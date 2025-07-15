# inference.py
from transformers import pipeline

def model_fn(model_dir):
    return pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def predict_fn(input_data, model):
    tags = [
        "family-friendly", "student gathering", "senior activities", "LGBTQ+ friendly",
        "women-focused", "networking event", "pet-friendly", "hackathon", "workshop",
        "seminar", "casual meetup", "community volunteering", "art exhibition", "game night",
        "tech talk", "career fair", "fundraising event", "competition / tournament",
        "music concert", "religious gathering", "political rally", "movie screening",
        "food tasting", "outdoor adventure", "indoor event", "online / virtual", "nightlife event",
        "day trip", "nature retreat", "festival / fair", "museum or gallery event",
        "learning / education", "socializing", "health & wellness", "personal development",
        "sports / fitness", "cultural celebration", "startup / entrepreneurship",
        "environmental / sustainability", "spiritual / meditation", "travel & exploration",
        "music & dance", "visual arts & crafts", "photography", "coding / programming",
        "board games", "esports", "anime & cosplay", "fashion", "public speaking",
        "DIY / makerspace"
    ]

    tag_map = {
        "festival / fair":"Fair",
        "learning / education":"Educative",
        "online / virtual":"Virtual",
        "sports / fitness":"Fitness",
        "startup / entrepreneurship":"Entrepreneurship",
        "environmental / sustainability":"Environmental",
        "coding / programming":"Coding",
        "competition / tournament":"Competition",
    }

    text = f"{input_data.get('title', '')} {input_data.get('description', '')}"
    result = model(text, tags, multi_label=True)
    top_k = input_data.get("top_k", 3)
    top = sorted(zip(result['labels'], result['scores']), key=lambda x: -x[1])[:top_k]
    categories = [tag_map.get(label, label) for label, _ in top]
    return {"categories": categories}