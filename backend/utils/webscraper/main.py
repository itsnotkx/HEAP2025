import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from typing import List

from models import Event
from STBScrapper import scrape_stb_events
from TheSmartLocalScraper import scrape_tsl_events
from TimeoutScraper import scrape_timeout_events
from deduplication import deduplicate_events

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
def read_root():
    return """
    <html>
    <head>
        <title>API Home</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

            body {
                background-color: black;
                color: white;
                font-family: 'Share Tech Mono', monospace;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .gradient-text {
                font-size: 2rem;
                font-weight: bold;
                background: linear-gradient(90deg, #00f, #0f0);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
                text-align: center;
                max-width: 600px;
                line-height: 1.5;
                user-select: none;
            }
        </style>
    </head>
    <body>
        <div class="gradient-text">
            Welcome to the Events API!<br><br>
            Use the endpoint <br> <code>/scrape/stb</code> <br> to fetch curated STB event data.<br>
            Use the endpoint <br> <code>/scrape/tsl</code> <br> to fetch curated TheSmartLocal event data.<br>
            Use the endpoint <br> <code>/scrape/timeout</code> <br> to fetch curated Timeout event data.<br>
            Use the endpoint <br> <code>/scrape/all</code> <br> to fetch all sources combined with classification and deduplication.<br><br>
        </div>
    </body>
    </html>
    """

@app.get("/scrape/stb", response_model=List[Event])
def get_stb_events():
    return scrape_stb_events()

@app.get("/scrape/tsl", response_model=List[Event])
def get_tsl_events():
    return scrape_tsl_events()

@app.get("/scrape/timeout", response_model=List[Event])
def get_timeout_events():
    return scrape_timeout_events()

@app.get("/scrape/all", response_model=List[Event])
def get_all_events():
    all_events = []

    for event in scrape_stb_events():
        event.description = f"[STB] {event.description}"
        all_events.append(event)

    for event in scrape_tsl_events():
        event.description = f"[TSL] {event.description}"
        all_events.append(event)

    for event in scrape_timeout_events():
        event.description = f"[Timeout] {event.description}"
        all_events.append(event)

    unique_events = deduplicate_events(all_events)
    return unique_events
