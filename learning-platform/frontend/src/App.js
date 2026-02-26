import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TutorPage from './pages/TutorPage';
import PracticePage from './pages/PracticePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div style={styles.app}>
        <Navbar />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutor" element={<TutorPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
  },
  main: {
    paddingTop: '2rem',
    paddingBottom: '4rem',
  },
};

export default App;