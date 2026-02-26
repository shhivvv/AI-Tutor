import React from 'react';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  const userId = 1; // In a real app, this would come from authentication

  return (
    <div style={styles.container}>
      <Dashboard userId={userId} />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
};

export default DashboardPage;