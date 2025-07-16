from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey, DECIMAL, ARRAY, Float
from db.base import Base
from models.user import User

class Event(Base):
    __tablename__ = "event"

    event_id = Column(Integer, primary_key=True, index=True)
    title = Column(Text, nullable=False)
    start_date = Column(TIMESTAMP, nullable=False)
    end_date = Column(TIMESTAMP, nullable=False)
    address = Column(Text, nullable=True)
    price = Column(DECIMAL(10, 2), nullable=True)
    categories = Column(ARRAY(Float), nullable=True)
    description = Column(Text, nullable=True)
    images = Column(ARRAY(Text), nullable=True)
    lat = Column(Float, nullable = True)
    long = Column(Float, nullable = True)
