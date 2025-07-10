import requests
import re
import dateparser
from typing import List, Optional
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from models import Event

app = FastAPI()

TIMEOUT_BASE_URL = "https://www.timeout.com"
TIMEOUT_THINGS_TO_DO_URL = f"{TIMEOUT_BASE_URL}/singapore/things-to-do"

JUNK_PHRASES = [
    "By entering your email address",
    "🙌Awesome, you're subscribed!",
    "RECOMMENDED:",
    "Thanks for subscribing!",
    "Been there, done that?",
    "Terms of Use",
    "Privacy Policy",
    "Popular on Time Out"
]

# --- Helper Functions ---

def fetch_timeout_article_links() -> List[str]:
    try:
        response = requests.get(TIMEOUT_THINGS_TO_DO_URL)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Timeout main page: {str(e)}")

    soup = BeautifulSoup(response.content, "html.parser")
    links = set()

    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        if href.startswith('/singapore/things-to-do/') and not href.endswith('/things-to-do'):
            links.add(TIMEOUT_BASE_URL + href)

    return list(links)

def clean_paragraph_text(text: str) -> bool:
    if not text.strip():
        return False
    for junk in JUNK_PHRASES:
        if junk in text:
            return False
    return True

def extract_time(text: str) -> Optional[str]:
    # Extract first time expression like "9am", "10:30pm"
    match = re.search(r'\b\d{1,2}(:\d{2})?\s?(am|pm|AM|PM)\b', text)
    if match:
        return match.group(0)
    return None

def extract_price(text: str) -> Optional[str]:
    text_lower = text.lower()
    if "free" in text_lower:
        return "Free"
    match = re.search(r'\$\s?(\d+(?:\.\d{1,2})?)', text)
    if match:
        return f"${match.group(1)}"
    return None

# --- Main Parser ---

def parse_timeout_article(url: str) -> Event:
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Timeout article {url}: {str(e)}")

    soup = BeautifulSoup(response.content, "html.parser")

    # Title
    title_tag = soup.find("h1")
    title = title_tag.get_text(strip=True) if title_tag else "N/A"

    # Dates (start_date, end_date)
    datetimes = [time_tag.get("datetime") for time_tag in soup.find_all("time") if time_tag.get("datetime")]
    start_date = datetimes[0] if datetimes else None
    end_date = datetimes[1] if len(datetimes) > 1 else None

    # Fallback: parse date ranges from text if not found in <time>
    text_content = soup.get_text(separator="\n", strip=True)
    date_match = re.search(r"(\d{1,2} ?[A-Za-z]{3,9}(?: \d{4})?)\s*(–|-|to)\s*(\d{1,2} ?[A-Za-z]{3,9}(?: \d{4})?)", text_content)
    if date_match:
        parsed_start = dateparser.parse(date_match.group(1), settings={"TIMEZONE": "Asia/Singapore"})
        parsed_end = dateparser.parse(date_match.group(3), settings={"TIMEZONE": "Asia/Singapore"})
        if parsed_start:
            start_date = parsed_start.isoformat()
        if parsed_end:
            end_date = parsed_end.isoformat()

    if start_date and not end_date:
        end_date = start_date

    # Extract all paragraphs, filter junk, keep unique
    body_paragraphs = []
    article_sections = soup.select("div[id*=main], article, section")
    for section in article_sections:
        for p in section.find_all("p"):
            text = p.get_text(strip=True)
            if clean_paragraph_text(text):
                body_paragraphs.append(text)
    unique_paragraphs = list(dict.fromkeys(body_paragraphs))
    description = "\n".join(unique_paragraphs)

    # Extract first time and price mentions from paragraphs
    time = None
    price = None
    for para in unique_paragraphs:
        if not time:
            time = extract_time(para)
        if not price:
            price = extract_price(para)
        if time and price:
            break

    # Extract images (deduplicate, keep only timeout domain)
    image_urls = []
    for img_tag in soup.find_all("img"):
        src = img_tag.get("src") or img_tag.get("data-src")
        if src and src.startswith("http") and "timeout" in src:
            image_urls.append(src)
    image_urls = list(dict.fromkeys(image_urls))

    return Event(
        title=title,
        start_date=start_date,
        end_date=end_date,
        time=time,
        location="Singapore",
        postal_code=None,
        category=None,
        price=price,
        description=description,
        image_urls=image_urls,
        organizer="Time Out Singapore",
        official_link=url,
        url=[url]
    )

# --- Route ---

@app.get("/scrape-timeout", response_model=List[Event])
def scrape_timeout_events():
    article_links = fetch_timeout_article_links()
    events = []
    for link in article_links:
        try:
            event = parse_timeout_article(link)
            events.append(event)
        except Exception as e:
            print(f"Failed to parse {link}: {e}")
    return events
