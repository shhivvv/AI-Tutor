import requests
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

# Groq API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_BASE_URL = "https://api.groq.com/openai/v1"
AI_MODEL = "llama-3.3-70b-versatile"  # Groq model


class AITutor:
    """AI Tutor service using Groq API"""

    def __init__(self):
        self.base_url = GROQ_BASE_URL
        self.api_key = GROQ_API_KEY
        self.model = AI_MODEL
    
    def generate_response(self, prompt: str, system_prompt: str = None) -> str:
        """Generate AI response using Groq API"""
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.9,
                    "top_p": 0.95,
                    "max_tokens": 800
                },
                timeout=180
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except requests.exceptions.Timeout:
            return "The AI is taking too long to respond. Please try a simpler question."
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"
    
    def tutor_chat(self, student_question: str, topic: str = None, conversation_history: list = None) -> str:
        """Respond to student questions using Socratic method"""
        
        system_prompt = """You are an expert tutor. Your goal is to help students learn by:
1. Not giving direct answers immediately
2. Asking guiding questions to help them think
3. Breaking down complex problems into smaller steps
4. Encouraging them when they make progress
5. Providing hints when they're stuck
6. Being patient and supportive

Use the Socratic method to guide learning."""

        context = ""
        if topic:
            context = f"\n\nCurrent topic: {topic}"
        
        if conversation_history:
            history = "\n".join([f"Student: {h['question']}\nTutor: {h['answer']}" 
                                for h in conversation_history[-3:]])
            context += f"\n\nRecent conversation:\n{history}"
        
        prompt = f"{context}\n\nStudent's question: {student_question}\n\nYour response:"
        
        return self.generate_response(prompt, system_prompt)
    
    def generate_practice_problem(self, topic: str, difficulty: float = 5.0, problem_type: str = "open_ended") -> dict:
        """Generate a practice problem for a given topic"""
        
        difficulty_map = {
            (0, 3): "easy",
            (3, 7): "medium", 
            (7, 11): "hard"
        }
        
        difficulty_level = next(level for (low, high), level in difficulty_map.items() 
                               if low <= difficulty < high)
        
        system_prompt = f"""You are a problem generator. Create a {difficulty_level} difficulty practice problem about {topic}.

Format your response EXACTLY as follows:
QUESTION: [The problem statement here]
SOLUTION: [Step-by-step solution]
HINTS: [2-3 helpful hints, separated by semicolons]"""

        prompt = f"Generate a {problem_type} problem about {topic} at {difficulty_level} difficulty level."
        
        response = self.generate_response(prompt, system_prompt)
        
        try:
            parts = response.split("SOLUTION:")
            question = parts[0].replace("QUESTION:", "").strip()
            
            solution_and_hints = parts[1].split("HINTS:")
            solution = solution_and_hints[0].strip()
            hints = solution_and_hints[1].strip() if len(solution_and_hints) > 1 else ""
            
            return {
                "question": question,
                "solution": solution,
                "hints": hints.split(";") if hints else []
            }
        except:
            return {
                "question": response,
                "solution": "Solution generation failed",
                "hints": []
            }
    
    def assess_answer(self, question: str, student_answer: str, correct_solution: str) -> dict:
        """Assess a student's answer and provide feedback"""
        
        system_prompt = """You are an expert grader. Evaluate the student's answer and provide constructive feedback.

Format your response EXACTLY as:
CORRECT: [Yes/No/Partial]
SCORE: [0-100]
FEEDBACK: [Detailed feedback on what was right/wrong and how to improve]"""

        prompt = f"""Question: {question}

Correct Solution: {correct_solution}

Student's Answer: {student_answer}

Evaluate the student's answer."""

        response = self.generate_response(prompt, system_prompt)
        
        try:
            lines = response.split("\n")
            is_correct = "Yes" in [l for l in lines if l.startswith("CORRECT:")][0]
            score = int([l.split(":")[1].strip() for l in lines if l.startswith("SCORE:")][0])
            feedback = response.split("FEEDBACK:")[1].strip()
            
            return {
                "is_correct": is_correct,
                "score": score,
                "feedback": feedback
            }
        except:
            return {
                "is_correct": False,
                "score": 0,
                "feedback": response
            }
    
    def generate_learning_path(self, subject: str, current_level: str = "beginner", goals: str = "") -> list:
        """Generate a personalized learning path"""
        
        system_prompt = """You are a curriculum designer. Create a logical learning path.

Format your response as a numbered list of topics in learning order."""

        prompt = f"""Create a learning path for {subject}.
Current level: {current_level}
Goals: {goals if goals else 'General mastery'}

List the topics in order from foundational to advanced."""

        response = self.generate_response(prompt, system_prompt)
        
        topics = []
        for line in response.split("\n"):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith("-")):
                topic = line.lstrip("0123456789.-) ").strip()
                if topic:
                    topics.append(topic)
        
        return topics


ai_tutor = AITutor()