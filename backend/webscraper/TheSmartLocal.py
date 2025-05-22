import requests
from bs4 import BeautifulSoup
import re
from typing import List, Optional
import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Event(BaseModel):
    title: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    postal_code: Optional[str] = None
    category: Optional[str] = None
    price: Optional[str] = None
    description: str
    image_urls: List[str] = []
    organizer: Optional[str] = None
    official_link: Optional[str] = None
    url: List[str]

def extract_address(text):
    address_pattern = r"Singapore\s+\d{6}"
    match = re.search(address_pattern, text)
    return text.strip() if match else text

def parse_dates_improved(dates_text):
    cleaned_text = re.sub(r'(\d{1,2})(st|nd|rd|th)', r'\1', dates_text)
    # Match date ranges like "16-18 May"
    date_range_match = re.match(r'(\d{1,2})-(\d{1,2})\s+(\w+)', cleaned_text)
    if date_range_match:
        start_day, end_day, month = date_range_match.groups()
        try:
            start_date = datetime.strptime(f"{start_day} {month} 2025", "%d %B %Y").isoformat()
            end_date = datetime.strptime(f"{end_day} {month} 2025", "%d %B %Y").isoformat()
            return start_date, end_date
        except ValueError:
            return None, None
    else:
        # Fallback to original method for single dates
        return parse_dates(dates_text)

def parse_dates(dates_text):
    date_parts = re.findall(r'(\d{1,2})(?:st|nd|rd|th)?\s*(\w+)', dates_text)
    try:
        parsed_dates = [datetime.strptime(f"{d} {m} 2025", "%d %B %Y") for d, m in date_parts]
        start_date = parsed_dates[0].isoformat()
        end_date = parsed_dates[-1].isoformat() if len(parsed_dates) > 1 else None
        return start_date, end_date
    except ValueError:
        return None, None

def scrape_events() -> List[Event]:
    url = "https://thesmartlocal.com/read/things-to-do-this-weekend-singapore/"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")
    soup = BeautifulSoup(response.content, "html.parser")
    event_tags = soup.find_all('h3')
    events = []
    for event in event_tags:
        title = event.get_text(strip=True)
        if "new events in singapore" in title.lower():
            continue
        content = []
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
        sibling = event.find_next_sibling()
        while sibling and sibling.name != 'h3':
            text = sibling.get_text(separator=' ', strip=True)
            content.append(text)

            if not event_data["price"]:
                price_match = re.search(r'(Tickets?|Price)[:\-]?\s*(From\s*\$?\d+|Free|\$?\d+(?:\s*-\s*\$?\d+)?(?:\+)?)(?=\s|$)', text, re.IGNORECASE)
                if price_match:
                    event_data["price"] = price_match.group(2)

            if not event_data["location"]:
                venue_match = re.search(r'Venue[:\-]?\s*(.+?)(?=(?:Dates?|Time|Price|Tickets?|Organizer)[:\-])', text, re.IGNORECASE)
                if venue_match:
                    address_str = venue_match.group(1).strip()
                    event_data["location"] = extract_address(address_str)

            date_match = re.search(r'Dates?[:\-]?\s*([\d, &a-zA-Z]+)', text)
            if date_match:
                start_date, end_date = parse_dates_improved(date_match.group(1))
                event_data["start_date"] = start_date
                event_data["end_date"] = end_date

            if not event_data["time"]:
                time_match = re.search(r'Time[:\-]?\s*([^\n]+)', text, re.IGNORECASE)
                if time_match:
                    event_data["time"] = time_match.group(1).strip()

            if not event_data["organizer"]:
                org_match = re.search(r'Organizer[s]?[:\-]?\s*(.+?)(?=(?:Dates?|Time|Price|Tickets?|Venue)[:\-]|$)', text, re.IGNORECASE)
                if org_match:
                    organizer = org_match.group(1).strip()
                    if organizer.lower() not in ["n/a", "tbc", ""]:
                        event_data["organizer"] = organizer

            if not event_data["official_link"]:
                links = sibling.find_all('a', href=True)
                for link in links:
                    href = link['href']
                    if href.startswith("http") and "thesmartlocal.com" not in href.lower():
                        event_data["official_link"] = href
                        break

            sibling = sibling.find_next_sibling()

        if event_data["location"]:
            postal_match = re.search(r'\b\d{6}\b', event_data["location"])
            if postal_match:
                event_data["postal_code"] = postal_match.group()

        prev_img = event.find_previous('img')
        if prev_img and prev_img.has_attr('src'):
            event_data["image_urls"].append(prev_img['src'])

        event_data["description"] = " ".join(content)
        events.append(Event(**event_data))
    return events

@app.post("/scrape-events", response_model=List[Event])
async def trigger_scraper():
    # Triggers scraping and returns Events
    return scrape_events()