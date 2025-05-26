from fastapi import FastAPI
from typing import List

from STBScrapper import scrape_stb_events  # your STB API function
from TheSmartLocalScraper import scrape_tsl_events  # your TheSmartLocal API function

app = FastAPI()

@app.post("/scrape-stb-events")
async def api_stb_events():
    return scrape_stb_events()

@app.post("/scrape-tsl-events")
async def api_tsl_events():
    return scrape_tsl_events()
