from sqlalchemy import Column, Integer, TIMESTAMP, ARRAY
from db.base import Base
from sqlalchemy.sql import func

class Day(Base):
    __tablename__ = "day"

    user_id = Column(Integer, primary_key=True, index=True)
    day_id = Column(Integer, primary_key=True, index=True)
    day_date = Column(TIMESTAMP, server_default=func.now())
    events_list = Column(ARRAY(Integer))