from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import secrets
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Create the main app without a prefix
app = FastAPI(title="CashGold API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    username: str
    password_hash: str
    balance: float = 0.0
    invested_balance: float = 0.0
    total_profits: float = 0.0
    vip_level: int = 0
    is_active: bool = True
    is_admin: bool = False
    referral_code: str = Field(default_factory=lambda: secrets.token_urlsafe(8))
    referred_by: Optional[str] = None
    two_fa_enabled: bool = False
    two_fa_code: Optional[str] = None
    two_fa_expires: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_profit_calculation: Optional[datetime] = None

class Deposit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: float
    currency: str = "USDT"
    wallet_address: str
    tx_hash: Optional[str] = None
    status: str = "pending"  # pending, approved, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    processed_at: Optional[datetime] = None
    processed_by: Optional[str] = None

class Withdrawal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: float
    currency: str = "USDT"
    wallet_address: str
    status: str = "pending"  # pending, processing, completed, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    processed_at: Optional[datetime] = None
    processed_by: Optional[str] = None

class Investment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: float
    vip_level: int
    daily_return_rate: float = 5.0  # 5% per day
    total_earned: float = 0.0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_profit_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Referral(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    referrer_id: str
    referred_id: str
    bonus_amount: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "global_settings"
    platform_wallet: str = "TLeCrKaPqcq3qZcdodJ8eUGJVzVbiWjMW1"
    min_deposit: float = 10.0
    min_withdrawal: float = 10.0
    referral_bonus_rate: float = 5.0  # 5%
    withdrawal_delay_hours: int = 0  # instant
    
# ==================== REQUEST/RESPONSE MODELS ====================

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    referral_code: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Verify2FARequest(BaseModel):
    email: EmailStr
    code: str

class DepositRequest(BaseModel):
    amount: float
    tx_hash: Optional[str] = None

class WithdrawalRequest(BaseModel):
    amount: float
    wallet_address: str

class InvestmentRequest(BaseModel):
    amount: float

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    balance: float
    invested_balance: float
    total_profits: float
    vip_level: int
    referral_code: str
    is_admin: bool
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    requires_2fa: bool = False
    user: Optional[UserResponse] = None

# ==================== UTILITY FUNCTIONS ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_2fa_code() -> str:
    return str(random.randint(100000, 999999))

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user_doc = await db.users.find_one({"id": user_id})
    if user_doc is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_doc)

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def determine_vip_level(amount: float) -> int:
    if amount >= 5000:
        return 5
    elif amount >= 1000:
        return 4
    elif amount >= 500:
        return 3
    elif amount >= 100:
        return 2
    elif amount >= 10:
        return 1
    return 0

async def calculate_and_update_profits():
    """Background task to calculate daily profits for all active investments"""
    active_investments = await db.investments.find({"is_active": True}).to_list(None)
    
    for inv_doc in active_investments:
        investment = Investment(**inv_doc)
        
        # Calculate time since last profit
        now = datetime.now(timezone.utc)
        time_diff = now - investment.last_profit_time
        hours_passed = time_diff.total_seconds() / 3600
        
        # Calculate profit (5% per day = ~0.208% per hour)
        if hours_passed >= 1:
            daily_rate = investment.daily_return_rate / 100
            hourly_rate = daily_rate / 24
            profit = investment.amount * hourly_rate * hours_passed
            
            # Update investment
            new_total_earned = investment.total_earned + profit
            await db.investments.update_one(
                {"id": investment.id},
                {"$set": {
                    "total_earned": new_total_earned,
                    "last_profit_time": now.isoformat()
                }}
            )
            
            # Update user balance and total profits
            await db.users.update_one(
                {"id": investment.user_id},
                {
                    "$inc": {
                        "balance": profit,
                        "total_profits": profit
                    },
                    "$set": {"last_profit_calculation": now.isoformat()}
                }
            )

# ==================== AUTHENTICATION ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(request: RegisterRequest):
    # Check if user exists
    existing_user = await db.users.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=request.email,
        username=request.username,
        password_hash=hash_password(request.password),
        referred_by=request.referral_code
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    await db.users.insert_one(user_dict)
    
    # Handle referral bonus
    if request.referral_code:
        referrer = await db.users.find_one({"referral_code": request.referral_code})
        if referrer:
            referral = Referral(
                referrer_id=referrer['id'],
                referred_id=user.id
            )
            ref_dict = referral.model_dump()
            ref_dict['created_at'] = ref_dict['created_at'].isoformat()
            await db.referrals.insert_one(ref_dict)
    
    # Generate access token immediately (no 2FA for registration)
    access_token = create_access_token(data={"sub": user.id})
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        balance=user.balance,
        invested_balance=user.invested_balance,
        total_profits=user.total_profits,
        vip_level=user.vip_level,
        referral_code=user.referral_code,
        is_admin=user.is_admin,
        created_at=user.created_at
    )
    
    return TokenResponse(
        access_token=access_token,
        requires_2fa=False,
        user=user_response
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    user_doc = await db.users.find_one({"email": request.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user = User(**user_doc)
    
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is suspended")
    
    # Generate 2FA code
    two_fa_code = generate_2fa_code()
    two_fa_expires = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    await db.users.update_one(
        {"id": user.id},
        {"$set": {
            "two_fa_code": two_fa_code,
            "two_fa_expires": two_fa_expires.isoformat()
        }}
    )
    
    logging.info(f"2FA Code for {request.email}: {two_fa_code}")
    
    return TokenResponse(
        access_token="",
        requires_2fa=True
    )

@api_router.post("/auth/verify-2fa", response_model=TokenResponse)
async def verify_2fa(request: Verify2FARequest):
    user_doc = await db.users.find_one({"email": request.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    user = User(**user_doc)
    
    # Check 2FA code
    if user.two_fa_code != request.code:
        raise HTTPException(status_code=401, detail="Invalid verification code")
    
    if user.two_fa_expires:
        expires = user.two_fa_expires if isinstance(user.two_fa_expires, datetime) else datetime.fromisoformat(user.two_fa_expires)
        if datetime.now(timezone.utc) > expires:
            raise HTTPException(status_code=401, detail="Verification code expired")
    
    # Clear 2FA code
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"two_fa_code": None, "two_fa_expires": None}}
    )
    
    # Generate access token
    access_token = create_access_token(data={"sub": user.id})
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        balance=user.balance,
        invested_balance=user.invested_balance,
        total_profits=user.total_profits,
        vip_level=user.vip_level,
        referral_code=user.referral_code,
        is_admin=user.is_admin,
        created_at=user.created_at
    )
    
    return TokenResponse(
        access_token=access_token,
        requires_2fa=False,
        user=user_response
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        balance=current_user.balance,
        invested_balance=current_user.invested_balance,
        total_profits=current_user.total_profits,
        vip_level=current_user.vip_level,
        referral_code=current_user.referral_code,
        is_admin=current_user.is_admin,
        created_at=current_user.created_at
    )

# ==================== DEPOSIT ROUTES ====================

@api_router.get("/deposits/wallet")
async def get_deposit_wallet(current_user: User = Depends(get_current_user)):
    settings_doc = await db.settings.find_one({"id": "global_settings"})
    if not settings_doc:
        settings = Settings()
        settings_dict = settings.model_dump()
        await db.settings.insert_one(settings_dict)
        wallet = settings.platform_wallet
    else:
        wallet = settings_doc.get("platform_wallet", "TLeCrKaPqcq3qZcdodJ8eUGJVzVbiWjMW1")
    
    return {"wallet_address": wallet, "currency": "USDT TRC20"}

@api_router.post("/deposits")
async def create_deposit(request: DepositRequest, current_user: User = Depends(get_current_user)):
    settings_doc = await db.settings.find_one({"id": "global_settings"})
    min_deposit = settings_doc.get("min_deposit", 10.0) if settings_doc else 10.0
    
    if request.amount < min_deposit:
        raise HTTPException(status_code=400, detail=f"Minimum deposit is ${min_deposit}")
    
    wallet = settings_doc.get("platform_wallet") if settings_doc else "TLeCrKaPqcq3qZcdodJ8eUGJVzVbiWjMW1"
    
    deposit = Deposit(
        user_id=current_user.id,
        amount=request.amount,
        wallet_address=wallet,
        tx_hash=request.tx_hash
    )
    
    deposit_dict = deposit.model_dump()
    deposit_dict['created_at'] = deposit_dict['created_at'].isoformat()
    await db.deposits.insert_one(deposit_dict)
    
    return {"message": "Deposit request submitted. Waiting for admin approval.", "deposit_id": deposit.id}

@api_router.get("/deposits/my")
async def get_my_deposits(current_user: User = Depends(get_current_user)):
    deposits = await db.deposits.find({"user_id": current_user.id}, {"_id": 0}).to_list(None)
    for dep in deposits:
        if isinstance(dep.get('created_at'), str):
            dep['created_at'] = datetime.fromisoformat(dep['created_at'])
        if dep.get('processed_at') and isinstance(dep.get('processed_at'), str):
            dep['processed_at'] = datetime.fromisoformat(dep['processed_at'])
    return deposits

# ==================== WITHDRAWAL ROUTES ====================

@api_router.post("/withdrawals")
async def create_withdrawal(request: WithdrawalRequest, current_user: User = Depends(get_current_user)):
    settings_doc = await db.settings.find_one({"id": "global_settings"})
    min_withdrawal = settings_doc.get("min_withdrawal", 10.0) if settings_doc else 10.0
    
    if request.amount < min_withdrawal:
        raise HTTPException(status_code=400, detail=f"Minimum withdrawal is ${min_withdrawal}")
    
    if current_user.balance < request.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    withdrawal = Withdrawal(
        user_id=current_user.id,
        amount=request.amount,
        wallet_address=request.wallet_address
    )
    
    withdrawal_dict = withdrawal.model_dump()
    withdrawal_dict['created_at'] = withdrawal_dict['created_at'].isoformat()
    await db.withdrawals.insert_one(withdrawal_dict)
    
    # Deduct from balance immediately
    await db.users.update_one(
        {"id": current_user.id},
        {"$inc": {"balance": -request.amount}}
    )
    
    return {"message": "Withdrawal request submitted", "withdrawal_id": withdrawal.id}

@api_router.get("/withdrawals/my")
async def get_my_withdrawals(current_user: User = Depends(get_current_user)):
    withdrawals = await db.withdrawals.find({"user_id": current_user.id}, {"_id": 0}).to_list(None)
    for wtd in withdrawals:
        if isinstance(wtd.get('created_at'), str):
            wtd['created_at'] = datetime.fromisoformat(wtd['created_at'])
        if wtd.get('processed_at') and isinstance(wtd.get('processed_at'), str):
            wtd['processed_at'] = datetime.fromisoformat(wtd['processed_at'])
    return withdrawals

# ==================== INVESTMENT ROUTES ====================

@api_router.post("/investments")
async def create_investment(request: InvestmentRequest, current_user: User = Depends(get_current_user)):
    if request.amount < 10:
        raise HTTPException(status_code=400, detail="Minimum investment is $10")
    
    if current_user.balance < request.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    vip_level = determine_vip_level(request.amount)
    
    investment = Investment(
        user_id=current_user.id,
        amount=request.amount,
        vip_level=vip_level,
        daily_return_rate=5.0
    )
    
    investment_dict = investment.model_dump()
    investment_dict['created_at'] = investment_dict['created_at'].isoformat()
    investment_dict['last_profit_time'] = investment_dict['last_profit_time'].isoformat()
    await db.investments.insert_one(investment_dict)
    
    # Update user
    new_invested = current_user.invested_balance + request.amount
    new_vip = determine_vip_level(new_invested)
    
    await db.users.update_one(
        {"id": current_user.id},
        {
            "$inc": {"balance": -request.amount, "invested_balance": request.amount},
            "$set": {"vip_level": new_vip}
        }
    )
    
    return {"message": "Investment created successfully", "investment_id": investment.id, "vip_level": vip_level}

@api_router.get("/investments/my")
async def get_my_investments(current_user: User = Depends(get_current_user)):
    investments = await db.investments.find({"user_id": current_user.id}, {"_id": 0}).to_list(None)
    for inv in investments:
        if isinstance(inv.get('created_at'), str):
            inv['created_at'] = datetime.fromisoformat(inv['created_at'])
        if isinstance(inv.get('last_profit_time'), str):
            inv['last_profit_time'] = datetime.fromisoformat(inv['last_profit_time'])
    return investments

@api_router.post("/investments/{investment_id}/stop")
async def stop_investment(investment_id: str, current_user: User = Depends(get_current_user)):
    investment_doc = await db.investments.find_one({"id": investment_id, "user_id": current_user.id})
    if not investment_doc:
        raise HTTPException(status_code=404, detail="Investment not found")
    
    if not investment_doc['is_active']:
        raise HTTPException(status_code=400, detail="Investment already stopped")
    
    # Calculate final profit before stopping
    await calculate_and_update_profits()
    
    # Return principal to balance
    await db.investments.update_one(
        {"id": investment_id},
        {"$set": {"is_active": False}}
    )
    
    await db.users.update_one(
        {"id": current_user.id},
        {
            "$inc": {"balance": investment_doc['amount'], "invested_balance": -investment_doc['amount']}
        }
    )
    
    return {"message": "Investment stopped and principal returned to balance"}

# ==================== REFERRAL ROUTES ====================

@api_router.get("/referrals/my")
async def get_my_referrals(current_user: User = Depends(get_current_user)):
    referrals = await db.referrals.find({"referrer_id": current_user.id}, {"_id": 0}).to_list(None)
    
    # Get referred user details
    result = []
    for ref in referrals:
        user_doc = await db.users.find_one({"id": ref['referred_id']})
        if user_doc:
            result.append({
                "username": user_doc['username'],
                "email": user_doc['email'],
                "bonus_earned": ref['bonus_amount'],
                "joined_at": ref['created_at']
            })
    
    return result

# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/deposits")
async def admin_get_deposits(current_user: User = Depends(get_admin_user)):
    deposits = await db.deposits.find({}, {"_id": 0}).to_list(None)
    for dep in deposits:
        if isinstance(dep.get('created_at'), str):
            dep['created_at'] = datetime.fromisoformat(dep['created_at'])
    return deposits

@api_router.post("/admin/deposits/{deposit_id}/approve")
async def admin_approve_deposit(deposit_id: str, current_user: User = Depends(get_admin_user)):
    deposit_doc = await db.deposits.find_one({"id": deposit_id})
    if not deposit_doc:
        raise HTTPException(status_code=404, detail="Deposit not found")
    
    if deposit_doc['status'] != 'pending':
        raise HTTPException(status_code=400, detail="Deposit already processed")
    
    # Update deposit status
    await db.deposits.update_one(
        {"id": deposit_id},
        {"$set": {
            "status": "approved",
            "processed_at": datetime.now(timezone.utc).isoformat(),
            "processed_by": current_user.id
        }}
    )
    
    # Add to user balance
    await db.users.update_one(
        {"id": deposit_doc['user_id']},
        {"$inc": {"balance": deposit_doc['amount']}}
    )
    
    # Handle referral bonus
    user_doc = await db.users.find_one({"id": deposit_doc['user_id']})
    if user_doc and user_doc.get('referred_by'):
        referrer = await db.users.find_one({"referral_code": user_doc['referred_by']})
        if referrer:
            settings_doc = await db.settings.find_one({"id": "global_settings"})
            bonus_rate = settings_doc.get("referral_bonus_rate", 5.0) if settings_doc else 5.0
            bonus = deposit_doc['amount'] * (bonus_rate / 100)
            
            await db.users.update_one(
                {"id": referrer['id']},
                {"$inc": {"balance": bonus}}
            )
            
            await db.referrals.update_one(
                {"referrer_id": referrer['id'], "referred_id": user_doc['id']},
                {"$inc": {"bonus_amount": bonus}}
            )
    
    return {"message": "Deposit approved"}

@api_router.post("/admin/deposits/{deposit_id}/reject")
async def admin_reject_deposit(deposit_id: str, current_user: User = Depends(get_admin_user)):
    deposit_doc = await db.deposits.find_one({"id": deposit_id})
    if not deposit_doc:
        raise HTTPException(status_code=404, detail="Deposit not found")
    
    if deposit_doc['status'] != 'pending':
        raise HTTPException(status_code=400, detail="Deposit already processed")
    
    await db.deposits.update_one(
        {"id": deposit_id},
        {"$set": {
            "status": "rejected",
            "processed_at": datetime.now(timezone.utc).isoformat(),
            "processed_by": current_user.id
        }}
    )
    
    return {"message": "Deposit rejected"}

@api_router.get("/admin/withdrawals")
async def admin_get_withdrawals(current_user: User = Depends(get_admin_user)):
    withdrawals = await db.withdrawals.find({}, {"_id": 0}).to_list(None)
    for wtd in withdrawals:
        if isinstance(wtd.get('created_at'), str):
            wtd['created_at'] = datetime.fromisoformat(wtd['created_at'])
    return withdrawals

@api_router.post("/admin/withdrawals/{withdrawal_id}/complete")
async def admin_complete_withdrawal(withdrawal_id: str, current_user: User = Depends(get_admin_user)):
    withdrawal_doc = await db.withdrawals.find_one({"id": withdrawal_id})
    if not withdrawal_doc:
        raise HTTPException(status_code=404, detail="Withdrawal not found")
    
    await db.withdrawals.update_one(
        {"id": withdrawal_id},
        {"$set": {
            "status": "completed",
            "processed_at": datetime.now(timezone.utc).isoformat(),
            "processed_by": current_user.id
        }}
    )
    
    return {"message": "Withdrawal completed"}

@api_router.get("/admin/users")
async def admin_get_users(current_user: User = Depends(get_admin_user)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0, "two_fa_code": 0}).to_list(None)
    return users

