from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    progress = relationship("Progress", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")


class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    subject = Column(String)
    difficulty_level = Column(String)
    description = Column(Text)
    
    topics = relationship("Topic", back_populates="course")


class Topic(Base):
    __tablename__ = "topics"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    order = Column(Integer)
    prerequisites = Column(Text)
    description = Column(Text)
    
    course = relationship("Course", back_populates="topics")
    problems = relationship("Problem", back_populates="topic")


class Problem(Base):
    __tablename__ = "problems"
    
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    question = Column(Text)
    difficulty = Column(Float)
    problem_type = Column(String)
    solution = Column(Text)
    hints = Column(Text)
    
    topic = relationship("Topic", back_populates="problems")


class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    topic_name = Column(String, nullable=True)  # free-form topic name for on-the-fly problems
    mastery_level = Column(Float, default=0.0)
    problems_attempted = Column(Integer, default=0)
    problems_correct = Column(Integer, default=0)
    last_practiced = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="progress")


class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    message = Column(Text)
    response = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="conversations")