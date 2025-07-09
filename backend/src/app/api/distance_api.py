import os
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/distance",
    tags=["distance"]
)

@router.post("/")
async def calculate_distance(address1: str, address2: str):
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Google Maps API key not configured.")
    url = (
        "https://maps.googleapis.com/maps/api/distancematrix/json"
        f"?origins={address1}&destinations={address2}&key={api_key}"
    )
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    data = response.json()
    try:
        element = data["rows"][0]["elements"][0]
        distance = element["distance"]["text"]
        duration = element["duration"]["text"]
        return {"distance": distance, "duration": duration}
    except (KeyError, IndexError):
        raise HTTPException(status_code=400, detail="Could not retrieve distance information.")
