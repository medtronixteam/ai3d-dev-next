import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../config';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Global 401 interceptor
  /*
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (
          error.response &&
          error.response.status === 401 &&
          !(error.config && error.config.skipAuthInterceptor)
        ) {
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.replace('/signin');
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);
  */

  useEffect(() => {
    if (token) {
      let userObj = null;
      try {
        const userStr = localStorage.getItem('user');
        userObj = userStr ? JSON.parse(userStr) : null;
      } catch (e) {
        userObj = null;
      }
      setUser(userObj && typeof userObj === 'object' ? userObj : { token });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // window.location.reload(); // Removed to allow React Router navigation after login
  };

  const signup = async (data) => {
    try {
      const res = await axios.post(`${baseURL}/auth/signup`, data);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${baseURL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      // Optionally handle error (e.g., show toast)
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 