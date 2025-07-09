from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import *

from api import events_api, user_api, distance_api # import your router modules here



app = FastAPI(
    title="Event Management API",
    description="API for managing events and user participation.",
    version="1.0.0"
)

# CORS middleware if your frontend is separate (e.g., React, Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers here
app.include_router(events_api.router, prefix="/api")
app.include_router(user_api.router, prefix="/api")
# app.include_router(user.router, prefix="/api")
# app.include_router(auth.router, prefix="/api")
app.include_router(distance_api.router, prefix = "/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Event Management API"}
