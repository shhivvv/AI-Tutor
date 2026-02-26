import React, { useState } from 'react';
import { Sparkles, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import apiService from '../services/api';

const ProblemGenerator = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState(5);
  const [problemType, setProblemType] = useState('open_ended');
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const generateProblem = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic!');
      return;
    }

    setLoading(true);
    setAssessment(null);
    setUserAnswer('');
    try {
      const response = await apiService.generateProblem(topic, difficulty, problemType);
      setProblem(response);
      setShowHints(false);
    } catch (error) {
      console.error('Error generating problem:', error);
      alert('Failed to generate problem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please enter your answer first!');
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiService.assessAnswerDirect(
        1, // user_id
        topic,
        problem.question,
        userAnswer,
        problem.solution
      );
      
      setAssessment({
        feedback: result.assessment.feedback,
        is_correct: result.assessment.is_correct,
        score: result.assessment.score,
        submitted: true
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetProblem = () => {
    setProblem(null);
    setUserAnswer('');
    setAssessment(null);
    setShowHints(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Topic</label>
          <input
            type="text"
            placeholder="e.g., Linear Equations, Python Loops, Physics Motion"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Difficulty: {difficulty}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.sliderLabels}>
              <span>Easy</span>
              <span>Medium</span>
              <span>Hard</span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Problem Type</label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              style={styles.select}
            >
              <option value="open_ended">Open Ended</option>
              <option value="mcq">Multiple Choice</option>
              <option value="coding">Coding</option>
            </select>
          </div>
        </div>

        <button onClick={generateProblem} disabled={loading} style={styles.generateButton}>
          <Sparkles size={20} />
          {loading ? 'Generating...' : 'Generate Problem'}
        </button>
      </div>

      {problem && (
        <div style={styles.problemCard}>
          <div style={styles.problemHeader}>
            <h3 style={styles.problemTitle}>Problem</h3>
            <div style={styles.headerRight}>
              <span style={styles.badge}>Difficulty: {difficulty}/10</span>
              <button onClick={resetProblem} style={styles.resetButton}>
                New Problem
              </button>
            </div>
          </div>

          <div style={styles.problemContent}>
            <p style={styles.questionText}>{problem.question}</p>
          </div>

          {problem.hints && problem.hints.length > 0 && (
            <div style={styles.hintsSection}>
              <button
                onClick={() => setShowHints(!showHints)}
                style={styles.hintButton}
              >
                <Lightbulb size={18} />
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>

              {showHints && (
                <div style={styles.hintsList}>
                  {problem.hints.map((hint, idx) => (
                    <div key={idx} style={styles.hint}>
                      <span style={styles.hintNumber}>Hint {idx + 1}:</span>
                      <span>{hint.trim()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={styles.answerSection}>
            <label style={styles.label}>Your Answer</label>
            <textarea
              placeholder="Type your answer here..."
              style={styles.answerInput}
              rows="4"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={assessment !== null}
            />
            
            {!assessment ? (
              <button 
                onClick={submitAnswer} 
                disabled={submitting || !userAnswer.trim()}
                style={{
                  ...styles.submitButton,
                  opacity: (submitting || !userAnswer.trim()) ? 0.5 : 1,
                  cursor: (submitting || !userAnswer.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Evaluating...' : 'Submit Answer'}
              </button>
            ) : (
              <div style={styles.assessmentCard}>
                <div style={styles.assessmentHeader}>
                  {assessment.is_correct
                    ? <CheckCircle size={24} color="#10b981" />
                    : <XCircle size={24} color="#ef4444" />}
                  <h4 style={styles.assessmentTitle}>
                    {assessment.is_correct ? 'Correct!' : 'Not quite right'}
                    {assessment.score !== undefined && ` — Score: ${assessment.score}/100`}
                  </h4>
                </div>
                <p style={styles.feedbackText}>{assessment.feedback}</p>
                <button onClick={resetProblem} style={styles.tryAgainButton}>
                  Try Another Problem
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  controls: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  slider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    outline: 'none',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '0.5rem',
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
    transition: 'background-color 0.3s',
  },
  problemCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  problemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e2e8f0',
  },
  problemTitle: {
    fontSize: '1.5rem',
    color: '#1e293b',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  badge: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  resetButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  problemContent: {
    marginBottom: '2rem',
  },
  questionText: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#334155',
    whiteSpace: 'pre-wrap',
  },
  hintsSection: {
    marginBottom: '2rem',
  },
  hintButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  hintsList: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fffbeb',
    borderRadius: '8px',
    borderLeft: '4px solid #fbbf24',
  },
  hint: {
    marginBottom: '0.75rem',
    display: 'flex',
    gap: '0.5rem',
    lineHeight: '1.6',
  },
  hintNumber: {
    fontWeight: '600',
    color: '#92400e',
  },
  answerSection: {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '2px solid #e2e8f0',
  },
  answerInput: {
    width: '100%',
    padding: '1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    marginBottom: '1rem',
  },
  submitButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  assessmentCard: {
    padding: '1.5rem',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    border: '2px solid #10b981',
  },
  assessmentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  assessmentTitle: {
    fontSize: '1.2rem',
    color: '#15803d',
    margin: 0,
  },
  feedbackText: {
    lineHeight: '1.8',
    color: '#334155',
    marginBottom: '1rem',
    whiteSpace: 'pre-wrap',
  },
  tryAgainButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ProblemGenerator;