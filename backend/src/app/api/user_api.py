from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from schemas.user import UserBase, UserOut, UserCreate
from crud import user as user_crud
from db.session import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# @router.post("/signup/traditional", response_model=UserOut)
# def signup_traditional(user: UserCreate, db: Session = Depends(get_db)):
#     if user_crud.get_user_by_email(db, user.email):
#         raise HTTPException(status_code=400, detail="Email already registered")
#     return user_crud.create_user_traditional(db, user)

# @router.post("/signup/sso", response_model=UserOut)
# def signup_sso(user: UserCreateSSO, db: Session = Depends(get_db)):
#     if user_crud.get_user_by_email(db, user.email):
#         raise HTTPException(status_code=400, detail="Email already registered")
#     return user_crud.create_user_sso(db, user)

# @router.post("/signin/traditional")
# def signin_traditional(credentials:LoginRequest, db: Session = Depends(get_db)):
#     if user_crud.verify_user_password(db, credentials.email, credentials.password):
#         return {"message": "Login successful",
#                 "user":user_crud.get_user_by_email(db, credentials.email)}
#     raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/signin/sso", response_model=UserOut)
def signup_sso(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = user_crud.get_user_by_email(db, user.email)
    print(f"SSO Sign In: {user.email}, {user.username}")
    if existing_user:
        return existing_user  # must return a UserOut-compatible object
    return user_crud.create_user_sso(db, user)
