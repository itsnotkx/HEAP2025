from sqlalchemy.orm import Session
from models.user import User as User_Model
from schemas.user import UserBase, UserCreate

# CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(User_Model).filter(User_Model.email == email).first()



def verify_user_sso(db: Session, email: str, sso_id: str) -> bool:
    user = get_user_by_email(db, email)
    return user is not None and user.sso_id == sso_id

def create_user(db: Session, user: UserCreate):
    db_user = User_Model(
        username=user.username,
        email=user.email,
        preferences=[0 for _ in range(51)],
        rating=None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user_sso(db: Session, user: UserBase):
    db_user = User_Model(
        username=user.username,
        email=user.email,
        preferences=user.preferences,
        rating=user.rating,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
