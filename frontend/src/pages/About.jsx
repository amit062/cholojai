import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Divisions', value: '8', icon: '🗺️' },
  { label: 'Districts', value: '64', icon: '📍' },
  { label: 'Population', value: '170M+', icon: '👥' },
  { label: 'UNESCO Sites', value: '3', icon: '🏛️' },
  { label: 'km Coastline', value: '710', icon: '🌊' },
  { label: 'Bird Species', value: '650+', icon: '🦅' },
];

const highlights = [
  {
    icon: '🌊', title: "World's Longest Beach",
    desc: "Cox's Bazar stretches 120km — the longest unbroken natural sea beach on Earth, with golden sand and a living fishing culture dating back centuries."
  },
  {
    icon: '🐯', title: 'Land of the Royal Bengal Tiger',
    desc: "The Sundarbans — a UNESCO World Heritage Mangrove forest — is the last wild home of the Royal Bengal Tiger, shared between Bangladesh and India."
  },
  {
    icon: '☕', title: 'Tea Capital of South Asia',
    desc: "Srimangal is home to over 150 tea estates producing some of the world's finest tea, including the legendary 7-layer tea — a unique Bangladeshi invention."
  },
  {
    icon: '🏔️', title: 'Hidden Himalayan Foothills',
    desc: "Bandarban's mist-shrouded peaks reach over 3,000 feet. The Chittagong Hill Tracts harbour over 11 indigenous communities with living cultural traditions."
  },
];

const team = [
  { name: 'The Cholojai Team', role: 'Travel Enthusiasts & Bangladesh Advocates', emoji: '✈️' },
  { name: 'Mission', role: 'To make authentic Bangladesh travel accessible, beautiful, and intelligently planned for every traveller.', emoji: '🎯' },
];

const About = () => {
  return (
    <div className="home-portal">
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1B3A2D 0%, #C4622D 100%)',
        padding: '9rem 2rem 5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          background: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🇧🇩</div>
          <h1 style={{ color: '#fff', marginBottom: '1rem' }}>About Bangladesh</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
            A land of rivers, hills, forests, and ancient civilizations — Bangladesh is one of South Asia's most underrated travel destinations, rich with natural wonder and cultural depth.
          </p>
          <Link to="/destinations" className="search-btn" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.9rem 2rem' }}>
            Explore All Destinations →
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background: '#fff', padding: '4rem 2rem' }}>
        <div className="main-content" style={{ padding: 0 }}>
          <h2 className="section-title">Bangladesh at a Glance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  textAlign: 'center', padding: '2rem 1rem',
                  background: 'var(--color-parchment)', borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-terracotta)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div style={{ color: 'var(--color-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Bangladesh */}
      <section style={{ background: 'var(--color-parchment)', padding: '4rem 2rem' }}>
        <div className="main-content" style={{ padding: 0 }}>
          <h2 className="section-title">Why Travel Bangladesh?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: '#fff', borderRadius: 'var(--radius-lg)',
                  padding: '2rem', boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{h.icon}</div>
                <h3 style={{ color: 'var(--color-forest)', marginBottom: '0.75rem', fontSize: '1.15rem' }}>{h.title}</h3>
                <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The 8 Divisions */}
      <section style={{ background: 'var(--color-forest)', padding: '4rem 2rem' }}>
        <div className="main-content" style={{ padding: 0 }}>
          <h2 className="section-title" style={{ color: '#fff' }}>8 Divisions to Explore</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            {[
              { name: 'Dhaka', desc: 'Capital — history, culture, Old Dhaka', icon: '🏙️' },
              { name: 'Chattogram', desc: 'Cox\'s Bazar, Bandarban, Rangamati', icon: '⛰️' },
              { name: 'Sylhet', desc: 'Tea estates, Ratargul swamp, Jaflong', icon: '🌿' },
              { name: 'Khulna', desc: 'Sundarbans, Bagerhat mosque city', icon: '🐯' },
              { name: 'Rajshahi', desc: 'Ancient Paharpur ruins, silk & mangoes', icon: '🏛️' },
              { name: 'Barisal', desc: 'Kuakata beach, rivers & rocket steamers', icon: '🌊' },
              { name: 'Rangpur', desc: 'Kantajew temple, Teesta River', icon: '🌾' },
              { name: 'Mymensingh', desc: 'Birishiri, Sunamganj haors', icon: '🦢' },
            ].map((div, i) => (
              <motion.div
                key={div.name}
                whileHover={{ scale: 1.04 }}
                style={{
                  background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)',
                  padding: '1.5rem', border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '2rem' }}>{div.icon}</span>
                <h3 style={{ color: '#fff', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{div.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{div.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Cholojai */}
      <section style={{ background: '#fff', padding: '4rem 2rem' }}>
        <div className="main-content" style={{ padding: 0, maxWidth: '800px' }}>
          <h2 className="section-title" style={{ textAlign: 'left' }}>About Cholojai</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', lineHeight: 2, marginBottom: '1.5rem' }}>
            <strong style={{ color: 'var(--color-forest)' }}>Cholojai</strong> (চলো যাই — "let's go") is Bangladesh's premier AI-powered travel intelligence platform. Our mission is simple: to make the incredible natural and cultural wealth of Bangladesh accessible, beautifully presented, and intelligently planned for every kind of traveller.
          </p>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', lineHeight: 2, marginBottom: '2rem' }}>
            We combine real-time weather data, Google Gemini AI, and meticulously curated destination knowledge to give you personalised travel itineraries, budget strategies, hotel bookings, and cultural insights — all in one place.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/destinations" className="search-btn" style={{ textDecoration: 'none' }}>Browse Destinations</Link>
            <Link to="/" className="btn-outline" style={{ padding: '0.75rem 1.5rem' }}>Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
