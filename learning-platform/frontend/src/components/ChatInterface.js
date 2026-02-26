import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import apiService from '../services/api';

const ChatInterface = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiService.chatWithTutor(userId, input, topic || null);
      const aiMessage = { role: 'assistant', content: response.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topicBar}>
        <input
          type="text"
          placeholder="Topic (optional, e.g., Algebra, Python)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={styles.topicInput}
        />
      </div>

      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <Bot size={64} color="#94a3b8" />
            <h3 style={styles.emptyTitle}>Start a conversation with your AI tutor!</h3>
            <p style={styles.emptyText}>
              Ask questions, request explanations, or get help with problems.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                ...(msg.role === 'user' ? styles.userMessage : styles.aiMessage),
              }}
            >
              <div style={styles.messageIcon}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div style={styles.messageContent}>
                <div style={styles.messageText}>{msg.content}</div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div style={{ ...styles.message, ...styles.aiMessage }}>
            <div style={styles.messageIcon}>
              <Bot size={20} />
            </div>
            <div style={styles.messageContent}>
              <div style={styles.typing}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your question..."
          style={styles.input}
          rows="2"
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} style={styles.sendButton}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  topicBar: {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  topicInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    color: '#64748b',
  },
  emptyTitle: {
    marginTop: '1rem',
    fontSize: '1.25rem',
    color: '#334155',
  },
  emptyText: {
    marginTop: '0.5rem',
    fontSize: '1rem',
  },
  message: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  userMessage: {
    flexDirection: 'row-reverse',
  },
  aiMessage: {
    flexDirection: 'row',
  },
  messageIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    flexShrink: 0,
  },
  messageContent: {
    maxWidth: '70%',
  },
  messageText: {
    padding: '1rem',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  typing: {
    display: 'flex',
    gap: '4px',
    padding: '1rem',
  },
  inputContainer: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#fff',
    borderTop: '1px solid #e2e8f0',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  },
};

export default ChatInterface;