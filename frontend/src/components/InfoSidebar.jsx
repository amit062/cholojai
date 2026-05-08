import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotModal from './SpotModal';

const InfoSidebar = ({ isOpen, onClose, destination }) => {
  const [activeTab, setActiveTab] = useState('spots');
  const [selectedSpot, setSelectedSpot] = useState(null);

  const spots = destination?.topSpots || [];
  const hotels = destination?.hotelOptions || [];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      
      <motion.div 
        className={`info-sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <button className="close-btn" style={{ position: 'absolute', top: '2rem', left: '2rem', color: '#fff' }} onClick={onClose}>✖</button>
        
        <div className="sidebar-header" style={{ height: '350px' }}>
           <img src={destination?.imageUrl} alt={destination?.name} className="sidebar-hero-img" style={{ height: '100%' }} referrerPolicy="no-referrer" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&q=80'; }} />
           <div className="sidebar-title-overlay" style={{ padding: '3rem' }}>
              <span className="location-badge" style={{ marginBottom: '1rem' }}>📍 {destination?.location}</span>
              <h2 style={{ fontSize: '3.5rem' }}>{destination?.name}</h2>
           </div>
        </div>

        <div className="tabs-navigation">
          <button className={activeTab === 'spots' ? 'active' : ''} onClick={() => setActiveTab('spots')}>🌟 7 Top Spots</button>
          <button className={activeTab === 'hotels' ? 'active' : ''} onClick={() => setActiveTab('hotels')}>🏨 Stay & Book</button>
        </div>

        <div className="tab-content" style={{ padding: '2.5rem' }}>
            <AnimatePresence mode='wait'>
              {activeTab === 'spots' && (
                <motion.div 
                  key="spots"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="spots-grid"
                >
                  {spots.map((s, i) => (
                    <motion.div 
                      key={i} 
                      className="spot-mini-card"
                      whileHover={{ y: -10, borderColor: '#00f2fe' }}
                      onClick={() => setSelectedSpot(s)}
                    >
                      <div className="spot-image-container">
                        <img src={s.imageUrl} alt={s.name} referrerPolicy="no-referrer" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&q=80'; }} />
                        <div className="spot-badge">{i + 1}</div>
                        <div className="spot-hover-hint">Deep Dive Intelligence ↗</div>
                      </div>
                      <div className="spot-info">
                        <h4>{s.name}</h4>
                        <p>{s.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'hotels' && (
                <motion.div 
                  key="hotels"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hotels-list-detailed"
                >
                  {hotels.map((h, i) => (
                    <div key={i} className="hotel-premium-card" style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '24px' }}>
                      <div className="hotel-main">
                        <div className="hotel-meta">
                          <span className={`cat-pill ${h.category?.toLowerCase().replace(' ', '-') || 'mid'}`}>{h.category}</span>
                          <h4 style={{ fontSize: '1.4rem', marginTop: '0.5rem' }}>{h.name}</h4>
                        </div>
                        <div className="hotel-pricing" style={{ marginRight: '2rem' }}>
                           <span className="price-val" style={{ fontSize: '1.6rem' }}>{h.price}</span>
                           <span className="per-night">/est avg</span>
                        </div>
                      </div>
                      <a href={h.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-book" style={{ padding: '12px 24px', borderRadius: '14px' }}>
                        Book Strategy ↗
                      </a>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </motion.div>

      <SpotModal 
        spot={selectedSpot} 
        onClose={() => setSelectedSpot(null)} 
      />
    </>
  );
};

export default InfoSidebar;
