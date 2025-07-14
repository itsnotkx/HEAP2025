from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey, DECIMAL, ARRAY
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
    categories = Column(ARRAY(float), nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    organiser_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
