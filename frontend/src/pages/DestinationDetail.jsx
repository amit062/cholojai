import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const TABS = ['spots', 'hotels', 'restaurants', 'itinerary'];
const TAB_ICONS = { spots: '🌟', hotels: '🏨', restaurants: '🍽️', itinerary: '🗓️' };
const DAYS_OPTIONS = [1, 2, 3, 5, 7];

const DestinationDetail = () => {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('spots');
  const [visitedLoading, setVisitedLoading] = useState(false);
  
  const { user, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Itinerary state
  const [itinerary, setItinerary] = useState(null);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(3);
  const [itineraryError, setItineraryError] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/destinations`)
      .then(res => {
        const found = res.data.find(d => d.slug === slug || d._id === slug);
        setDestination(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const generateItinerary = async () => {
    if (!destination) return;
    setItineraryLoading(true);
    setItinerary(null);
    setItineraryError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/itinerary`, {
        destination: destination.name,
        days: selectedDays
      });
      setItinerary(res.data);
    } catch (err) {
      setItineraryError('Could not generate itinerary. Please ensure the backend AI service is running.');
    } finally {
      setItineraryLoading(false);
    }
  };

  const handleMarkVisited = async () => {
    if (!user) {
      if (window.confirm('You need to log in or sign up to mark destinations as visited. Go to login?')) {
        navigate('/login');
      }
      return;
    }
    setVisitedLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/visit`, { destinationId: destination._id });
      await fetchUser(); // Updates the user object
    } catch (err) {
      // Ignored for now or could alert
    } finally {
      setVisitedLoading(false);
    }
  };

  const isVisited = user?.visitedDestinations?.some(d => 
    d._id === destination._id || d === destination._id
  );

  if (loading) return (
    <div className="home-portal" style={{ minHeight: '100vh', padding: '10rem 2rem', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--color-forest)' }}>Discovering Bangladesh...</h2>
      <div className="pulse-loader" style={{ margin: '2rem auto' }}></div>
    </div>
  );

  if (!destination) return (
    <div className="home-portal" style={{ minHeight: '100vh', padding: '10rem 2rem', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--color-terracotta)' }}>আরে! এই পথ তো হারিয়ে গেছে...</h1>
      <p>Oops! This destination seems lost in the hills...</p>
      <Link to="/destinations" className="btn-outline" style={{ marginTop: '2rem', display: 'inline-block' }}>Browse All Destinations</Link>
    </div>
  );

  return (
    <div className="destination-page">
      {/* Hero */}
      <section className="hero-section" style={{ backgroundImage: `url(${destination.imageUrl})`, height: '60vh', backgroundAttachment: 'fixed' }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
            {' → '}
            <Link to="/destinations" style={{ color: '#fff', textDecoration: 'none' }}>Destinations</Link>
            {' → '}{destination.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ color: '#fff', margin: 0 }}>{destination.name}</h1>
            <button 
              onClick={handleMarkVisited} 
              disabled={visitedLoading || isVisited}
              style={{
                background: isVisited ? 'transparent' : 'var(--color-saffron)',
                border: isVisited ? '2px solid var(--color-saffron)' : 'none',
                color: isVisited ? 'var(--color-saffron)' : 'var(--color-forest)',
                padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 800, fontSize: '0.85rem', cursor: isVisited ? 'default' : 'pointer'
              }}
            >
              {isVisited ? '✓ VISITED' : (visitedLoading ? 'MARKING...' : '+ MARK VISITED')}
            </button>
          </div>
          <span className="card-division" style={{ color: 'var(--color-saffron)', fontSize: '1.1rem' }}>📍 {destination.location}</span>
          <p className="drop-cap" style={{ color: 'rgba(255,255,255,0.9)', marginTop: '1rem', maxWidth: '600px', textAlign: 'left' }}>{destination.description}</p>
        </div>

        <div className="scroll-indicator"></div>

        {/* Hidden anchor img tag with referrerPolicy — belt-and-suspenders */}
        <img src={destination.imageUrl} alt="" referrerPolicy="no-referrer" style={{ display: 'none' }} onLoad={() => {}} />
      </section>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.1)', position: 'sticky', top: '70px', zIndex: 100 }}>
        <div className="main-content" style={{ padding: '0 2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1.25rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap',
                color: activeTab === tab ? 'var(--color-terracotta)' : 'var(--color-muted)',
                borderBottom: activeTab === tab ? '3px solid var(--color-terracotta)' : '3px solid transparent',
                textTransform: 'capitalize', transition: 'all 0.2s'
              }}
            >
              {TAB_ICONS[tab]} {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <main className="main-content" style={{ paddingTop: '3rem' }}>
        <AnimatePresence mode="wait">
          {/* ── SPOTS TAB ── */}
          {activeTab === 'spots' && (
            <motion.div key="spots" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="section-title">Top Tourist Spots</h2>
              {destination.topSpots?.length > 0 ? (
                <div className="grid-cards">
                  {destination.topSpots.map((spot, idx) => (
                    <motion.div
                      key={idx}
                      className="tour-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <div className="card-img-wrap" style={{ height: '200px' }}>
                        <img
                          src={spot.imageUrl}
                          alt={spot.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={e => { e.target.src = `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&q=80`; }}
                        />

                        <span style={{
                          position: 'absolute', top: '1rem', left: '1rem',
                          background: 'var(--color-forest)', color: '#fff',
                          width: '32px', height: '32px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.85rem'
                        }}>{idx + 1}</span>
                      </div>
                      <div className="card-info" style={{ flex: 1 }}>
                        <h3 className="card-title">{spot.name}</h3>
                        <p className="card-desc" style={{ fontSize: '0.9rem' }}>{spot.description}</p>
                      </div>
                      {spot.tourGuide && (
                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', background: 'var(--color-parchment)' }}>
                          <p style={{ fontSize: '0.82rem', color: 'var(--color-olive)', fontWeight: 600 }}>
                            💡 <strong>How to get there:</strong> {spot.tourGuide}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
                  <p>We are gathering verified spots for {destination.name}. Check back soon!</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── HOTELS TAB ── */}
          {activeTab === 'hotels' && (
            <motion.div key="hotels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="section-title">Where to Stay</h2>
              {destination.hotelOptions?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                  {destination.hotelOptions.map((h, i) => (
                    <motion.div
                      key={i}
                      className="tour-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ display: 'flex', padding: '1.5rem 2rem', alignItems: 'center', gap: '1rem' }}
                    >
                      <div style={{ flex: 1 }}>
                        <span style={{
                          display: 'inline-block', padding: '0.2rem 0.8rem', borderRadius: '50px',
                          fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem',
                          background: h.category === 'Luxury' ? '#f5e6d3' : h.category === 'Premium' ? '#e0f0e9' : '#f0f0f0',
                          color: h.category === 'Luxury' ? 'var(--color-terracotta)' : h.category === 'Premium' ? 'var(--color-forest)' : 'var(--color-muted)'
                        }}>{h.category}</span>
                        <h3 style={{ color: 'var(--color-forest)', margin: 0 }}>{h.name}</h3>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ color: 'var(--color-terracotta)', fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>{h.price}</p>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', margin: '0 0 0.75rem' }}>per night (avg)</p>
                        <a
                          href={h.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="search-btn"
                          style={{ textDecoration: 'none', display: 'inline-block', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                        >
                          Book Now ↗
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Hotel listings coming soon for {destination.name}.</p>
              )}
            </motion.div>
          )}

          {/* ── RESTAURANTS TAB ── */}
          {activeTab === 'restaurants' && (
            <motion.div key="restaurants" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="section-title">Taste of {destination.name}</h2>
              {destination.restaurants?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {destination.restaurants.map((r, i) => (
                    <motion.div
                      key={i}
                      className="tour-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div style={{
                        height: '80px', background: 'linear-gradient(135deg, var(--color-forest), var(--color-terracotta))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'
                      }}>🍽️</div>
                      <div className="card-info">
                        <span className="card-division">LOCAL RESTAURANT</span>
                        <h3 className="card-title" style={{ fontSize: '1.15rem' }}>{r.name}</h3>
                        <div style={{
                          display: 'inline-block', background: 'rgba(232,168,56,0.15)',
                          border: '1px solid var(--color-saffron)', borderRadius: 'var(--radius-sm)',
                          padding: '0.3rem 0.8rem', marginBottom: '0.75rem'
                        }}>
                          <span style={{ color: 'var(--color-terracotta)', fontWeight: 700, fontSize: '0.85rem' }}>⭐ Must Try: {r.specialty}</span>
                        </div>
                        <p className="card-desc" style={{ fontSize: '0.88rem' }}>{r.description}</p>
                        <p style={{ color: 'var(--color-olive)', fontWeight: 600, fontSize: '0.82rem', marginTop: '0.75rem' }}>
                          💸 {r.priceRange}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
                  <p style={{ fontSize: '3rem' }}>🍽️</p>
                  <p>Restaurant listings for {destination.name} are being curated. Check back soon!</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── ITINERARY TAB ── */}
          {activeTab === 'itinerary' && (
            <motion.div key="itinerary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="section-title">AI Travel Itinerary</h2>

              {/* Day selector */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{ color: 'var(--color-muted)', marginBottom: '1rem' }}>How many days are you visiting {destination.name}?</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {DAYS_OPTIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDays(d)}
                      style={{
                        width: '56px', height: '56px', borderRadius: '50%', border: '2px solid',
                        borderColor: selectedDays === d ? 'var(--color-terracotta)' : 'rgba(0,0,0,0.2)',
                        background: selectedDays === d ? 'var(--color-terracotta)' : 'transparent',
                        color: selectedDays === d ? '#fff' : 'var(--color-ink)',
                        fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >{d}</button>
                  ))}
                </div>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Selected: <strong>{selectedDays} day{selectedDays > 1 ? 's' : ''}</strong>
                </p>
                <button
                  className="search-btn"
                  onClick={generateItinerary}
                  disabled={itineraryLoading}
                  style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}
                >
                  {itineraryLoading ? 'Generating...' : '✦ Generate AI Itinerary'}
                </button>
              </div>

              {/* Loading */}
              {itineraryLoading && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="pulse-loader" style={{ margin: '0 auto 1rem' }}></div>
                  <p style={{ color: 'var(--color-muted)' }}>AI is planning your perfect {selectedDays}-day trip to {destination.name}...</p>
                </div>
              )}

              {/* Error */}
              {itineraryError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center', color: '#dc2626' }}>
                  <p>⚠️ {itineraryError}</p>
                </div>
              )}

              {/* Result */}
              {itinerary && !itineraryLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Overview */}
                  {itinerary.overview && (
                    <div style={{ background: 'var(--color-forest)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem', color: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ color: 'var(--color-saffron)', fontFamily: 'var(--font-body)' }}>{itinerary.duration}</h3>
                          <h2 style={{ color: '#fff' }}>{itinerary.destination}</h2>
                        </div>
                        {itinerary.bestSeason && (
                          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>BEST SEASON</p>
                            <p style={{ fontWeight: 700, margin: 0 }}>{itinerary.bestSeason}</p>
                          </div>
                        )}
                      </div>
                      <p style={{ opacity: 0.9, lineHeight: 1.8 }}>{itinerary.overview}</p>
                    </div>
                  )}

                  {/* Budget */}
                  {itinerary.budgetBreakdown && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                      <div style={{ background: '#f0fdf4', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid #86efac', textAlign: 'center' }}>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem', margin: 0 }}>BUDGET OPTION</p>
                        <p style={{ color: 'var(--color-forest)', fontWeight: 800, fontSize: '1.3rem', margin: '0.25rem 0 0' }}>{itinerary.budgetBreakdown.budget}</p>
                      </div>
                      <div style={{ background: '#fef9ee', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid var(--color-saffron)', textAlign: 'center' }}>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem', margin: 0 }}>PREMIUM OPTION</p>
                        <p style={{ color: 'var(--color-terracotta)', fontWeight: 800, fontSize: '1.3rem', margin: '0.25rem 0 0' }}>{itinerary.budgetBreakdown.premium}</p>
                      </div>
                    </div>
                  )}

                  {/* Day Plans */}
                  {itinerary.days?.map((day, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-card)', borderLeft: '4px solid var(--color-terracotta)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{
                          background: 'var(--color-terracotta)', color: '#fff',
                          width: '48px', height: '48px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '1.1rem', flexShrink: 0
                        }}>D{day.day}</div>
                        <h3 style={{ color: 'var(--color-forest)', margin: 0 }}>{day.title}</h3>
                      </div>

                      {day.activities?.length > 0 && (
                        <div style={{ marginBottom: '1.25rem' }}>
                          <p style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>ACTIVITIES</p>
                          <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-ink)', lineHeight: 2 }}>
                            {day.activities.map((a, i) => <li key={i}>{a}</li>)}
                          </ul>
                        </div>
                      )}

                      {day.meals && (
                        <div style={{ background: 'var(--color-parchment)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                          {['breakfast', 'lunch', 'dinner'].map(meal => day.meals[meal] && (
                            <div key={meal} style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', margin: 0 }}>{meal}</p>
                              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0', color: 'var(--color-ink)' }}>{day.meals[meal]}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Cultural Tips */}
                  {itinerary.culturalTips?.length > 0 && (
                    <div style={{ background: 'var(--color-parchment)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid rgba(232,168,56,0.4)' }}>
                      <h3 style={{ color: 'var(--color-terracotta)', marginBottom: '1rem' }}>🙏 Cultural Tips</h3>
                      <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-ink)', lineHeight: 2.2 }}>
                        {itinerary.culturalTips.map((tip, i) => <li key={i}>{tip}</li>)}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Empty state (before generating) */}
              {!itinerary && !itineraryLoading && !itineraryError && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-muted)' }}>
                  <p style={{ fontSize: '3rem' }}>✨</p>
                  <p>Select the number of days above and click <strong>Generate AI Itinerary</strong> to get a personalised day-by-day travel plan for {destination.name}.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DestinationDetail;
