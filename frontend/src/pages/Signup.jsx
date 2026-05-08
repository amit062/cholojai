import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    phone: '',
    gender: 'Prefer not to say'
  });
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up');
    }
  };

  return (
    <div className="home-portal" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={{ background: '#fff', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-float)', width: '100%', maxWidth: '500px' }}
      >
        <h2 style={{ color: 'var(--color-forest)', marginBottom: '0.5rem', textAlign: 'center' }}>Join Cholojai</h2>
        <p style={{ color: 'var(--color-muted)', textAlign: 'center', marginBottom: '2rem' }}>Start your journey across authentic Bangladesh.</p>

        {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Location (City)</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: '#fff' }}>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" className="search-btn" style={{ marginTop: '1rem', width: '100%', padding: '0.85rem' }}>Create Account</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-terracotta)', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
