from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

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

@router.post("/signup/traditional", response_model=UserOut)
def signup_traditional(user: UserCreate, db: Session = Depends(get_db)):
    if user_crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_crud.create_user_traditional(db, user)

@router.post("/signup/sso", response_model=UserOut)
def signup_sso(user: UserCreateSSO, db: Session = Depends(get_db)):
    if user_crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_crud.create_user_sso(db, user)

@router.post("/signin/traditional")
def signin_traditional(email: str, password: str, db: Session = Depends(get_db)):
    if user_crud.verify_user_password(db, email, password):
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/signin/sso")
def signin_sso(email: str, sso_id: str, db: Session = Depends(get_db)):
    if user_crud.verify_user_sso(db, email, sso_id):
        return {"message": "SSO login successful"}
    raise HTTPException(status_code=401, detail="Invalid SSO credentials")