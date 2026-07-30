from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
import bcrypt
from jose import JWTError, jwt
import uuid
import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

app = FastAPI(title="CashGold API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "607cc72ea28d4c3275acc271d0f47e979418bb92013faf949a101a70ab5b0b00")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Database
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db():
    # Force IPv4 connection by modifying the connection string
    # Replace IPv6 address with IPv4 or add connection parameters
    db_url = DATABASE_URL
    if db_url and "db.mybsggbhijvxnvswzrlb.supabase.co" in db_url:
        # Force IPv4 by adding connection parameters
        if "?" in db_url:
            db_url += "&target_session_attrs=read-write"
        else:
            db_url += "?target_session_attrs=read-write"
    conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor, connect_timeout=10)
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            balance REAL DEFAULT 0.0,
            invested_balance REAL DEFAULT 0.0,
            total_profits REAL DEFAULT 0.0,
            vip_level INTEGER DEFAULT 1,
            referral_code TEXT UNIQUE,
            referred_by TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Deposits table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS deposits (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            tx_hash TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    # Withdrawals table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS withdrawals (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            wallet_address TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    # Investments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS investments (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            vip_level INTEGER NOT NULL,
            daily_return_rate REAL DEFAULT 5.0,
            total_earned REAL DEFAULT 0.0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    conn.commit()
    conn.close()

# Initialize database on startup
@app.on_event("startup")
def startup():
    init_db()

# Models
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    referral_code: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class DepositCreate(BaseModel):
    amount: float
    tx_hash: Optional[str] = None

class WithdrawalCreate(BaseModel):
    amount: float
    wallet_address: str

class InvestmentCreate(BaseModel):
    amount: float

# Helper functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return dict(user)

def get_current_admin(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

def generate_referral_code():
    return uuid.uuid4().hex[:8]

# Auth endpoints
@app.post("/api/auth/register")
async def register(user_data: UserRegister):
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute("SELECT id FROM users WHERE email = %s OR username = %s", (user_data.email, user_data.username))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    # Check referral code
    referrer_id = None
    if user_data.referral_code:
        cursor.execute("SELECT id FROM users WHERE referral_code = %s", (user_data.referral_code,))
        referrer = cursor.fetchone()
        if referrer:
            referrer_id = referrer["id"]
    
    # Create user
    user_id = str(uuid.uuid4())
    referral_code = generate_referral_code()
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cursor.execute("""
        INSERT INTO users (id, email, username, hashed_password, referral_code, referred_by, balance)
        VALUES (%s, %s, %s, %s, %s, %s, 0.0)
    """, (user_id, user_data.email, user_data.username, hashed_password, referral_code, referrer_id))
    
    # No signup bonus
    # No referral bonus
    
    conn.commit()
    conn.close()
    
    # Generate token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "user": {
            "id": user_id,
            "email": user_data.email,
            "username": user_data.username,
            "is_admin": False,
            "balance": 6.0,
            "invested_balance": 0.0,
            "total_profits": 0.0,
            "vip_level": 1,
            "referral_code": referral_code
        }
    }

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE email = %s", (user_data.email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not bcrypt.checkpw(user_data.password.encode('utf-8'), user["hashed_password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user["is_active"]:
        raise HTTPException(status_code=401, detail="Account is suspended")
    
    access_token = create_access_token(data={"sub": user["id"]})
    
    return {
        "access_token": access_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "is_admin": bool(user["is_admin"]),
            "balance": user["balance"],
            "invested_balance": user["invested_balance"],
            "total_profits": user["total_profits"],
            "vip_level": user["vip_level"],
            "referral_code": user["referral_code"]
        }
    }

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "username": current_user["username"],
        "is_admin": bool(current_user["is_admin"]),
        "balance": current_user["balance"],
        "invested_balance": current_user["invested_balance"],
        "total_profits": current_user["total_profits"],
        "vip_level": current_user["vip_level"],
        "referral_code": current_user["referral_code"]
    }

# Deposit endpoints
@app.get("/api/deposits/my")
async def get_my_deposits(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM deposits WHERE user_id = %s ORDER BY created_at DESC", (current_user["id"],))
    deposits = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": d["id"],
            "amount": d["amount"],
            "tx_hash": d["tx_hash"],
            "status": d["status"],
            "created_at": d["created_at"]
        }
        for d in deposits
    ]

