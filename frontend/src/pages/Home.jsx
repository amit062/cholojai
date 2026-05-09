import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_IMAGES = [
  { url: 'https://loremflickr.com/1280/720/bangladesh,coxsbazar?lock=1', label: "Cox's Bazar" },
  { url: 'https://loremflickr.com/1280/720/bangladesh,bandarban?lock=2', label: "Bandarban" },
  { url: 'https://loremflickr.com/1280/720/bangladesh,sajek?lock=3', label: "Sajek Valley" },
  { url: '/images/hero/ratargul.jpg', label: "Ratargul, Sylhet" },
  { url: 'https://loremflickr.com/1280/720/bangladesh,sundarbans?lock=5', label: "Sundarbans" },
];

const QUOTES = [
  "The world is a book, and those who do not travel read only one page.",
  "পথ হাঁটতে হাঁটতেই পথ তৈরি হয়।",
  "Travel is the only thing you buy that makes you richer.",
  "আমাদের ছোট নদী চলে বাঁকে বাঁকে।",
  "Not all those who wander are lost.",
  "জীবন একটি যাত্রা, গন্তব্য নয়।",
  "Travel far enough, you meet yourself.",
  "সুন্দরবনের গভীরে লুকিয়ে আছে এক অন্য পৃথিবী।"
];

