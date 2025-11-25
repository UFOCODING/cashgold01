#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from passlib.context import CryptContext
from datetime import datetime, timezone
import uuid
import secrets
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin():
    admin_email = "admin@cashgold.com"
    admin_password = "admin123"
    
    # Check if admin already exists
    existing = await db.users.find_one({"email": admin_email})
    if existing:
        print(f"Admin user already exists: {admin_email}")
        return
    
    admin_user = {
        "id": str(uuid.uuid4()),
        "email": admin_email,
        "username": "Admin",
        "password_hash": pwd_context.hash(admin_password),
        "balance": 0.0,
        "invested_balance": 0.0,
        "total_profits": 0.0,
        "vip_level": 0,
        "is_active": True,
        "is_admin": True,
        "referral_code": secrets.token_urlsafe(8),
        "referred_by": None,
        "two_fa_enabled": False,
        "two_fa_code": None,
        "two_fa_expires": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_profit_calculation": None
    }
    
    await db.users.insert_one(admin_user)
    print(f"Admin user created successfully!")
    print(f"Email: {admin_email}")
    print(f"Password: {admin_password}")
    print(f"Please change the password after first login.")

if __name__ == "__main__":
    asyncio.run(create_admin())
