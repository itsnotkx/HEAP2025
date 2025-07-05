from sqlalchemy.orm import Session
from typing import List, Optional
from models.event import Event
from schemas.event import EventCreate, EventUpdate
from datetime import datetime
from sqlalchemy import func, text
from sqlalchemy.dialects.postgresql import array

def get_event(db: Session, event_id: int) -> Optional[Event]:
    return db.query(Event).filter(Event.event_id == event_id).first()

def get_all_events(db: Session, skip: int = 0, limit: int = 100) -> List[Event]:
    return db.query(Event).offset(skip).limit(limit).all()

def create_event(db: Session, event_data: EventCreate) -> Event:
    db_event = Event(
        title=event_data.title,
        start_date=event_data.start_date,
        end_date=event_data.end_date,
        address=event_data.address,
        price=event_data.price,
        categories=event_data.categories,
        description=event_data.description,
        organiser_id=event_data.organiser_id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def update_event(db: Session, event_id: int, updates: EventUpdate) -> Optional[Event]:
    event = get_event(db, event_id)
    if not event:
        return None
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event


def delete_event(db: Session, event_id: int) -> bool:
    event = get_event(db, event_id)
    if event:
        db.delete(event)
        db.commit()
        return True
    return False

def search_event(db: Session, start_date: datetime, end_date: datetime, preferences: List[int]) -> List[Event]:
    # Convert Python list to PostgreSQL array
    preferences_array = array(preferences)

    # Compute the dot product between event.categories and preferences
    relevance_score = func.sum(
        func.unnest(Event.categories) * func.unnest(preferences_array)
    )

    return (
        db.query(Event)
        .filter(Event.start_date >= start_date, Event.end_date <= end_date)
        .order_by(relevance_score.desc())
        .all()
    )