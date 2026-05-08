import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AiSidebar = ({ isOpen, onClose, destinationName }) => {
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && destinationName) {
      fetchAiSuggestion();
    } else {
      setAiText(''); // clear on close
    }
  }, [isOpen, destinationName]);

  const fetchAiSuggestion = async () => {
    setLoading(true);
    setAiText('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/suggest`, {
        destinationName
      });
      setAiText(res.data.suggestion);
    } catch (error) {
      console.error(error);
      setAiText('Oops! The AI could not process this right now. Please ensure your Gemini API key is configured in the `.env` file and the backend server is restarted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay background */}
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      
      {/* Sidebar Panel */}
      <div className={`ai-sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={onClose}>✖</button>
        
        <h2>✨ AI Trip Advisor</h2>
        <h3 className="destination-focus">Analyzing: {destinationName}</h3>
        
        <div className="ai-content-box">
          {loading ? (
            <div className="ai-loading">
              <div className="dot-flashing"></div>
              <p>Gemini is evaluating weather, costs, and feasibility...</p>
            </div>
          ) : (
            <p className="ai-response">{aiText}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AiSidebar;
