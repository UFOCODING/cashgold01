import psycopg2
from psycopg2.extras import RealDictCursor
from passlib.context import CryptContext
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = os.getenv("DATABASE_URL")

def create_admin():
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    cursor = conn.cursor()
    
    # Check if admin already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", ("admin@cashgold.com",))
    if cursor.fetchone():
        print("Admin already exists")
        conn.close()
        return
    
    # Create admin user
    admin_id = str(uuid.uuid4())
    hashed_password = pwd_context.hash("admin123")
    referral_code = uuid.uuid4().hex[:8]
    
    cursor.execute("""
        INSERT INTO users (id, email, username, hashed_password, is_admin, is_active, balance, referral_code)
        VALUES (%s, %s, %s, %s, TRUE, TRUE, 0.0, %s)
    """, (admin_id, "admin@cashgold.com", "admin", hashed_password, referral_code))
    
    conn.commit()
    conn.close()
    
    print(f"Admin created successfully!")
    print(f"Email: admin@cashgold.com")
    print(f"Password: admin123")
    print(f"Referral code: {referral_code}")

if __name__ == "__main__":
    create_admin()
