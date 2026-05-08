import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, loading, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (!loading && user) {
      fetchUser(); // refresh populated data
    }
  }, [user, loading, navigate]);

  if (loading || !user) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="pulse-loader"></div>
    </div>
  );

  return (
    <div className="home-portal" style={{ minHeight: '100vh', padding: '8rem 2rem 4rem' }}>
      <div className="main-content" style={{ padding: 0 }}>
        
        {/* Profile Header */}
        <div style={{ background: '#fff', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-forest)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>{user.name}</h1>
            <p style={{ color: 'var(--color-muted)', margin: 0 }}>{user.email} • {user.location || 'Explorer'}</p>
          </div>
        </div>

        {/* Visited Destinations */}
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Destinations Visited So Far 🌍</h2>
        
        {user.visitedDestinations && user.visitedDestinations.length > 0 ? (
          <div className="grid-cards">
            {user.visitedDestinations.map((dest, i) => (
              <motion.div 
                key={dest._id}
                className="tour-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="card-img-wrap" style={{ height: '180px' }}>
                  <img src={dest.imageUrl} alt={dest.name} referrerPolicy="no-referrer" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&q=80'; }} />
                  <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-saffron)', color: 'var(--color-forest)', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800 }}>VISITED</span>
                </div>
                <div className="card-info" style={{ padding: '1.25rem' }}>
                  <h3 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>{dest.name}</h3>
                  <span className="card-division" style={{ marginBottom: 0, marginTop: '0.25rem' }}>📍 {dest.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧭</div>
            <h3 style={{ color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Your map is empty</h3>
            <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem' }}>Start exploring Bangladesh and mark destinations as visited to build your travel profile.</p>
            <Link to="/destinations" className="search-btn" style={{ textDecoration: 'none' }}>Browse Destinations</Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
