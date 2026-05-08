import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SpotModal = ({ spot, onClose }) => {
  if (!spot) return null;

  return (
    <AnimatePresence>
      <div className="spot-modal-overlay" onClick={onClose}>
        <motion.div 
          className="spot-modal-box"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="spot-gallery-wrap">
            <img src={spot.imageUrl} alt={spot.name} referrerPolicy="no-referrer" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&q=80'; }} />

          </div>

          <div className="spot-detail-content">
            <button className="close-btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#fff' }} onClick={onClose}>✖</button>
            <h2 className="spot-title-pro">{spot.name}</h2>
            <p className="spot-desc-pro" style={{ fontSize: '1.1rem', opacity: 0.8, lineHeight: '1.8' }}>
              {spot.description}
            </p>

            {/* Comprehensive Spot Guide */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ background: 'var(--color-parchment)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-forest)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  🗺️ Step-by-Step Directions
                </div>
                <p style={{ color: 'var(--color-ink)', opacity: 0.9, lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
                  {spot.directions || "Follow the main trail from the destination center."}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                  <strong>Brief:</strong> {spot.tourGuide}
                </div>
              </div>

              <div style={{ background: '#fef9ee', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--color-saffron)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-terracotta)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  💰 Transport Cost Guide
                </div>
                <p style={{ color: 'var(--color-ink)', opacity: 0.9, lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
                  {spot.transportCost || "Inquire locally for current transport rates."}
                </p>
              </div>

              <div style={{ background: '#f5f7fa', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #64748b' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  🎒 Survival & Supplies
                </div>
                <p style={{ color: 'var(--color-ink)', opacity: 0.9, lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
                  {spot.suppliesNeeded || "Bring basic walking supplies and sun protection."}
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SpotModal;
