from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from schemas.event import EventCreate, EventUpdate, EventOut
from schemas.user import UserCreate, UserCreateSSO, UserOut
from crud import event as event_crud
from crud import user as user_crud
from db.session import get_db

router = APIRouter(
    prefix="/events",
    tags=["events"]
)


@router.post("/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    return event_crud.create_event(db, event)


@router.get("/", response_model=List[EventOut])
def read_all_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):

    return event_crud.get_all_events(db, skip=skip, limit=limit)


@router.get("/search", response_model=List[EventOut])
def search_for_events(
    start_date: datetime = Query(..., description="Start date in ISO format"),
    end_date: datetime = Query(..., description="End date in ISO format"),
    user_id: int = Query(..., description="User ID to filter events by user preferences"),
    db: Session = Depends(get_db)
):
    events = event_crud.search_event(db, start_date, end_date, user_id)
    if not events:
        raise HTTPException(status_code=404, detail="No events found for the given criteria")
    return events





@router.get("/{event_id}", response_model=EventOut)
def read_event(event_id: int, db: Session = Depends(get_db)):
    event = event_crud.get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/{event_id}", response_model=EventOut)
def update_event(event_id: int, event_update: EventUpdate, db: Session = Depends(get_db)):
    event = event_crud.update_event(db, event_id, event_update)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    success = event_crud.delete_event(db, event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
