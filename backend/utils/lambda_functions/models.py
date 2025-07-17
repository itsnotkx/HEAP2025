from typing import List, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ScrapedEvent:
    title: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    postal_code: Optional[str] = None
    category: Optional[float] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image_urls: List[str] = None
    organizer: Optional[str] = None
    official_link: Optional[str] = None
    url: List[str] = None

@dataclass
class DBEvent:
    title: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    address: Optional[str]
    price: Optional[float]
    categories: Optional[List[float]]
    description: Optional[str]
    images: Optional[List[str]]
    lat: Optional[float]
    long: Optional[float]