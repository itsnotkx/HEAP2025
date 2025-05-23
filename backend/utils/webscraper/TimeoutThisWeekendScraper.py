import os
import re
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup

# ---------- Helpers ----------

def parse_price_list(prices):
    """Convert list of price strings to sorted list of floats."""
    prices_float = []
    for p in prices:
        try:
            prices_float.append(float(p.replace('$', '')))
        except ValueError:
            continue
    return sorted(set(prices_float))

def parse_date_list(dates, context_months=None):
    """Normalize and sort date strings. Optionally filter using context months."""
    months_map = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
    }

    parsed_dates = []
    for d in set(dates):
        d = d.lower().replace(',', '').strip()
        parts = d.split()
        day = None
        month = None
        for part in parts:
            if part.isdigit():
                day = int(part)
            elif part[:3] in months_map:
                month = months_map[part[:3]]

        if context_months and month:
            context_nums = [months_map[m[:3].lower()] for m in context_months]
            if month not in context_nums:
                continue

        if day and month:
            try:
                dt = datetime(2025, month, day)
                parsed_dates.append(dt)
            except ValueError:
                continue

    parsed_dates.sort()
    return [dt.strftime("%d %B") for dt in parsed_dates]

def extract_times_with_context(text):
    """Extract and sort times based on context (e.g., starts at, opens at)."""
    pattern = r'(?:(?:start|opens?|screenings?|show|doors?)\s*(?:at|from)?\s*)(\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm))'
    matches = re.findall(pattern, text, re.IGNORECASE)

    def normalize_time(t):
        t = t.lower().replace('.', ':').replace(' ', '')
        try:
            return datetime.strptime(t, "%I:%M%p").time()
        except ValueError:
            try:
                return datetime.strptime(t, "%I%p").time()
            except ValueError:
                return None

    unique_times = list(set(matches))
    parsed_times = [(t, normalize_time(t)) for t in unique_times]
    parsed_times = [pt for pt in parsed_times if pt[1] is not None]
    parsed_times.sort(key=lambda x: x[1])

    return [pt[0] for pt in parsed_times]

# ---------- Main Logic ----------

def main():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-insecure-localhost')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')

    driver = webdriver.Chrome(options=options)

    driver.get("https://www.timeout.com/singapore/things-to-do/things-to-do-in-singapore-this-weekend")
    time.sleep(5)

    read_more_links = driver.find_elements(By.CSS_SELECTOR, 'a[data-testid="view-more-cta_testID"]')
    urls = [link.get_attribute('href') for link in read_more_links if link.get_attribute('href')]

    os.makedirs('Activities', exist_ok=True)

    for idx, url in enumerate(urls, 1):
        driver.get(url)
        time.sleep(3)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        title = soup.find('h1').text.strip() if soup.find('h1') else 'No title'
        full_text = soup.get_text(separator=' ', strip=True)

        # --- Extract prices and dates ---
        raw_prices = re.findall(r'\$\d+(?:\.\d{2})?', full_text)
        raw_dates = re.findall(
            r'\b(?:\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*|'
            r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{1,2})\b',
            full_text, re.IGNORECASE
        )

        # Extract months from title for better date filtering
        title_months = [
            m for m in [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ] if m.lower() in title.lower()
        ]

        prices = parse_price_list(raw_prices)
        dates = parse_date_list(raw_dates, context_months=title_months)
        times = extract_times_with_context(full_text)

        # --- Description fallback ---
        desc_meta = soup.find('meta', attrs={'name': 'description'})
        description = desc_meta['content'].strip() if desc_meta else ''
        if not description:
            p_tag = soup.find('p')
            description = p_tag.text.strip() if p_tag else 'No description found'

        # --- Location detection ---
        location_elem = soup.find('span', class_='location') or soup.find('div', class_='location')
        location = location_elem.text.strip() if location_elem else 'Unknown'

        # --- Output ---
        output = (
            f"URL:\n{url}\n\n"
            f"Title:\n{title}\n\n"
            f"Location:\n{location}\n\n"
            f"Description:\n{description}\n\n"
            f"Dates:\n{', '.join(dates) if dates else 'Unknown'}\n\n"
            f"Times:\n{', '.join(times) if times else 'Unknown'}\n\n"
            f"Prices:\n{', '.join([f'${p:.2f}' for p in prices]) if prices else 'Unknown'}\n"
        )

        # Save output
        filename = f'Activities/activity_{idx}_{title[:30].replace(" ", "_").replace(":", "")}.txt'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(output)

    driver.quit()

# ---------- Entry Point ----------

if __name__ == "__main__":
    main()
