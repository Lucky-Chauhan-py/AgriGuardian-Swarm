from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.config import settings
from app.database import engine, Base, SessionLocal, User, Farm, Field, SustainabilityMetric
from app.routers import auth, farms, agents, tasks, notifications, reports, analytics
from app.routers.auth import get_password_hash
import datetime

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up Static files for uploads & reports
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(os.path.join(static_dir, "uploads"), exist_ok=True)
os.makedirs(os.path.join(static_dir, "reports"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include Routers
api_router_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_router_prefix)
app.include_router(farms.router, prefix=api_router_prefix)
app.include_router(agents.router, prefix=api_router_prefix)
app.include_router(tasks.router, prefix=api_router_prefix)
app.include_router(notifications.router, prefix=api_router_prefix)
app.include_router(reports.router, prefix=api_router_prefix)
app.include_router(analytics.router, prefix=api_router_prefix)

# Seed Database on Startup
@app.on_event("startup")
def seed_db():
    db = SessionLocal()
    try:
        # 1. Ensure default demo user exists (do NOT overwrite existing users)
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
            print("Demo user farmer@agriguardian.com created.")
        else:
            print("Demo user farmer@agriguardian.com already exists — skipping.")

        # 2. Ensure default farm exists for this user
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

        # 3. Ensure fields exist for this farm
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

        print("Database seeding verification completed successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to AgriGuardian Swarm API. Head to /docs for Swagger documentation."}
