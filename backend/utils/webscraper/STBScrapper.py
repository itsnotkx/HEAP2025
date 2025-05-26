import os
import re
import time
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

# Use these if you have OAuth credentials, else fallback to API key
CLIENT_ID = os.getenv("STB_CLIENT_ID")
CLIENT_SECRET = os.getenv("STB_CLIENT_SECRET")
API_KEY = os.getenv("STB_API_KEY")

OAUTH_TOKEN_URL = "https://oauth.stb.gov.sg/token"  # double-check actual URL in docs
EVENTS_API_URL = "https://api.stb.gov.sg/content/events/v2/search"

def get_access_token():
    if not CLIENT_ID or not CLIENT_SECRET:
        raise RuntimeError("Missing CLIENT_ID or CLIENT_SECRET for OAuth")

    auth_str = f"{CLIENT_ID}:{CLIENT_SECRET}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth_str}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}

    response = requests.post(OAUTH_TOKEN_URL, headers=headers, data=data)
    response.raise_for_status()
    token = response.json().get("access_token")
    if not token:
        raise RuntimeError("Failed to retrieve access token")
    return token

def fetch_events(auth_header, limit=50, offset=0, keywords=None):
    headers = {
        "Accept": "application/json",
        **auth_header,
    }

    # If keywords param is None or empty, fallback to ["all"]
    search_values = keywords if keywords else ["all"]

    params = {
        "searchType": "keyword",
        "searchValues": search_values,  # Pass as list directly here
        "limit": limit,
        "offset": offset
    }

    response = requests.get(EVENTS_API_URL, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


def parse_events(events):
    parsed = []
    for event in events:
        time.sleep(0.2)  # to avoid hammering API

        title = event.get("name")
        start_date = event.get("startDate")
        end_date = event.get("endDate")
        location = event.get("location")

        postal_code = None
        address = event.get("address")
        if isinstance(address, str):
            match = re.search(r'\b\d{6}\b', address)
            if match:
                postal_code = match.group()

        category = event.get("type")

        price = None # none means cannot scrape price, free is free
        if event.get("ticketed") is True:
            price = "Ticketed"
        elif event.get("ticketed") is False:
            price = "Free"

        description = event.get("description") or ""

        image_urls = event.get("images")
        if not isinstance(image_urls, list):
            image_urls = []

        organizer = event.get("eventOrganizer")
        official_link = event.get("officialWebsite")
        url_list = [official_link] if official_link else []

        event_data = {
            "title": title,
            "start_date": start_date,
            "end_date": end_date,
            "location": location,
            "postal_code": postal_code,
            "category": category,
            "price": price,
            "description": description,
            "image_urls": image_urls,
            "organizer": organizer,
            "official_link": official_link,
            "url": url_list,
        }
        parsed.append(event_data)
    return parsed

def main():
    # Choose auth method: OAuth or API key
    use_oauth = CLIENT_ID and CLIENT_SECRET

    if use_oauth:
        try:
            token = get_access_token()
            auth_header = {"Authorization": f"Bearer {token}"}
        except Exception as e:
            print(f"Error obtaining access token: {e}")
            return
    elif API_KEY:
        auth_header = {"X-Api-Key": API_KEY}
    else:
        print("No authentication method found. Set either STB_CLIENT_ID & STB_CLIENT_SECRET or STB_API_KEY.")
        return

    keywords = ['music', 'arts', 'food', 'family', 'history', 'festival', 'sports', 'culture']
    all_events = []
    seen_uuids = set()

    for kw in keywords:
        offset = 0
        limit = 50

        while True:
            try:
                data = fetch_events(auth_header, limit=limit, offset=offset, keywords=[kw])
            except Exception as e:
                print(f"Error fetching events for keyword '{kw}': {e}")
                break

            events = data.get("data", [])
            if not events:
                break

            parsed_events = parse_events(events)

            for event in events:
                uuid = event.get("uuid")
                if uuid and uuid not in seen_uuids:
                    seen_uuids.add(uuid)
                    match = next((e for e in parsed_events if e["title"] == event.get("name")), None)
                    if match:
                        all_events.append(match)

            total_records = data.get("totalRecords", 0)
            offset += limit
            if offset >= total_records:
                break

            print(f"Fetched {len(events)} events for keyword '{kw}' (offset {offset})")

    print(f"\nTotal unique events fetched: {len(all_events)}\n")

    for e in all_events[:5]:
        print(f"Title: {e['title']}")
        print(f"Start: {e['start_date']}")
        print(f"End: {e['end_date']}")
        print(f"Location: {e['location']}")
        print(f"Postal Code: {e['postal_code']}")
        print(f"Category: {e['category']}")
        print(f"Price: {e['price']}")
        print(f"Description: {e['description'][:100]}...")
        print(f"Organizer: {e['organizer']}")
        print(f"Official Link: {e['official_link']}")
        print(f"URLs: {e['url']}")
        print("-" * 40)

if __name__ == "__main__":
    main()
