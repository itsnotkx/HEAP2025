import re
from datetime import datetime
from typing import List, Optional, Tuple
import requests
from bs4 import BeautifulSoup
from dateutil import parser as date_parser

YEAR = 2025

TIME_REGEX = re.compile(
    r'(\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm))\s*[-–—to]+\s*(\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm))',
    re.IGNORECASE
)

PRICE_PATTERNS = [
    re.compile(r'(?:admission|price|tickets?)[:\s]*(?:from\s+)?\$?(\d+(?:\.\d+)?)', re.I),
    re.compile(r'(?:from|starting\s+(?:at|from))\s+\$(\d+(?:\.\d+)?)', re.I),
    re.compile(r'(?:admission|price|tickets?)[:\s]*(free|complimentary)', re.I),
    re.compile(r'\$(\d+(?:\.\d+)?)', re.I)
]

def extract_postal_code(location: Optional[str]) -> Optional[str]:
    if location:
        match = re.search(r'\b\d{6}\b', location)
        if match:
            return match.group()
    return None

def try_parse_date(date_str: str) -> Optional[datetime]:
    try:
        return date_parser.parse(date_str, dayfirst=True)
    except Exception:
        return None

def parse_single_dates(text: str) -> Tuple[Optional[str], Optional[str]]:
    matches = re.findall(r'(\d{1,2})(?:st|nd|rd|th)?\s*([A-Za-z]+)', text)
    parsed_dates = [try_parse_date(f"{day} {month} {YEAR}") for day, month in matches]
    parsed_dates = [d for d in parsed_dates if d]
    if parsed_dates:
        return parsed_dates[0].isoformat(), parsed_dates[-1].isoformat()
    return None, None

def parse_date_range(text: str) -> Tuple[Optional[str], Optional[str]]:
    cleaned = re.sub(r'(\d{1,2})(st|nd|rd|th)', r'\1', text).replace("–", "-").replace("—", "-").strip()
    cross_month = re.match(r'(\d{1,2})\s+([A-Za-z]+)\s*-\s*(\d{1,2})\s+([A-Za-z]+)', cleaned)
    if cross_month:
        d1, m1, d2, m2 = cross_month.groups()
        start = try_parse_date(f"{d1} {m1} {YEAR}")
        end = try_parse_date(f"{d2} {m2} {YEAR}")
        return (start.isoformat() if start else None, end.isoformat() if end else None)
    same_month = re.match(r'(\d{1,2})-(\d{1,2})\s+([A-Za-z]+)', cleaned)
    if same_month:
        d1, d2, m = same_month.groups()
        start = try_parse_date(f"{d1} {m} {YEAR}")
        end = try_parse_date(f"{d2} {m} {YEAR}")
        return (start.isoformat() if start else None, end.isoformat() if end else None)
    return parse_single_dates(text)

def normalize_time(time_str: str) -> str:
    if not time_str:
        return time_str
    normalized = re.sub(r'(\d{1,2})\.(\d{2})', r'\1:\2', time_str)
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    return normalized

def extract_time_from_text(text: str) -> Optional[str]:
    time_label_match = re.search(r'time[:\s]*([^\n\|]+?)(?=\s*(?:venue|date|admission|price|\||$))', text, re.I)
    if time_label_match:
        candidate = time_label_match.group(1).strip()
        if re.search(r'vary|varies|different|multiple', candidate, re.I):
            return candidate
        time_match = TIME_REGEX.search(candidate)
        if time_match:
            return normalize_time(f"{time_match.group(1)} - {time_match.group(2)}")
    time_match = TIME_REGEX.search(text)
    if time_match:
        return normalize_time(f"{time_match.group(1)} - {time_match.group(2)}")
    return None

def extract_price_from_text(text: str) -> Optional[float]:
    prices = []
    free_match = re.search(r'(?:admission|price|tickets?)[:\s]*(free|complimentary)', text, re.I)
    if free_match:
        return 0.0
    for pattern in PRICE_PATTERNS:
        matches = pattern.findall(text)
        for match in matches:
            if isinstance(match, tuple):
                match = match[0] if match[0] else match[1]
            if isinstance(match, str):
                if match.lower() in ['free', 'complimentary']:
                    return 0.0
                try:
                    price = float(match)
                    prices.append(price)
                except ValueError:
                    continue
    return min(prices) if prices else None

