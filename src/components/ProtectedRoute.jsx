import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuth();

  if (typeof token === 'undefined' || (token === null && localStorage.getItem('token'))) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#e6339a' }}>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export default ProtectedRoute; 