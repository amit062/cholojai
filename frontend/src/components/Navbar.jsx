import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <Link to="/" className="nav-brand">
        ✈️ Cholojai
        <span>DISCOVER AUTHENTIC BANGLADESH</span>
      </Link>

      {/* Desktop Nav */}
      <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ borderBottom: isActive('/') ? '2px solid var(--color-saffron)' : '2px solid transparent', paddingBottom: '2px' }}>
          Home
        </Link>
        <Link to="/destinations" style={{ borderBottom: isActive('/destinations') ? '2px solid var(--color-saffron)' : '2px solid transparent', paddingBottom: '2px' }}>
          Destinations
        </Link>
        <Link to="/about" style={{ borderBottom: isActive('/about') ? '2px solid var(--color-saffron)' : '2px solid transparent', paddingBottom: '2px' }}>
          About BD
        </Link>
        
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 10px' }}></div>

        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'var(--color-saffron)', fontWeight: 700, borderBottom: isActive('/admin') ? '2px solid var(--color-saffron)' : '2px solid transparent' }}>
                Admin
              </Link>
            )}
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: isActive('/profile') ? '2px solid var(--color-saffron)' : '2px solid transparent' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-saffron)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              {user.name.split(' ')[0]}
            </Link>
            <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Log In</Link>
            <Link to="/signup" style={{ background: 'var(--color-terracotta)', padding: '0.5rem 1.25rem', borderRadius: '50px', color: '#fff', fontWeight: 700 }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
