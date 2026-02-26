import React from 'react';
import ChatInterface from '../components/ChatInterface';

const TutorPage = () => {
  const userId = 1; // In a real app, this would come from authentication

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Tutor</h1>
        <p style={styles.description}>
          Ask questions, get explanations, and learn with the Socratic method
        </p>
      </div>
      <ChatInterface userId={userId} />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '1.1rem',
    color: '#64748b',
  },
};

export default TutorPage;