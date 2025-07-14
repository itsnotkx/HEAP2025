import re
from datetime import datetime
from typing import List, Optional, Tuple
import requests
from bs4 import BeautifulSoup
from dateutil import parser as date_parser
from eventLib.event import Event

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
    """Extract 6-digit postal code from location string."""
    if location:
        match = re.search(r'\b\d{6}\b', location)
        if match:
            return match.group()
    return None

def try_parse_date(date_str: str) -> Optional[datetime]:
    """Try to parse date string with multiple formats."""
    try:
        return date_parser.parse(date_str, dayfirst=True)
    except Exception:
        return None

def parse_single_dates(text: str) -> Tuple[Optional[str], Optional[str]]:
    """Parse individual dates from text."""
    matches = re.findall(r'(\d{1,2})(?:st|nd|rd|th)?\s*([A-Za-z]+)', text)
    parsed_dates = [try_parse_date(f"{day} {month} {YEAR}") for day, month in matches]
    parsed_dates = [d for d in parsed_dates if d]
    if parsed_dates:
        return parsed_dates[0].isoformat(), parsed_dates[-1].isoformat()
    return None, None

def parse_date_range(text: str) -> Tuple[Optional[str], Optional[str]]:
    """Parse date ranges from text with multiple formats."""
    cleaned = re.sub(r'(\d{1,2})(st|nd|rd|th)', r'\1', text).replace("–", "-").replace("—", "-").strip()
    
    # Cross-month: "3 July - 7 August"
    cross_month = re.match(r'(\d{1,2})\s+([A-Za-z]+)\s*-\s*(\d{1,2})\s+([A-Za-z]+)', cleaned)
    if cross_month:
        d1, m1, d2, m2 = cross_month.groups()
        start = try_parse_date(f"{d1} {m1} {YEAR}")
        end = try_parse_date(f"{d2} {m2} {YEAR}")
        return (start.isoformat() if start else None, end.isoformat() if end else None)
    
    # Same-month: "3-7 July"
    same_month = re.match(r'(\d{1,2})-(\d{1,2})\s+([A-Za-z]+)', cleaned)
    if same_month:
        d1, d2, m = same_month.groups()
        start = try_parse_date(f"{d1} {m} {YEAR}")
        end = try_parse_date(f"{d2} {m} {YEAR}")
        return (start.isoformat() if start else None, end.isoformat() if end else None)
    
    # Fallback to single dates
    return parse_single_dates(text)

def normalize_time(time_str: str) -> str:
    """Normalize time format: convert dots to colons and clean up spaces."""
    if not time_str:
        return time_str
    
    # Replace dots with colons (7.30pm -> 7:30pm)
    normalized = re.sub(r'(\d{1,2})\.(\d{2})', r'\1:\2', time_str)
    
    # Clean up extra spaces
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    
    return normalized

def extract_time_from_text(text: str) -> Optional[str]:
    """Extract time with improved boundary detection."""
    # First, try to find explicit "Time:" labels
    time_label_match = re.search(r'time[:\s]*([^\n\|]+?)(?=\s*(?:venue|date|admission|price|\||$))', text, re.I)
    if time_label_match:
        candidate = time_label_match.group(1).strip()
        
        # Check if the candidate contains "vary" or similar
        if re.search(r'vary|varies|different|multiple', candidate, re.I):
            return candidate
            
        # If it contains a proper time range, extract and normalize it
        time_match = TIME_REGEX.search(candidate)
        if time_match:
            return normalize_time(f"{time_match.group(1)} - {time_match.group(2)}")
    
    # Fallback: look for time patterns anywhere in the text
    time_match = TIME_REGEX.search(text)
    if time_match:
        return normalize_time(f"{time_match.group(1)} - {time_match.group(2)}")
    
    return None

def extract_price_from_text(text: str) -> Optional[float]:
    """Extract price with improved pattern matching and lowest price logic."""
    prices = []
    
    # Check for free admission first
    free_match = re.search(r'(?:admission|price|tickets?)[:\s]*(free|complimentary)', text, re.I)
    if free_match:
        return 0.0
    
    # Look for all price patterns
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
    
    # Return the lowest price found
    return min(prices) if prices else None

