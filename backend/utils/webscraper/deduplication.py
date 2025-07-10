from typing import List
from rapidfuzz import fuzz
from models import Event
import requests
import time
import os

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

def normalize_location(address: str) -> str:
    if not address:
        return ""
    try:
        response = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={"address": address, "key": GOOGLE_MAPS_API_KEY},
            timeout=5
        )
        data = response.json()
        if data["status"] == "OK":
            return data["results"][0]["formatted_address"]
    except Exception as e:
        print(f"Error normalizing location '{address}':", e)
    return address.lower().strip()

def time_similarity(t1: str, t2: str) -> float:
    return fuzz.token_sort_ratio(t1 or "", t2 or "")

def event_similarity(e1: Event, e2: Event) -> float:
    title_score = fuzz.token_sort_ratio(e1.title, e2.title)
    loc1 = normalize_location(e1.location or "")
    loc2 = normalize_location(e2.location or "")
    location_score = fuzz.token_sort_ratio(loc1, loc2)
    time_score = time_similarity(e1.start_date or "", e2.start_date or "")

    # Weighted score
    return 0.5 * title_score + 0.3 * location_score + 0.2 * time_score

def deduplicate_events(events: List[Event], threshold: float = 80.0) -> List[Event]:
    unique = []
    for e in events:
        is_duplicate = False
        for u in unique:
            score = event_similarity(e, u)
            if score >= threshold:
                is_duplicate = True
                break
        if not is_duplicate:
            unique.append(e)
        time.sleep(0.2)  # Avoid rate limiting
    return unique