def extract_event_info(text: str) -> dict:
    info = {}
    date_match = re.search(r'dates?[:\s]*([^\n\|]+?)(?=\s*(?:venue|time|admission|price|\||$))', text, re.I)
    if date_match:
        start, end = parse_date_range(date_match.group(1))
        if start:
            info["start_date"] = start
        if end:
            info["end_date"] = end
    else:
        start, end = parse_date_range(text)
        if start:
            info["start_date"] = start
        if end:
            info["end_date"] = end
    venue_match = re.search(r'venue[:\s]*([^\n\|]+?)(?=\s*(?:dates?|time|admission|price|\||$))', text, re.I)
    if venue_match:
        info["location"] = venue_match.group(1).strip()
    time_result = extract_time_from_text(text)
    if time_result:
        info["time"] = time_result
    price_result = extract_price_from_text(text)
    if price_result is not None:
        info["price"] = price_result
    organizer_match = re.search(r'organizer[s]?[:\s]*([^\n\|]+?)(?=\s*(?:dates?|time|venue|admission|price|\||$))', text, re.I)
    if organizer_match:
        organizer = organizer_match.group(1).strip()
        if organizer.lower() not in ["n/a", "tbc", "tba", ""]:
            info["organizer"] = organizer
    return info

def find_official_link(sibling) -> Optional[str]:
    if not sibling:
        return None
    for a in sibling.find_all('a', href=True):
        href = a['href']
        if "thesmartlocal" not in href.lower():
            return href
    return None

def is_valid_event_image(img_tag):
    """Return True if the img is likely an event image, not a logo/icon/etc."""
    exclude_patterns = [
        "logo", "icon", "footer", "default", "sprite", "banner", "favicon",
        "pixel", "wp-content/themes/thesmartlocal", "wp-content/plugins", "/ads/", "placeholder"
    ]
    src = img_tag.get('src', '') or ''
    lower_src = src.lower()
    if not src or any(pat in lower_src for pat in exclude_patterns):
        return False
    if img_tag.find_parent('svg'):
        return False
    try:
        w = int(img_tag.get('width', 0))
        h = int(img_tag.get('height', 0))
        if (w and w < 50) or (h and h < 50):
            return False
    except Exception:
        pass
    return True

def scrape_tsl_events() -> List[dict]:
    url = "https://thesmartlocal.com/read/things-to-do-this-weekend-singapore/"
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, "html.parser")
    events = []

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
        image_urls = []
        sibling = header.find_next_sibling()

        # process each sibling—collect text, info, and images, up to next event
        while sibling and sibling.name != 'h3':
            text = sibling.get_text(separator=' ', strip=True)
            if text:
                description_parts.append(text)
                chunk_info = extract_event_info(text)
                for key, value in chunk_info.items():
                    if value is not None:
                        if key == "price":
                            if event["price"] is None or value < event["price"]:
                                event["price"] = value
                        elif not event.get(key):
                            event[key] = value
                if not event.get("official_link"):
                    event["official_link"] = find_official_link(sibling)

            # Gather all valid images from this sibling
            if hasattr(sibling, "find_all"):
                for img_tag in sibling.find_all('img'):
                    if is_valid_event_image(img_tag):
                        img_src = img_tag['src']
                        if img_src not in image_urls:
                            image_urls.append(img_src)

            sibling = sibling.find_next_sibling()

        event["description"] = " ".join(description_parts)

        # Final extraction pass on full description
        final_info = extract_event_info(event["description"])
        for key, value in final_info.items():
            if value is not None:
                if key == "price":
                    if event["price"] is None or value < event["price"]:
                        event["price"] = value
                elif not event.get(key):
                    event[key] = value

        event["postal_code"] = extract_postal_code(event.get("location"))
        event["image_urls"] = image_urls
        events.append(event)

    return events

def lambda_handler(event, context):
    try:
        events = scrape_tsl_events()
        print(f"Scraped {len(events)} events.")
        return {
            "statusCode": 200,
            "events": events
        }
    except Exception as e:
        print(f"Error in Lambda: {e}")
        return {
            "statusCode": 500,
            "body": f"Error scraping events: {str(e)}"
        }
