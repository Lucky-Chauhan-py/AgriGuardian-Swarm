from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, Farm, SustainabilityMetric, CropImage
from app.routers.auth import get_current_user, User
import datetime

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("")
def get_analytics(farm_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify ownership
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found or access denied")
    # Query latest sustainability metrics
    latest_metric = db.query(SustainabilityMetric).filter(SustainabilityMetric.farm_id == farm_id).order_by(SustainabilityMetric.recorded_at.desc()).first()
    
    # Query historical crop scans
    scans = db.query(CropImage).filter(CropImage.farm_id == farm_id).order_by(CropImage.captured_at.asc()).all()
    
    # Find latest analyzed scan for current recommendations
    latest_scan = db.query(CropImage).filter(
        CropImage.farm_id == farm_id,
        CropImage.status == "analyzed"
    ).order_by(CropImage.captured_at.desc()).first()

    # Dynamic crop health score calculation
    health_score = 100
    latest_diagnosis = None
    if latest_scan:
        health_score = int(100 - (latest_scan.severity_score * 40))
        latest_diagnosis = {
            "disease_name": latest_scan.diagnosis,
            "pest_or_disease": latest_scan.pest_or_disease,
            "severity_score": latest_scan.severity_score,
            "growth_stage": latest_scan.growth_stage,
            "treatment_plan": latest_scan.treatment_plan
        }

    # Crop health score trend (simulated based on historical scans)
    health_trend = []
    base_date = datetime.date.today() - datetime.timedelta(days=30)
    for i in range(5):
        date_str = (base_date + datetime.timedelta(days=i*6)).strftime("%b %d")
        if latest_scan:
            # If disease is active, show health dip
            score = 100 - (i * 3) if i < 4 else health_score
        else:
            score = 100
        health_trend.append({"date": date_str, "score": score})

    # Yield prediction vs actual
    yield_data = [
        {"month": "Apr", "predicted": 10.5, "actual": 10.2},
        {"month": "May", "predicted": 11.2, "actual": 11.5},
        {"month": "Jun", "predicted": 12.0, "actual": 12.1},
        {"month": "Jul", "predicted": 12.5, "actual": None} # Current month
    ]

    # Water usage simulator values (drip vs flood)
    water_comparison = [
        {"type": "Flood Irrigation (Traditional)", "usage": 45000},
        {"type": "Drip Irrigation (AgriGuardian)", "usage": 15000}
    ]

    # Expense breakdown
    expenses = [
        {"name": "Seeds", "value": 4000},
        {"name": "Fertilizers", "value": 6500},
        {"name": "Labor", "value": 8000},
        {"name": "Irrigation/Power", "value": 3000},
        {"name": "Pesticides/Treatment", "value": 2500}
    ]

    # Dynamically build timeline events
    timeline_events = [
        {
            "date": farm.created_at.strftime("%b %d"),
            "title": "Farm Registered",
            "description": f"Successfully registered '{farm.name}' in '{farm.location}' location."
        }
    ]
    for scan in scans:
        if scan.status == "analyzed":
            timeline_events.append({
                "date": scan.captured_at.strftime("%b %d"),
                "title": "Crop Scan: " + scan.diagnosis,
                "description": f"Swarm diagnosed {scan.diagnosis} ({scan.pest_or_disease}) at {scan.growth_stage} stage."
            })

    return {
        "crop_health_score": health_score,
        "sustainability_score": latest_metric.sustainability_score if latest_metric else 78,
        "carbon_footprint_kg_co2": latest_metric.carbon_footprint_kg_co2 if latest_metric else 105.0,
        "water_efficiency_pct": 90.0 if farm.irrigation_type == "Drip" else 75.0 if farm.irrigation_type == "Sprinkler" else 50.0,
        "fertilizer_efficiency_pct": 80.0,
        "health_trend": health_trend,
        "yield_forecast": yield_data,
        "water_comparison": water_comparison,
        "expenses": expenses,
        "latest_diagnosis": latest_diagnosis,
        "timeline_events": timeline_events[:5]  # Limit to latest 5 events
    }