@app.post("/api/deposits")
async def create_deposit(deposit: DepositCreate, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    deposit_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO deposits (id, user_id, amount, tx_hash, status)
        VALUES (%s, %s, %s, %s, 'pending')
    """, (deposit_id, current_user["id"], deposit.amount, deposit.tx_hash))
    
    conn.commit()
    conn.close()
    
    return {"id": deposit_id, "status": "pending"}

@app.get("/api/deposits/wallet")
async def get_deposit_wallet():
    return {"wallet_address": "TLeCrKaPqcq3qZcdodJ8eUGJVzVbiWjMW1"}

# Withdrawal endpoints
@app.get("/api/withdrawals/my")
async def get_my_withdrawals(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM withdrawals WHERE user_id = %s ORDER BY created_at DESC", (current_user["id"],))
    withdrawals = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": w["id"],
            "amount": w["amount"],
            "wallet_address": w["wallet_address"],
            "status": w["status"],
            "created_at": w["created_at"]
        }
        for w in withdrawals
    ]

@app.post("/api/withdrawals")
async def create_withdrawal(withdrawal: WithdrawalCreate, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    # Check balance
    cursor.execute("SELECT balance FROM users WHERE id = %s", (current_user["id"],))
    balance = cursor.fetchone()["balance"]
    
    if withdrawal.amount > balance:
        conn.close()
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    if withdrawal.amount < 10:
        conn.close()
        raise HTTPException(status_code=400, detail="Minimum withdrawal is $10")
    
    # Deduct balance
    cursor.execute("UPDATE users SET balance = balance - %s WHERE id = %s", (withdrawal.amount, current_user["id"]))
    
    # Create withdrawal
    withdrawal_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO withdrawals (id, user_id, amount, wallet_address, status)
        VALUES (%s, %s, %s, %s, 'pending')
    """, (withdrawal_id, current_user["id"], withdrawal.amount, withdrawal.wallet_address))
    
    conn.commit()
    conn.close()
    
    return {"id": withdrawal_id, "status": "pending"}

# Investment endpoints
@app.get("/api/investments/my")
async def get_my_investments(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM investments WHERE user_id = %s ORDER BY created_at DESC", (current_user["id"],))
    investments = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": inv["id"],
            "amount": inv["amount"],
            "vip_level": inv["vip_level"],
            "daily_return_rate": inv["daily_return_rate"],
            "total_earned": inv["total_earned"],
            "is_active": bool(inv["is_active"]),
            "created_at": inv["created_at"]
        }
        for inv in investments
    ]

@app.post("/api/investments")
async def create_investment(investment: InvestmentCreate, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    # Check balance
    cursor.execute("SELECT balance FROM users WHERE id = %s", (current_user["id"],))
    balance = cursor.fetchone()["balance"]
    
    if investment.amount > balance:
        conn.close()
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    if investment.amount < 10:
        conn.close()
        raise HTTPException(status_code=400, detail="Minimum investment is $10")
    
    # Determine VIP level
    if investment.amount >= 5000:
        vip_level = 5
    elif investment.amount >= 1000:
        vip_level = 4
    elif investment.amount >= 500:
        vip_level = 3
    elif investment.amount >= 100:
        vip_level = 2
    else:
        vip_level = 1
    
    # Deduct balance and add to invested
    cursor.execute("UPDATE users SET balance = balance - %s, invested_balance = invested_balance + %s WHERE id = %s", 
                   (investment.amount, investment.amount, current_user["id"]))
    
    # Create investment
    investment_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO investments (id, user_id, amount, vip_level, daily_return_rate, total_earned, is_active)
        VALUES (%s, %s, %s, %s, 5.0, 0.0, TRUE)
    """, (investment_id, current_user["id"], investment.amount, vip_level))
    
    # Update user VIP level if this is higher
    cursor.execute("UPDATE users SET vip_level = GREATEST(vip_level, %s) WHERE id = %s", (vip_level, current_user["id"]))
    
    conn.commit()
    conn.close()
    
    return {"id": investment_id, "vip_level": f"VIP {vip_level}"}

@app.post("/api/investments/{investment_id}/stop")
async def stop_investment(investment_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    # Get investment
    cursor.execute("SELECT * FROM investments WHERE id = %s AND user_id = %s", (investment_id, current_user["id"]))
    investment = cursor.fetchone()
    
    if not investment:
        conn.close()
        raise HTTPException(status_code=404, detail="Investment not found")
    
    if not investment["is_active"]:
        conn.close()
        raise HTTPException(status_code=400, detail="Investment already stopped")
    
    # Calculate total (principal + earnings)
    total_return = investment["amount"] + investment["total_earned"]
    
    # Update investment
    cursor.execute("UPDATE investments SET is_active = FALSE WHERE id = %s", (investment_id,))
    
    # Return to balance
    cursor.execute("UPDATE users SET balance = balance + %s, invested_balance = invested_balance - %s WHERE id = %s", 
                   (total_return, investment["amount"], current_user["id"]))
    
    conn.commit()
    conn.close()
    
    return {"message": "Investment stopped"}

# Referral endpoints
@app.get("/api/referrals/my")
async def get_my_referrals(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.username, u.email, u.created_at 
        FROM users u 
        WHERE u.referred_by = %s
    """, (current_user["id"],))
    referrals = cursor.fetchall()
    conn.close()
    
    return [
        {
            "username": r["username"],
            "email": r["email"],
            "bonus_earned": 6.0  # Fixed bonus for simplicity
        }
        for r in referrals
    ]

