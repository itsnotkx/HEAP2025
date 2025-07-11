
# import os
# import httpx
# from fastapi import APIRouter, HTTPException

# from pydantic import BaseModel


# router = APIRouter(
#     prefix="/distance",
#     tags=["distance"]
# )

# @router.post("/")


# class DistanceRequest(BaseModel):
#     address1: str
#     address2: str


# @router.post("/")
# async def calculate_distance(request: DistanceRequest):
#     address1 = request.address1
#     address2 = request.address2

#     api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
#     if not api_key:
#         raise HTTPException(status_code=500, detail="Google Maps API key not configured.")
#     url = (
#         "https://maps.googleapis.com/maps/api/distancematrix/json"
#         f"?origins={address1}&destinations={address2}&key={api_key}"
#     )
#     async with httpx.AsyncClient() as client:
#         response = await client.get(url)
#     data = response.json()
#     try:
#         element = data["rows"][0]["elements"][0]
#         distance = element["distance"]["text"]
#         duration = element["duration"]["text"]
#         return {"distance": distance, "duration": duration}
#     except (KeyError, IndexError):
#         raise HTTPException(status_code=400, detail="Could not retrieve distance information.")

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import httpx
from urllib.parse import quote_plus

class DistanceRequest(BaseModel):
    address1: str
    address2: str
    mode: str = "transit"

router = APIRouter(prefix="/distance", tags=["distance"])


# @router.post("/")
# async def calculate_distance(request: DistanceRequest):
#     address1 = request.address1
#     address2 = request.address2

#     api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
#     if not api_key:
#         raise HTTPException(status_code=500, detail="Google Maps API key not configured.")
#     url = (
#         "https://maps.googleapis.com/maps/api/distancematrix/json"
#         f"?origins={address1}&destinations={address2}&key={api_key}"
#     )
#     async with httpx.AsyncClient() as client:
#         response = await client.get(url)
#     data = response.json()
#     if data.get("status") != "OK":
#         raise HTTPException(status_code=400, detail=f"Google API error: {data.get('error_message') or data.get('status')}")
#     try:
#         element = data["rows"][0]["elements"][0]
#         distance = element["distance"]["text"]
#         duration = element["duration"]["text"]
#         return {"distance": distance, "duration": duration}
#     except (KeyError, IndexError):
#         raise HTTPException(status_code=400, detail="Could not retrieve distance information.")
    


@router.post("/")
async def calculate_distance(request: DistanceRequest):
    address1 = quote_plus(request.address1)
    address2 = quote_plus(request.address2)
    mode = request.mode
    #Mode can be driving, walking,cycling or transit

    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Google Maps API key not configured.")
    url = (
        "https://maps.googleapis.com/maps/api/distancematrix/json"
        f"?origins={address1}&destinations={address2}&mode={mode}&key={api_key}"
    )
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    data = response.json()
    if data.get("status") != "OK":
        raise HTTPException(status_code=400, detail=f"Google API error: {data.get('error_message') or data.get('status')}")
    try:
        element = data["rows"][0]["elements"][0]
        distance = element["distance"]["text"]
        duration = element["duration"]["text"]
        return {"distance": distance, "duration": duration}
    except (KeyError, IndexError):
        raise HTTPException(status_code=400, detail="Could not retrieve distance information.")
