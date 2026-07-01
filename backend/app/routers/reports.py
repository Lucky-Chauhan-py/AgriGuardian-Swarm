from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db, Report, Farm, Task
from app.schemas import ReportResponse
from app.routers.auth import get_current_user, User
from app.agents.report import report_agent
from app.agents.profile import profile_agent
import datetime

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("", response_model=List[ReportResponse])
def get_reports(farm_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify ownership
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found or access denied")
    return db.query(Report).filter(Report.farm_id == farm_id).order_by(Report.created_at.desc()).all()

@router.post("", response_model=ReportResponse)
def generate_report(farm_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found or access denied")
        
    # Compile profile & tasks
    profile_res = profile_agent.run(db, farm_id)
    farm_profile = profile_res["output"]
    farm_profile["farmer_name"] = current_user.full_name or "Farmer"
    
    tasks = db.query(Task).filter(Task.farm_id == farm_id, Task.status == "pending").all()
    task_list = [{"title": t.title, "category": t.category, "due_date": t.due_date.strftime("%Y-%m-%d"), "status": t.status} for t in tasks]
    
    # Run Report Agent
    analytics_mock = {"crop_health_score": 85, "sustainability_score": 75}
    report_res = report_agent.run(farm_profile, analytics_mock, task_list)
    
    out = report_res["output"]
    
    # Save Report to DB
    report = Report(
        farm_id=farm_id,
        title=out["report_title"],
        file_path=out["pdf_url"],
        summary=", ".join(out["summary"]),
        data_json=out["financials"],
        created_at=datetime.datetime.utcnow()
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return report