# Admin endpoints
@app.get("/api/admin/stats")
async def get_admin_stats(current_admin: dict = Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) FROM deposits WHERE status = 'pending'")
    pending_deposits = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) FROM withdrawals WHERE status = 'pending'")
    pending_withdrawals = cursor.fetchone()["count"]
    
    cursor.execute("SELECT SUM(amount) FROM deposits WHERE status = 'approved'")
    total_deposits = cursor.fetchone()["sum"] or 0
    
    cursor.execute("SELECT SUM(amount) FROM withdrawals WHERE status = 'completed'")
    total_withdrawals = cursor.fetchone()["sum"] or 0
    
    conn.close()
    
    return {
        "total_users": total_users,
        "pending_deposits": pending_deposits,
        "pending_withdrawals": pending_withdrawals,
        "total_deposits": total_deposits,
        "total_withdrawals": total_withdrawals
    }

@app.get("/api/admin/deposits")
async def get_admin_deposits(current_admin: dict = Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT d.*, u.email, u.username 
        FROM deposits d 
        JOIN users u ON d.user_id = u.id 
        ORDER BY d.created_at DESC
    """)
    deposits = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": d["id"],
            "user_id": d["user_id"],
            "email": d["email"],
            "username": d["username"],
            "amount": d["amount"],
            "tx_hash": d["tx_hash"],
            "status": d["status"],
            "created_at": d["created_at"]
        }
        for d in deposits
    ]

@app.post("/api/admin/deposits/{deposit_id}/approve")
async def approve_deposit(deposit_id: str, current_admin: dict = Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM deposits WHERE id = %s", (deposit_id,))
    deposit = cursor.fetchone()
    
    if not deposit:
        conn.close()
        raise HTTPException(status_code=404, detail="Deposit not found")
    
    if deposit["status"] != "pending":
        conn.close()
        raise HTTPException(status_code=400, detail="Deposit already processed")
    
    # Update deposit status
    cursor.execute("UPDATE deposits SET status = 'approved' WHERE id = %s", (deposit_id,))
    
    # Add to user balance
    cursor.execute("UPDATE users SET balance = balance + %s WHERE id = %s", (deposit["amount"], deposit["user_id"]))
    
    conn.commit()
    conn.close()
    
    return {"message": "Deposit approved"}

@app.post("/api/admin/deposits/{deposit_id}/reject")
async def reject_deposit(deposit_id: str, current_admin: dict = Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM deposits WHERE id = %s", (deposit_id,))
    deposit = cursor.fetchone()
    
    if not deposit:
        conn.close()
        raise HTTPException(status_code=404, detail="Deposit not found")
    
    cursor.execute("UPDATE deposits SET status = 'rejected' WHERE id = %s", (deposit_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Deposit rejected"}

@app.get("/api/admin/withdrawals")
async def get_admin_withdrawals(current_admin: dict = Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT w.*, u.email, u.username 
        FROM withdrawals w 
        JOIN users u ON w.user_id = u.id 
        ORDER BY w.created_at DESC
    """)
    withdrawals = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": w["id"],
            "user_id": w["user_id"],
            "email": w["email"],
            "username": w["username"],
            "amount": w["amount"],
            "wallet_address": w["wallet_address"],
            "status": w["status"],
            "created_at": w["created_at"]
        }
        for w in withdrawals
    ]

@app.post("/api/admin/withdrawals/{withdrawal_id}/complete")
async def complete_withdrawal(withdrawal_id: str, current_admin: dict = Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM withdrawals WHERE id = ?", (withdrawal_id,))
    withdrawal = cursor.fetchone()
    
    if not withdrawal:
        conn.close()
        raise HTTPException(status_code=404, detail="Withdrawal not found")
    
    if withdrawal["status"] != "pending":
        conn.close()
        raise HTTPException(status_code=400, detail="Withdrawal already processed")
    
    cursor.execute("UPDATE withdrawals SET status = 'completed' WHERE id = %s", (withdrawal_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Withdrawal completed"}

@app.get("/api/admin/users")
async def get_admin_users(current_admin: dict = Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users ORDER BY created_at DESC")
    users = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": u["id"],
            "email": u["email"],
            "username": u["username"],
            "is_admin": bool(u["is_admin"]),
            "is_active": bool(u["is_active"]),
            "balance": u["balance"],
            "invested_balance": u["invested_balance"],
            "total_profits": u["total_profits"],
            "vip_level": u["vip_level"],
            "created_at": u["created_at"]
        }
        for u in users
    ]

@app.post("/api/admin/users/{user_id}/suspend")
async def suspend_user(user_id: str, current_admin: dict = Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET is_active = FALSE WHERE id = %s", (user_id,))
    conn.commit()
    conn.close()
    
    return {"message": "User suspended"}

@app.post("/api/admin/users/{user_id}/activate")
async def activate_user(user_id: str, current_admin: dict = Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET is_active = TRUE WHERE id = %s", (user_id,))
    conn.commit()
    conn.close()
    
    return {"message": "User activated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
