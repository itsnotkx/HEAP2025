from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class dayBase(BaseModel):
    day_id: int
    user_id: int
    day_date: Optional[datetime]
    events_list: Optional[List[int]]

class FetchAllDays(BaseModel):
    user_id: int

class FetchDay(BaseModel):
    user_id: int
    day_id: int

class DayCreate(BaseModel):
    user_id: int
    day_date: datetime
    events_list: List[int]

class DayUpdate(BaseModel):
    user_id: int
    day_id: int
    events_list: Optional[List[int]]