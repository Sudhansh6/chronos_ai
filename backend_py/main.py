from fastapi import FastAPI, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
import random
from datetime import datetime
from mockdata import MOCK_DATA, MOCK_DATA2
from backend_main import BackendMain

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

backend = BackendMain()

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

class TimelineQuery(BaseModel):
    year: int
    query: str
    region: Optional[str] = None

class TabContent(BaseModel):
    text: str
    score: int

class TimelineDataResponse(BaseModel):
    content: Dict[str, TabContent]
    totalScore: float

class ChatRequest(BaseModel):
    message: str
    timeline: TimelineQuery

res = {}
@app.get("/api/timeline/{year}", response_model=Dict)
async def get_timeline_data(
    year: int,
    query: str = Query(...)
):
    if res.get((year, query), None):
        print("Sending from cache")
        return res[(year, query)]
    # data = backend.simulate_year(year=year, user_decision=query)
    # print("returning", data)
    # return data 
    return MOCK_DATA2

@app.post("/api/chat")
async def chat_endpoint(
    request: ChatRequest = Body(...)
) -> ChatMessage:
    # Generate context-aware response
    response_text = f"In {request.timeline.year}, {request.timeline.region or 'globally'}: " \
                    f"{request.message} led to {random.choice(['unexpected consequences', 'new discoveries', 'cultural shifts'])}. " \
                    f"Score impact: {random.randint(10, 95)}"
    
    return ChatMessage(
        role="assistant",
        content=response_text
    )

@app.get("/api/suggestions")
async def get_suggestions(
    query: str = Query(...)
) -> Dict[str, List[str]]:
    suggestions = [
        "What if the Industrial Revolution happened earlier?",
        "What if the Renaissance spread to different regions?",
        "What if ancient civilizations had modern technology?",
        "What if different trade routes dominated history?",
        "What if key historical figures made different choices?"
    ]
    
    filtered = [s for s in suggestions if query.lower() in s.lower()] if query else suggestions
    return {"suggestions": filtered}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

