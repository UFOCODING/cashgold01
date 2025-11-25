#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def calculate_profits():
    """Calculate daily profits for all active investments"""
    print("Starting profit calculation...")
    
    active_investments = await db.investments.find({"is_active": True}).to_list(None)
    print(f"Found {len(active_investments)} active investments")
    
    for inv_doc in active_investments:
        # Calculate time since last profit
        now = datetime.now(timezone.utc)
        last_profit_time = inv_doc.get('last_profit_time')
        
        if isinstance(last_profit_time, str):
            last_profit_time = datetime.fromisoformat(last_profit_time)
        
        time_diff = now - last_profit_time
        hours_passed = time_diff.total_seconds() / 3600
        
        # Calculate profit (5% per day = ~0.208% per hour)
        if hours_passed >= 1:
            daily_rate = inv_doc.get('daily_return_rate', 5.0) / 100
            hourly_rate = daily_rate / 24
            profit = inv_doc['amount'] * hourly_rate * hours_passed
            
            # Update investment
            new_total_earned = inv_doc.get('total_earned', 0.0) + profit
            await db.investments.update_one(
                {"id": inv_doc['id']},
                {"$set": {
                    "total_earned": new_total_earned,
                    "last_profit_time": now.isoformat()
                }}
            )
            
            # Update user balance and total profits
            await db.users.update_one(
                {"id": inv_doc['user_id']},
                {
                    "$inc": {
                        "balance": profit,
                        "total_profits": profit
                    },
                    "$set": {"last_profit_calculation": now.isoformat()}
                }
            )
            
            print(f"Updated investment {inv_doc['id']}: +${profit:.2f} (total earned: ${new_total_earned:.2f})")
    
    print("Profit calculation completed!")

if __name__ == "__main__":
    asyncio.run(calculate_profits())
