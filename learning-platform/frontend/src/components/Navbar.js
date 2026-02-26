import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, MessageSquare, ListChecks, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <BookOpen size={28} />
          <span style={styles.logoText}>AI Learning Platform</span>
        </Link>

        <div style={styles.navLinks}>
          <Link
            to="/tutor"
            style={{
              ...styles.navLink,
              ...(isActive('/tutor') ? styles.navLinkActive : {}),
            }}
          >
            <MessageSquare size={20} />
            <span>AI Tutor</span>
          </Link>

          <Link
            to="/practice"
            style={{
              ...styles.navLink,
              ...(isActive('/practice') ? styles.navLinkActive : {}),
            }}
          >
            <ListChecks size={20} />
            <span>Practice</span>
          </Link>

          <Link
            to="/dashboard"
            style={{
              ...styles.navLink,
              ...(isActive('/dashboard') ? styles.navLinkActive : {}),
            }}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1e293b',
    padding: '1rem 2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  logoText: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#cbd5e1',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s',
    fontSize: '1rem',
  },
  navLinkActive: {
    backgroundColor: '#334155',
    color: '#fff',
  },
};

export default Navbar;