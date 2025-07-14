from typing import List, Optional

class Event:
    def __init__(
        self,
        title: str,
        start_date: Optional[str],
        end_date: Optional[str],
        time: Optional[str] = None,
        location: Optional[str] = None,
        postal_code: Optional[str] = None,
        category: Optional[float] = None,
        price: Optional[float] = None,
        description: str = "",
        image_urls: List[str] = None,
        organizer: Optional[str] = None,
        official_link: Optional[str] = None,
        url: List[str] = None,
    ):
        self.title = title
        self.start_date = start_date
        self.end_date = end_date
        self.time = time
        self.location = location
        self.postal_code = postal_code
        self.category = category
        self.price = price
        self.description = description
        self.image_urls = image_urls or []
        self.organizer = organizer
        self.official_link = official_link
        self.url = url or []

    def to_dict(self):
        """Convert event to dictionary."""
        return {
            "title": self.title,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "time": self.time,
            "location": self.location,
            "postal_code": self.postal_code,
            "category": self.category,
            "price": self.price,
            "description": self.description,
            "image_urls": self.image_urls,
            "organizer": self.organizer,
            "official_link": self.official_link,
            "url": self.url,
        }