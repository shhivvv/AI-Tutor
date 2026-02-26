# AI Learning Platform

A full-stack personalized learning platform powered by a Groq-hosted LLM (llama-3.3-70b-versatile). Students can chat with an AI tutor using the Socratic method, generate adaptive practice problems, submit answers for AI grading, and track progress on a dashboard.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React (Create React App) |
| Backend | FastAPI + Python 3.13 |
| Database | PostgreSQL via [Neon](https://neon.tech) (async, asyncpg) |
| AI | [Groq API](https://console.groq.com) — `llama-3.3-70b-versatile` |

## Features

- **AI Tutor Chat** — Socratic-method responses, conversation history per user
- **Practice Problem Generator** — Generate problems by topic, difficulty (1–10), and type (open-ended, MCQ, coding)
- **AI Answer Assessment** — Instant grading with score (0–100) and detailed feedback
- **Progress Dashboard** — Tracks mastery level, accuracy, and problems attempted per topic
- **Learning Path Generator** — Generates a personalized topic roadmap for any subject

## Project Structure

```
learning-platform/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── models.py        # SQLAlchemy ORM models
│   ├── database.py      # Async engine + session setup
│   ├── ai_tutor.py      # Groq API wrapper
│   ├── requirements.txt
│   └── .env.example     # Environment variable template
└── frontend/
    └── src/
        ├── components/  # ChatInterface, Dashboard, ProblemGenerator, etc.
        ├── pages/       # Home, TutorPage, DashboardPage, PracticePage
        └── services/
            └── api.js   # Axios API client
```

## Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- A [Neon](https://neon.tech) (or any PostgreSQL) database
- A [Groq](https://console.groq.com) API key

### Backend

```bash
cd learning-platform/backend
pip install -r requirements.txt

# Copy and fill in your credentials
cp .env.example .env

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd learning-platform/frontend
npm install
npm start
```

App runs at **http://localhost:3000**, API at **http://localhost:8000**.

## Environment Variables

See `learning-platform/backend/.env.example`:

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
GROQ_API_KEY=gsk_your_key_here
DEBUG=False
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/users` | Create user |
| GET | `/api/users/{id}` | Get user |
| GET | `/api/users/{id}/progress` | Get learning progress |
| POST | `/api/chat` | Chat with AI tutor |
| POST | `/api/problems/generate` | Generate a practice problem |
| POST | `/api/problems/assess-direct` | Submit answer + update progress |
| POST | `/api/learning-path` | Generate a learning path |

## First-time User Setup

The frontend uses a hardcoded `userId = 1`. Create the user once:

```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "student", "email": "student@example.com"}'
```
