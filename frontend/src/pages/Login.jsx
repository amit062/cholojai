import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="home-portal" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={{ background: '#fff', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-float)', width: '100%', maxWidth: '400px' }}
      >
        <h2 style={{ color: 'var(--color-forest)', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ color: 'var(--color-muted)', textAlign: 'center', marginBottom: '2rem' }}>Log in to access your travel profile.</p>

        {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} 
            />
          </div>
          <button type="submit" className="search-btn" style={{ marginTop: '1rem', width: '100%', padding: '0.85rem' }}>Log In</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--color-terracotta)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
