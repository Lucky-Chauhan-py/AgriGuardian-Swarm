from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    phone: Optional[str]
    language: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# Farm Schemas
class FieldCreate(BaseModel):
    name: str
    crop_type: str
    crop_variety: Optional[str] = None
    planting_date: Optional[datetime] = None

class FieldResponse(BaseModel):
    id: int
    name: str
    crop_type: str
    crop_variety: Optional[str]
    planting_date: Optional[datetime]
    status: str

    class Config:
        from_attributes = True

class FarmCreate(BaseModel):
    name: str
    location: Optional[str] = None
    size_acres: float
    soil_type: Optional[str] = None
    water_source: Optional[str] = None
    irrigation_type: Optional[str] = None
    fields: Optional[List[FieldCreate]] = []

class FarmResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]
    size_acres: float
    soil_type: Optional[str]
    water_source: Optional[str]
    irrigation_type: Optional[str]
    fields: List[FieldResponse]

    class Config:
        from_attributes = True

# Task Schemas
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: datetime
    category: str

class TaskUpdate(BaseModel):
    status: str

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    due_date: datetime
    category: str
    status: str

    class Config:
        from_attributes = True

# Notification Schemas
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Report Schemas
class ReportResponse(BaseModel):
    id: int
    title: str
    file_path: Optional[str]
    summary: Optional[str]
    data_json: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True

# Sustainability Schemas
class SustainabilityMetricResponse(BaseModel):
    id: int
    water_usage_liters_per_day: float
    carbon_footprint_kg_co2: float
    fertilizer_efficiency_pct: float
    sustainability_score: int
    recorded_at: datetime

# Chat Schemas
class ChatMessageRequest(BaseModel):
    message: str
    farm_id: int

class ChatMessageResponse(BaseModel):
    id: int
    message: str
    sender: str
    agent_thoughts: Optional[List[Dict[str, Any]]]
    created_at: datetime

    class Config:
        from_attributes = True
