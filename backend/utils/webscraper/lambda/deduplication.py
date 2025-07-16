from typing import List, Optional, Tuple
import difflib
from models import DBEvent, ScrapedEvent
import requests
import time
import os
from datetime import datetime
from dataclasses import asdict

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

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

def event_similarity(e1: ScrapedEvent, e2: ScrapedEvent) -> float:
    title_score = difflib.SequenceMatcher(None, e1.title, e2.title).ratio()
    loc1, *_ = geocode_location(e1.location or "")
    loc2, *_ = geocode_location(e2.location or "")
    location_score = difflib.SequenceMatcher(None, loc1, loc2).ratio()
    time_score = time_similarity(e1.start_date or "", e2.start_date or "")
    return 0.5 * title_score + 0.3 * location_score + 0.2 * time_score

def deduplicate_and_convert(scraped_events: List[ScrapedEvent], threshold: float = 0.8) -> List[DBEvent]:
    unique_scraped = []
    for e in scraped_events:
        is_duplicate = False
        for u in unique_scraped:
            score = event_similarity(e, u)
            if score >= threshold:
                is_duplicate = True
                break
        if not is_duplicate:
            unique_scraped.append(e)
        time.sleep(0.2)  # To respect API rate limits

    # Now convert to DBEvent
    result = []
    for e in unique_scraped:
        formatted_address, lat, lng = geocode_location(e.location or "")
        db_event = DBEvent(
            title=e.title,
            start_date=datetime.fromisoformat(e.start_date) if e.start_date else None,
            end_date=datetime.fromisoformat(e.end_date) if e.end_date else None,
            address=formatted_address,
            price=e.price,
            categories=[e.category] if e.category is not None else None,
            description=e.description,
            images=e.image_urls,
            lat=lat,
            long=lng
        )
        result.append(db_event)
        time.sleep(0.2)  # Extra safety

    return result

def serialize_event(e: DBEvent) -> dict:
    d = asdict(e)
    if d["start_date"]:
        d["start_date"] = d["start_date"].isoformat()
    if d["end_date"]:
        d["end_date"] = d["end_date"].isoformat()
    return d

def lambda_handler(event, context):
    scraped_events = [ScrapedEvent(**e) for e in event["events"]]
    results = deduplicate_and_convert(scraped_events)
    return {
        "statusCode": 200,
        "result": [serialize_event(e) for e in results]
    }