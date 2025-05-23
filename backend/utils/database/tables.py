from typing import List
from uuid import uuid4
from datetime import datetime

from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, ARRAY
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.schema import PrimaryKeyConstraint


Base = declarative_base()

class Event(Base):
    __tablename__ = "events"

    event_id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String)
    organizer = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    address = Column(String)
    price = Column(Float)
    category = Column(ARRAY[String])
    description = Column(Text)
    image_urls = Column(ARRAY(String))
    
    @classmethod
    def from_dict(cls, data: dict):
        """Create Event object from dictionary (scraped data, API input, etc.)"""
        event = cls()
        
        # Handle basic fields
        event.title = data.get("title")
        event.organizer = data.get("organizer")
        event.address = data.get("address")
        event.price = data.get("price", 0.0) if data.get("price") is not None else None
        event.category = data.get("category")
        event.description = data.get("description")
        event.image_urls = data.get("image_urls", [])
        
        # Handle datetime fields with multiple format support
        if data.get("start_date"):
            event.start_date = cls._parse_datetime(data["start_date"])
        if data.get("end_date"):
            event.end_date = cls._parse_datetime(data["end_date"])
            
        return event
    
    def to_dict(self) -> dict:
        """Convert Event object to dictionary for API responses"""
        result = {
            "event_id": str(self.event_id),
            "title": self.title,
            "organizer": self.organizer,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "address": self.address,
            "price": self.price,
            "category": self.category,
            "description": self.description,
            "image_urls": self.image_urls or []
        }
        
        return result
    
    @staticmethod
    def _parse_datetime(date_input):
        """Helper method to parse various datetime formats"""
        if isinstance(date_input, datetime):
            return date_input
        
        if isinstance(date_input, str):
            # Common datetime formats for web scraping
            formats = [
                "%Y-%m-%d %H:%M:%S",
                "%Y-%m-%dT%H:%M:%SZ",
                "%Y-%m-%dT%H:%M:%S",
                "%m/%d/%Y %I:%M %p",
                "%d/%m/%Y %H:%M",
                "%Y-%m-%d",
                "%m/%d/%Y"
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(date_input, fmt)
                except ValueError:
                    continue
                    
            # Try ISO format parsing
            try:
                return datetime.fromisoformat(date_input.replace('Z', '+00:00'))
            except ValueError:
                pass
                
            raise ValueError(f"Unable to parse datetime: {date_input}")
        
        raise TypeError(f"Expected datetime or string, got {type(date_input)}")

class User(Base):
    __tablename__ = "users"
    user_id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    image_url = Column(String)

class Company(Base):
    __tablename__ = "company"
    company_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"), primary_key=True, default=uuid4)
    image_url = Column(String)
    rating = Column(Float)
    company_url = Column(String)
    company_description = Column(String)
    organisation_history = relationship("Company_Organisation_History", backref="company")
    
    @classmethod
    def from_dict(cls, data: dict):
        company = cls()
        company.company_id = data.get("company_id", uuid4())
        company.image_url = data.get("image_url", "")
        company.rating = data.get("rating", None)
        company.company_url = data.get("company_url", "")
        company.company_description = data.get("company_description", "")

    @classmethod
    def to_dict(self, include_relationships = False) -> dict:
        result = {
            "company_id":str(self.company_id),
            "image_url":self.image_url,
            "rating":self.rating,
            "company_url":self.company_url,
            "company_description":self.company_description
        }
        if include_relationships:
            result["organisation_history"] = [rel.to_dict() for rel in self.organisation_history]

        return result
    

class Participant(Base):
    __tablename__ = "participant"
    participant_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"), primary_key=True, default=uuid4)
    image_url = Column(String)
    rating = Column(Float)
    preferred_tags = Column(ARRAY[String])
    rating = Column(String)
    history = relationship("Participant_History", backref="participant")

    @classmethod
    def from_dict(cls, data: dict):
        participant = cls()
        participant.participant_id = data.get("participant_id", uuid4())
        participant.image_url = data.get("image_url", "")
        participant.rating = data.get("rating", "")
        participant.preferred_tags = data.get("preferred_tags", [])

        return participant

    def to_dict(self, include_relationships: bool = False) -> dict:
        data = {
            "participant_id": str(self.participant_id),
            "image_url": self.image_url,
            "rating": self.rating,
            "preferred_tags": self.preferred_tags or []
        }
        if include_relationships:
            data["history"] = [rel.to_dict() for rel in self.history]
        return data
    
class Participant_History(Base):
    __tablename__ = "participant-history"
    participant_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"), primary_key=True, default=uuid4)
    event_id = Column(PG_UUID(as_uuid=True), ForeignKey("event.event_id"), primary_key=True,  default=uuid4)
    comments = Column(List[String])
    indiv_rating = Column(Float)

    __table_args__ = (
        PrimaryKeyConstraint('participant_id', 'event_id')
    )

    @classmethod
    def from_dict(cls, data: dict):
        ph = cls()
        ph.participant_id = data.get("participant_id", uuid4())
        ph.event_id = data.get("event_id", uuid4())
        ph.comments = data.get("comments", [])
        ph.indiv_rating = data.get("indiv_rating")
        return ph

    def to_dict(self) -> dict:
        return {
            "participant_id": str(self.participant_id),
            "event_id": str(self.event_id),
            "comments": self.comments,
            "indiv_rating": self.indiv_rating
        }

class Company_Organisation_History(Base):
    __tablename__ = "company-organisation-history"
    event_id = Column(PG_UUID(as_uuid=True), ForeignKey("event.event_id"), primary_key=True,  default=uuid4)
    company_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.user_id"), primary_key=True, default=uuid4)

    __table_args__ = (
        PrimaryKeyConstraint('company_id', 'event_id')
    )

    @classmethod
    def from_dict(cls, data: dict):
        coh = cls()
        coh.event_id = data.get("event_id", uuid4())
        coh.company_id = data.get("company_id", uuid4())
        return coh