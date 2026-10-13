# Backend Setup Guide - Stanly Ranch API

Complete guide to build the FastAPI backend that powers the mobile app.

## Project Setup

### Create Project Structure
```bash
mkdir stanly-ranch-api
cd stanly-ranch-api

# Create virtual environment
python -m venv venv

# Activate venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Create requirements.txt
touch requirements.txt
```

### Install Dependencies
```bash
pip install fastapi uvicorn python-dotenv httpx anthropic supabase
```

### requirements.txt
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
httpx==0.25.0
anthropic==0.7.0
supabase==2.3.5
pydantic==2.4.2
python-multipart==0.0.6
pydantic-settings==2.0.3
```

---

## Project Structure

```
stanly-ranch-api/
├── main.py                 # FastAPI app entry point
├── config.py              # Configuration & environment
├── alice_client.py        # ALICE PMS integration
├── claude_client.py       # Claude AI integration
├── supabase_client.py     # Supabase database
├── schemas.py             # Pydantic request/response models
├── routers/
│   ├── guests.py          # Guest endpoints
│   ├── tasks.py           # Task endpoints
│   └── health.py          # Health check
├── models/
│   ├── guest.py
│   ├── task.py
│   └── note.py
├── utils/
│   ├── cache.py           # In-memory cache
│   └── logging.py         # Logging setup
├── requirements.txt
├── .env
├── .env.example
└── README.md
```

---

## Core Implementation

### 1. main.py - FastAPI Application

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import logging

from routers import guests, tasks, health
from utils.cache import cache_manager

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Background tasks
async def startup():
    """Initialize cache and connections on startup"""
    logger.info("Starting Stanly Ranch API...")
    cache_manager.start_polling()

async def shutdown():
    """Cleanup on shutdown"""
    logger.info("Shutting down Stanly Ranch API...")
    cache_manager.stop_polling()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown"""
    await startup()
    yield
    await shutdown()

# Create FastAPI app
app = FastAPI(
    title="Stanly Ranch API",
    description="AI-powered guest memory system for luxury hotels",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://stanly-ranch-mobile.fly.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(guests.router, prefix="/api/guests", tags=["guests"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Stanly Ranch API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
```

---

### 2. config.py - Configuration

```python
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # ALICE PMS Configuration
    ALICE_API_URL: str = os.getenv("ALICE_API_URL", "https://aliceapp.com/api")
    ALICE_API_KEY: str = os.getenv("ALICE_API_KEY", "")
    ALICE_PROPERTY_ID: str = os.getenv("ALICE_PROPERTY_ID", "")
    
    # Claude API Configuration
    CLAUDE_API_KEY: str = os.getenv("CLAUDE_API_KEY", "")
    CLAUDE_MODEL: str = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # App Configuration
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # Cache Configuration
    CACHE_TTL: int = 1800  # 30 minutes
    CACHE_POLL_INTERVAL: int = 30  # 30 seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

---

### 3. alice_client.py - ALICE Integration

```python
import httpx
import logging
from config import settings
from typing import Optional, Dict, List, Any

logger = logging.getLogger(__name__)

