from sqlalchemy import Column, Integer, String, Float, Text, TIMESTAMP, ARRAY
from db.base import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "User"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    preferences = Column(ARRAY(Integer))
    rating = Column(Float, nullable=True)
    email = Column(Text, unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    sso_id = Column(Text, nullable=True)

