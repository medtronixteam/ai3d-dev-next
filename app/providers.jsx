'use client';

import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from '../src/context/AuthContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { WorkspaceProvider } from '../src/context/WorkspaceContext';
import { SocketProvider } from '../src/context/SocketContext';
import CookieConsent from '../src/components/CookieConsent';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    'pk_live_51TvzB97QrDvHQjE0SWoiXc7NbgssynHx3okHicqJjyCrVtT4is9LXruQxAcZrcpWradpsF3cZc29oGa8h6XWSqAa008Rlpu4ce',
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <h1 style={{ color: '#e74c3c' }}>Something went wrong</h1>
          <p style={{ color: '#7f8c8d' }}>Please refresh the page or contact support</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Providers({ children }) {
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === 'theme') {
        document.documentElement.setAttribute('data-theme', event.newValue || 'dark');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <WorkspaceProvider>
            <Elements stripe={stripePromise}>
              <ToastContainer position="top-right" autoClose={3000} />
              <AuthProvider>
                <SocketProvider>
                  <Elements stripe={stripePromise}>
                    {children}
                    <CookieConsent />
                  </Elements>
                </SocketProvider>
              </AuthProvider>
            </Elements>
          </WorkspaceProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
