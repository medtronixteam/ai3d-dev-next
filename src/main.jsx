import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'simplebar-react/dist/simplebar.min.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YourPublishableKeyHere');

// =============================
// Theme Initialization
// =============================

// Detect user's system theme
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Get saved theme from localStorage OR fallback to system theme
const savedTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');

// Apply theme to <html> element
document.documentElement.setAttribute('data-theme', savedTheme);

// Keep theme synced across browser tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'theme') {
    const nextTheme = event.newValue || 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
  }
});

// Detect live system theme changes (only applies if user hasn't manually chosen a theme)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const newTheme = e.matches ? 'dark' : 'light';
  if (!localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', newTheme);
  }
});

// =============================
// React App Render
// =============================
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <Elements stripe={stripePromise}>
          <ToastContainer position="top-right" autoClose={3000} />
          <RouterProvider router={router} />
        </Elements>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
