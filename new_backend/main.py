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
from urllib.parse import urlparse
import socket

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
    db_url = DATABASE_URL
    if not db_url:
        raise HTTPException(status_code=500, detail="DATABASE_URL not configured")
    
    # Parse connection string to force IPv4
    try:
        parsed = urlparse(db_url)
        hostname = parsed.hostname
        
        # Force IPv4 resolution
        try:
            # Get IPv4 address only
            ipv4_addresses = [addr[4][0] for addr in socket.getaddrinfo(hostname, parsed.port or 5432, socket.AF_INET, socket.SOCK_STREAM)]
            if ipv4_addresses:
                hostname = ipv4_addresses[0]
        except:
            pass  # Fallback to original hostname
        
        # Force IPv4 by using individual connection parameters
        conn = psycopg2.connect(
            host=hostname,
            port=parsed.port or 5432,
            database=parsed.path[1:],  # Remove leading /
            user=parsed.username,
            password=parsed.password,
            cursor_factory=RealDictCursor,
            connect_timeout=30,
            client_encoding='utf8'
        )
    except Exception as e:
        # Fallback to original connection string
        conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor, connect_timeout=30)
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
    return {"wallet_address": "TF348PVPBaqhGCFZSCCJEkDNVdtUHwaCyE"}

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

