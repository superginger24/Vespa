# Stanly Ranch Backend API Specification

This document describes the REST API that the frontend expects from the FastAPI backend.

## Base URL
```
http://localhost:8000/api
```

## Authentication
Currently mock/development only. In production, implement JWT tokens.

## Endpoints

### 1. Guest Search
**Endpoint:** `POST /api/guests/search`

**Query Parameters:**
- `q` (string): Search query (guest name or room number)

**Example Request:**
```bash
curl "http://localhost:8000/api/guests/search?q=John+Smith"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "G001",
    "name": "John Smith",
    "roomNumber": "301",
    "checkInDate": "2024-10-10",
    "checkOutDate": "2024-10-15",
    "activity": ["Dinner at restaurant", "Spa appointment", "Golf course visit"],
    "preferences": ["Non-smoking", "High floor", "King bed"]
  },
  "timestamp": "2024-10-12T22:00:00Z"
}
```

---

### 2. Generate Conversation Starters
**Endpoint:** `POST /api/guests/{guestId}/conversation-starters`

**Path Parameters:**
- `guestId` (string): Guest ID

**Request Body:**
```json
{}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/guests/G001/conversation-starters"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cs1",
      "tip": "How did you enjoy that amazing golf course yesterday? I heard the weather was perfect.",
      "category": "activity",
      "confidence": 0.95,
      "timestamp": "2024-10-12T22:00:00Z"
    },
    {
      "id": "cs2",
      "tip": "I hope you had a wonderful spa experience! Would you like us to book another session?",
      "category": "preferences",
      "confidence": 0.88,
      "timestamp": "2024-10-12T22:00:00Z"
    },
    {
      "id": "cs3",
      "tip": "How was dinner last night? Our chef would love to know if there's anything you'd like for tonight.",
      "category": "dining",
      "confidence": 0.92,
      "timestamp": "2024-10-12T22:00:00Z"
    }
  ],
  "timestamp": "2024-10-12T22:00:00Z"
}
```

**Implementation Notes:**
- Call Claude 3.5 Sonnet with guest activity history
- Return exactly 3 conversation starters
- Confidence scores should reflect AI model certainty (0.0-1.0)
- Categories: `dining`, `activity`, `preferences`, `general`

---

### 3. Save Conversation Note to ALICE
**Endpoint:** `POST /api/guests/{guestId}/notes`

**Path Parameters:**
- `guestId` (string): Guest ID

**Request Body:**
```json
{
  "content": "How did you enjoy that amazing golf course yesterday? I heard the weather was perfect.",
  "type": "conversation_starter",
  "category": "activity"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/guests/G001/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Golf course comment",
    "type": "conversation_starter",
    "category": "activity"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "noteId": "N12345",
    "guestId": "G001",
    "content": "How did you enjoy that amazing golf course yesterday? I heard the weather was perfect.",
    "type": "conversation_starter",
    "category": "activity",
    "savedToALICE": true,
    "timestamp": "2024-10-12T22:00:00Z"
  },
  "timestamp": "2024-10-12T22:00:00Z"
}
```

**Implementation Notes:**
- Validate guestId exists in ALICE
- Post note to ALICE staff notes API
- Save locally to Supabase for audit trail
- Return confirmation once saved to ALICE

---

### 4. Fetch All Tasks
**Endpoint:** `GET /api/tasks`

**Query Parameters:**
- `status` (optional): Filter by status (pending, in-progress, completed)
- `guestId` (optional): Filter by guest ID
- `roomNumber` (optional): Filter by room number

**Example Request:**
```bash
curl "http://localhost:8000/api/tasks?status=pending"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "T001",
      "title": "Room cleaning - 301",
      "description": "Deep clean guest room",
      "guestId": "G001",
      "roomNumber": "301",
      "priority": "high",
      "status": "pending",
      "dueTime": "14:00",
      "createdAt": "2024-10-12T12:00:00Z",
      "updatedAt": "2024-10-12T12:00:00Z"
    },
    {
      "id": "T002",
      "title": "Maintenance check - 502",
      "description": "HVAC inspection",
      "guestId": "G002",
      "roomNumber": "502",
      "priority": "medium",
      "status": "in-progress",
      "dueTime": "15:30",
      "createdAt": "2024-10-12T12:00:00Z",
      "updatedAt": "2024-10-12T13:30:00Z"
    }
  ],
  "timestamp": "2024-10-12T22:00:00Z"
}
```

---

### 5. Update Task Status
**Endpoint:** `PATCH /api/tasks/{taskId}`

**Path Parameters:**
- `taskId` (string): Task ID

**Request Body:**
```json
{
  "status": "in-progress"
}
```

