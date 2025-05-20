import requests
from bs4 import BeautifulSoup
import re
import json
import os
from datetime import datetime

os.makedirs("event_listings", exist_ok=True)

url = "https://thesmartlocal.com/read/things-to-do-this-weekend-singapore/"
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

def extract_address(text):
    address_pattern = r"Singapore\s+\d{6}"
    match = re.search(address_pattern, text)
    if match:
        return text.strip()
    return text

def parse_dates(dates_text):
    date_parts = re.findall(r'(\d{1,2})(?:st|nd|rd|th)?\s*(\w+)', dates_text)
    try:
        parsed_dates = [datetime.strptime(f"{d} {m} 2025", "%d %B %Y") for d, m in date_parts]
        start_date = parsed_dates[0].isoformat()
        end_date = parsed_dates[-1].isoformat() if len(parsed_dates) > 1 else None
        return start_date, end_date
    except ValueError:
        return None, None

event_tags = soup.find_all('h3')
index = 1

for event_tag in event_tags:
    title = event_tag.get_text(strip=True)
    if "new events in singapore" in title.lower():
        continue

    content = []
    event_data = {
        "Title": title,
        "Start Date": None,
        "End Date": None,
        "Time": None,
        "Address / Location": None,
        "Postal Code": None,
        "Category": None,
        "Price / Ticket Info": None,
        "Description": "",
        "Image URL(s)": [],
        "Organizer": None,
        "Official Event Link": None,  # Default null if no official link found
        "url": [url]  # Always include the thesmartlocal URL as a list
    }

    sibling = event_tag.find_next_sibling()
    while sibling and sibling.name != 'h3':
        text = sibling.get_text(separator=' ', strip=True)
        content.append(text)

        # Price info
        if not event_data["Price / Ticket Info"]:
            price_match = re.search(r'(Tickets?|Price)[:\-]?\s*(From\s*\$?\d+|Free|\$?\d+(?:\s*-\s*\$?\d+)?(?:\+)?)(?=\s|$)', text, re.IGNORECASE)
            if price_match:
                event_data["Price / Ticket Info"] = price_match.group(2)

        # Address / Location
        if not event_data["Address / Location"]:
            venue_match = re.search(r'Venue[:\-]?\s*(.+?)(?=(?:Dates?|Time|Price|Tickets?|Organizer)[:\-])', text, re.IGNORECASE)
            if venue_match:
                address_str = venue_match.group(1).strip()
                event_data["Address / Location"] = extract_address(address_str)

        # Dates
        date_match = re.search(r'Dates?[:\-]?\s*([\d, &a-zA-Z]+)', text)
        if date_match:
            start_date, end_date = parse_dates(date_match.group(1))
            event_data["Start Date"] = start_date
            event_data["End Date"] = end_date

        # Time
        if not event_data["Time"]:
            time_match = re.search(r'Time[:\-]?\s*([^\n]+)', text, re.IGNORECASE)
            if time_match:
                event_data["Time"] = time_match.group(1).strip()

        # Organizer
        if not event_data["Organizer"]:
            org_match = re.search(r'Organizer[s]?[:\-]?\s*(.+?)(?=(?:Dates?|Time|Price|Tickets?|Venue)[:\-]|$)', text, re.IGNORECASE)
            if org_match:
                organizer = org_match.group(1).strip()
                if organizer.lower() not in ["n/a", "tbc", ""]:
                    event_data["Organizer"] = organizer

        # Official Event Link - look for links that are NOT thesmartlocal URLs
        if not event_data["Official Event Link"]:
            links = sibling.find_all('a', href=True)
            for link in links:
                href = link['href']
                # Skip internal thesmartlocal URLs
                if href.startswith("http") and "thesmartlocal.com" not in href.lower():
                    event_data["Official Event Link"] = href
                    break

        sibling = sibling.find_next_sibling()

    # Extract postal code from Address / Location if present
    if event_data["Address / Location"]:
        postal_match = re.search(r'\b\d{6}\b', event_data["Address / Location"])
        if postal_match:
            event_data["Postal Code"] = postal_match.group()

    # Image
    prev_img = event_tag.find_previous('img')
    if prev_img and prev_img.has_attr('src'):
        event_data["Image URL(s)"].append(prev_img['src'])

    event_data["Description"] = " ".join(content)

    filename = f"event_listings/event_{index:02d}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(event_data, f, indent=4, ensure_ascii=False)

    print(f"Saved: {filename}")
    index += 1
