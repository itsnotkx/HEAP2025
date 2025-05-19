import requests
import re
import os

from bs4 import BeautifulSoup as bs

r = requests.get("https://www.timeout.com/singapore/things-to-do")

soup = bs(r.content, features="html.parser")

# print(soup.prettify())

# finding url links
article_links = []
for a_tag in soup.find_all('a', href = True):
    href = a_tag['href']
    if href.startswith('/singapore/things-to-do/') and not href.endswith('/things-to-do'):
        full_url = "https://www.timeout.com" + href
        article_links.append(full_url)

os.makedirs("articles", exist_ok=True)

# go to each atricle
for url in set(article_links): 

    article_r = requests.get(url)
    article_soup = bs(article_r.content, "html.parser")

    # Title
    title_tag = article_soup.find("h1")
    title = title_tag.get_text(strip=True) if title_tag else "N/A"

    # Published date
    date = "N/A"
    date_tag = article_soup.find("time")
    if date_tag and date_tag.get("datetime"):
        date = date_tag["datetime"]

    # Junk text filters
    junk_phrases = [
        "By entering your email address",
        "🙌Awesome, you're subscribed!",
        "RECOMMENDED:",
        "Thanks for subscribing!",
        "Been there, done that?",
        "Terms of Use",
        "Privacy Policy",
        "Popular on Time Out"
    ]

    # Clean paragraphs
    body_paragraphs = []
    article_body = article_soup.select("div[id*=main], article, section")
    for section in article_body:
        for p in section.find_all("p"):
            text = p.get_text(strip=True)
            if text and not any(junk in text for junk in junk_phrases):
                body_paragraphs.append(text)

        full_text = "\n".join(body_paragraphs)

    # Write to file
    safe_title = re.sub(r'[\\/*?:"<>|]', "", title)[:50]  # remove illegal filename characters & truncate
    if not safe_title or safe_title == "N/A":
        safe_title = url.split("/")[-1]  # fallback to URL slug
    filename = os.path.join("articles", f"{safe_title}.txt")

    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"URL: {url}\n")
        f.write(f"Title: {title}\n")
        f.write(f"Published: {date}\n")
        f.write("Article Content:\n")
        f.write(full_text + "\n")

print("Done")