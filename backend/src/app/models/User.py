from sqlalchemy import Column, Integer, String, Float, Text, TIMESTAMP, ARRAY
from db.base import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(Text, nullable=False) 
    preferences = Column(
        ARRAY(Float),
        nullable=False,
        default=lambda: [0] * 51
    )
    rating = Column(Float, nullable=True)
    email = Column(Text, unique=True, nullable=False, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now())