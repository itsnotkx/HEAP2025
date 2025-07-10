from typing import List, Optional
from pydantic import BaseModel, field_validator

class Event(BaseModel):
    title: str
    start_date: Optional[str]
    end_date: Optional[str]
    time: Optional[str] = None
    location: Optional[str]
    postal_code: Optional[str]
    category: Optional[float]
    price: Optional[float]
    description: str
    image_urls: List[str]
    organizer: Optional[str]
    official_link: Optional[str]
    url: List[str]
    @field_validator('category')
    def round_category(cls, v):
        if v is not None:
            return round(float(v), 1)
        return v
