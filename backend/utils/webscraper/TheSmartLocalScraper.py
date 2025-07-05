import re
from datetime import datetime
from typing import List, Optional, Tuple

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from dateutil import parser as date_parser

from models import Event  # Your local Event Pydantic model

app = FastAPI()

YEAR = 2025

# Regex pattern to extract time ranges like "10am - 6pm", "7:30pm to 9pm"
TIME_REGEX = re.compile(
    r'\b(\d{1,2}(:\d{2})?\s*(am|pm|AM|PM))\s*(?:-|to)?\s*(\d{1,2}(:\d{2})?\s*(am|pm|AM|PM))?\b'
)

# -------- Helper Functions --------

def extract_postal_code(location: Optional[str]) -> Optional[str]:
    if location:
        match = re.search(r'\b\d{6}\b', location)
        if match:
            return match.group()
    return None

def extract_address(text: str) -> str:
    if re.search(r"Singapore\s+\d{6}", text):
        return text.strip()
    return text

def normalize_price(price_text: Optional[str]) -> Optional[float]:
    if not price_text:
        return None
    if "free" in price_text.lower():
        return 0.0
    numbers = re.findall(r'\$?(\d+(?:\.\d+)?)', price_text)
    return float(numbers[0]) if numbers else None


def try_parse_date(date_str: str) -> Optional[datetime]:
    try:
        return date_parser.parse(date_str, dayfirst=True)
    except Exception:
        return None

def parse_single_dates(text: str) -> Tuple[Optional[str], Optional[str]]:
    matches = re.findall(r'(\d{1,2})(?:st|nd|rd|th)?\s*(\w+)', text)
    parsed = [try_parse_date(f"{d} {m} {YEAR}") for d, m in matches]
    parsed = [p for p in parsed if p]
    if not parsed:
        return None, None
    start, end = parsed[0], parsed[-1]
    return start.isoformat(), end.isoformat()

def parse_date_range(text: str) -> Tuple[Optional[str], Optional[str]]:
    cleaned = re.sub(r'(\d{1,2})(st|nd|rd|th)', r'\1', text).replace("–", "-").replace("—", "-")

    cross_month = re.match(r'(\d{1,2})\s+([A-Za-z]+)\s*-\s*(\d{1,2})\s+([A-Za-z]+)', cleaned)
    if cross_month:
        d1, m1, d2, m2 = cross_month.groups()
        start = try_parse_date(f"{d1} {m1} {YEAR}")
        end = try_parse_date(f"{d2} {m2} {YEAR}")
        if start and end:
            return start.isoformat(), end.isoformat()

    same_month = re.match(r'(\d{1,2})-(\d{1,2})\s+([A-Za-z]+)', cleaned)
    if same_month:
        d1, d2, m = same_month.groups()
        start = try_parse_date(f"{d1} {m} {YEAR}")
        end = try_parse_date(f"{d2} {m} {YEAR}")
        if start and end:
            return start.isoformat(), end.isoformat()

    return parse_single_dates(text)

def extract_time(text: str) -> Optional[str]:
    match = TIME_REGEX.search(text)
    if match:
        # Rebuild the time string, ignoring None groups and connectors
        groups = [g for g in match.groups() if g and g.lower() not in ['-', 'to']]
        # Join the groups with " - " if there are two times, else single time
        if len(groups) > 1:
            return f"{groups[0]} - {groups[-1]}"
        return groups[0]
    return None

def extract_event_info(sibling) -> dict:
    text = sibling.get_text(separator=' ', strip=True)
    info = {}

    # Dates (already reasonably handled)
    date_match = re.search(r'Dates?[:\-]?\s*([\d, &a-zA-Z]+)', text)
    if not date_match:
        date_match = re.search(
            r'(\d{1,2}(?:st|nd|rd|th)?(?:-\d{1,2}(?:st|nd|rd|th)?)?\s+[A-Za-z]+(?:\s*-\s*\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+)?)',
            text)
    if date_match:
        start, end = parse_date_range(date_match.group(1))
        info["start_date"], info["end_date"] = start, end

    # Venue
    venue_match = re.search(r'Venue[:\-]?\s*(.+?)(?=(?:Dates?|Time|Price|Tickets?|Organizer)[:\-]|$)', text, re.IGNORECASE)
    if venue_match:
        info["location"] = extract_address(venue_match.group(1).strip())

    # Time (refined regex to avoid trailing hyphen)
    time_match = re.search(r'Time[:\-]?\s*([^\n|]+?)(?=\s*(?:\||$))', text, re.IGNORECASE)
    if time_match:
        info["time"] = time_match.group(1).strip()
    else:
        fallback_time_match = re.search(r'(\d{1,2}(am|pm)?\s*-\s*\d{1,2}(am|pm)?)', text, re.IGNORECASE)
        if fallback_time_match:
            info["time"] = fallback_time_match.group(1).strip()

    # Price - match both structured and fallback
    price_match = re.search(r'Admission[:\-]?\s*(\$?\d+.*?)(?=Venue|Dates?|Time|Organizer|$)', text, re.IGNORECASE)
    if price_match:
        info["price"] = normalize_price(price_match.group(1))
    else:
        generic_price_match = re.search(r'\$?\d+(?:\s*[-|/]\s*\$?\d+)?(?:\s*/\s*\w+)?', text)
        if generic_price_match:
            info["price"] = normalize_price(generic_price_match.group(0))

    # Organizer (fallback: first capital phrase with “by”)
    organizer_match = re.search(r'Organizer[s]?:\s*(.+?)(?=(?:Dates?|Time|Price|Tickets?|Venue)[:\-]|$)', text, re.IGNORECASE)
    if organizer_match:
        organizer = organizer_match.group(1).strip()
        if organizer.lower() not in ["n/a", "tbc", ""]:
            info["organizer"] = organizer
    else:
        by_line = re.search(r'by\s+([A-Z][a-zA-Z\s]+)', text)
        if by_line:
            info["organizer"] = by_line.group(1).strip()

    return info


def find_official_link(sibling) -> Optional[str]:
    return next((a['href'] for a in sibling.find_all('a', href=True)
                 if "thesmartlocal" not in a['href'].lower()), None)

# --------- Main Scraper --------

def scrape_tsl_events() -> List[Event]:
    url = "https://thesmartlocal.com/read/things-to-do-this-weekend-singapore/"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")

    soup = BeautifulSoup(response.content, "html.parser")
    events: List[Event] = []

    for header in soup.find_all('h3'):
        title = header.get_text(strip=True)
        if "new events in singapore" in title.lower():
            continue

        event = {
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

        description_parts = []
        sibling = header.find_next_sibling()

        while sibling and sibling.name != 'h3':
            description_parts.append(sibling.get_text(separator=' ', strip=True))

            info = extract_event_info(sibling)
            for key, value in info.items():
                if value and event.get(key) is None:
                    event[key] = value

            if event["official_link"] is None:
                event["official_link"] = find_official_link(sibling)

            sibling = sibling.find_next_sibling()

        event["description"] = " ".join(description_parts)

        # fallback date parsing from description if no explicit date found
        if event["start_date"] is None:
            start, end = parse_date_range(event["description"])
            event["start_date"], event["end_date"] = start, end

        event["postal_code"] = extract_postal_code(event["location"])

        img = header.find_previous('img')
        if img and img.has_attr('src'):
            event["image_urls"].append(img['src'])

        events.append(Event(**event))

    return events

# --------- FastAPI Route ---------

@app.post("/scrape-tsl-events", response_model=List[Event])
async def trigger_scraper():
    return scrape_tsl_events()