**Example Request:**
```bash
curl -X PATCH "http://localhost:8000/api/tasks/T001" \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "T001",
    "title": "Room cleaning - 301",
    "description": "Deep clean guest room",
    "guestId": "G001",
    "roomNumber": "301",
    "priority": "high",
    "status": "in-progress",
    "dueTime": "14:00",
    "updatedAt": "2024-10-12T13:45:00Z"
  },
  "timestamp": "2024-10-12T22:00:00Z"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Guest not found",
  "timestamp": "2024-10-12T22:00:00Z"
}
```

### Common Error Codes
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized
- `404` - Not Found (guest, task, etc.)
- `500` - Internal Server Error

---

## Data Polling

The frontend polls the following endpoints every 30 seconds:
- `GET /api/tasks` - To refresh task list
- Individual guest updates when actively viewing

Implement caching in the backend to avoid repeated ALICE API calls.

---

## ALICE Integration Notes

### Guest Data Source
Fetch from ALICE `/guests` or `/properties/{propertyId}/guests`

Example ALICE Guest Object:
```json
{
  "id": "guest_123",
  "firstName": "John",
  "lastName": "Smith",
  "roomNumber": "301",
  "reservationId": "res_456",
  "checkInDate": "2024-10-10",
  "checkOutDate": "2024-10-15",
  "notes": [],
  "preferences": ["Non-smoking", "High floor", "King bed"]
}
```

### Activity Source
Combine data from:
- Guest messages (real-time messaging)
- Ticket history (requests, issues)
- Folio transactions (dining, services)
- Staff notes (previous interactions)

### Staff Notes POST
POST to ALICE `/guests/{guestId}/notes` or `/tickets/{ticketId}/notes`:
```json
{
  "content": "Conversation started about golf course visit - guest very satisfied with experience",
  "type": "staff_note",
  "tags": ["conversation_starter", "activity"],
  "timestamp": "2024-10-12T22:00:00Z"
}
```

---

## Claude AI Integration

### Prompt Engineering

Generate conversation starters using this prompt:

```
You are a luxury hotel hospitality AI assistant.
Based on this guest's recent activity and preferences, generate exactly 3 warm, personalized conversation starters.

Guest Name: {guest_name}
Activity: {activity_list}
Preferences: {preference_list}
Stay Duration: {stay_dates}

Requirements:
1. Each starter should be 1-2 sentences
2. Be warm, genuine, and professional
3. Reference specific activities or preferences
4. Vary the category (dining, activity, preferences, general)
5. Return JSON format with confidence scores

Return JSON:
{
  "starters": [
    {
      "tip": "...",
      "category": "activity|dining|preferences|general",
      "confidence": 0.0-1.0
    }
  ]
}
```

### Model Selection
- **Production**: Claude 3.5 Sonnet (best quality)
- **Development/Cost**: Claude 3 Haiku (faster, cheaper)
- **Budget**: GPT-4 mini alternative

---

## Database Schema (Supabase PostgreSQL)

### guests_cache
```sql
CREATE TABLE guests_cache (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  room_number VARCHAR NOT NULL,
  check_in_date DATE,
  check_out_date DATE,
  activity JSONB,
  preferences JSONB,
  last_updated TIMESTAMP DEFAULT NOW(),
  alice_synced BOOLEAN DEFAULT false
);
```

### conversation_starters_cache
```sql
CREATE TABLE conversation_starters_cache (
  id VARCHAR PRIMARY KEY,
  guest_id VARCHAR NOT NULL REFERENCES guests_cache(id),
  tips JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

### task_audit_log
```sql
CREATE TABLE task_audit_log (
  id SERIAL PRIMARY KEY,
  task_id VARCHAR NOT NULL,
  guest_id VARCHAR,
  action VARCHAR NOT NULL,
  status VARCHAR,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## Deployment Checklist

- [ ] ALICE API credentials configured
- [ ] Claude API key secured
- [ ] Supabase connection string configured
- [ ] CORS enabled for frontend origin
- [ ] Rate limiting implemented
- [ ] Error logging configured
- [ ] Database migrations run
- [ ] Environment variables set (.env)
- [ ] Health check endpoint working
- [ ] Deployed to Fly.io or Render

---

## Rate Limiting

Recommended limits:
- Guest search: 30 req/min per IP
- Conversation starters: 10 req/min per user
- Task updates: 60 req/min per user
- General: 100 req/min per IP

---

## Monitoring

Track these metrics:
- Claude API cost per interaction
- ALICE API latency
- Database query performance
- Conversation starter quality scores
- Staff note save success rate

---

**Version:** 1.0  
**Last Updated:** 2024-10-12  
**Maintained By:** Stanly Ranch Dev Team
