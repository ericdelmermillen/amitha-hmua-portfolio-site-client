import React, { useState, useContext } from 'react';
import AppContext from '../../AppContext'; 

import './LoginForm.scss';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const { 
    isLoggedIn, 
    setIsLoggedIn
  } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
  
      if (response.ok) {
        // Handle successful login
        setIsLoggedIn(true);
      } else {
        // Handle login error
        console.error('Login failed');
      }
    } catch (error) {
      // Handle fetch error
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="loginForm">
      <div className="loginForm__modal">
        <h2 className="loginForm__title">Admin Login</h2>
        <form 
          className="loginForm__form" 
          onSubmit={handleSubmit}
        >
          <div className="loginForm__group">
            <label htmlFor="email" className="loginForm__label">Email</label>
            <input
              type="email"
              id="email"
              className="loginForm__input"
              value={email}
              placeholder="Email"
              onChange={handleEmailChange}
            />
          </div>
          <div className="loginForm__group">
            <label htmlFor="password" className="loginForm__label">Password</label>
            <input
              type="password"
              id="password"
              className="loginForm__input"
              value={password}
              placeholder="Password"
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" className="loginForm__button">Login</button>
        </form>
      </div>
    </div>
  )};

export default LoginForm;
