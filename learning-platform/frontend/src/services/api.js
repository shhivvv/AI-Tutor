import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // User operations
  createUser: async (username, email) => {
    const response = await api.post('/api/users', { username, email });
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  getUserProgress: async (userId) => {
    const response = await api.get(`/api/users/${userId}/progress`);
    return response.data;
  },

  // Chat with AI tutor
  chatWithTutor: async (userId, message, topic = null) => {
    const response = await api.post('/api/chat', {
      user_id: userId,
      message,
      topic,
    });
    return response.data;
  },

  // Problem generation
  generateProblem: async (topic, difficulty = 5.0, problemType = 'open_ended') => {
    const response = await api.post('/api/problems/generate', {
      topic,
      difficulty,
      problem_type: problemType,
    });
    return response.data;
  },

  // Submit answer
  submitAnswer: async (userId, problemId, answer) => {
    const response = await api.post('/api/problems/submit', {
      user_id: userId,
      problem_id: problemId,
      answer,
    });
    return response.data;
  },

  // Learning path
  generateLearningPath: async (subject, currentLevel = 'beginner', goals = '') => {
    const response = await api.post('/api/learning-path', {
      subject,
      current_level: currentLevel,
      goals,
    });
    return response.data;
  },
};

export default apiService;