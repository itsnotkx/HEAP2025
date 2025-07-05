from typing import List, Optional
from pydantic import BaseModel

class Event(BaseModel):
    title: str
    start_date: Optional[str]
    end_date: Optional[str]
    time: Optional[str] = None
    location: Optional[str]
    postal_code: Optional[str]
    category: Optional[str]
    price: Optional[float]
    description: str
    image_urls: List[str]
    organizer: Optional[str]
    official_link: Optional[str]
    url: List[str]
