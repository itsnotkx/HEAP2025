from transformers import pipeline
from flask import Flask, request, jsonify
import os
import psycopg2
import json

app = Flask(__name__)

tags = [
  "family-friendly", "student gathering", "senior activities", "LGBTQ+ friendly", "women-focused", "networking event", "pet-friendly",
  "hackathon", "workshop", "seminar", "casual meetup", "community volunteering", "art exhibition", "game night", "tech talk",
  "career fair", "fundraising event", "competition / tournament", "music concert", "religious gathering", "political rally",
  "movie screening", "food tasting",
  "outdoor adventure", "indoor event", "online / virtual", "nightlife event", "day trip", "nature retreat", "festival / fair",
  "museum or gallery event",
  "learning / education", "socializing", "health & wellness", "personal development", "sports / fitness", "cultural celebration",
  "startup / entrepreneurship", "environmental / sustainability", "spiritual / meditation", "travel & exploration",
  "music & dance", "visual arts & crafts", "photography", "coding / programming", "board games", "esports",
  "anime & cosplay", "fashion", "public speaking", "DIY / makerspace"
]

# Mapping for concise descriptions
map = {
    "festival / fair": "Fair",
    "learning / education": "Educative",
    "online / virtual": "Virtual",
    "sports / fitness": "Fitness",
    "startup / entrepreneurship": "Entrepreneurship",
    "environmental / sustainability": "Environmental",
    "coding / programming": "Coding",
    "competition / tournament": "Competition",
}

DB_CONFIG = {
    "host": os.environ.get("DB_HOST"),
    "port": os.environ.get("DB_PORT"),
    "dbname": os.environ.get("DB_NAME"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD")
}

print(DB_CONFIG)

# Normalize mapping keys for lowercase matching
map = {k.lower(): v for k, v in map.items()}

# Load model
classifier = pipeline("zero-shot-classification", model='facebook/bart-large-mnli')

def connect_db():
    return psycopg2.connect(**DB_CONFIG)

def insert_event(event):
    """Insert a single event (dict) into the database"""
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO events (title, start_date, end_date, address, price, categories, description, images, lat, long)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    event.get("title"),
                    event.get("start_date"),
                    event.get("end_date"),
                    event.get("address"),
                    event.get("price"),
                    event.get("categories"),
                    event.get("description"),
                    event.get("images"),
                    event.get("lat"),
                    event.get("long")
                )
            )




@app.route('/classify', methods=['POST'])
def classify_event():
    event=request.get_json()

    # Clean concatenation of title and description
    text = " ".join(filter(None, [event.get("title", ""), event.get("description", "")]))

    result = classifier(text, tags, multi_label=True)

    # Round scores to 1 decimal place and apply mapping
    tag_scores = {
        map.get(label.lower(), label): round(score * 2 - 1, 1)
        for label, score in zip(result['labels'], result['scores'])
    }

    event["categories"] = tag_scores

    insert_event(event)
    
    return 200
    



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)