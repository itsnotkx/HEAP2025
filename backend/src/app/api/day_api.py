from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from schemas.day import DayCreate, DayUpdate, dayBase
from models.event import Event
from models.user import User
from crud import day as day_crud
from crud import event as event_crud
from crud import user as user_crud
from db.session import get_db

router = APIRouter(
    prefix="/day",
    tags=["days"]
)

@router.post("/", response_model=dayBase, status_code=status.HTTP_201_CREATED)
def create_day(day: DayCreate, db: Session = Depends(get_db)):
    events = [event_crud.get_event(db, event_id) for event_id in day.events_list]

    if not events:
        raise HTTPException(status_code=400, detail="No valid events found.")

    # 1. Collect category vectors from events
    category_vectors = [event.categories for event in events]  # List[List[float]]

    # 2. Compute average category vector from selected events
    num_categories = len(category_vectors[0])
    avg_vector = [0.0] * num_categories
    for vec in category_vectors:
        for i in range(num_categories):
            avg_vector[i] += vec[i]
    avg_vector = [x / len(category_vectors) for x in avg_vector]

    # 3. Fetch user and current preferences
    user = db.query(User).filter(User.id == day.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if user.preferences is None:
        user.preferences = avg_vector
    else:
        # 4. Blend with current preferences using a smoothing factor
        alpha = 0.5  # weight for new preferences (you can tune this)
        user.preferences = [
            (1 - alpha) * old + alpha * new
            for old, new in zip(user.preferences, avg_vector)
        ]

    user.preferences = [max(min(x, 1.0), -1.0) for x in user.preferences]
    db.commit()
    return day_crud.create_day(db, day)

@router.get("/", response_model=List[dayBase])
def read_all_days(user_id: int, db: Session = Depends(get_db)):

    return day_crud.get_all_days(db, user_id)

@router.get("/{day_id}", response_model=dayBase)
def read_day(day_id: int, db: Session = Depends(get_db)):
    day = day_crud.get_day(db, day_id)
    if not day:
        raise HTTPException(status_code=404, detail="day not found")
    return day

@router.put("/{day_id}", response_model=dayBase)
def update_day(day_id: int, updated_day: DayCreate, db: Session = Depends(get_db)):
    # 1. Fetch existing day
    day_in_db = day_crud.get_day(db, day_id)
    if not day_in_db:
        raise HTTPException(status_code=404, detail="Day not found.")

    user = db.query(User).filter(User.id == updated_day.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    old_event_ids = day_in_db.events_list
    new_event_ids = updated_day.events_list

    # 2. If events have changed, recalculate preferences delta
    if set(old_event_ids) != set(new_event_ids):
        def avg_vector(event_ids):
            events = db.query(Event).filter(Event.id.in_(event_ids)).all()
            vectors = [e.categories for e in events]
            n = len(vectors)
            if n == 0:
                return [0.0] * len(user.preferences)
            return [sum(vec[i] for vec in vectors) / n for i in range(len(vectors[0]))]

        old_avg = avg_vector(old_event_ids)
        new_avg = avg_vector(new_event_ids)

        # 3. Subtract old, add new (momentum update style)
        alpha = 0.5  # same as before
        for i in range(len(user.preferences)):
            # Undo old contribution, apply new one
            user.preferences[i] += alpha * (new_avg[i] - old_avg[i])

        # Optional: clamp to [-1, 1]
        user.preferences = [max(min(x, 1.0), -1.0) for x in user.preferences]

    # 4. Update the day
    day_in_db.events_list = updated_day.events_list
    day_in_db.day_date = updated_day.day_date
    db.commit()

    return day_in_db


@router.delete("/{day_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_day(day_id: int, db: Session = Depends(get_db)):
    success = day_crud.delete_day(db, day_id)
    if not success:
        raise HTTPException(status_code=404, detail="day not found")