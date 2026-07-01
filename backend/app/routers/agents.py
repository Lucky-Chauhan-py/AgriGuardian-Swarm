from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import shutil
from typing import Optional
from app.database import get_db, Chat, CropImage, DiseaseReport, Task
from app.schemas import ChatMessageRequest, ChatMessageResponse
from app.routers.auth import get_current_user, User
from app.agents.coordinator import coordinator_agent
from app.services.voice_service import voice_service
import datetime

router = APIRouter(prefix="/agents", tags=["agents"])

# Static upload folder setup
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/chat", response_model=ChatMessageResponse)
def chat_with_swarm(
    req: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Run the coordinator text workflow
    res = coordinator_agent.run_text_workflow(db, req.farm_id, current_user.id, req.message)
    
    # Save user message
    user_chat = Chat(
        user_id=current_user.id,
        message=req.message,
        sender="user"
    )
    db.add(user_chat)
    
    # Save agent response with thoughts
    agent_chat = Chat(
        user_id=current_user.id,
        message=res["response"],
        sender="system",
        agent_thoughts=res["thought_logs"]
    )
    db.add(agent_chat)
    db.commit()
    db.refresh(agent_chat)
    
    return agent_chat

@router.post("/scan")
async def scan_crop_image(
    farm_id: int = Form(...),
    mock_disease: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Save file
    file_ext = file.filename.split(".")[-1]
    filename = f"crop_{farm_id}_{int(datetime.datetime.utcnow().timestamp())}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    web_url = f"/static/uploads/{filename}"
    
    # Save crop image entry in DB
    crop_image = CropImage(
        farm_id=farm_id,
        image_url=web_url,
        status="analyzing"
    )
    db.add(crop_image)
    db.commit()
    db.refresh(crop_image)
    
    try:
        # Execute Coordinator Image Workflow
        workflow_res = coordinator_agent.run_image_workflow(
            db=db,
            farm_id=farm_id,
            user_id=current_user.id,
            image_path=file_path,
            mock_disease=mock_disease
        )
        
        diag = workflow_res["diagnosis"]
        
        # Update CropImage in DB
        crop_image.status = "analyzed"
        crop_image.diagnosis = diag["disease_name"]
        crop_image.pest_or_disease = diag["pest_or_disease"]
        crop_image.severity_score = diag["severity_score"]
        crop_image.growth_stage = diag["growth_stage"]
        crop_image.treatment_plan = diag["treatment_plan"]
        
        # Save Disease Report
        disease_report = DiseaseReport(
            crop_image_id=crop_image.id,
            disease_name=diag["disease_name"],
            symptoms=diag["symptoms"],
            preventive_measures=diag["preventive_measures"],
            chemical_control=diag["chemical_control"],
            biological_control=diag["biological_control"]
        )
        db.add(disease_report)
        
        # Save generated tasks to DB
        tasks_to_add = workflow_res["tasks"]["daily_tasks"] + workflow_res["tasks"]["weekly_tasks"]
        for t in tasks_to_add:
            task = Task(
                farm_id=farm_id,
                title=t["title"],
                description=t["description"],
                due_date=datetime.datetime.fromisoformat(t["due_date"]),
                category=t["category"],
                status="pending"
            )
            db.add(task)
            
        db.commit()
        db.refresh(crop_image)
        
        return {
            "crop_image_id": crop_image.id,
            "image_url": web_url,
            "workflow_results": workflow_res
        }
        
    except Exception as e:
        crop_image.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Autonomous workflow failed: {str(e)}")

@router.post("/voice")
def voice_assisted_command(
    message: str = Form(...),
    lang: str = Form("en"),  # en, hi, pa
    farm_id: int = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Translate to English
    eng_message = voice_service.translate_to_english(message, lang)
    
    # Run the text workflow
    res = coordinator_agent.run_text_workflow(db, farm_id, current_user.id, eng_message)
    
    # Translate response back
    translated_response = voice_service.translate_from_english(res["response"], lang)
    
    # Save chats
    user_chat = Chat(user_id=current_user.id, message=message, sender="user")
    db.add(user_chat)
    
    agent_chat = Chat(
        user_id=current_user.id,
        message=translated_response,
        sender="system",
        agent_thoughts=res["thought_logs"]
    )
    db.add(agent_chat)
    db.commit()
    
    return {
        "user_message": message,
        "english_translation": eng_message,
        "agent_response": translated_response,
        "thought_logs": res["thought_logs"]
    }
