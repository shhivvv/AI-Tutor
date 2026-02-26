import React, { useState, useEffect } from 'react';
import { BarChart3, Trophy, Target, TrendingUp } from 'lucide-react';
import apiService from '../services/api';

const Dashboard = ({ userId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [userId]);

  const loadProgress = async () => {
    try {
      const data = await apiService.getUserProgress(userId);
      setProgress(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading your progress...</div>;
  }

  const totalProblems = progress?.progress?.reduce((sum, p) => sum + p.problems_attempted, 0) || 0;
  const totalCorrect = progress?.progress?.reduce((sum, p) => sum + p.problems_correct, 0) || 0;
  const overallAccuracy = totalProblems > 0 ? ((totalCorrect / totalProblems) * 100).toFixed(1) : 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        <BarChart3 size={32} />
        Your Learning Dashboard
      </h2>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, backgroundColor: '#dbeafe'}}>
            <Target size={24} color="#1e40af" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{progress?.topics_in_progress || 0}</div>
            <div style={styles.statLabel}>Topics In Progress</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, backgroundColor: '#dcfce7'}}>
            <Trophy size={24} color="#15803d" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{totalProblems}</div>
            <div style={styles.statLabel}>Problems Attempted</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, backgroundColor: '#fef3c7'}}>
            <TrendingUp size={24} color="#92400e" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{overallAccuracy}%</div>
            <div style={styles.statLabel}>Overall Accuracy</div>
          </div>
        </div>
      </div>

      {progress?.progress && progress.progress.length > 0 ? (
        <div style={styles.progressSection}>
          <h3 style={styles.sectionTitle}>Topic Progress</h3>
          <div style={styles.progressList}>
            {progress.progress.map((item, idx) => (
              <div key={idx} style={styles.progressItem}>
                <div style={styles.progressHeader}>
                  <span style={styles.topicTitle}>{item.topic_name || `Topic ${item.topic_id}`}</span>
                  <span style={styles.accuracyBadge}>{item.accuracy.toFixed(1)}% accuracy</span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${item.mastery_level * 100}%`,
                    }}
                  />
                </div>
                <div style={styles.progressStats}>
                  <span>{item.problems_correct}/{item.problems_attempted} correct</span>
                  <span>{(item.mastery_level * 100).toFixed(0)}% mastery</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <Target size={64} color="#cbd5e1" />
          <h3 style={styles.emptyTitle}>No progress yet</h3>
          <p style={styles.emptyText}>
            Start practicing problems to see your progress here!
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#64748b',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '2rem',
    color: '#1e293b',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    display: 'flex',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginTop: '0.25rem',
  },
  progressSection: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  progressList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  progressItem: {
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  topicTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#334155',
  },
  accuracyBadge: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    transition: 'width 0.3s',
  },
  progressStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: '#64748b',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#334155',
    marginTop: '1rem',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#64748b',
    marginTop: '0.5rem',
  },
};

export default Dashboard;