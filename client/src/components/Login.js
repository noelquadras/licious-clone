//Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/user/login', formData);
      console.log('Login Success:', res.data);
      
      // CRITICAL STEP: Save the token to LocalStorage
      // The backend likely returns { token: "...", user: {...} }
      // Adjust 'res.data.token' if your backend names it differently (e.g. res.data.accessToken)
      const token = res.data.token || res.data.accessToken;
      const user = res.data.user; 
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.name);
      
      alert('Login Successful!');
      navigate('/'); // Redirect to Home
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      alert('Invalid Credentials');
    }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#d92662' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} style={inputStyle} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle} required />
        
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#d92662', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;