class ALICEClient:
    """Client for ALICE PMS API"""
    
    def __init__(self):
        self.base_url = settings.ALICE_API_URL
        self.api_key = settings.ALICE_API_KEY
        self.property_id = settings.ALICE_PROPERTY_ID
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def search_guests(self, query: str) -> List[Dict[str, Any]]:
        """Search guests by name or room number"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/properties/{self.property_id}/guests/search",
                    params={"q": query},
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json().get("data", [])
        except Exception as e:
            logger.error(f"Error searching guests: {e}")
            return []
    
    async def get_guest(self, guest_id: str) -> Optional[Dict[str, Any]]:
        """Fetch individual guest details"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/properties/{self.property_id}/guests/{guest_id}",
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json().get("data")
        except Exception as e:
            logger.error(f"Error fetching guest {guest_id}: {e}")
            return None
    
    async def get_guest_activity(self, guest_id: str) -> List[Dict[str, Any]]:
        """Fetch guest activity history (dining, services, messages)"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/guests/{guest_id}/activity",
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json().get("data", [])
        except Exception as e:
            logger.error(f"Error fetching activity for {guest_id}: {e}")
            return []
    
    async def add_staff_note(self, guest_id: str, note_content: str, tags: List[str] = None) -> bool:
        """Add staff note to guest record in ALICE"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/guests/{guest_id}/notes",
                    json={
                        "content": note_content,
                        "type": "staff_note",
                        "tags": tags or [],
                        "timestamp": "now()"
                    },
                    headers=self.headers
                )
                response.raise_for_status()
                return True
        except Exception as e:
            logger.error(f"Error adding note for {guest_id}: {e}")
            return False
    
    async def get_tasks(self, room_number: Optional[str] = None) -> List[Dict[str, Any]]:
        """Fetch tasks for property"""
        try:
            async with httpx.AsyncClient() as client:
                params = {"propertyId": self.property_id}
                if room_number:
                    params["roomNumber"] = room_number
                
                response = await client.get(
                    f"{self.base_url}/tasks",
                    params=params,
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json().get("data", [])
        except Exception as e:
            logger.error(f"Error fetching tasks: {e}")
            return []

alice_client = ALICEClient()
```

---

### 4. claude_client.py - Claude AI Integration

```python
import logging
from anthropic import Anthropic
from config import settings
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class ClaudeClient:
    """Client for Claude AI"""
    
    def __init__(self):
        self.client = Anthropic(api_key=settings.CLAUDE_API_KEY)
        self.model = settings.CLAUDE_MODEL
    
    async def generate_conversation_starters(
        self,
        guest_name: str,
        activities: List[str],
        preferences: List[str],
        check_in: str,
        check_out: str
    ) -> List[Dict[str, Any]]:
        """Generate 3 personalized conversation starters using Claude"""
        
        # Format activity and preference lists
        activity_text = "\n".join(f"- {a}" for a in activities) if activities else "No recent activities"
        preference_text = "\n".join(f"- {p}" for p in preferences) if preferences else "No stated preferences"
        
        prompt = f"""You are a luxury hotel hospitality AI assistant. Generate exactly 3 warm, personalized conversation starters for a guest.

Guest Name: {guest_name}
Check-in: {check_in}
Check-out: {check_out}

Recent Activities:
{activity_text}

Guest Preferences:
{preference_text}

Generate 3 different conversation starters:
1. Each should be 1-2 sentences, warm and professional
2. Reference specific activities or preferences from above
3. Vary the category between: dining, activity, preferences, general
4. Include a confidence score (0.0-1.0) for relevance

Return ONLY valid JSON (no markdown, no extra text):
{{
  "starters": [
    {{"tip": "...", "category": "activity", "confidence": 0.95}},
    {{"tip": "...", "category": "dining", "confidence": 0.88}},
    {{"tip": "...", "category": "preferences", "confidence": 0.92}}
  ]
}}"""
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Parse response
            content = response.content[0].text
            
            # Handle markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            import json
            data = json.loads(content)
            
            return data.get("starters", [])
        
        except Exception as e:
            logger.error(f"Error generating conversation starters: {e}")
            return []

claude_client = ClaudeClient()
```

---

### 5. routers/guests.py - Guest Endpoints

```python
from fastapi import APIRouter, Query, HTTPException, BackgroundTasks
from typing import Optional, List
import logging
from datetime import datetime

from alice_client import alice_client
from claude_client import claude_client
from supabase_client import supabase_client
from schemas import GuestResponse, ConversationStarterResponse, NoteRequest

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/search")
async def search_guests(q: str = Query(...)):
    """Search guests by name or room number"""
    
    # Search in ALICE
    results = await alice_client.search_guests(q)
    
    if not results:
        return {
            "success": False,
            "error": "No guests found",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    guest = results[0]  # Return first match
    
    return {
        "success": True,
        "data": {
            "id": guest.get("id"),
            "name": f"{guest.get('firstName')} {guest.get('lastName')}",
            "roomNumber": guest.get("roomNumber"),
            "checkInDate": guest.get("checkInDate"),
            "checkOutDate": guest.get("checkOutDate"),
            "activity": guest.get("activity", []),
            "preferences": guest.get("preferences", [])
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@router.post("/{guest_id}/conversation-starters")
async def generate_starters(guest_id: str):
    """Generate AI conversation starters for a guest"""
    
    # Fetch guest from ALICE
    guest = await alice_client.get_guest(guest_id)
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    # Fetch activity
    activity = await alice_client.get_guest_activity(guest_id)
    activity_text = [f"{a.get('type')}: {a.get('description')}" for a in activity[:10]]
    
    # Generate starters with Claude
    starters = await claude_client.generate_conversation_starters(
        guest_name=f"{guest.get('firstName')} {guest.get('lastName')}",
        activities=activity_text,
        preferences=guest.get("preferences", []),
        check_in=guest.get("checkInDate"),
        check_out=guest.get("checkOutDate")
    )
    
    # Cache starters
    await supabase_client.cache_conversation_starters(guest_id, starters)
    
    # Format response with IDs
    formatted_starters = [
        {
            "id": f"cs_{guest_id}_{i}",
            "tip": s["tip"],
            "category": s["category"],
            "confidence": s["confidence"],
            "timestamp": datetime.utcnow().isoformat()
        }
        for i, s in enumerate(starters)
    ]
    
    return {
        "success": True,
        "data": formatted_starters,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.post("/{guest_id}/notes")
async def save_note(guest_id: str, note: NoteRequest, background_tasks: BackgroundTasks):
    """Save conversation starter as staff note to ALICE"""
    
    # Save to ALICE
    success = await alice_client.add_staff_note(
        guest_id,
        note.content,
        ["conversation_starter", note.category]
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save note")
    
    # Log to audit trail
    background_tasks.add_task(
        supabase_client.log_note_saved,
        guest_id=guest_id,
        content=note.content,
        category=note.category
    )
    
    return {
        "success": True,
        "data": {
            "guestId": guest_id,
            "content": note.content,
            "type": "conversation_starter",
            "category": note.category,
            "savedToALICE": True,
            "timestamp": datetime.utcnow().isoformat()
        },
        "timestamp": datetime.utcnow().isoformat()
    }
```

---

### 6. routers/tasks.py - Task Endpoints

```python
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from datetime import datetime

from alice_client import alice_client

router = APIRouter()

@router.get("")
async def get_tasks(status: Optional[str] = Query(None)):
    """Fetch all tasks, optionally filtered by status"""
    
    tasks = await alice_client.get_tasks()
    
    # Filter by status if provided
    if status:
        tasks = [t for t in tasks if t.get("status") == status]
    
    formatted_tasks = [
        {
            "id": t.get("id"),
            "title": t.get("title"),
            "description": t.get("description"),
            "guestId": t.get("guestId"),
            "roomNumber": t.get("roomNumber"),
            "priority": t.get("priority", "medium"),
            "status": t.get("status", "pending"),
            "dueTime": t.get("dueTime"),
            "createdAt": t.get("createdAt"),
            "updatedAt": t.get("updatedAt")
        }
        for t in tasks
    ]
    
    return {
        "success": True,
        "data": formatted_tasks,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.patch("/{task_id}")
async def update_task(task_id: str, status: str):
    """Update task status"""
    
    # Update in ALICE (implement based on ALICE API)
    # For now, return success
    
    return {
        "success": True,
        "data": {
            "id": task_id,
            "status": status,
            "updatedAt": datetime.utcnow().isoformat()
        },
        "timestamp": datetime.utcnow().isoformat()
    }
```

---

### 7. routers/health.py - Health Check

```python
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "stanly-ranch-api"
    }
```

---

## Environment Setup

### .env.example
```
# ALICE PMS
ALICE_API_URL=https://aliceapp.com/api
ALICE_API_KEY=your_alice_api_key_here
ALICE_PROPERTY_ID=your_property_id_here

# Claude AI
CLAUDE_API_KEY=sk-your-claude-key-here
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key_here

# App
ENVIRONMENT=development
DEBUG=true
```

### .env (local)
```
Copy .env.example to .env and fill in your credentials
```

---

## Running the Backend

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run development server
python main.py

# API will be available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

---

## Testing Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Search guests
curl "http://localhost:8000/api/guests/search?q=John+Smith"

# Generate conversation starters
curl -X POST "http://localhost:8000/api/guests/G001/conversation-starters"

# Get tasks
curl "http://localhost:8000/api/tasks"

# Update task
curl -X PATCH "http://localhost:8000/api/tasks/T001" \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

---

## Production Deployment

### Using Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Create Fly app
flyctl launch

# Set secrets
flyctl secrets set ALICE_API_KEY=xxx
flyctl secrets set CLAUDE_API_KEY=xxx
flyctl secrets set SUPABASE_KEY=xxx

# Deploy
flyctl deploy
```

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

**Version:** 1.0  
**Last Updated:** 2024-10-12  
**Maintained By:** Stanly Ranch Dev Team