def extract_event_info(text: str) -> dict:
    """Extract event information from text with improved parsing."""
    info = {}
    
    # Extract dates
    date_match = re.search(r'dates?[:\s]*([^\n\|]+?)(?=\s*(?:venue|time|admission|price|\||$))', text, re.I)
    if date_match:
        start, end = parse_date_range(date_match.group(1))
        if start:
            info["start_date"] = start
        if end:
            info["end_date"] = end
    else:
        # Fallback date parsing
        start, end = parse_date_range(text)
        if start:
            info["start_date"] = start
        if end:
            info["end_date"] = end
    
    # Extract venue/location
    venue_match = re.search(r'venue[:\s]*([^\n\|]+?)(?=\s*(?:dates?|time|admission|price|\||$))', text, re.I)
    if venue_match:
        info["location"] = venue_match.group(1).strip()
    
    # Extract time
    time_result = extract_time_from_text(text)
    if time_result:
        info["time"] = time_result
    
    # Extract price
    price_result = extract_price_from_text(text)
    if price_result is not None:
        info["price"] = price_result
    
    # Extract organizer
    organizer_match = re.search(r'organizer[s]?[:\s]*([^\n\|]+?)(?=\s*(?:dates?|time|venue|admission|price|\||$))', text, re.I)
    if organizer_match:
        organizer = organizer_match.group(1).strip()
        if organizer.lower() not in ["n/a", "tbc", "tba", ""]:
            info["organizer"] = organizer
    
    return info

def find_official_link(sibling) -> Optional[str]:
    """Find first external link (not containing 'thesmartlocal') from sibling."""
    if not sibling:
        return None
    
    for a in sibling.find_all('a', href=True):
        href = a['href']
        if "thesmartlocal" not in href.lower():
            return href
    return None

# ---------- Main Scraper Function ---------- #
def scrape_tsl_events() -> List[Event]:
    """Main scraping function with improved extraction logic."""
    url = "https://thesmartlocal.com/read/things-to-do-this-weekend-singapore/"
    
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, "html.parser")
    events: List[Event] = []
    
    for header in soup.find_all('h3'):
        title = header.get_text(strip=True)
        
        # Skip non-event headers
        if "new events in singapore" in title.lower():
            continue
        
        # Initialize event data
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
        
        # Collect all content for this event
        description_parts = []
        sibling = header.find_next_sibling()
        
        # Process each sibling element
        while sibling and sibling.name != 'h3':
            text = sibling.get_text(separator=' ', strip=True)
            if text:  # Only add non-empty text
                description_parts.append(text)
                
                # Extract info from each text chunk
                chunk_info = extract_event_info(text)
                
                # Update event data with extracted info (only if not already set)
                for key, value in chunk_info.items():
                    if value is not None:
                        if key == "price":
                            # Always keep the lowest price
                            if event["price"] is None or value < event["price"]:
                                event["price"] = value
                        elif not event.get(key):
                            event[key] = value
                
                # Look for official links
                if not event.get("official_link"):
                    event["official_link"] = find_official_link(sibling)
            
            sibling = sibling.find_next_sibling()
        
        # Set full description
        event["description"] = " ".join(description_parts)
        
        # Final extraction pass on complete description
        final_info = extract_event_info(event["description"])
        for key, value in final_info.items():
            if value is not None:
                if key == "price":
                    # Always keep the lowest price
                    if event["price"] is None or value < event["price"]:
                        event["price"] = value
                elif not event.get(key):
                    event[key] = value
        
        # Extract postal code from location
        event["postal_code"] = extract_postal_code(event.get("location"))
        
        # Find associated image
        img = header.find_previous('img')
        if img and img.has_attr('src'):
            event["image_urls"].append(img['src'])
        
        # Create Event object and add to list
        events.append(Event(**event))
    
    return events



def lambda_handler(event, context):
    try:
        events = scrape_tsl_events()
        print(f"Scraped {len(events)} events.")
        return [e.to_dict() for e in events] 
    except Exception as e:
        print(f"Error in Lambda: {e}")
        return {
            "statusCode": 500,
            "body": f"Error scraping events: {str(e)}"
        }
    