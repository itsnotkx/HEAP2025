from transformers import pipeline

tags = [
  "family-friendly",
  "student gathering",
  "senior activities",
  "LGBTQ+ friendly",
  "women-focused",
  "networking event",
  "pet-friendly",
  
  "hackathon",
  "workshop",
  "seminar",
  "casual meetup",
  "community volunteering",
  "art exhibition",
  "game night",
  "tech talk",
  "career fair",
  "fundraising event",
  "competition / tournament",
  "music concert",
  "religious gathering",
  "political rally",
  "movie screening",
  "food tasting",
  
  "outdoor adventure",
  "indoor event",
  "online / virtual",
  "nightlife event",
  "day trip",
  "nature retreat",
  "festival / fair",
  "museum or gallery event",
  
  "learning / education",
  "socializing",
  "health & wellness",
  "personal development",
  "sports / fitness",
  "cultural celebration",
  "startup / entrepreneurship",
  "environmental / sustainability",
  "spiritual / meditation",
  "travel & exploration",
  
  "music & dance",
  "visual arts & crafts",
  "photography",
  "coding / programming",
  "board games",
  "esports",
  "anime & cosplay",
  "fashion",
  "public speaking",
  "DIY / makerspace"
]

map = {
    "festival / fair":"Fair",
    "learning / education":"Educative",
    "online / virtual":"Virtual",
    "sports / fitness":"Fitness",
    "startup / entrepreneurship":"Entrepreneurship",
    "environmental / sustainability":"Environmental",
    "coding / programming":"Coding",
    "competition / tournament":"Competition",
}

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def classify_event(event: dict, top_k: int = 3):
    text = f"{event.get('title', '')} {event.get('description', '')} {event.get('location', '')} {event.get('audience', '')}"
    
    result = classifier(text, tags, multi_label=True)
    
    # Sort by score and return top_k labels
    top_indices = sorted(zip(result['labels'], result['scores']), key=lambda x: -x[1])[:top_k]
    categories = [label for label, score in top_indices]
    res = []
    for category in categories:
        if category in map:
            #replace
            res.append(map[category])
        else:
            res.append(category)

    return res


