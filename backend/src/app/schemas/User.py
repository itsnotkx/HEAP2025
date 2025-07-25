from pydantic import BaseModel, EmailStr, Field # type: ignore
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    preferences: List[float] = Field(default_factory=lambda: [0] * 51)
    rating: Optional[float] = None

class UserCreate(BaseModel):  # for POST input
    username: str
    email: EmailStr

class UserOut(UserCreate):  # for response
    user_id: int
    preferences: List[float] = Field(default_factory=lambda: [0] * 51)
    rating: Optional[float] = None
# class UserCreate(UserBase):
#     password: str

# class UserCreateSSO(UserBase):
#     sso_id: str

# class UserOut(UserBase):
#     user_id: int
#     created_at: datetime

    class Config:
        from_attributes = True

# class LoginRequest(BaseModel):
#     email: str
#     password: str


