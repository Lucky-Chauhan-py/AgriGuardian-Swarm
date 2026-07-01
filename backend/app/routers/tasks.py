from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db, Task, Farm
from app.schemas import TaskCreate, TaskResponse, TaskUpdate
from app.routers.auth import get_current_user, User

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("", response_model=List[TaskResponse])
def get_tasks(farm_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify farm ownership
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found or access denied")
    return db.query(Task).filter(Task.farm_id == farm_id).order_by(Task.due_date.asc()).all()

@router.post("", response_model=TaskResponse)
def create_task(farm_id: int, task_in: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found or access denied")
    
    task = Task(
        farm_id=farm_id,
        title=task_in.title,
        description=task_in.description,
        due_date=task_in.due_date,
        category=task_in.category,
        status="pending"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_in: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Verify ownership via farm
    farm = db.query(Farm).filter(Farm.id == task.farm_id, Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=403, detail="Access denied")
        
    task.status = task_in.status
    db.commit()
    db.refresh(task)
    return task
