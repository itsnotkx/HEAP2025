import re
from datetime import datetime
from typing import List, Optional

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


# --------- Models ---------

class Event(BaseModel):
    title: str
    start_date: Optional[str]
    end_date: Optional[str]
    time: Optional[str]
    location: Optional[str]
    postal_code: Optional[str]
    category: Optional[str]
    price: Optional[float]
    description: str
    image_urls: List[str]
    organizer: Optional[str]
    official_link: Optional[str]
    url: List[str]


# --------- Helper Functions ---------

def extract_postal_code(location: Optional[str]) -> Optional[str]:
    if not location:
        return None
    match = re.search(r'\b\d{6}\b', location)
    return match.group() if match else None


def extract_address(text: str) -> str:
    # Return the text if it contains "Singapore" followed by 6-digit postal code, else unchanged
    if re.search(r"Singapore\s+\d{6}", text):
        return text.strip()
    return text


def normalize_price(price_text: Optional[str]) -> Optional[float]:
    if not price_text:
        return None
    if "free" in price_text.lower():
        return 0.0
    numbers = re.findall(r'\d+(?:\.\d+)?', price_text)
    if numbers:
        return float(numbers[0])
    return None


def parse_date_range(dates_text: str) -> (Optional[str], Optional[str]):
    """Parse date range like '16-18 May' or fallback to single dates."""
    cleaned = re.sub(r'(\d{1,2})(st|nd|rd|th)', r'\1', dates_text)
    range_match = re.match(r'(\d{1,2})-(\d{1,2})\s+(\w+)', cleaned)
    if range_match:
        start_day, end_day, month = range_match.groups()
        try:
            start_date = datetime.strptime(f"{start_day} {month} 2025", "%d %B %Y").isoformat()
            end_date = datetime.strptime(f"{end_day} {month} 2025", "%d %B %Y").isoformat()
            return start_date, end_date
        except ValueError:
            return None, None
    else:
        return parse_single_dates(dates_text)


def parse_single_dates(dates_text: str) -> (Optional[str], Optional[str]):
    date_parts = re.findall(r'(\d{1,2})(?:st|nd|rd|th)?\s*(\w+)', dates_text)
    try:
        parsed_dates = [datetime.strptime(f"{d} {m} 2025", "%d %B %Y") for d, m in date_parts]
        start_date = parsed_dates[0].isoformat()
        end_date = parsed_dates[-1].isoformat() if len(parsed_dates) > 1 else None
        return start_date, end_date
    except ValueError:
        return None, None


def extract_event_info(sibling) -> dict:
    """Extract event-related info from sibling tag text."""
    text = sibling.get_text(separator=' ', strip=True)
    info = {}

    price_match = re.search(r'(Tickets?|Price)[:\-]?\s*(From\s*\$?\d+|Free|\$?\d+(?:\s*-\s*\$?\d+)?(?:\+)?)(?=\s|$)', text, re.IGNORECASE)
    if price_match:
        info["price"] = normalize_price(price_match.group(2))

    venue_match = re.search(r'Venue[:\-]?\s*(.+?)(?=(?:Dates?|Time|Price|Tickets?|Organizer)[:\-])', text, re.IGNORECASE)
    if venue_match:
        info["location"] = extract_address(venue_match.group(1).strip())

    date_match = re.search(r'Dates?[:\-]?\s*([\d, &a-zA-Z]+)', text)
    if date_match:
        start_date, end_date = parse_date_range(date_match.group(1))
        info["start_date"] = start_date
        info["end_date"] = end_date

    time_match = re.search(r'Time[:\-]?\s*([^\n]+)', text, re.IGNORECASE)
    if time_match:
        info["time"] = time_match.group(1).strip()

    organizer_match = re.search(r'Organizer[s]?[:\-]?\s*(.+?)(?=(?:Dates?|Time|Price|Tickets?|Venue)[:\-]|$)', text, re.IGNORECASE)
    if organizer_match:
        organizer = organizer_match.group(1).strip()
        if organizer.lower() not in ["n/a", "tbc", ""]:
            info["organizer"] = organizer

    return info


def find_official_link(sibling) -> Optional[str]:
    links = sibling.find_all('a', href=True)
    for link in links:
        href = link['href']
        if href.startswith("http") and "thesmartlocal.com" not in href.lower():
            return href
    return None


# --------- Main Scraping Function ---------

def scrape_tsl_events() -> List[Event]:
    url = "https://thesmartlocal.com/read/things-to-do-this-weekend-singapore/"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")

    soup = BeautifulSoup(response.content, "html.parser")
    event_headers = soup.find_all('h3')
    events = []

    for header in event_headers:
        title = header.get_text(strip=True)
        if "new events in singapore" in title.lower():
            continue

        event_data = {
            "title": title,
            "start_date": None,
            "end_date": None,
            "time": None,
            "location": None,
            "postal_code": None,
            "category": None,
            "price": None,
            "description": "",
            "image_urls": [],
            "organizer": None,
            "official_link": None,
            "url": [url]
        }

        # Aggregate description text and parse other info from siblings until next h3
        description_parts = []
        sibling = header.find_next_sibling()
        while sibling and sibling.name != 'h3':
            text = sibling.get_text(separator=' ', strip=True)
            description_parts.append(text)

            # Extract structured info
            info = extract_event_info(sibling)

            for key, value in info.items():
                if value is not None and event_data.get(key) is None:
                    event_data[key] = value

            # Extract official link once
            if event_data["official_link"] is None:
                official_link = find_official_link(sibling)
                if official_link:
                    event_data["official_link"] = official_link

            sibling = sibling.find_next_sibling()

        event_data["description"] = " ".join(description_parts)

        # Extract postal code if possible
        event_data["postal_code"] = extract_postal_code(event_data["location"])

        # Extract image URLs from the previous img tag before the h3
        prev_img = header.find_previous('img')
        if prev_img and prev_img.has_attr('src'):
            event_data["image_urls"].append(prev_img['src'])

        events.append(Event(**event_data))

    return events


# --------- API Route ---------

@app.post("/scrape-tsl-events", response_model=List[Event])
async def trigger_scraper():
    return scrape_events()
