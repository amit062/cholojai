import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminDestinationForm = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '', location: '', division: '', description: '', imageUrl: '', category: 'All',
    topSpots: [], hotelOptions: [], restaurants: []
  });

  const categories = ['Beach', 'Hill', 'Nature', 'Historical', 'Wildlife', 'City'];
  const divisions = ['Chattogram', 'Sylhet', 'Dhaka', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Mymensingh'];

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/destinations/${id}`)
        .then(res => setFormData(res.data))
        .catch(console.error);
    }
  }, [id]);

  const handleBaseChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Dynamic Handlers
  const addSpot = () => {
    if (formData.topSpots.length >= 5) return alert("Maximum 5 spots allowed");
    setFormData({ ...formData, topSpots: [...formData.topSpots, { name: '', description: '', imageUrl: '', tourGuide: '' }] });
  };
  const updateSpot = (index, field, value) => {
    const newSpots = [...formData.topSpots];
    newSpots[index][field] = value;
    setFormData({ ...formData, topSpots: newSpots });
  };

  const addHotel = () => {
    setFormData({ ...formData, hotelOptions: [...formData.hotelOptions, { name: '', price: '', category: 'Mid-Range', bookingUrl: '' }] });
  };
  const updateHotel = (index, field, value) => {
    const newHotels = [...formData.hotelOptions];
    newHotels[index][field] = value;
    setFormData({ ...formData, hotelOptions: newHotels });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/destinations/${id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/destinations`, formData);
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Failed to save destination');
    }
  };

  if (loading) return null;

  return (
    <div className="home-portal" style={{ minHeight: '100vh', padding: '8rem 2rem 4rem' }}>
      <div className="main-content" style={{ padding: 0, maxWidth: '900px' }}>
        <h2 className="section-title">{id ? 'Edit Destination' : 'Add New Destination'}</h2>
        
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }}>
          
          {/* Base Info */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--color-terracotta)', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Basic Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><label>Name</label><input required className="search-input" style={{background:'#f5f5f5', color:'#000'}} name="name" value={formData.name} onChange={handleBaseChange} /></div>
              <div><label>Location</label><input required className="search-input" style={{background:'#f5f5f5', color:'#000'}} name="location" value={formData.location} onChange={handleBaseChange} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Division</label>
                <select name="division" className="search-input" style={{background:'#f5f5f5', color:'#000', width: '100%'}} value={formData.division} onChange={handleBaseChange}>
                  <option value="">Select Division</option>
                  {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label>Category</label>
                <select name="category" className="search-input" style={{background:'#f5f5f5', color:'#000', width: '100%'}} value={formData.category} onChange={handleBaseChange}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label>Image URL</label>
              <input required className="search-input" style={{background:'#f5f5f5', color:'#000', width: '100%', marginBottom: '1rem'}} name="imageUrl" value={formData.imageUrl} onChange={handleBaseChange} />
            </div>
            <div>
              <label>Description (Rich text capable)</label>
              <textarea required rows="4" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#f5f5f5', outline: 'none', fontFamily:'inherit'}} name="description" value={formData.description} onChange={handleBaseChange} />
            </div>
          </div>

          {/* Spots */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--color-terracotta)', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              Top Spots ({formData.topSpots.length}/5)
              <button type="button" onClick={addSpot} style={{background:'var(--color-forest)', color:'#fff', border:'none', padding:'0.2rem 0.8rem', borderRadius:'50px', cursor:'pointer', fontSize:'0.8rem'}}>+ Add Spot</button>
            </h3>
            {formData.topSpots.map((spot, i) => (
              <div key={i} style={{ background: 'var(--color-parchment)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Spot {i+1}</p>
                <input placeholder="Spot Name" style={{width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={spot.name} onChange={e => updateSpot(i, 'name', e.target.value)} />
                <input placeholder="Image URL" style={{width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={spot.imageUrl} onChange={e => updateSpot(i, 'imageUrl', e.target.value)} />
                <textarea placeholder="Description" rows="2" style={{width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={spot.description} onChange={e => updateSpot(i, 'description', e.target.value)} />
              </div>
            ))}
          </div>

          {/* Hotels */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--color-terracotta)', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              Hotels
              <button type="button" onClick={addHotel} style={{background:'var(--color-forest)', color:'#fff', border:'none', padding:'0.2rem 0.8rem', borderRadius:'50px', cursor:'pointer', fontSize:'0.8rem'}}>+ Add Hotel</button>
            </h3>
            {formData.hotelOptions.map((h, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) 1fr 1fr 2fr', gap: '0.5rem', background: 'var(--color-parchment)', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <input placeholder="Hotel Name" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={h.name} onChange={e => updateHotel(i, 'name', e.target.value)} />
                <input placeholder="Price" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={h.price} onChange={e => updateHotel(i, 'price', e.target.value)} />
                <select style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={h.category} onChange={e => updateHotel(i, 'category', e.target.value)}>
                  <option>Luxury</option><option>Premium</option><option>Mid-Range</option><option>Budget</option>
                </select>
                <input placeholder="Booking URL" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={h.bookingUrl} onChange={e => updateHotel(i, 'bookingUrl', e.target.value)} />
              </div>
            ))}
          </div>

          <button type="submit" className="search-btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            {id ? 'Update Destination' : 'Create Destination'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminDestinationForm;
