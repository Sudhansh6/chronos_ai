from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
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

@app.post("/api/chat/{timeline_id}")
async def chat(
    timeline_id: str,
    message: str = Query(...),
    location: Optional[str] = None
) -> ChatMessage:
    responses = [
        "In this alternate timeline, things developed quite differently...",
        "The changes you're asking about had far-reaching consequences...",
        "That's an interesting question about this timeline...",
        "The historical divergence led to unexpected developments here..."
    ]
    
    context = f" in {location}" if location else ""
    return ChatMessage(
        role="assistant",
        content=f"{random.choice(responses)} The effects{context} were profound."
    )

@app.get("/api/suggestions")
async def get_suggestions(query: str = "") -> List[str]:
    suggestions = [
        "What if the Industrial Revolution happened earlier?",
        "What if the Renaissance spread to different regions?",
        "What if ancient civilizations had modern technology?",
        "What if different trade routes dominated history?",
        "What if key historical figures made different choices?"
    ]
    
    if query:
        return [s for s in suggestions if query.lower() in s.lower()]
    return random.sample(suggestions, 3)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

