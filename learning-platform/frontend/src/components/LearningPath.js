import React, { useState } from 'react';
import { Map, Target, BookOpen, Clock } from 'lucide-react';
import apiService from '../services/api';

const LearningPath = () => {
  const [subject, setSubject] = useState('');
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [goals, setGoals] = useState('');
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePath = async () => {
    if (!subject.trim()) {
      alert('Please enter a subject!');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.generateLearningPath(subject, currentLevel, goals);
      console.log('Learning path response:', response); // Debug log
      setPath(response);
    } catch (error) {
      console.error('Error generating path:', error);
      alert('Failed to generate learning path. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>
          <Map size={28} />
          Generate Your Learning Path
        </h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Subject / Skill</label>
          <input
            type="text"
            placeholder="e.g., Machine Learning, Web Development, Calculus"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Current Level</label>
          <select
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value)}
            style={styles.select}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Goals (Optional)</label>
          <textarea
            placeholder="What do you want to achieve? e.g., Get job-ready, Pass exam, Build projects"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            style={styles.textarea}
            rows="3"
          />
        </div>

        <button onClick={generatePath} disabled={loading} style={styles.generateButton}>
          <Target size={20} />
          {loading ? 'Generating Path...' : 'Generate Learning Path'}
        </button>
      </div>

      {path && path.topics && path.topics.length > 0 ? (
        <div style={styles.pathCard}>
          <div style={styles.pathHeader}>
            <h3 style={styles.pathTitle}>{path.subject}</h3>
            <span style={styles.levelBadge}>{path.level}</span>
          </div>

          <div style={styles.pathInfo}>
            <div style={styles.infoItem}>
              <BookOpen size={18} />
              <span>{path.total_topics} topics</span>
            </div>
            <div style={styles.infoItem}>
              <Clock size={18} />
              <span>Estimated: {Math.ceil(path.total_topics * 2)} weeks</span>
            </div>
          </div>

          <div style={styles.topicsList}>
            {path.topics.map((topic, idx) => (
              <div key={idx} style={styles.topicItem}>
                <div style={styles.topicNumber}>{idx + 1}</div>
                <div style={styles.topicContent}>
                  <h4 style={styles.topicName}>{topic}</h4>
                  <div style={styles.topicActions}>
                    <button 
                      style={styles.actionButton}
                      onClick={() => alert(`Starting: ${topic}\n\nThis would navigate to the tutor with this topic!`)}
                    >
                      <BookOpen size={16} />
                      Start Learning
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.pathFooter}>
            <p style={styles.footerText}>
              💡 Tip: Follow this path in order for the best learning experience. Each topic builds on the previous one!
            </p>
          </div>
        </div>
      ) : loading ? (
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p>Creating your personalized learning path...</p>
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.75rem',
    color: '#1e293b',
    marginBottom: '2rem',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
  },
  generateButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  spinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 1rem',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  pathCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  pathHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e2e8f0',
  },
  pathTitle: {
    fontSize: '1.5rem',
    color: '#1e293b',
    margin: 0,
  },
  levelBadge: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  pathInfo: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#64748b',
    fontSize: '0.95rem',
  },
  topicsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  topicItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s',
  },
  topicNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  topicContent: {
    flex: 1,
  },
  topicName: {
    fontSize: '1.1rem',
    color: '#1e293b',
    marginBottom: '0.75rem',
  },
  topicActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  pathFooter: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#fffbeb',
    borderRadius: '8px',
    borderLeft: '4px solid #fbbf24',
  },
  footerText: {
    color: '#92400e',
    margin: 0,
  },
};

export default LearningPath;