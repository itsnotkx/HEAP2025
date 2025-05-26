from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from typing import List

from STBScrapper import scrape_stb_events  
from TheSmartLocalScraper import scrape_tsl_events  

app = FastAPI()
@app.get("/", response_class=HTMLResponse)
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
            Use the endpoint <br> <code>/scrape-stb-events</code> <br> to fetch curated STB event data.<br>
            Use the endpoint <br> <code>/scrape-tsl-events</code> <br> to fetch curated TheSmartLocal event data.<br><br>
            Both endpoints provide filtered event lists.<br>
        </div>
    </body>
    </html>
    """

@app.post("/scrape-stb-events")
async def api_stb_events():
    return scrape_stb_events()

@app.post("/scrape-tsl-events")
async def api_tsl_events():
    return scrape_tsl_events()
