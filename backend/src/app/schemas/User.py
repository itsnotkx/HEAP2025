from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    image_url: Optional[str] = None
    preferences: List[int] = Field(default_factory=lambda: [0] * 51)
    rating: Optional[float] = None

class UserCreate(UserBase):
    password: str

class UserCreateSSO(UserBase):
    sso_id: str

class UserOut(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: str
    password: str


