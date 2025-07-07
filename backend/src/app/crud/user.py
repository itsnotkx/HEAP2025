from sqlalchemy.orm import Session
from models.User import User as User_Model
from schemas.User import UserCreate, UserCreateSSO
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Utility
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(User_Model).filter(User_Model.email == email).first()

def verify_user_password(db: Session, email: str, password: str) -> bool:
    user = get_user_by_email(db, email)
    if user is not None and user.password_hash is not None:
        return verify_password(password, user.password_hash)
    return False

def verify_user_sso(db: Session, email: str, sso_id: str) -> bool:
    user = get_user_by_email(db, email)
    return user is not None and user.sso_id == sso_id

def create_user_traditional(db: Session, user: UserCreate):
    hashed_pw = hash_password(user.password)
    db_user = User_Model(
        username=user.username,
        email=user.email,
        image_url=user.image_url,
        preferences=user.preferences,
        rating=user.rating,
        password_hash=hashed_pw
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user_sso(db: Session, user: UserCreateSSO):
    db_user = User_Model(
        username=user.username,
        email=user.email,
        image_url=user.image_url,
        preferences=user.preferences,
        rating=user.rating,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
