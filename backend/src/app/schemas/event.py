from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Tuple


class EventBase(BaseModel):
    title: str
    start_date: datetime
    end_date: Optional[datetime]
    address: Optional[str]
    price: Optional[float]
    categories: Optional[List[float]]
    description: Optional[str]
    images: Optional[List[str]]
    lat: Optional[float]
    long: Optional[float]

class EventCreate(EventBase):
    organiser_id: int

class EventUpdate(BaseModel):
    title: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    address: Optional[str]
    price: Optional[float]
    categories: Optional[List[float]]
    description: Optional[str]
    images: Optional[List[str]]
    lat: Optional[float]
    long: Optional[float]

class EventOut(EventBase):
    event_id: int


    class Config:
        from_attributes = True

class EventSearchRequest(BaseModel):
    start_date: datetime
    end_date: datetime

    preferences: List[float]
