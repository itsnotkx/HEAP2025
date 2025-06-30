from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# Shared properties
class UserBase(BaseModel):
    username: str
    image_url: Optional[str]
    preferences: Optional[List[int]]
    rating: Optional[float]
    email: EmailStr


# Schema for creation
class UserCreate(UserBase):
    password: str  # plain-text password sent by client


# Schema for update (partial)
class UserUpdate(BaseModel):
    username: Optional[str]
    image_url: Optional[str]
    preferences: Optional[List[int]]
    rating: Optional[float]
    email: Optional[EmailStr]
    password: Optional[str]


# Schema returned in responses
class UserOut(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True  # allows SQLAlchemy model → Pydantic conversion
