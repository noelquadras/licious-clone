import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    alignItems: 'center'
  };

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', color: '#d92662', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Licious Clone
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Base Products</Link>
        <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</Link>
        <Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>Register</Link>
        <Link to="/cart" style={{ textDecoration: 'none', color: '#333' }}>Cart</Link>
      </div>
    </nav>
  );
};

export default Navbar;