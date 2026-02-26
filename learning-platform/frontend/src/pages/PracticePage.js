import React, { useState } from 'react';
import ProblemGenerator from '../components/ProblemGenerator';
import LearningPath from '../components/LearningPath';

const PracticePage = () => {
  const [activeTab, setActiveTab] = useState('problems');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Practice & Learn</h1>
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('problems')}
            style={{
              ...styles.tab,
              ...(activeTab === 'problems' ? styles.activeTab : {}),
            }}
          >
            Practice Problems
          </button>
          <button
            onClick={() => setActiveTab('path')}
            style={{
              ...styles.tab,
              ...(activeTab === 'path' ? styles.activeTab : {}),
            }}
          >
            Learning Path
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {activeTab === 'problems' ? <ProblemGenerator /> : <LearningPath />}
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
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    borderBottom: '2px solid #e2e8f0',
  },
  tab: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  activeTab: {
    color: '#4f46e5',
    borderBottomColor: '#4f46e5',
  },
  content: {
    marginTop: '2rem',
  },
};

export default PracticePage;