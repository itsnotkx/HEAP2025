from fastapi import APIRouter, HTTPException, Query
import os
import httpx
from urllib.parse import unquote_plus

router = APIRouter(prefix="/distance", tags=["distance"])

@router.get("/")
async def calculate_distance(
    address1: str = Query(..., description="Origin address"),
    address2: str = Query(..., description="Destination address"),
    mode: str = Query("Transit", description="Mode of transport (driving, walking, cycling, or Transit)")
):
    encoded_address1 = unquote_plus(address1)
    encoded_address2 = unquote_plus(address2)
 
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")

    if not api_key:
        raise HTTPException(status_code=500, detail="Google Maps API key not configured.")
    

    url = (
        "https://maps.googleapis.com/maps/api/distancematrix/json"
        f"?origins={encoded_address1}&destinations={encoded_address2}&mode={mode}&key={api_key}"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    data = response.json()

    if data.get("status") != "OK":
        raise HTTPException(
            status_code=400,
            detail=f"Google API error: {data.get('error_message') or data.get('status')}"
        )

    try:
        element = data["rows"][0]["elements"][0]
        distance = element["distance"]["text"]
        duration = element["duration"]["text"]
        return {"distance": distance, "duration": duration}
    except (KeyError, IndexError) as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not retrieve distance information: {str(e)}"
        )
