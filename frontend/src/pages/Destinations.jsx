import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Beach', 'Hill', 'Nature', 'Historical', 'Wildlife', 'City'];
const DIVISIONS = ['All Divisions', 'Chattogram', 'Sylhet', 'Dhaka', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Mymensingh'];

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [division, setDivision] = useState('All Divisions');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/destinations')
      .then(r => setDestinations(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = destinations.filter(d => {
    const matchCat = category === 'All' || d.category === category;
    const matchDiv = division === 'All Divisions' || d.division === division || d.location?.includes(division);
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.location?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDiv && matchSearch;
  });

  return (
    <div className="home-portal">
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #1B3A2D 0%, #2d5a44 50%, #1B3A2D 100%)',
        padding: '8rem 2rem 4rem',
        textAlign: 'center'
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: '#fff', marginBottom: '1rem' }}
        >
          Explore Bangladesh
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}
        >
          {destinations.length} authentic destinations across 8 divisions — from sea beaches to ancient temples
        </motion.p>
        {/* Search */}
        <div className="search-wrapper" style={{ margin: '0 auto 0', maxWidth: '500px' }}>
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search destinations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Filters */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'sticky', top: '70px', zIndex: 100 }}>
        <div className="main-content" style={{ padding: '1rem 2rem' }}>
          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted)', alignSelf: 'center', marginRight: '0.5rem' }}>TYPE:</span>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '50px', border: '1.5px solid',
                  borderColor: category === c ? 'var(--color-terracotta)' : 'rgba(0,0,0,0.15)',
                  background: category === c ? 'var(--color-terracotta)' : 'transparent',
                  color: category === c ? '#fff' : 'var(--color-ink)',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >{c}</button>
            ))}
          </div>
          {/* Division Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted)', alignSelf: 'center', marginRight: '0.5rem' }}>DIVISION:</span>
            {DIVISIONS.map(d => (
              <button
                key={d}
                onClick={() => setDivision(d)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '50px', border: '1.5px solid',
                  borderColor: division === d ? 'var(--color-forest)' : 'rgba(0,0,0,0.15)',
                  background: division === d ? 'var(--color-forest)' : 'transparent',
                  color: division === d ? '#fff' : 'var(--color-ink)',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >{d}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <div className="pulse-loader" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--color-muted)' }}>Loading destinations...</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Showing <strong>{filtered.length}</strong> destination{filtered.length !== 1 ? 's' : ''}
              {category !== 'All' ? ` · ${category}` : ''}
              {division !== 'All Divisions' ? ` · ${division}` : ''}
            </p>
            <div className="grid-cards">
              <AnimatePresence>
                {filtered.map((dest, idx) => (
                  <motion.div
                    key={dest._id}
                    className="tour-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="card-img-wrap">
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&q=80'; }}
                      />

                      <span style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'var(--color-terracotta)', color: '#fff',
                        padding: '0.2rem 0.6rem', borderRadius: '50px',
                        fontSize: '0.7rem', fontWeight: 700
                      }}>{dest.category}</span>
                    </div>
                    <div className="card-info">
                      <span className="card-division">📍 {dest.location}</span>
                      <h3 className="card-title">{dest.name}</h3>
                      <p className="card-desc">{dest.description?.substring(0, 110)}...</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <span style={{ color: 'var(--color-saffron)', fontWeight: 700 }}>
                          ⭐ {dest.rating}
                        </span>
                        <Link to={`/destination/${dest.slug || dest._id}`} className="btn-outline">
                          Explore →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-muted)' }}>
                <p style={{ fontSize: '3rem' }}>🗺️</p>
                <h3>No destinations found</h3>
                <p>Try adjusting your filters or search term.</p>
                <button className="search-btn" style={{ marginTop: '1rem' }} onClick={() => { setCategory('All'); setDivision('All Divisions'); setSearch(''); }}>
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Destinations;
