import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ListChecks, BarChart3, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>
          Welcome to AI Learning Platform
        </h1>
        <p style={styles.subtitle}>
          Personalized education powered by artificial intelligence
        </p>
        <div style={styles.features}>
          <div style={styles.feature}>
            <Sparkles size={24} color="#4f46e5" />
            <span>AI-Powered Tutoring</span>
          </div>
          <div style={styles.feature}>
            <ListChecks size={24} color="#4f46e5" />
            <span>Adaptive Problems</span>
          </div>
          <div style={styles.feature}>
            <BarChart3 size={24} color="#4f46e5" />
            <span>Track Progress</span>
          </div>
        </div>
      </div>

      <div style={styles.cardsGrid}>
        <div style={styles.card} onClick={() => navigate('/tutor')}>
          <div style={{...styles.cardIcon, backgroundColor: '#dbeafe'}}>
            <MessageSquare size={32} color="#1e40af" />
          </div>
          <h3 style={styles.cardTitle}>AI Tutor</h3>
          <p style={styles.cardDescription}>
            Get personalized help from your AI tutor. Ask questions, get explanations, and learn at your own pace.
          </p>
          <button style={styles.cardButton}>Start Learning →</button>
        </div>

        <div style={styles.card} onClick={() => navigate('/practice')}>
          <div style={{...styles.cardIcon, backgroundColor: '#dcfce7'}}>
            <ListChecks size={32} color="#15803d" />
          </div>
          <h3 style={styles.cardTitle}>Practice Problems</h3>
          <p style={styles.cardDescription}>
            Generate custom practice problems on any topic. Get instant feedback and hints when you need them.
          </p>
          <button style={styles.cardButton}>Start Practicing →</button>
        </div>

        <div style={styles.card} onClick={() => navigate('/dashboard')}>
          <div style={{...styles.cardIcon, backgroundColor: '#fef3c7'}}>
            <BarChart3 size={32} color="#92400e" />
          </div>
          <h3 style={styles.cardTitle}>Your Progress</h3>
          <p style={styles.cardDescription}>
            Track your learning journey. See your achievements, mastery levels, and areas for improvement.
          </p>
          <button style={styles.cardButton}>View Dashboard →</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  hero: {
    textAlign: 'center',
    padding: '3rem 0',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#64748b',
    marginBottom: '2rem',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#334155',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    border: '2px solid transparent',
  },
  cardIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#1e293b',
    marginBottom: '1rem',
  },
  cardDescription: {
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  cardButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Home;