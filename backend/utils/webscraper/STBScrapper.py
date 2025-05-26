import os
import re
import time
import requests
from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("STB_API_KEY")
EVENTS_API_URL = "https://api.stb.gov.sg/content/events/v2/search"

app = FastAPI()

EXCLUDED_TITLES = [
    "National Day 2025",
    "Hari Raya Haji 2025",
    "Chinese New Year",
    "Good Friday 2025",
    "Deepavali 2025",
    "Christmas 2025",
    "Hari Raya Puasa 2025",
    "New Year’s Day 2025",
    "Labour Day 2025",
    "Vesak Day 2025",
    "Year of the Horse 2026",
]

SEARCH_KEYWORDS = [
    "music", "arts", "food", "family", "festival", "sports", "culture",
    "dance", "drama", "exhibition", "performance", "theatre", "bazaar",
    "market", "parade", "workshop", "concert", "heritage", "community",
    "fashion", "film", "carnival", "marathon", "wellness", "photography",
    "flea", "design", "craft", "culinary", "comedy", "kids", "indoor", "outdoor"
]

SEARCH_KEYWORDS += [
    "street fair", "block party", "music festival", "concert", "live music",
    "food festival", "food truck festival", "wine tasting", "beer festival",
    "cultural festival", "heritage festival", "art walk", "gallery opening",
    "art show", "craft fair", "makers market", "flea market", "farmers market",
    "holiday market", "bazaar", "parade", "carnival", "circus", "funfair",
    "outdoor movie", "film screening", "film festival", "open mic", "jam session",
    "karaoke night", "talent show", "dance party", "silent disco", "dance class",
    "yoga class", "fitness bootcamp", "wellness retreat", "meditation session",
    "guided hike", "nature walk", "bird watching", "garden tour", "plant sale",
    "pet show", "animal adoption", "dog walk", "community picnic", "potluck",
    "cook-off", "bake sale", "culinary class", "cooking demo", "baking workshop",
    "storytelling", "poetry slam", "book reading", "book club", "kids workshop",
    "children's activity", "family fun day", "science fair", "robotics competition",
    "board game night", "game night", "trivia night", "quiz night", "escape room",
    "scavenger hunt", "treasure hunt", "sports tournament", "charity run",
    "fun run", "marathon", "bike ride", "cycling event", "skate night",
    "roller disco", "swimming gala", "beach party", "campout", "stargazing",
    "fireworks show", "lantern festival", "light show", "historical reenactment",
    "reenactment", "community cleanup", "tree planting", "volunteer day",
    "environmental rally", "petting zoo", "farm tour", "nature festival",
    "outdoor adventure", "adventure race", "obstacle course", "park event"
]

# Pydantic Event model for response serialization
class Event(BaseModel):
    title: str
    start_date: Optional[str]
    end_date: Optional[str]
    location: Optional[str]
    postal_code: Optional[str]
    category: Optional[str]
    price: Optional[str]
    description: str
    image_urls: List[str]
    organizer: Optional[str]
    official_link: Optional[str]
    url: List[str]

def fetch_events(auth_header, limit=50, offset=0, keywords=None):
    headers = {
        "Accept": "application/json",
        **auth_header,
    }

    params = {
        "searchType": "keyword",
        "searchValues": keywords or ["all"],
        "limit": limit,
        "offset": offset
    }

    response = requests.get(EVENTS_API_URL, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

def parse_events(events):
    parsed = []
    for event in events:
        title = event.get("name", "").strip()
        if any(excluded.lower() == title.lower() for excluded in EXCLUDED_TITLES):
            continue  # skip excluded events

        start_date = event.get("startDate")
        end_date = event.get("endDate")

        # Convert location dict to string if dict, else keep as is or None
        location = event.get("location")
        if isinstance(location, dict):
            lat = location.get("latitude")
            lon = location.get("longitude")
            if lat is not None and lon is not None:
                location = f"{lat},{lon}"
            else:
                location = str(location)  # fallback to string of dict

        postal_code = None
        address = event.get("address")
        if isinstance(address, str):
            match = re.search(r'\b\d{6}\b', address)
            if match:
                postal_code = match.group()

        category = event.get("type")

        price = None
        if event.get("ticketed") is True:
            price = "Ticketed"
        elif event.get("ticketed") is False:
            price = "Free"

        description = event.get("description") or ""

        # image_urls should be list of strings (extract 'uuid' if dict)
        images = event.get("images")
        image_urls = []
        if isinstance(images, list):
            for img in images:
                if isinstance(img, dict) and "uuid" in img:
                    image_urls.append(img["uuid"])
                elif isinstance(img, str):
                    image_urls.append(img)

        organizer = event.get("eventOrganizer")
        official_link = event.get("officialWebsite")
        url_list = [official_link] if official_link else []

        parsed.append(Event(
            title=title,
            start_date=start_date,
            end_date=end_date,
            location=location,
            postal_code=postal_code,
            category=category,
            price=price,
            description=description,
            image_urls=image_urls,
            organizer=organizer,
            official_link=official_link,
            url=url_list,
        ))

    return parsed


@app.post("/scrape-stb-events", response_model=List[Event])
def scrape_stb_events():
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Missing STB_API_KEY in environment.")

    auth_header = {"X-Api-Key": API_KEY}
    all_events = []
    seen_uuids = set()

    for kw in SEARCH_KEYWORDS:
        offset = 0
        limit = 50

        while True:
            try:
                data = fetch_events(auth_header, limit=limit, offset=offset, keywords=[kw])
            except Exception as e:
                # Log error and skip this keyword
                print(f"Error fetching events for keyword '{kw}': {e}")
                break

            events = data.get("data", [])
            if not events:
                break

            parsed_events = parse_events(events)

            for event, raw in zip(parsed_events, events):
                uuid = raw.get("uuid")
                if uuid and uuid not in seen_uuids:
                    seen_uuids.add(uuid)
                    all_events.append(event)

            total_records = data.get("totalRecords", 0)
            offset += limit
            if offset >= total_records:
                break

    return all_events
