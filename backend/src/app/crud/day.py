from sqlalchemy.orm import Session, aliased
from typing import List, Optional, Any
from models.day import Day
from schemas.day import DayCreate, DayUpdate
from datetime import datetime
from sqlalchemy import func, text, select, literal_column
from sqlalchemy.dialects.postgresql import array

def get_day(db: Session, day_id: int) -> Optional[Day]:
    return db.query(Day).filter(Day.day_id == day_id).first()

def get_all_days(db: Session, user_id: int) -> List[Day]:
    return db.query(Day).filter(Day.user_id == user_id).all()

def create_day(db: Session, day_data:DayCreate) -> Day:
    db_day = Day(
        user_id = day_data.user_id,
        day_date = day_data.day_date,
        events_list = day_data.events_list
    )
    db.add(db_day)
    db.commit()
    db.refresh(db_day)
    return db_day

def update_day(db: Session, day_id: int, updates: DayUpdate) -> Optional[Day]:
    day = get_day(db, day_id)
    if not day:
        return None
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(day, key, value)
    db.commit()
    db.refresh(day)
    return day


def delete_day(db: Session, day_id: int) -> bool:
    day = get_day(db, day_id)
    if day:
        db.delete(day)
        db.commit()
        return True
    return False