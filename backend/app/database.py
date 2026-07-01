from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    language = Column(String, default="en")  # en, hi, pa
    role = Column(String, default="farmer")  # farmer, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farms = relationship("Farm", back_populates="owner", cascade="all, delete-orphan")
    chats = relationship("Chat", back_populates="user", cascade="all, delete-orphan")

class Farm(Base):
    __tablename__ = "farms"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)  # Latitude, Longitude or address
    size_acres = Column(Float, default=1.0)
    soil_type = Column(String, nullable=True)  # Clay, Sandy, Loamy, etc.
    water_source = Column(String, nullable=True)  # Well, Canal, Rainfed, Borewell
    irrigation_type = Column(String, nullable=True)  # Drip, Sprinkler, Flood
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="farms")
    fields = relationship("Field", back_populates="farm", cascade="all, delete-orphan")
    crop_images = relationship("CropImage", back_populates="farm", cascade="all, delete-orphan")
    sustainability_metrics = relationship("SustainabilityMetric", back_populates="farm", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="farm", cascade="all, delete-orphan")

class Field(Base):
    __tablename__ = "fields"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    name = Column(String, nullable=False)
    crop_type = Column(String, nullable=False)
    crop_variety = Column(String, nullable=True)
    planting_date = Column(DateTime, nullable=True)
    status = Column(String, default="active")  # active, harvested, fallow
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farm = relationship("Farm", back_populates="fields")

class CropImage(Base):
    __tablename__ = "crop_images"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    image_url = Column(String, nullable=False)  # Path or URL to uploaded image
    captured_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="pending")  # pending, analyzed, failed
    
    # Analysis results
    diagnosis = Column(String, nullable=True)
    pest_or_disease = Column(String, nullable=True)
    severity_score = Column(Float, nullable=True)  # 0.0 to 1.0
    growth_stage = Column(String, nullable=True)
    treatment_plan = Column(Text, nullable=True)

    farm = relationship("Farm", back_populates="crop_images")
    disease_reports = relationship("DiseaseReport", back_populates="crop_image", cascade="all, delete-orphan")

class DiseaseReport(Base):
    __tablename__ = "disease_reports"
    id = Column(Integer, primary_key=True, index=True)
    crop_image_id = Column(Integer, ForeignKey("crop_images.id"), nullable=False)
    disease_name = Column(String, nullable=False)
    confidence = Column(Float, default=1.0)
    symptoms = Column(Text, nullable=True)
    preventive_measures = Column(Text, nullable=True)
    chemical_control = Column(Text, nullable=True)
    biological_control = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    crop_image = relationship("CropImage", back_populates="disease_reports")

class WeatherLog(Base):
    __tablename__ = "weather_logs"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, index=True, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    temp_c = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    precipitation_mm = Column(Float, default=0.0)
    wind_kph = Column(Float, default=0.0)
    condition = Column(String, nullable=False)
    forecast_json = Column(JSON, nullable=True)  # Stores 7-day forecast
    alerts = Column(JSON, nullable=True)  # Frost, heatwave alerts

class MarketPrice(Base):
    __tablename__ = "market_prices"
    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    market = Column(String, index=True, nullable=False)
    commodity = Column(String, index=True, nullable=False)
    variety = Column(String, nullable=True)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class GovScheme(Base):
    __tablename__ = "gov_schemes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    benefits = Column(Text, nullable=True)
    eligibility_criteria = Column(Text, nullable=True)
    application_process = Column(Text, nullable=True)
    source_url = Column(String, nullable=True)
    category = Column(String, nullable=True)  # Subsidy, Loan, Insurance, Grant

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    category = Column(String, nullable=False)  # Crop, Irrigation, Fertilizer, Market, Risk
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    priority = Column(String, default="medium")  # high, medium, low
    status = Column(String, default="active")  # active, dismissed, implemented
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=False)
    category = Column(String, default="general")  # watering, fertilizer, harvesting, scouting
    status = Column(String, default="pending")  # pending, completed, overdue
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farm = relationship("Farm", back_populates="tasks")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info")  # alert, info, reminder, price_alert
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    title = Column(String, nullable=False)
    file_path = Column(String, nullable=True)  # Path to generated PDF
    summary = Column(Text, nullable=True)
    data_json = Column(JSON, nullable=True)  # Contains details for frontend rendering
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SustainabilityMetric(Base):
    __tablename__ = "sustainability_metrics"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    water_usage_liters = Column(Float, default=0.0)
    carbon_footprint_kg_co2 = Column(Float, default=0.0)
    fertilizer_efficiency_pct = Column(Float, default=0.0)
    sustainability_score = Column(Integer, default=70)  # 0-100
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

    farm = relationship("Farm", back_populates="sustainability_metrics")

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    sender = Column(String, default="user")  # user, system
    agent_thoughts = Column(JSON, nullable=True)  # Log of agent communications/reasoning
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="chats")

class Memory(Base):
    __tablename__ = "memories"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    key = Column(String, index=True, nullable=False)
    value = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
