from sqlalchemy import Column, Integer, Text, ARRAY, Float, TIMESTAMP
from sqlalchemy.sql import func
from db.session import Base  # assuming you have declarative_base()

class User(Base):
    __tablename__ = "User" 
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    preferences = Column(ARRAY(Integer), nullable=True)
    rating = Column(Float, nullable=True)
    email = Column(Text, nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
