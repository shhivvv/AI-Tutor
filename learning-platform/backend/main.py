from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from pydantic import BaseModel
from typing import Optional
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv
import asyncio
import uvicorn
import os

load_dotenv(Path(__file__).parent / ".env")

from database import get_db, init_db
from models import User, Course, Topic, Problem, Progress, Conversation
from ai_tutor import ai_tutor


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    # Add topic_name column if it doesn't exist (migration for existing DBs)
    from database import engine
    async with engine.begin() as conn:
        await conn.execute(text(
            "ALTER TABLE progress ADD COLUMN IF NOT EXISTS topic_name VARCHAR;"
        ))
    print("✅ Database initialized")
    print("✅ Server ready!")
    yield


app = FastAPI(title="Personalized Learning Platform API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    username: str
    email: str

class ChatRequest(BaseModel):
    user_id: int
    message: str
    topic: Optional[str] = None

class ProblemGenerateRequest(BaseModel):
    topic: str
    difficulty: float = 5.0
    problem_type: str = "open_ended"

class AnswerSubmitRequest(BaseModel):
    user_id: int
    problem_id: int
    answer: str

class LearningPathRequest(BaseModel):
    subject: str
    current_level: str = "beginner"
    goals: Optional[str] = ""

class DirectAssessRequest(BaseModel):
    user_id: int
    topic_name: str
    question: str
    answer: str
    solution: str



@app.get("/")
async def root():
    return {
        "message": "Welcome to Personalized Learning Platform API",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "users": "/api/users",
            "chat": "/api/chat",
            "problems": "/api/problems",
            "learning-path": "/api/learning-path"
        }
    }


@app.get("/health")
async def health_check():
    groq_key = os.getenv("GROQ_API_KEY")
    return {
        "status": "healthy",
        "database": "connected",
        "ai_service": "connected" if groq_key else "missing key",
    }


@app.post("/api/users")
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    new_user = User(username=user.username, email=user.email)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"user_id": new_user.id, "username": new_user.username}


@app.get("/api/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at
    }


@app.post("/api/chat")
async def chat_with_tutor(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == request.user_id)
        .order_by(Conversation.timestamp.desc())
        .limit(3)
    )
    recent_conversations = result.scalars().all()
    
    history = [
        {"question": conv.message, "answer": conv.response}
        for conv in reversed(recent_conversations)
    ]
    
    response = await asyncio.to_thread(
        ai_tutor.tutor_chat,
        student_question=request.message,
        topic=request.topic,
        conversation_history=history
    )
    
    conversation = Conversation(
        user_id=request.user_id,
        message=request.message,
        response=response,
        topic_id=None
    )
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)  # Fix: populate conversation.id after commit
    
    return {
        "response": response,
        "conversation_id": conversation.id
    }


@app.post("/api/problems/generate")
async def generate_problem(request: ProblemGenerateRequest, db: AsyncSession = Depends(get_db)):
    problem_data = await asyncio.to_thread(
        ai_tutor.generate_practice_problem,
        topic=request.topic,
        difficulty=request.difficulty,
        problem_type=request.problem_type
    )
    
    return {
        "question": problem_data["question"],
        "hints": problem_data["hints"],
        "topic": request.topic,
        "difficulty": request.difficulty
    }


@app.post("/api/problems/submit")
async def submit_answer(request: AnswerSubmitRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Problem).where(Problem.id == request.problem_id))
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    assessment = await asyncio.to_thread(
        ai_tutor.assess_answer,
        question=problem.question,
        student_answer=request.answer,
        correct_solution=problem.solution
    )
    
    result = await db.execute(
        select(Progress).where(
            Progress.user_id == request.user_id,
            Progress.topic_id == problem.topic_id
        )
    )
    progress = result.scalar_one_or_none()
    
    if progress:
        progress.problems_attempted += 1
        if assessment["is_correct"]:
            progress.problems_correct += 1
        progress.mastery_level = progress.problems_correct / progress.problems_attempted
    else:
        # First attempt for this topic — create a new progress record
        is_correct = assessment["is_correct"]
        progress = Progress(
            user_id=request.user_id,
            topic_id=problem.topic_id,
            problems_attempted=1,
            problems_correct=1 if is_correct else 0,
            mastery_level=1.0 if is_correct else 0.0,
        )
        db.add(progress)

    await db.commit()
    
    return {
        "assessment": assessment,
        "progress_updated": True
    }


@app.post("/api/problems/assess-direct")
async def assess_direct(request: DirectAssessRequest, db: AsyncSession = Depends(get_db)):
    """Assess an on-the-fly problem (no saved Problem row) and track progress by topic name."""
    assessment = await asyncio.to_thread(
        ai_tutor.assess_answer,
        question=request.question,
        student_answer=request.answer,
        correct_solution=request.solution
    )

    # Find existing progress record by user + topic_name
    result = await db.execute(
        select(Progress).where(
            Progress.user_id == request.user_id,
            Progress.topic_name == request.topic_name
        )
    )
    progress = result.scalar_one_or_none()

    if progress:
        progress.problems_attempted += 1
        if assessment["is_correct"]:
            progress.problems_correct += 1
        progress.mastery_level = progress.problems_correct / progress.problems_attempted
    else:
        is_correct = assessment["is_correct"]
        progress = Progress(
            user_id=request.user_id,
            topic_id=None,
            topic_name=request.topic_name,
            problems_attempted=1,
            problems_correct=1 if is_correct else 0,
            mastery_level=1.0 if is_correct else 0.0,
        )
        db.add(progress)

    await db.commit()

    return {"assessment": assessment}


@app.post("/api/learning-path")
async def generate_learning_path(request: LearningPathRequest):
    topics = await asyncio.to_thread(
        ai_tutor.generate_learning_path,
        subject=request.subject,
        current_level=request.current_level,
        goals=request.goals
    )
    
    return {
        "subject": request.subject,
        "level": request.current_level,
        "topics": topics,
        "total_topics": len(topics)
    }


@app.get("/api/users/{user_id}/progress")
async def get_user_progress(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Progress).where(Progress.user_id == user_id)
    )
    progress_records = result.scalars().all()
    
    return {
        "user_id": user_id,
        "topics_in_progress": len(progress_records),
        "progress": [
            {
                "topic_id": p.topic_id,
                "topic_name": p.topic_name or (f"Topic {p.topic_id}" if p.topic_id else "Unknown"),
                "mastery_level": p.mastery_level,
                "problems_attempted": p.problems_attempted,
                "problems_correct": p.problems_correct,
                "accuracy": (p.problems_correct / p.problems_attempted * 100) if p.problems_attempted > 0 else 0
            }
            for p in progress_records
        ]
    }


if __name__ == "__main__":
    print("🚀 Starting Personalized Learning Platform API...")
    print("🤖 AI Model in use: llama-3.3-70b-versatile (Groq API)")
    print("=" * 50)
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
