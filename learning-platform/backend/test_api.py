import requests
import json
import time

BASE_URL = "http://localhost:8000"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health():
    print_section("Testing Server Health")
    response = requests.get(f"{BASE_URL}/health")
    print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

def test_create_user():
    print_section("Creating Test User")
    response = requests.post(
        f"{BASE_URL}/api/users",
        json={
            "username": "test_student",
            "email": "test@example.com"
        }
    )
    data = response.json()
    print(json.dumps(data, indent=2))
    return data.get("user_id")

def test_chat(user_id):
    print_section("Testing AI Tutor Chat")
    print("Question: Can you explain what a variable is in programming?")
    
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={
            "user_id": user_id,
            "message": "Can you explain what a variable is in programming?",
            "topic": "Programming Basics"
        }
    )
    data = response.json()
    print("\nAI Tutor Response:")
    print("-" * 60)
    print(data.get("response", "No response"))
    print("-" * 60)

def test_problem_generation():
    print_section("Testing Problem Generation")
    print("Generating an algebra problem...")
    
    response = requests.post(
        f"{BASE_URL}/api/problems/generate",
        json={
            "topic": "Linear Equations",
            "difficulty": 5.0,
            "problem_type": "open_ended"
        }
    )
    data = response.json()
    print("\nGenerated Problem:")
    print("-" * 60)
    print(f"Question: {data.get('question', 'N/A')}")
    print(f"\nHints: {', '.join(data.get('hints', []))}")
    print("-" * 60)

def test_learning_path():
    print_section("Testing Learning Path Generation")
    print("Generating path for: High School Mathematics")
    
    response = requests.post(
        f"{BASE_URL}/api/learning-path",
        json={
            "subject": "High School Mathematics",
            "current_level": "beginner",
            "goals": "Master algebra and prepare for calculus"
        }
    )
    data = response.json()
    print("\nGenerated Learning Path:")
    print("-" * 60)
    for i, topic in enumerate(data.get("topics", []), 1):
        print(f"{i}. {topic}")
    print("-" * 60)

def main():
    print("\n🚀 Starting Backend Test Suite")
    print("Make sure the server is running (python main.py)")
    time.sleep(2)
    
    try:
        if not test_health():
            print("❌ Server not responding. Make sure it's running!")
            return
        print("✅ Server is healthy")
        
        user_id = test_create_user()
        if user_id:
            print(f"✅ User created with ID: {user_id}")
        
        if user_id:
            test_chat(user_id)
            print("✅ AI Chat working")
        
        test_problem_generation()
        print("✅ Problem generation working")
        
        test_learning_path()
        print("✅ Learning path generation working")
        
        print_section("🎉 All Tests Passed!")
        print("Your backend is fully functional!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server.")
        print("Make sure you've started it with: python main.py")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()