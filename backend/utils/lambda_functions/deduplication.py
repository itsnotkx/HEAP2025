from typing import List, Optional, Tuple
import difflib
from models import DBEvent, ScrapedEvent
import requests
import time
import re
import os
from datetime import datetime, timedelta
from dataclasses import asdict
import psycopg2

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
DB_CONFIG = {
    "host": os.environ.get("DB_HOST"),
    "port": os.environ.get("DB_PORT"),
    "dbname": os.environ.get("DB_NAME"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD")
}


def geocode_location(address: str) -> Tuple[str, Optional[float], Optional[float]]:
    if not address:
        return "", None, None
    try:
        response = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={"address": address, "key": GOOGLE_MAPS_API_KEY},
            timeout=5
        )
        data = response.json()
        if data["status"] == "OK":
            result = data["results"][0]
            formatted = result["formatted_address"]
            location = result["geometry"]["location"]
            return formatted, location["lat"], location["lng"]
    except Exception as e:
        print(f"Error geocoding location '{address}':", e)
    return address.lower().strip(), None, None


def time_similarity(t1: str, t2: str) -> float:
    return difflib.SequenceMatcher(None, t1 or "", t2 or "").ratio()


def event_similarity(e1: DBEvent, e2: DBEvent) -> float:
    title_score = difflib.SequenceMatcher(None, e1.title, e2.title).ratio()
    location_score = difflib.SequenceMatcher(None, e1.address or "", e2.address or "").ratio()
    time_score = time_similarity(
        e1.start_date.isoformat() if e1.start_date else "",
        e2.start_date.isoformat() if e2.start_date else ""
    )

    print(0.5 * title_score + 0.3 * location_score + 0.2 * time_score)
    return 0.5 * title_score + 0.3 * location_score + 0.2 * time_score


def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)


def fetch_recent_db_events() -> List[DBEvent]:
    conn = get_db_connection()
    cursor = conn.cursor()
    three_months_before = datetime.now() - timedelta(days=90)
    three_months_later = datetime.now() + timedelta(days=90)

    cursor.execute("""
        SELECT title, start_date, end_date, address, price, description, images, lat, long, categories
        FROM event
        WHERE start_date >= %s AND start_date <= %s
    """, (three_months_before, three_months_later))

    rows = cursor.fetchall()
    conn.close()

    db_events = []
    for row in rows:
        db_events.append(DBEvent(
            title=row[0],
            start_date=row[1],
            end_date=row[2],
            address=row[3],
            price=row[4],
            description=row[5],
            images=row[6],
            lat=row[7],
            long=row[8],
            categories=row[9]
        ))
    return db_events


def convert_scraped_to_db(scraped_events: List[ScrapedEvent]) -> List[DBEvent]:
    converted = []
    for e in scraped_events:
        formatted_address, lat, lng = geocode_location(e.location or "")
        db_event = DBEvent(
            title=e.title,
            start_date=datetime.fromisoformat(e.start_date) if e.start_date else None,
            end_date=datetime.fromisoformat(e.end_date) if e.end_date else None,
            address=formatted_address,
            price=e.price,
            categories=None,  # this marks it as new
            description=e.description,
            images=e.image_urls,
            lat=lat,
            long=lng
        )
        converted.append(db_event)
        time.sleep(0.2)  # Respect API rate limit
    return converted


def deduplicate(converted: List[DBEvent], existing: List[DBEvent], threshold: float = 0.8) -> List[DBEvent]:
    unique = []
    for e in converted:
        is_duplicate = any(event_similarity(e, exist) >= threshold for exist in existing)
        if not is_duplicate:
            unique.append(e)
    return unique


def serialize_event(e: DBEvent) -> dict:
    d = asdict(e)
    if d["start_date"]:
        d["start_date"] = d["start_date"].isoformat()
    if d["end_date"]:
        d["end_date"] = d["end_date"].isoformat()
    return d

def clean_title(title: str) -> str | None:
    title = title.strip()

    # Remove noise/generic section headers
    if re.fullmatch(r"[-–•\s]+.*[-–•\s]+", title, re.IGNORECASE):
        return None
    if "new shows" in title.lower() or "in singapore this week" in title.lower():
        return None

    # Filter generic blog-style listicles or SEO content
    banned_phrases = [
        "the best", 
        "hidden trails", 
        "secret beaches", 
        "watch the sunrise", 
        "watch the sunset",
        "best",
        "places",
        "hiking trails"
    ]
    title_lower = title.lower()
    if any(phrase in title_lower for phrase in banned_phrases):
        return None

    # Remove leading numbers like "16. Title"
    title = re.sub(r"^\d+\.\s*", "", title)
    title = re.sub(r'\s+', ' ', title)

    return title if title else None

def extract_address_from_title(title: str) -> str | None:
    # Try to extract content after " at "
    match = re.search(r'\bat\s+(.+)', title, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None

def clean_price(raw_price: str) -> float | None:
    if not raw_price:
        return None

    raw_price = raw_price.strip().lower()

    if raw_price in {"free", "$0", "0"}:
        return 0.0

    match = re.search(r'(\d+(?:\.\d+)?)', raw_price)
    if match:
        return float(match.group(1))

    return None  

def is_valid_url(url):
    return isinstance(url, str) and re.match(r'^https?://[^\s]+$', url)

def lambda_handler(event, context):
    scraped_events = [ScrapedEvent(**e) for e in event["events"]]

    for e in scraped_events:
        if hasattr(e, "title"):
            cleaned = clean_title(e.title)
            if cleaned:
                e.title = cleaned
                if not getattr(e, "location", None) and e.title:
                    extracted = extract_address_from_title(e.title)
                    if extracted:
                        e.location = extracted
            else:
                e.title = None 
                
        if hasattr(e, "price") and isinstance(e.price, str):
            e.price = clean_price(e.price)
        
        if hasattr(e, "image_urls") and isinstance(e.image_urls, list):
            e.image_urls = [url for url in e.image_urls if is_valid_url(url)]

    scraped_events = [e for e in scraped_events if e.title]

    # 2. Geocode and convert to DBEvent
    converted_events = convert_scraped_to_db(scraped_events)

    # 3. Fetch recent DB events
    added_events = fetch_recent_db_events()

    # 4. Deduplicate
    new_events = deduplicate(converted_events, added_events)

    return {
        "statusCode": 200,
        "result": [serialize_event(e) for e in new_events]
    }