const POPULAR = ["Cox's Bazar", "Sundarbans", "Sylhet", "Bandarban", "Sajek", "Kuakata", "Rangamati", "Srimangal"];

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // AI state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/destinations`)
      .then(r => setDestinations(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Rotate hero image every 5s
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(p => (p + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Rotate quote every 6s
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(p => (p + 1) % QUOTES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAskAI = async () => {
    setIsAiDrawerOpen(true);
    setIsAiLoading(true);
    setAiSuggestion(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/suggest`);
      setAiSuggestion(res.data.destination ? res.data : { error: 'Unexpected AI response format.' });
    } catch {
      setAiSuggestion({ error: 'Could not connect to AI services. Please ensure the backend is running.' });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="home-portal">
      {/* ── HERO ── */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Rotating background images */}
        <AnimatePresence>
          <motion.div
            key={heroIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url("${HERO_IMAGES[heroIdx].url}")`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          />
        </AnimatePresence>
        {/* Preload all hero images silently with referrerPolicy */}
        {HERO_IMAGES.map(img => (
          <img key={img.url} src={img.url} alt="" referrerPolicy="no-referrer"
            style={{ display: 'none' }} onLoad={() => { }} />
        ))}

        <div className="hero-overlay"></div>
        {/* Location label */}
        <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 5, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          📍 {HERO_IMAGES[heroIdx].label}
          <span style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
            {HERO_IMAGES.map((_, i) => (
              <span key={i} onClick={() => setHeroIdx(i)}
                style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === heroIdx ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }} />
            ))}
          </span>
        </div>

        <div className="hero-content" style={{ zIndex: 2 }}>
          <AnimatePresence mode="wait">
            <motion.p key={quoteIdx} className="hero-quote"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
              "{QUOTES[quoteIdx]}"
            </motion.p>
          </AnimatePresence>

          <div className="search-wrapper" style={{ position: 'relative' }}>
            <span className="search-icon">🔍</span>
            <input className="search-input" type="text"
              placeholder="Search a destination... e.g. Sylhet, Cox's Bazar, Sundarbans"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <button className="search-btn">Search</button>

            {/* Instant Search Dropdown Popup */}
            {searchTerm && (
              <div
                className="search-results-dropdown"
                style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: '#fff', borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  marginTop: '0.5rem', maxHeight: '350px', overflowY: 'auto',
                  zIndex: 999, display: 'flex', flexDirection: 'column', textAlign: 'left'
                }}
              >
                {filtered.length > 0 ? (
                  filtered.map(dest => (
                    <Link key={dest._id} to={`/destination/${dest.slug || dest._id}`}
                      style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f0f0f0', color: 'var(--color-ink)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <img src={dest.imageUrl} alt={dest.name} style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1f2937' }}>{dest.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>📍 {dest.location}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div style={{ padding: '1rem', color: '#6b7280', textAlign: 'center' }}>No destinations match "{searchTerm}"</div>
                )}
              </div>
            )}
          </div>

          <p className="hint-text">or explore popular destinations <span className="btn-arrow">→</span></p>
          <div className="pill-container">
            {POPULAR.map(dest => (
              <span key={dest} className="location-pill" onClick={() => setSearchTerm(dest)}>{dest}</span>
            ))}
          </div>
        </div>
        
        <div className="scroll-indicator"></div>
      </section>

      {/* ── AI FAB ── */}
      <button className="ai-fab" onClick={handleAskAI}>✦ Ask AI</button>

      {/* ── AI DRAWER ── */}
      <div className={`ai-drawer-overlay ${isAiDrawerOpen ? 'open' : ''}`} onClick={() => setIsAiDrawerOpen(false)}>
        <div className="ai-drawer" onClick={e => e.stopPropagation()}>
          <button className="drawer-close" onClick={() => setIsAiDrawerOpen(false)}>×</button>
          <h2 style={{ color: 'var(--color-forest)', marginBottom: '1rem' }}>✦ Travel Intelligence</h2>

          {isAiLoading ? (
            <div style={{ textAlign: 'center', margin: '4rem 0' }}>
              <p>Reading the weather, date & time...</p>
              <div className="pulse-loader" style={{ margin: '1rem auto' }}></div>
            </div>
          ) : aiSuggestion ? (
            aiSuggestion.error ? (
              <p style={{ color: 'red' }}>{aiSuggestion.error}</p>
            ) : (
              <div>
                <h1 style={{ color: 'var(--color-terracotta)', fontSize: '2.2rem' }}>{aiSuggestion.destination}</h1>
                <span className="card-division">{aiSuggestion.division}</span>
                <p style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>{aiSuggestion.reason}</p>

                {aiSuggestion.bestFor?.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Best For:</h3>
                    <div className="pill-container" style={{ justifyContent: 'flex-start' }}>
                      {aiSuggestion.bestFor.map(a => (
                        <span key={a} className="location-pill" style={{ background: 'var(--color-forest)', borderColor: 'var(--color-forest)' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ background: 'rgba(232,168,56,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid var(--color-saffron)' }}>
                  <h3>Weather Note</h3>
                  <p>{aiSuggestion.weatherNote}</p>
                </div>
                <div style={{ background: 'rgba(27,58,45,0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--color-forest)' }}>
                  <h3>Quick Tip</h3>
                  <p>{aiSuggestion.quickTip}</p>
                </div>

                <button className="search-btn" style={{ width: '100%', marginTop: '2rem' }}
                  onClick={() => { setIsAiDrawerOpen(false); setSearchTerm(aiSuggestion.destination); }}>
                  Explore This Destination →
                </button>
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* ── DESTINATIONS GRID ── */}
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Discover Authentic Bangladesh</h2>
          <Link to="/destinations" className="btn-outline">View All {destinations.length} <span className="btn-arrow">→</span></Link>
        </div>

        {loading ? (
          <div className="grid-cards">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="tour-card" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
                <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: 0, flexShrink: 0 }}></div>
                <div className="card-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1, padding: '1.25rem' }}>
                  <div className="skeleton" style={{ height: '14px', width: '30%' }}></div>
                  <div className="skeleton" style={{ height: '22px', width: '70%' }}></div>
                  <div className="skeleton" style={{ height: '35px', width: '100%' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div className="skeleton" style={{ height: '18px', width: '20%' }}></div>
                    <div className="skeleton" style={{ height: '32px', width: '30%', borderRadius: '50px' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-cards">
            <AnimatePresence>
              {filtered.map((dest, idx) => (
                <motion.div key={dest._id} className="tour-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                >
                  <div className="card-img-wrap">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&q=80'; }}
                    />

                  </div>
                  <div className="card-info">
                    <span className="card-division">📍 {dest.location}</span>
                    <h3 className="card-title">{dest.name}</h3>
                    <p className="card-desc">{dest.description?.substring(0, 100)}...</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{ color: 'var(--color-saffron)', fontWeight: 700 }}>⭐ {dest.rating}</span>
                      <Link to={`/destination/${dest.slug || dest._id}`} className="btn-outline">Explore <span className="btn-arrow">→</span></Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && searchTerm && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
                <p>No destinations match "<strong>{searchTerm}</strong>". <span style={{ cursor: 'pointer', color: 'var(--color-terracotta)' }} onClick={() => setSearchTerm('')}>Clear search</span></p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
