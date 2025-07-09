from typing import List
from sentence_transformers import SentenceTransformer, util
from rapidfuzz import fuzz
from models import Event 

model = SentenceTransformer("all-MiniLM-L6-v2")

def event_similarity(e1: Event, e2: Event) -> float:
    # Use title + location for fuzzy match
    fuzz_score = fuzz.token_sort_ratio(
        f"{e1.title} {e1.location or ''}", f"{e2.title} {e2.location or ''}"
    )
    
    # Use description + title for semantic similarity
    s1 = f"{e1.title}. {e1.description}"
    s2 = f"{e2.title}. {e2.description}"
    emb1, emb2 = model.encode([s1, s2], convert_to_tensor=True)
    semantic_score = util.pytorch_cos_sim(emb1, emb2).item() * 100  # scale to 0–100

    # Weighted average (tune if needed)
    final_score = 0.4 * fuzz_score + 0.6 * semantic_score
    return final_score

def deduplicate_events(events: List[Event], threshold: float = 75.0) -> List[Event]:
    unique = []
    for e in events:
        if all(event_similarity(e, u) < threshold for u in unique):
            unique.append(e)
    return unique
