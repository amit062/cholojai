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

  const handleFileUpload = async (e, field, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, formDataUpload, config);
      const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${data.imageUrl}`;

      if (index === null) {
        setFormData((prev) => ({ ...prev, [field]: fullUrl }));
      } else {
        setFormData((prev) => {
          const newSpots = [...prev.topSpots];
          newSpots[index][field] = fullUrl;
          return { ...prev, topSpots: newSpots };
        });
      }
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
    }
  };

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
  const deleteSpot = (index) => {
    const newSpots = formData.topSpots.filter((_, i) => i !== index);
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
  const deleteHotel = (index) => {
    const newHotels = formData.hotelOptions.filter((_, i) => i !== index);
    setFormData({ ...formData, hotelOptions: newHotels });
  };

  const addRestaurant = () => {
    setFormData({ ...formData, restaurants: [...formData.restaurants, { name: '', specialty: '', priceRange: '', description: '' }] });
  };
  const updateRestaurant = (index, field, value) => {
    const newRestaurants = [...formData.restaurants];
    newRestaurants[index][field] = value;
    setFormData({ ...formData, restaurants: newRestaurants });
  };
  const deleteRestaurant = (index) => {
    const newRestaurants = formData.restaurants.filter((_, i) => i !== index);
    setFormData({ ...formData, restaurants: newRestaurants });
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
              <label>Image Upload</label>
              <input type="file" accept="image/*" className="search-input" style={{background:'#f5f5f5', color:'#000', width: '100%', marginBottom: '1rem'}} onChange={(e) => handleFileUpload(e, 'imageUrl')} />
              {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem'}} />}
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
              <div key={i} style={{ background: 'var(--color-parchment)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>Spot {i+1}</p>
                  <button type="button" onClick={() => deleteSpot(i)} style={{background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'}}>Delete Spot</button>
                </div>
                <input placeholder="Spot Name" style={{width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={spot.name} onChange={e => updateSpot(i, 'name', e.target.value)} />
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input type="file" accept="image/*" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} onChange={e => handleFileUpload(e, 'imageUrl', i)} />
                  {spot.imageUrl && <img src={spot.imageUrl} alt="Spot Preview" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />}
                </div>
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
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) 1fr 1fr 2fr auto', gap: '0.5rem', background: 'var(--color-parchment)', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input placeholder="Hotel Name" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={h.name} onChange={e => updateHotel(i, 'name', e.target.value)} />
                <input placeholder="Price" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={h.price} onChange={e => updateHotel(i, 'price', e.target.value)} />
                <select style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={h.category} onChange={e => updateHotel(i, 'category', e.target.value)}>
                  <option>Luxury</option><option>Premium</option><option>Mid-Range</option><option>Budget</option>
                </select>
                <input placeholder="Booking URL" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={h.bookingUrl} onChange={e => updateHotel(i, 'bookingUrl', e.target.value)} />
                <button type="button" onClick={() => deleteHotel(i)} style={{background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer'}} title="Delete Hotel">🗑️</button>
              </div>
            ))}
          </div>

          {/* Restaurants */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--color-terracotta)', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              Restaurants
              <button type="button" onClick={addRestaurant} style={{background:'var(--color-forest)', color:'#fff', border:'none', padding:'0.2rem 0.8rem', borderRadius:'50px', cursor:'pointer', fontSize:'0.8rem'}}>+ Add Restaurant</button>
            </h3>
            {formData.restaurants?.map((r, i) => (
              <div key={i} style={{ background: 'var(--color-parchment)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>Restaurant {i+1}</p>
                  <button type="button" onClick={() => deleteRestaurant(i)} style={{background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'}}>Delete Restaurant</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input placeholder="Restaurant Name" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={r.name} onChange={e => updateRestaurant(i, 'name', e.target.value)} />
                  <input placeholder="Specialty" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={r.specialty} onChange={e => updateRestaurant(i, 'specialty', e.target.value)} />
                  <input placeholder="Price Range" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={r.priceRange} onChange={e => updateRestaurant(i, 'priceRange', e.target.value)} />
                </div>
                <textarea placeholder="Description" rows="2" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border:'1px solid #ccc'}} value={r.description} onChange={e => updateRestaurant(i, 'description', e.target.value)} />
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
