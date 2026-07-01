import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, User
from app.routers.auth import get_password_hash, verify_password

def check_and_fix():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "farmer@agriguardian.com").first()
        if not user:
            print("User farmer@agriguardian.com does not exist in the database! Creating user...")
            user = User(
                email="farmer@agriguardian.com",
                hashed_password=get_password_hash("farmer123"),
                full_name="Rajesh Kumar",
                phone="9876543210",
                language="en",
                role="farmer"
            )
            db.add(user)
            db.commit()
            print("User created successfully.")
        else:
            print(f"User found: {user.email}")
            print(f"Stored Hash: {user.hashed_password}")
            
            # Let's test the hash with 'farmer123'
            is_valid = verify_password("farmer123", user.hashed_password)
            print(f"Is 'farmer123' valid for this hash? {is_valid}")
            
            if not is_valid:
                print("Password hash is invalid! Resetting password hash to 'farmer123'...")
                user.hashed_password = get_password_hash("farmer123")
                db.commit()
                print("Password reset successfully. Testing again...")
                db.refresh(user)
                is_valid_now = verify_password("farmer123", user.hashed_password)
                print(f"Is 'farmer123' valid now? {is_valid_now}")
    except Exception as e:
        print(f"Error checking database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_and_fix()
