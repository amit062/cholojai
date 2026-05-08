import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Socket connection for active users
    const socket = io('http://localhost:5000');
    socket.on('activeUsers', (count) => {
      setActiveUsers(count);
    });

    // Fetch all destinations
    axios.get('http://localhost:5000/api/destinations')
      .then(res => setDestinations(res.data))
      .catch(console.error);

    return () => socket.disconnect();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await axios.delete(`http://localhost:5000/api/destinations/${id}`);
        setDestinations(destinations.filter(d => d._id !== id));
      } catch (error) {
        console.error('Failed to delete', error);
        alert('Failed to delete destination.');
      }
    }
  };

  if (loading || !user) return <div className="pulse-loader" style={{ margin: '10rem auto' }}></div>;

  return (
    <div className="home-portal" style={{ minHeight: '100vh', padding: '8rem 2rem 4rem' }}>
      <div className="main-content" style={{ padding: 0, maxWidth: '1200px' }}>
        
        {/* Header Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '3rem' }}>🟢</div>
            <div>
              <h3 style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.9rem' }}>Real-time Online</h3>
              <p style={{ color: 'var(--color-forest)', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{activeUsers}</p>
            </div>
          </div>
          
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--color-terracotta)' }}>
            <div style={{ fontSize: '3rem' }}>🗺️</div>
            <div>
              <h3 style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.9rem' }}>Total Destinations</h3>
              <p style={{ color: 'var(--color-forest)', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{destinations.length}</p>
            </div>
          </div>
        </div>

        {/* Management Area */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '3rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Manage Destinations</h2>
            <button className="search-btn" onClick={() => navigate('/admin/destination/new')}>+ Add New Destination</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-parchment)', color: 'var(--color-forest)' }}>
                  <th style={{ padding: '1rem' }}>Destination</th>
                  <th style={{ padding: '1rem' }}>Division</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map(d => (
                  <tr key={d._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={d.imageUrl} alt={d.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                      <span style={{ fontWeight: 600 }}>{d.name}</span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-muted)' }}>{d.division}</td>
                    <td style={{ padding: '1rem' }}><span className="location-pill" style={{ background: 'var(--color-parchment)', color: 'var(--color-forest)', borderColor: 'transparent' }}>{d.category}</span></td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => navigate(`/admin/destination/${d._id}/edit`)} style={{ background: 'transparent', border: '1px solid var(--color-saffron)', color: 'var(--color-saffron)', padding: '0.4rem 1rem', borderRadius: '50px', cursor: 'pointer', marginRight: '0.5rem', fontWeight: 600 }}>Edit</button>
                      <button onClick={() => handleDelete(d._id)} style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.4rem 1rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
