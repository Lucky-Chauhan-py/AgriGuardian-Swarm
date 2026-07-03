import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, User, Farm, Field, SustainabilityMetric

def check_db():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print("--- USERS ---")
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}, Name: {u.full_name}")
            
        farms = db.query(Farm).all()
        print("\n--- FARMS ---")
        for f in farms:
            print(f"ID: {f.id}, Owner ID: {f.owner_id}, Name: {f.name}")
            
        fields = db.query(Field).all()
        print("\n--- FIELDS ---")
        for fld in fields:
            print(f"ID: {fld.id}, Farm ID: {fld.farm_id}, Name: {fld.name}, Crop: {fld.crop_type}")
            
        metrics = db.query(SustainabilityMetric).all()
        print("\n--- METRICS ---")
        for m in metrics:
            print(f"ID: {m.id}, Farm ID: {m.farm_id}, Score: {m.sustainability_score}")
            
    except Exception as e:
        print(f"Error querying database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
