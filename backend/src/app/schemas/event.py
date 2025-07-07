from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class EventBase(BaseModel):
    title: str
    start_date: datetime
    end_date: datetime
    address: Optional[str]
    price: Optional[float]
    categories: Optional[List[int]]
    description: Optional[str]


class EventCreate(EventBase):
    organiser_id: int


class EventUpdate(BaseModel):
    title: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    address: Optional[str]
    price: Optional[float]
    categories: Optional[List[int]]
    description: Optional[str]


class EventOut(EventBase):
    event_id: int
    organiser_id: int

    class Config:
        orm_mode = True

class EventSearchRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    preferences: List[int]