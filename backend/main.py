from fastapi import FastAPI, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
import random
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data structures
class TimelineResponse(BaseModel):
    id: str
    summary: str
    details: Dict[str, str]
    affected_regions: List[str]

class ChatMessage(BaseModel):
    role: str
    content: str

class LocationInfo(BaseModel):
    name: str
    description: str
    significance: str

class ChatRequest(BaseModel):
    message: str
    region: Optional[str] = None
    timeline: Dict[str, Any]

MOCK_TIMELINE_DETAILS = {
    "Overview": {
        "Ancient": "The world took a drastically different path...",
        "Medieval": "Civilizations evolved in unexpected ways...",
        "Modern": "Technology developed along alternative lines..."
    },
    "Religion": {
        "Ancient": "Different belief systems emerged...",
        "Medieval": "Religious power structures shifted...",
        "Modern": "New spiritual movements gained prominence..."
    },
    "Economy": {
        "Ancient": "Trade routes developed differently...",
        "Medieval": "Different resources became valuable...",
        "Modern": "Alternative economic systems emerged..."
    },
    "Population": {
        "Ancient": "Settlement patterns changed...",
        "Medieval": "Demographics shifted unexpectedly...",
        "Modern": "Population centers moved..."
    },
    "Myths": {
        "Ancient": "New legends were born...",
        "Medieval": "Different heroes emerged...",
        "Modern": "Alternative stories shaped culture..."
    },
    "Upcoming Events": {
        "Near Future": "Immediate changes are occurring...",
        "Mid Future": "Society is adapting...",
        "Far Future": "Long-term effects are emerging..."
    },
    "Geopolitics": {
        "Ancient": "Power structures formed differently...",
        "Medieval": "Alliances shifted unexpectedly...",
        "Modern": "New political systems emerged..."
    },
    "Environment": {
        "Ancient": "Climate patterns changed...",
        "Medieval": "Ecosystems evolved differently...",
        "Modern": "Environmental challenges shifted..."
    }
}

@app.get("/api/timeline/{timeline_id}")
async def get_timeline(
    timeline_id: str,
    category: str = Query("Overview"),
    year: Optional[int] = None
) -> Dict:
    era = "Modern"
    if year:
        if year < 500: era = "Ancient"
        elif year < 1500: era = "Medieval"
    
    return {
        "content": MOCK_TIMELINE_DETAILS[category][era],
        "era": era,
        "year": year
    }

@app.get("/api/location/{timeline_id}")
async def get_location_info(
    timeline_id: str,
    lat: float = Query(...),
    lng: float = Query(...)
) -> LocationInfo:
    # Mock location-specific information
    return LocationInfo(
        name=f"Location at {lat:.2f}, {lng:.2f}",
        description="This region experienced significant changes in the alternate timeline.",
        significance="Major historical events diverged here."
    )

@app.post("/api/chat")
async def chat_endpoint(
    request: ChatRequest = Body(...)
) -> Dict:
    # Implementation logic here
    return {
        "role": "assistant",
        "content": f"Response to {request.message} about {request.region or 'global'}"
    }

@app.get("/api/timeline/{year}")
async def get_timeline_data(
    year: int,
    query: str = Query(...),
    region: Optional[str] = None
) -> Dict:
    # Implementation logic here
    return {
        "content": MOCK_TIMELINE_DETAILS,
        "totalScore": 42  # Calculate actual score
    }

@app.get("/api/suggestions")
async def get_suggestions(
    query: str = Query(...)
) -> Dict[str, List[str]]:
    # Keep existing logic but wrap in dict
    return {
        "suggestions": [
            "What if the Industrial Revolution happened earlier?",
            "What if the Renaissance spread to different regions?",
            # ... other suggestions
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

