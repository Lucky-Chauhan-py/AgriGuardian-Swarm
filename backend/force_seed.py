import sys
import os
import datetime
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, User, Farm, Field, SustainabilityMetric
from app.routers.auth import get_password_hash

def force_seed():
    db = SessionLocal()
    try:
        # 1. Ensure user exists
        user = db.query(User).filter(User.email == "farmer@agriguardian.com").first()
        if not user:
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
            db.refresh(user)
            print("User created.")
        else:
            user.hashed_password = get_password_hash("farmer123")
            db.commit()
            print("User password updated.")

        # 2. Ensure farm exists
        farm = db.query(Farm).filter(Farm.owner_id == user.id).first()
        if not farm:
            farm = Farm(
                owner_id=user.id,
                name="Green Valley Farms",
                location="Bareilly, Uttar Pradesh",
                size_acres=2.5,
                soil_type="Loamy",
                water_source="Borewell",
                irrigation_type="Drip"
            )
            db.add(farm)
            db.commit()
            db.refresh(farm)
            print("Farm created.")
        else:
            print("Farm already exists.")

        # 3. Ensure fields exist
        fields_count = db.query(Field).filter(Field.farm_id == farm.id).count()
        if fields_count == 0:
            field1 = Field(
                farm_id=farm.id,
                name="North Tomato Patch",
                crop_type="Tomato",
                crop_variety="Arka Rakshak",
                planting_date=datetime.datetime.utcnow() - datetime.timedelta(days=30),
                status="active"
            )
            field2 = Field(
                farm_id=farm.id,
                name="East Wheat Field",
                crop_type="Wheat",
                crop_variety="PBW 343",
                planting_date=datetime.datetime.utcnow() - datetime.timedelta(days=60),
                status="active"
            )
            db.add(field1)
            db.add(field2)
            db.commit()
            print("Fields created.")
        else:
            print("Fields already exist.")

        # 4. Ensure sustainability metrics exist
        metrics_count = db.query(SustainabilityMetric).filter(SustainabilityMetric.farm_id == farm.id).count()
        if metrics_count == 0:
            metric = SustainabilityMetric(
                farm_id=farm.id,
                water_usage_liters=15000.0,
                carbon_footprint_kg_co2=105.0,
                fertilizer_efficiency_pct=80.0,
                sustainability_score=85
            )
            db.add(metric)
            db.commit()
            print("Sustainability metrics created.")
        else:
            print("Sustainability metrics already exist.")

        print("Force seeding completed successfully!")
    except Exception as e:
        print(f"Error force seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    force_seed()