# Chatbot endpoint
@app.post("/api/chatbot")
async def chatbot(request: dict):
    message = request.get("message", "").lower()
    language = request.get("language", "fr")  # Get language from frontend
    
    # Simple rule-based responses based on language
    if language == "fr":
        responses = {
            # Investissement
            "investissement": "Pour investir, connectez-vous à votre compte, allez dans l'onglet 'Investir', choisissez le montant et le plan VIP. Le minimum est $10.",
            "invest": "Pour investir, connectez-vous à votre compte, allez dans l'onglet 'Investir', choisissez le montant et le plan VIP. Le minimum est $10.",
            # Dépôt
            "dépôt": "Pour déposer, allez dans l'onglet 'Déposer', copiez l'adresse USDT TRC20, envoyez vos fonds depuis votre portefeuille, puis soumettez le montant.",
            "déposer": "Pour déposer, allez dans l'onglet 'Déposer', copiez l'adresse USDT TRC20, envoyez vos fonds depuis votre portefeuille, puis soumettez le montant.",
            # Retrait
            "retrait": "Pour retirer, allez dans l'onglet 'Retirer', entrez le montant (minimum $10) et votre adresse USDT TRC20.",
            "retirer": "Pour retirer, allez dans l'onglet 'Retirer', entrez le montant (minimum $10) et votre adresse USDT TRC20.",
            # VIP
            "vip": "Il y a 5 niveaux VIP : VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999), et VIP 5 ($5,000+). Tous offrent 5% par jour.",
            "niveau": "Il y a 5 niveaux VIP : VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999), et VIP 5 ($5,000+). Tous offrent 5% par jour.",
            # Parrainage
            "parrainage": "Partagez votre lien de parrainage unique. Lorsque vos filleuls s'inscrivent et effectuent un dépôt, vous recevez 5% de leur montant.",
            "parrain": "Partagez votre lien de parrainage unique. Lorsque vos filleuls s'inscrivent et effectuent un dépôt, vous recevez 5% de leur montant.",
            "filleul": "Partagez votre lien de parrainage unique. Lorsque vos filleuls s'inscrivent et effectuent un dépôt, vous recevez 5% de leur montant.",
            # Contact
            "contact": "Pour nous contacter, envoyez un email à servicecashgold@gmail.com ou utilisez le formulaire de contact.",
            "support": "Pour nous contacter, envoyez un email à servicecashgold@gmail.com ou utilisez le formulaire de contact.",
            # Inscription
            "inscription": "Pour vous inscrire, cliquez sur 'S'inscrire', remplissez le formulaire avec votre email, nom d'utilisateur et mot de passe. Vous pouvez aussi utiliser un code de parrainage.",
            "inscrire": "Pour vous inscrire, cliquez sur 'S'inscrire', remplissez le formulaire avec votre email, nom d'utilisateur et mot de passe. Vous pouvez aussi utiliser un code de parrainage.",
            "register": "Pour vous inscrire, cliquez sur 'S'inscrire', remplissez le formulaire avec votre email, nom d'utilisateur et mot de passe. Vous pouvez aussi utiliser un code de parrainage.",
            "compte": "Pour créer un compte, cliquez sur 'S'inscrire' et remplissez le formulaire d'inscription.",
            # Sécurité
            "sécurité": "Vos fonds sont sécurisés avec un cryptage SSL de niveau bancaire et des protocoles de sécurité avancés.",
            "securite": "Vos fonds sont sécurisés avec un cryptage SSL de niveau bancaire et des protocoles de sécurité avancés.",
            "safe": "Vos fonds sont sécurisés avec un cryptage SSL de niveau bancaire et des protocoles de sécurité avancés.",
            # Profits
            "profit": "Les profits sont calculés automatiquement à 5% par jour sur vos investissements actifs.",
            "gain": "Les profits sont calculés automatiquement à 5% par jour sur vos investissements actifs.",
            "rendement": "Tous les investissements offrent un rendement de 5% par jour, quel que soit le niveau VIP.",
            # Frais
            "frais": "Nous ne facturons pas de frais de dépôt ou de retrait. Le montant que vous déposez ou demandez est celui que vous recevez.",
            "fee": "Nous ne facturons pas de frais de dépôt ou de retrait. Le montant que vous déposez ou demandez est celui que vous recevez.",
            # Temps
            "temps": "Les dépôts sont validés dans les 12 heures maximum. Les retraits sont traités entre 30 minutes et 24 heures.",
            "délai": "Les dépôts sont validés dans les 12 heures maximum. Les retraits sont traités entre 30 minutes et 24 heures.",
            "validation": "Les dépôts sont validés manuellement par notre équipe dans un délai maximum de 12 heures.",
            # Arrêter investissement
            "arrêter": "Vous pouvez arrêter un investissement actif à tout moment. Votre capital et vos profits sont immédiatement retournés à votre solde.",
            "stop": "Vous pouvez arrêter un investissement actif à tout moment. Votre capital et vos profits sont immédiatement retournés à votre solde.",
            # Minimum
            "minimum": "L'investissement minimum est de $10. Le dépôt minimum est de $10. Le retrait minimum est de $10.",
            "min": "L'investissement minimum est de $10. Le dépôt minimum est de $10. Le retrait minimum est de $10.",
            # USDT
            "usdt": "Nous acceptons uniquement les dépôts en USDT sur le réseau TRC20. Assurez-vous d'utiliser le bon réseau.",
            "trc20": "Nous acceptons uniquement les dépôts en USDT sur le réseau TRC20. Assurez-vous d'utiliser le bon réseau.",
            # Multiples comptes
            "multiple": "Non, chaque utilisateur ne peut avoir qu'un seul compte. Les comptes multiples sont interdits.",
            "comptes": "Non, chaque utilisateur ne peut avoir qu'un seul compte. Les comptes multiples sont interdits.",
            # Salutations
            "help": "Comment puis-je vous aider ? Je peux répondre aux questions sur les investissements, dépôts, retraits, niveaux VIP, parrainage, sécurité et plus.",
            "bonjour": "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
            "salut": "Salut ! Comment puis-je vous aider ?",
            "hello": "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
            "merci": "Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?",
        }
        default_response = "Je suis là pour vous aider ! Vous pouvez me poser des questions sur les investissements, dépôts, retraits, niveaux VIP, parrainage, sécurité, inscription et plus. Pour une assistance personnalisée, contactez servicecashgold@gmail.com"
    elif language == "es":
        responses = {
            # Inversión
            "inversión": "Para invertir, inicie sesión en su cuenta, vaya a la pestaña 'Invertir', elija el monto y el plan VIP. El mínimo es $10.",
            "invertir": "Para invertir, inicie sesión en su cuenta, vaya a la pestaña 'Invertir', elija el monto y el plan VIP. El mínimo es $10.",
            "invest": "Para invertir, inicie sesión en su cuenta, vaya a la pestaña 'Invertir', elija el monto y el plan VIP. El mínimo es $10.",
            # Depósito
            "depósito": "Para depositar, vaya a la pestaña 'Depositar', copie la dirección USDT TRC20, envíe sus fondos desde su billetera, luego envíe el monto.",
            "depositar": "Para depositar, vaya a la pestaña 'Depositar', copie la dirección USDT TRC20, envíe sus fondos desde su billetera, luego envíe el monto.",
            "deposit": "Para depositar, vaya a la pestaña 'Depositar', copie la dirección USDT TRC20, envíe sus fondos desde su billetera, luego envíe el monto.",
            # Retiro
            "retiro": "Para retirar, vaya a la pestaña 'Retirar', ingrese el monto (mínimo $10) y su dirección USDT TRC20.",
            "retirar": "Para retirar, vaya a la pestaña 'Retirar', ingrese el monto (mínimo $10) y su dirección USDT TRC20.",
            "withdraw": "Para retirar, vaya a la pestaña 'Retirar', ingrese el monto (mínimo $10) y su dirección USDT TRC20.",
            # VIP
            "vip": "Hay 5 niveles VIP: VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999), y VIP 5 ($5,000+). Todos ofrecen 5% diario.",
            "nivel": "Hay 5 niveles VIP: VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999), y VIP 5 ($5,000+). Todos ofrecen 5% diario.",
            # Referido
            "referido": "Comparta su enlace de referido único. Cuando sus referidos se registren y hagan un depósito, recibirá el 5% de su monto.",
            "referral": "Comparta su enlace de referido único. Cuando sus referidos se registren y hagan un depósito, recibirá el 5% de su monto.",
            # Contacto
            "contacto": "Para contactarnos, envíe un email a servicecashgold@gmail.com o use el formulario de contacto.",
            "contact": "Para contactarnos, envíe un email a servicecashgold@gmail.com o use el formulario de contacto.",
            "support": "Para contactarnos, envíe un email a servicecashgold@gmail.com o use el formulario de contacto.",
            # Registro
            "registro": "Para registrarse, haga clic en 'Registrarse', complete el formulario con su email, nombre de usuario y contraseña. También puede usar un código de referido.",
            "registrar": "Para registrarse, haga clic en 'Registrarse', complete el formulario con su email, nombre de usuario y contraseña. También puede usar un código de referido.",
            "register": "Para registrarse, haga clic en 'Registrarse', complete el formulario con su email, nombre de usuario y contraseña. También puede usar un código de referido.",
            "cuenta": "Para crear una cuenta, haga clic en 'Registrarse' y complete el formulario de registro.",
            # Seguridad
            "seguridad": "Sus fondos están seguros con encriptación SSL de nivel bancario y protocolos de seguridad avanzados.",
            "safe": "Sus fondos están seguros con encriptación SSL de nivel bancario y protocolos de seguridad avanzados.",
            # Ganancias
            "ganancia": "Las ganancias se calculan automáticamente al 5% diario sobre sus inversiones activas.",
            "profit": "Las ganancias se calculan automáticamente al 5% diario sobre sus inversiones activas.",
            "rendimiento": "Todas las inversiones ofrecen un rendimiento del 5% diario, independientemente del nivel VIP.",
            # Tarifas
            "tarifa": "No cobramos tarifas de depósito o retiro. El monto que deposita o solicita es el que recibe.",
            "fee": "No cobramos tarifas de depósito o retiro. El monto que deposita o solicita es el que recibe.",
            # Tiempo
            "tiempo": "Los depósitos se validan en un máximo de 12 horas. Los retiros se procesan entre 30 minutos y 24 horas.",
            "demora": "Los depósitos se validan en un máximo de 12 horas. Los retiros se procesan entre 30 minutos y 24 horas.",
            # Detener inversión
            "detener": "Puede detener una inversión activa en cualquier momento. Su capital y ganancias se devuelven inmediatamente a su saldo.",
            "stop": "Puede detener una inversión activa en cualquier momento. Su capital y ganancias se devuelven inmediatamente a su saldo.",
            # Mínimo
            "mínimo": "La inversión mínima es de $10. El depósito mínimo es de $10. El retiro mínimo es de $10.",
            "min": "La inversión mínima es de $10. El depósito mínimo es de $10. El retiro mínimo es de $10.",
            # USDT
            "usdt": "Solo aceptamos depósitos en USDT en la red TRC20. Asegúrese de usar la red correcta.",
            "trc20": "Solo aceptamos depósitos en USDT en la red TRC20. Asegúrese de usar la red correcta.",
            # Múltiples cuentas
            "multiple": "No, cada usuario solo puede tener una cuenta. Las cuentas múltiples están prohibidas.",
            "cuentas": "No, cada usuario solo puede tener una cuenta. Las cuentas múltiples están prohibidas.",
            # Saludos
            "ayuda": "¿Cómo puedo ayudarle? Puedo responder preguntas sobre inversiones, depósitos, retiros, niveles VIP, referidos, seguridad y más.",
            "help": "¿Cómo puedo ayudarle? Puedo responder preguntas sobre inversiones, depósitos, retiros, niveles VIP, referidos, seguridad y más.",
            "hola": "¡Hola! ¿Cómo puedo ayudarle hoy?",
            "gracias": "¡De nada! ¿Hay algo más en lo que pueda ayudarle?",
        }
        default_response = "Estoy aquí para ayudarle! Puede hacerme preguntas sobre inversiones, depósitos, retiros, niveles VIP, referidos, seguridad, registro y más. Para asistencia personalizada, contacte servicecashgold@gmail.com"
    elif language == "ar":
        responses = {
            # استثمار
            "استثمار": "للاستثمار، قم بتسجيل الدخول إلى حسابك، انتقل إلى علامة التبويب 'استثمار'، اختر المبلغ وخطة VIP. الحد الأدنى هو 10$.",
            "invest": "للاستثمار، قم بتسجيل الدخول إلى حسابك، انتقل إلى علامة التبويب 'استثمار'، اختر المبلغ وخطة VIP. الحد الأدنى هو 10$.",
            # إيداع
            "إيداع": "للإيداع، انتقل إلى علامة التبويب 'إيداع'، انسخ عنوان USDT TRC20، أرسل أموالك من محفظتك، ثم أرسل المبلغ.",
            "deposit": "للإيداع، انتقل إلى علامة التبويب 'إيداع'، انسخ عنوان USDT TRC20، أرسل أموالك من محفظتك، ثم أرسل المبلغ.",
            # سحب
            "سحب": "للسحب، انتقل إلى علامة التبويب 'سحب'، أدخل المبلغ (الحد الأدنى 10$) وعنوان محفظتك USDT TRC20.",
            "withdraw": "للسحب، انتقل إلى علامة التبويب 'سحب'، أدخل المبلغ (الحد الأدنى 10$) وعنوان محفظتك USDT TRC20.",
            # VIP
            "vip": "هناك 5 مستويات VIP: VIP 1 ($10-$99)، VIP 2 ($100-$499)، VIP 3 ($500-$999)، VIP 4 ($1,000-$4,999)، وVIP 5 ($5,000+). جميعها توفر 5% يومي.",
            "مستوى": "هناك 5 مستويات VIP: VIP 1 ($10-$99)، VIP 2 ($100-$499)، VIP 3 ($500-$999)، VIP 4 ($1,000-$4,999)، وVIP 5 ($5,000+). جميعها توفر 5% يومي.",
            # إحالة
            "إحالة": "شارك رابط الإحالة الخاص بك. عندما يسجل referrals ويودعون، ستتلقى 5% من مبلغهم.",
            "referral": "شارك رابط الإحالة الخاص بك. عندما يسجل referrals ويودعون، ستتلقى 5% من مبلغهم.",
            # اتصال
            "اتصال": "للاتصال بنا، أرسل بريدًا إلكترونيًا إلى servicecashgold@gmail.com أو استخدم نموذج الاتصال.",
            "contact": "للاتصال بنا، أرسل بريدًا إلكترونيًا إلى servicecashgold@gmail.com أو استخدم نموذج الاتصال.",
            "support": "للاتصال بنا، أرسل بريدًا إلكترونيًا إلى servicecashgold@gmail.com أو استخدم نموذج الاتصال.",
            # تسجيل
            "تسجيل": "للتسجيل، انقر على 'تسجيل'، املأ النموذج بالبريد الإلكتروني واسم المستخدم وكلمة المرور. يمكنك أيضًا استخدام رمز إحالة.",
            "register": "للتسجيل، انقر على 'تسجيل'، املأ النموذج بالبريد الإلكتروني واسم المستخدم وكلمة المرور. يمكنك أيضًا استخدام رمز إحالة.",
            "حساب": "لإنشاء حساب، انقر على 'تسجيل' واملأ نموذج التسجيل.",
            # أمان
            "أمان": "أموالك آمنة مع تشفير SSL على مستوى البنوك وبروتوكولات أمان متقدمة.",
            "safe": "أموالك آمنة مع تشفير SSL على مستوى البنوك وبروتوكولات أمان متقدمة.",
            # أرباح
            "ربح": "يتم حساب الأرباح تلقائيًا بنسبة 5% يوميًا على استثماراتك النشطة.",
            "profit": "يتم حساب الأرباح تلقائيًا بنسبة 5% يوميًا على استثماراتك النشطة.",
            # رسوم
            "رسوم": "نحن لا نفرض رسوم إيداع أو سحب. المبلغ الذي تودعه أو تطلبه هو المبلغ الذي ستستلمه.",
            "fee": "نحن لا نفرض رسوم إيداع أو سحب. المبلغ الذي تودعه أو تطلبه هو المبلغ الذي ستستلمه.",
            # وقت
            "وقت": "يتم التحقق من الإيداعات في غضون 12 ساعة كحد أقصى. تتم معالجة السحوبات بين 30 دقيقة و24 ساعة.",
            "delay": "يتم التحقق من الإيداعات في غضون 12 ساعة كحد أقصى. تتم معالجة السحوبات بين 30 دقيقة و24 ساعة.",
            # إيقاف
            "إيقاف": "يمكنك إيقاف استثمار نشط في أي وقت. يتم إرجاع رأس مالك وأرباحك فورًا إلى رصيدك.",
            "stop": "يمكنك إيقاف استثمار نشط في أي وقت. يتم إرجاع رأس مالك وأرباحك فورًا إلى رصيدك.",
            # الحد الأدنى
            "الحد": "الحد الأدنى للاستثمار هو 10$. الحد الأدنى للإيداع هو 10$. الحد الأدنى للسحب هو 10$.",
            "min": "الحد الأدنى للاستثمار هو 10$. الحد الأدنى للإيداع هو 10$. الحد الأدنى للسحب هو 10$.",
            # USDT
            "usdt": "نقبل فقط الإيداعات بعملة USDT على شبكة TRC20. تأكد من استخدام الشبكة الصحيحة.",
            "trc20": "نقبل فقط الإيداعات بعملة USDT على شبكة TRC20. تأكد من استخدام الشبكة الصحيحة.",
            # حسابات متعددة
            "multiple": "لا، يمكن لكل مستخدم امتلاك حساب واحد فقط. الحسابات المتعددة محظورة.",
            "حسابات": "لا، يمكن لكل مستخدم امتلاك حساب واحد فقط. الحسابات المتعددة محظورة.",
            # تحيات
            "مساعدة": "كيف يمكنني مساعدتك؟ يمكنني الإجابة على أسئلة حول الاستثمارات، الإيداعات، السحوبات، مستويات VIP، الإحالات، الأمان والمزيد.",
            "help": "كيف يمكنني مساعدتك؟ يمكنني الإجابة على أسئلة حول الاستثمارات، الإيداعات، السحوبات، مستويات VIP، الإحالات، الأمان والمزيد.",
            "مرحبا": "مرحبا! كيف يمكنني مساعدتك اليوم؟",
            "شكرا": "عفوا! هل هناك شيء آخر يمكنني مساعدتك به؟",
        }
        default_response = "أنا هنا للمساعدة! يمكنك طرح أسئلة حول الاستثمارات، الإيداعات، السحوبات، مستويات VIP، الإحالات، الأمان، التسجيل والمزيد. للمساعدة الشخصية، اتصل بـ servicecashgold@gmail.com"
    elif language == "zh":
        responses = {
            # 投资
            "投资": "要投资，请登录您的账户，转到'投资'选项卡，选择金额和VIP计划。最低$10。",
            "invest": "要投资，请登录您的账户，转到'投资'选项卡，选择金额和VIP计划。最低$10。",
            # 存款
            "存款": "要存款，请转到'存款'选项卡，复制USDT TRC20地址，从您的钱包发送资金，然后提交金额。",
            "deposit": "要存款，请转到'存款'选项卡，复制USDT TRC20地址，从您的钱包发送资金，然后提交金额。",
            # 取款
            "取款": "要取款，请转到'取款'选项卡，输入金额（最低$10）和您的USDT TRC20地址。",
            "withdraw": "要取款，请转到'取款'选项卡，输入金额（最低$10）和您的USDT TRC20地址。",
            # VIP
            "vip": "有5个VIP级别：VIP 1（$10-$99），VIP 2（$100-$499），VIP 3（$500-$999），VIP 4（$1,000-$4,999），和VIP 5（$5,000+）。全部提供每日5%回报。",
            "级别": "有5个VIP级别：VIP 1（$10-$99），VIP 2（$100-$499），VIP 3（$500-$999），VIP 4（$1,000-$4,999），和VIP 5（$5,000+）。全部提供每日5%回报。",
            # 推荐
            "推荐": "分享您的唯一推荐链接。当您的推荐注册并存款时，您将获得其金额的5%。",
            "referral": "分享您的唯一推荐链接。当您的推荐注册并存款时，您将获得其金额的5%。",
            # 联系
            "联系": "要联系我们，请发送电子邮件至servicecashgold@gmail.com或使用联系表格。",
            "contact": "要联系我们，请发送电子邮件至servicecashgold@gmail.com或使用联系表格。",
            "support": "要联系我们，请发送电子邮件至servicecashgold@gmail.com或使用联系表格。",
            # 注册
            "注册": "要注册，点击'注册'，用您的电子邮件、用户名和密码填写表格。您也可以使用推荐代码。",
            "register": "要注册，点击'注册'，用您的电子邮件、用户名和密码填写表格。您也可以使用推荐代码。",
            "账户": "要创建账户，点击'注册'并填写注册表格。",
            # 安全
            "安全": "您的资金通过银行级SSL加密和先进的安全协议得到保护。",
            "safe": "您的资金通过银行级SSL加密和先进的安全协议得到保护。",
            # 利润
            "利润": "利润按您的活跃投资每日5%自动计算。",
            "profit": "利润按您的活跃投资每日5%自动计算。",
            # 费用
            "费用": "我们不收取存款或取款费用。您存款或请求的金额就是您收到的金额。",
            "fee": "我们不收取存款或取款费用。您存款或请求的金额就是您收到的金额。",
            # 时间
            "时间": "存款在最多12小时内验证。取款在30分钟到24小时内处理。",
            "delay": "存款在最多12小时内验证。取款在30分钟到24小时内处理。",
            # 停止
            "停止": "您可以随时停止活跃投资。您的资本和利润立即返回到您的余额。",
            "stop": "您可以随时停止活跃投资。您的资本和利润立即返回到您的余额。",
            # 最低
            "最低": "最低投资是$10。最低存款是$10。最低取款是$10。",
            "min": "最低投资是$10。最低存款是$10。最低取款是$10。",
            # USDT
            "usdt": "我们只接受TRC20网络上的USDT存款。请确保使用正确的网络。",
            "trc20": "我们只接受TRC20网络上的USDT存款。请确保使用正确的网络。",
            # 多个账户
            "multiple": "不，每个用户只能拥有一个账户。禁止多个账户。",
            "账户": "不，每个用户只能拥有一个账户。禁止多个账户。",
            # 问候
            "帮助": "我怎么能帮您？我可以回答关于投资、存款、取款、VIP级别、推荐、安全等的问题。",
            "help": "我怎么能帮您？我可以回答关于投资、存款、取款、VIP级别、推荐、安全等的问题。",
            "你好": "你好！今天我能为您做些什么？",
            "谢谢": "不客气！还有什么我可以帮助您的吗？",
        }
        default_response = "我在这里帮助您！您可以问我关于投资、存款、取款、VIP级别、推荐、安全、注册等的问题。对于个性化帮助，请联系servicecashgold@gmail.com"
    elif language == "de":
        responses = {
            # Investition
            "investition": "Um zu investieren, loggen Sie sich in Ihr Konto ein, gehen Sie zum Reiter 'Investieren', wählen Sie den Betrag und den VIP-Plan. Das Minimum ist $10.",
            "investieren": "Um zu investieren, loggen Sie sich in Ihr Konto ein, gehen Sie zum Reiter 'Investieren', wählen Sie den Betrag und den VIP-Plan. Das Minimum ist $10.",
            "invest": "Um zu investieren, loggen Sie sich in Ihr Konto ein, gehen Sie zum Reiter 'Investieren', wählen Sie den Betrag und den VIP-Plan. Das Minimum ist $10.",
            # Einzahlung
            "einzahlung": "Um einzuzahlen, gehen Sie zum Reiter 'Einzahlen', kopieren Sie die USDT TRC20-Adresse, senden Sie Ihre Gelder aus Ihrer Wallet und übermitteln Sie dann den Betrag.",
            "einzahlen": "Um einzuzahlen, gehen Sie zum Reiter 'Einzahlen', kopieren Sie die USDT TRC20-Adresse, senden Sie Ihre Gelder aus Ihrer Wallet und übermitteln Sie dann den Betrag.",
            "deposit": "Um einzuzahlen, gehen Sie zum Reiter 'Einzahlen', kopieren Sie die USDT TRC20-Adresse, senden Sie Ihre Gelder aus Ihrer Wallet und übermitteln Sie dann den Betrag.",
            # Auszahlung
            "auszahlung": "Um abzuheben, gehen Sie zum Reiter 'Abheben', geben Sie den Betrag (mindestens $10) und Ihre USDT TRC20-Wallet-Adresse ein.",
            "abheben": "Um abzuheben, gehen Sie zum Reiter 'Abheben', geben Sie den Betrag (mindestens $10) und Ihre USDT TRC20-Wallet-Adresse ein.",
            "withdraw": "Um abzuheben, gehen Sie zum Reiter 'Abheben', geben Sie den Betrag (mindestens $10) und Ihre USDT TRC20-Wallet-Adresse ein.",
            # VIP
            "vip": "Es gibt 5 VIP-Stufen: VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1.000-$4.999) und VIP 5 ($5.000+). Alle bieten 5% tägliche Rendite.",
            "stufe": "Es gibt 5 VIP-Stufen: VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1.000-$4.999) und VIP 5 ($5.000+). Alle bieten 5% tägliche Rendite.",
            # Empfehlung
            "empfehlung": "Teilen Sie Ihren einzigartigen Empfehlungslink. Wenn Ihre Empfehlungen sich registrieren und eine Einzahlung tätigen, erhalten Sie 5% ihres Betrags.",
            "referral": "Teilen Sie Ihren einzigartigen Empfehlungslink. Wenn Ihre Empfehlungen sich registrieren und eine Einzahlung tätigen, erhalten Sie 5% ihres Betrags.",
            # Kontakt
            "kontakt": "Um uns zu kontaktieren, senden Sie eine E-Mail an servicecashgold@gmail.com oder verwenden Sie das Kontaktformular.",
            "contact": "Um uns zu kontaktieren, senden Sie eine E-Mail an servicecashgold@gmail.com oder verwenden Sie das Kontaktformular.",
            "support": "Um uns zu kontaktieren, senden Sie eine E-Mail an servicecashgold@gmail.com oder verwenden Sie das Kontaktformular.",
            # Registrierung
            "registrierung": "Um sich zu registrieren, klicken Sie auf 'Registrieren', füllen Sie das Formular mit Ihrer E-Mail, Ihrem Benutzernamen und Ihrem Passwort aus. Sie können auch einen Empfehlungscode verwenden.",
            "registrieren": "Um sich zu registrieren, klicken Sie auf 'Registrieren', füllen Sie das Formular mit Ihrer E-Mail, Ihrem Benutzernamen und Ihrem Passwort aus. Sie können auch einen Empfehlungscode verwenden.",
            "register": "Um sich zu registrieren, klicken Sie auf 'Registrieren', füllen Sie das Formular mit Ihrer E-Mail, Ihrem Benutzernamen und Ihrem Passwort aus. Sie können auch einen Empfehlungscode verwenden.",
            "konto": "Um ein Konto zu erstellen, klicken Sie auf 'Registrieren' und füllen Sie das Registrierungsformular aus.",
            # Sicherheit
            "sicherheit": "Ihre Gelder sind mit SSL-Verschlüsselung auf Bankniveau und fortschrittlichen Sicherheitsprotokollen geschützt.",
            "safe": "Ihre Gelder sind mit SSL-Verschlüsselung auf Bankniveau und fortschrittlichen Sicherheitsprotokollen geschützt.",
            # Gewinne
            "gewinn": "Gewinne werden automatisch mit 5% täglich auf Ihre aktiven Investitionen berechnet.",
            "profit": "Gewinne werden automatisch mit 5% täglich auf Ihre aktiven Investitionen berechnet.",
            # Gebühren
            "gebühr": "Wir erheben keine Einzahlungs- oder Abhebungsgebühren. Der Betrag, den Sie einzahlen oder anfordern, ist der Betrag, den Sie erhalten.",
            "fee": "Wir erheben keine Einzahlungs- oder Abhebungsgebühren. Der Betrag, den Sie einzahlen oder anfordern, ist der Betrag, den Sie erhalten.",
            # Zeit
            "zeit": "Einzahlungen werden innerhalb von maximal 12 Stunden validiert. Auszahlungen werden zwischen 30 Minuten und 24 Stunden bearbeitet.",
            "verzögerung": "Einzahlungen werden innerhalb von maximal 12 Stunden validiert. Auszahlungen werden zwischen 30 Minuten und 24 Stunden bearbeitet.",
            # Stoppen
            "stoppen": "Sie können eine aktive Investition jederzeit stoppen. Ihr Kapital und Ihre Gewinne werden sofort Ihrem Guthaben gutgeschrieben.",
            "stop": "Sie können eine aktive Investition jederzeit stoppen. Ihr Kapital und Ihre Gewinne werden sofort Ihrem Guthaben gutgeschrieben.",
            # Minimum
            "minimum": "Die Mindestinvestition beträgt $10. Die Mindesteinzahlung beträgt $10. Die Mindestabhebung beträgt $10.",
            "min": "Die Mindestinvestition beträgt $10. Die Mindesteinzahlung beträgt $10. Die Mindestabhebung beträgt $10.",
            # USDT
            "usdt": "Wir akzeptieren nur Einzahlungen in USDT im TRC20-Netzwerk. Stellen Sie sicher, dass Sie das richtige Netzwerk verwenden.",
            "trc20": "Wir akzeptieren nur Einzahlungen in USDT im TRC20-Netzwerk. Stellen Sie sicher, dass Sie das richtige Netzwerk verwenden.",
            # Mehrere Konten
            "multiple": "Nein, jeder Benutzer darf nur ein Konto haben. Mehrere Konten sind verboten.",
            "konten": "Nein, jeder Benutzer darf nur ein Konto haben. Mehrere Konten sind verboten.",
            # Begrüßungen
            "hilfe": "Wie kann ich Ihnen helfen? Ich kann Fragen zu Investitionen, Einzahlungen, Auszahlungen, VIP-Stufen, Empfehlungen, Sicherheit und mehr beantworten.",
            "help": "Wie kann ich Ihnen helfen? Ich kann Fragen zu Investitionen, Einzahlungen, Auszahlungen, VIP-Stufen, Empfehlungen, Sicherheit und mehr beantworten.",
            "hallo": "Hallo! Wie kann ich Ihnen heute helfen?",
            "danke": "Gern geschehen! Gibt es noch etwas, womit ich Ihnen helfen kann?",
        }
        default_response = "Ich bin hier, um zu helfen! Sie können mir Fragen zu Investitionen, Einzahlungen, Auszahlungen, VIP-Stufen, Empfehlungen, Sicherheit, Registrierung und mehr stellen. Für persönliche Hilfe kontaktieren Sie servicecashgold@gmail.com"
    else:  # English (default)
        responses = {
            # Investment
            "invest": "To invest, log in to your account, go to the 'Invest' tab, choose the amount and VIP plan. The minimum is $10.",
            "investment": "To invest, log in to your account, go to the 'Invest' tab, choose the amount and VIP plan. The minimum is $10.",
            # Deposit
            "deposit": "To deposit, go to the 'Deposit' tab, copy the USDT TRC20 address, send your funds from your wallet, then submit the amount.",
            # Withdraw
            "withdraw": "To withdraw, go to the 'Withdraw' tab, enter the amount (minimum $10) and your USDT TRC20 address.",
            # VIP
            "vip": "There are 5 VIP levels: VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999), and VIP 5 ($5,000+). All offer 5% daily return.",
            "level": "There are 5 VIP levels: VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999), and VIP 5 ($5,000+). All offer 5% daily return.",
            # Referral
            "referral": "Share your unique referral link. When your referrals sign up and make a deposit, you receive 5% of their amount.",
            # Contact
            "contact": "To contact us, send an email to servicecashgold@gmail.com or use the contact form.",
            "support": "To contact us, send an email to servicecashgold@gmail.com or use the contact form.",
            # Registration
            "register": "To register, click on 'Register', fill the form with your email, username and password. You can also use a referral code.",
            "signup": "To register, click on 'Register', fill the form with your email, username and password. You can also use a referral code.",
            "account": "To create an account, click on 'Register' and fill the registration form.",
            # Security
            "safe": "Your funds are secured with bank-level SSL encryption and advanced security protocols.",
            "security": "Your funds are secured with bank-level SSL encryption and advanced security protocols.",
            # Profits
            "profit": "Profits are calculated automatically at 5% daily on your active investments.",
            "earnings": "Profits are calculated automatically at 5% daily on your active investments.",
            "return": "All investments offer a 5% daily return, regardless of VIP level.",
            # Fees
            "fee": "We don't charge deposit or withdrawal fees. The amount you deposit or request is the amount you receive.",
            "fees": "We don't charge deposit or withdrawal fees. The amount you deposit or request is the amount you receive.",
            # Time
            "time": "Deposits are validated within 12 hours maximum. Withdrawals are processed between 30 minutes and 24 hours.",
            "delay": "Deposits are validated within 12 hours maximum. Withdrawals are processed between 30 minutes and 24 hours.",
            # Stop investment
            "stop": "You can stop an active investment at any time. Your capital and profits are immediately returned to your balance.",
            # Minimum
            "minimum": "The minimum investment is $10. The minimum deposit is $10. The minimum withdrawal is $10.",
            "min": "The minimum investment is $10. The minimum deposit is $10. The minimum withdrawal is $10.",
            # USDT
            "usdt": "We only accept deposits in USDT on the TRC20 network. Make sure to use the correct network.",
            "trc20": "We only accept deposits in USDT on the TRC20 network. Make sure to use the correct network.",
            # Multiple accounts
            "multiple": "No, each user may have only one account. Multiple accounts are prohibited.",
            "accounts": "No, each user may have only one account. Multiple accounts are prohibited.",
            # Greetings
            "help": "How can I help you? I can answer questions about investments, deposits, withdrawals, VIP levels, referrals, security and more.",
            "hello": "Hello! How can I help you today?",
            "hi": "Hi! How can I help you today?",
            "thanks": "You're welcome! Is there anything else I can help you with?",
            "thank": "You're welcome! Is there anything else I can help you with?",
        }
        default_response = "I'm here to help! You can ask me questions about investments, deposits, withdrawals, VIP levels, referrals, security, registration and more. For personalized assistance, contact servicecashgold@gmail.com"
    
    # Check for keywords in message
    for keyword, response in responses.items():
        if keyword in message:
            return {"response": response}
    
    # Default response based on language
    return {"response": default_response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
