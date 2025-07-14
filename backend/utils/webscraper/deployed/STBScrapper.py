
import os
import re
import requests
from typing import List, Optional
from eventLib.event import Event


API_KEY = os.getenv("STB_API_KEY")
EVENTS_API_URL = "https://api.stb.gov.sg/content/events/v2/search"

EXCLUDED_TITLES = [
    "National Day 2025", "Hari Raya Haji 2025", "Chinese New Year", "Good Friday 2025",
    "Deepavali 2025", "Christmas 2025", "Hari Raya Puasa 2025", "New Year’s Day 2025",
    "Labour Day 2025", "Vesak Day 2025", "Year of the Horse 2026",
]

SEARCH_KEYWORDS = [
    "music", "arts", "food", "family", "festival", "sports", "culture", "dance", "drama",
    "exhibition", "performance", "theatre", "bazaar", "market", "parade", "workshop",
    "concert", "heritage", "community", "fashion", "film", "carnival", "marathon",
    "wellness", "photography", "flea", "design", "craft", "culinary", "comedy", "kids",
    "indoor", "outdoor", "street fair", "block party", "music festival", "live music",
    "food festival", "food truck festival", "wine tasting", "beer festival",
    "cultural festival", "heritage festival", "art walk", "gallery opening", "art show",
    "craft fair", "makers market", "flea market", "farmers market", "holiday market",
    "bazaar", "parade", "carnival", "circus", "funfair", "outdoor movie", "film screening",
    "film festival", "open mic", "jam session", "karaoke night", "talent show",
    "dance party", "silent disco", "dance class", "yoga class", "fitness bootcamp",
    "wellness retreat", "meditation session", "guided hike", "nature walk",
    "bird watching", "garden tour", "plant sale", "pet show", "animal adoption",
    "dog walk", "community picnic", "potluck", "cook-off", "bake sale",
    "culinary class", "cooking demo", "baking workshop", "storytelling", "poetry slam",
    "book reading", "book club", "kids workshop", "children's activity",
    "family fun day", "science fair", "robotics competition", "board game night",
    "game night", "trivia night", "quiz night", "escape room", "scavenger hunt",
    "treasure hunt", "sports tournament", "charity run", "fun run", "bike ride",
    "cycling event", "skate night", "roller disco", "swimming gala", "beach party",
    "campout", "stargazing", "fireworks show", "lantern festival", "light show",
    "historical reenactment", "reenactment", "community cleanup", "tree planting",
    "volunteer day", "environmental rally", "petting zoo", "farm tour",
    "nature festival", "outdoor adventure", "adventure race", "obstacle course",
    "park event"
]

def extract_postal_code(address: Optional[str]) -> Optional[str]:
    if not address:
        return None
    match = re.search(r"\b\d{6}\b", address)
    return match.group() if match else None

def normalize_price(description: str) -> Optional[float]:
    if not description:
        return None
    desc_lower = description.lower()
    if "free" in desc_lower:
        return 0.0
    price_match = re.search(r"\$\s?(\d+(?:\.\d{1,2})?)", description)
    if price_match:
        return float(price_match.group(1))
    return None

def extract_time(description: Optional[str]) -> Optional[str]:
    if not description:
        return None
    time_match = re.search(r"\b\d{1,2}(am|pm)(?:\s*-\s*\d{1,2}(am|pm))?", description, re.IGNORECASE)
    return time_match.group() if time_match else None

def is_excluded_title(title: str) -> bool:
    return any(excluded.lower() == title.lower() for excluded in EXCLUDED_TITLES)

def fetch_events(auth_header, limit=50, offset=0, keywords=None) -> dict:
    headers = {"Accept": "application/json", **auth_header}
    params = {"searchType": "keyword", "searchValues": keywords or ["all"], "limit": limit, "offset": offset}
    response = requests.get(EVENTS_API_URL, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

def parse_events(events: List[dict]) -> List[Event]:
    parsed = []
    for event in events:
        try:
            if not isinstance(event, dict):
                continue

            name_data = event.get("name")
            title = name_data.get("en").strip() if isinstance(name_data, dict) else str(name_data).strip()
            if is_excluded_title(title):
                continue

            description_data = event.get("description")
            description = description_data.get("en") if isinstance(description_data, dict) else str(description_data or "")

            start_date = event.get("startDate")
            end_date = event.get("endDate")

            venue = event.get("venue", {})
            location_data = venue.get("name")
            location = location_data.get("en") if isinstance(location_data, dict) else location_data

            address_data = venue.get("address", {})
            address = address_data.get("streetAddress") if isinstance(address_data, dict) else None
            postal_code = extract_postal_code(address)

            time = extract_time(description)
            price = normalize_price(description)

            images = event.get("images", [])
            image_urls = [
                img.get("uuid") for img in images
                if isinstance(img, dict) and img.get("uuid")
            ]

            organizer_data = event.get("organizer")
            organizer = (
                organizer_data.get("name", {}).get("en")
                if isinstance(organizer_data, dict)
                else None
            )

            official_link = event.get("website")
            url_list = [event.get("slug")] if event.get("slug") else []

            parsed.append(Event(
                title=title,
                start_date=start_date,
                end_date=end_date,
                time=time,
                location=location,
                postal_code=postal_code,
                category=None,
                price=price,
                description=description,
                image_urls=image_urls,
                organizer=organizer,
                official_link=official_link,
                url=url_list,
            ))

        except Exception as e:
            print(f"Unexpected error parsing event: {e}")

    return parsed


def scrape_stb_events() -> List[Event]:
    if not API_KEY:
        raise RuntimeError("Missing STB_API_KEY in environment.")

    auth_header = {"X-Api-Key": API_KEY}
    all_events = []
    seen_uuids = set()

    for kw in SEARCH_KEYWORDS:
        offset = 0
        limit = 50

        while True:
            try:
                data = fetch_events(auth_header, limit=limit, offset=offset, keywords=[kw])
                print(data)
            except Exception as e:
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




def lambda_handler(event, context):
    try:
        events = scrape_stb_events()
        print(f"Scraped {len(events)} events.")
        return [e.to_dict() for e in events] 
    except Exception as e:
        print(f"Error in Lambda: {e}")
        return {
            "statusCode": 500,
            "body": f"Error scraping events: {str(e)}"
        }
    
# print(lambda_handler({}, {}))  # For local testing, remove in production
