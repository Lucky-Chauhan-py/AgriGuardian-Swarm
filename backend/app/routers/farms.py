from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db, Farm, Field, User
from app.schemas import FarmCreate, FarmResponse, FieldCreate, FieldResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/farms", tags=["farms"])

@router.get("", response_model=List[FarmResponse])
def get_farms(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Farm).filter(Farm.owner_id == current_user.id).all()

@router.post("", response_model=FarmResponse)
def create_farm(farm_in: FarmCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    farm = Farm(
        owner_id=current_user.id,
        name=farm_in.name,
        location=farm_in.location,
        size_acres=farm_in.size_acres,
        soil_type=farm_in.soil_type,
        water_source=farm_in.water_source,
        irrigation_type=farm_in.irrigation_type
    )
    db.add(farm)
    db.commit()
    db.refresh(farm)

    for field_in in farm_in.fields:
        field = Field(
            farm_id=farm.id,
            name=field_in.name,
            crop_type=field_in.crop_type,
            crop_variety=field_in.crop_variety,
            planting_date=field_in.planting_date,
            status="active"
        )
        db.add(field)
    
    db.commit()
    db.refresh(farm)
    return farm

@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm(farm_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm

@router.post("/{farm_id}/fields", response_model=FieldResponse)
def create_field(farm_id: int, field_in: FieldCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    field = Field(
        farm_id=farm_id,
        name=field_in.name,
        crop_type=field_in.crop_type,
        crop_variety=field_in.crop_variety,
        planting_date=field_in.planting_date,
        status="active"
    )
    db.add(field)
    db.commit()
    db.refresh(field)
    return field