@api_router.post("/admin/users/{user_id}/suspend")
async def admin_suspend_user(user_id: str, current_user: User = Depends(get_admin_user)):
    await db.users.update_one({"id": user_id}, {"$set": {"is_active": False}})
    return {"message": "User suspended"}

@api_router.post("/admin/users/{user_id}/activate")
async def admin_activate_user(user_id: str, current_user: User = Depends(get_admin_user)):
    await db.users.update_one({"id": user_id}, {"$set": {"is_active": True}})
    return {"message": "User activated"}

@api_router.get("/admin/stats")
async def admin_get_stats(current_user: User = Depends(get_admin_user)):
    total_users = await db.users.count_documents({})
    active_users = await db.users.count_documents({"is_active": True})
    
    deposits = await db.deposits.find({"status": "approved"}).to_list(None)
    total_deposits = sum(d['amount'] for d in deposits)
    
    withdrawals = await db.withdrawals.find({"status": "completed"}).to_list(None)
    total_withdrawals = sum(w['amount'] for w in withdrawals)
    
    investments = await db.investments.find({}).to_list(None)
    total_invested = sum(i['amount'] for i in investments)
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_deposits": total_deposits,
        "total_withdrawals": total_withdrawals,
        "total_invested": total_invested,
        "platform_profit": total_deposits - total_withdrawals
    }

@api_router.get("/admin/settings")
async def admin_get_settings(current_user: User = Depends(get_admin_user)):
    settings_doc = await db.settings.find_one({"id": "global_settings"})
    if not settings_doc:
        settings = Settings()
        await db.settings.insert_one(settings.model_dump())
        return settings.model_dump()
    return settings_doc

@api_router.put("/admin/settings")
async def admin_update_settings(settings: Settings, current_user: User = Depends(get_admin_user)):
    await db.settings.update_one(
        {"id": "global_settings"},
        {"$set": settings.model_dump()},
        upsert=True
    )
    return {"message": "Settings updated"}

# ==================== PROFIT CALCULATION ====================

@api_router.post("/profits/calculate")
async def calculate_profits(background_tasks: BackgroundTasks):
    background_tasks.add_task(calculate_and_update_profits)
    return {"message": "Profit calculation started"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
