import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AiAssistant = ({ activeDestination }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Month extraction for seasonal advice
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = months[new Date().getMonth()];
  const currentDate = new Date().toDateString();

  useEffect(() => {
    if (isOpen) {
      handleConsult();
    }
  }, [isOpen, activeDestination]);

  const handleConsult = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/assistant', {
        destinationName: activeDestination?.name || null,
        currentDate: currentDate,
        currentMonth: currentMonth
      });
      setAiResponse(res.data.advice);
    } catch (err) {
      setAiResponse("I'm fine-tuning my travel maps. Please check back in a moment!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant-container">
      <motion.div 
        className="ai-assistant-fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ fontSize: '1.8rem' }}>🤖</span>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="ai-assistant-bubble"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
          >
            <div className="ai-header">
              <h3>{activeDestination ? `Strategy for ${activeDestination.name}` : `Cholojai Discovery`}</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>{currentDate}</p>
            </div>

            <div className="ai-assistant-content" style={{ marginTop: '1.5rem' }}>
              {loading ? (
                <div className="loading-state">
                  <div className="pulse-loader"></div>
                  <p>Consulting the stars of Bangladesh travel...</p>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              )}
            </div>
            
            <button 
              className="btn-details-pro" 
              style={{ width: '100%', marginTop: '2rem' }}
              onClick={() => setIsOpen(false)}
            >
              Close Assistant
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiAssistant;
