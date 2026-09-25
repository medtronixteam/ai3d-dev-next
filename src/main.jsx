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
import { WorkspaceProvider } from './context/WorkspaceContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// =============================
// iOS Error Boundary
// =============================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔴 React Error Boundary Caught:', error, errorInfo);
    // Log to external service if needed
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ color: '#e74c3c' }}>Something went wrong</h1>
          <p style={{ color: '#7f8c8d' }}>Please refresh the page or contact support</p>
          <pre style={{ 
            background: '#ecf0f1', 
            padding: '10px', 
            borderRadius: '5px',
            fontSize: '12px',
            overflow: 'auto',
            maxWidth: '90%'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
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

// =============================
// Stripe Configuration
// =============================
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    'pk_live_51TvzB97QrDvHQjE0SWoiXc7NbgssynHx3okHicqJjyCrVtT4is9LXruQxAcZrcpWradpsF3cZc29oGa8h6XWSqAa008Rlpu4ce',
);

// =============================
// Theme Initialization
// =============================
// Force dark mode by default
const forcedDefaultTheme = 'dark'; // Change this to 'light' if you want to force light mode instead

// Get saved theme from localStorage OR fallback to the forced default
const savedTheme = localStorage.getItem('theme') || forcedDefaultTheme;

// Apply the determined theme to the <html> element immediately
document.documentElement.setAttribute('data-theme', savedTheme);

// Keep theme synced across browser tabs when localStorage changes in another tab
window.addEventListener('storage', (event) => {
  if (event.key === 'theme') {
    const nextTheme = event.newValue || forcedDefaultTheme; // Fallback to forced default if value is null/invalid
    document.documentElement.setAttribute('data-theme', nextTheme);
  }
});

// Detect live system theme changes (only applies if user hasn't manually chosen a theme via localStorage)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const newSystemTheme = e.matches ? 'dark' : 'light';
  // Only update the theme if the user hasn't saved a preference in localStorage
  if (!localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', newSystemTheme);
  }
});

// =============================
// Root Element Check
// =============================
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('🔴 CRITICAL: Root element not found!');
  // Create error message in body
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
      <div style="text-align: center;">
        <h1 style="color: #e74c3c;">Root Element Missing</h1>
        <p>The application cannot start because the root element is missing.</p>
      </div>
    </div>
  `;
  throw new Error('Root element (#root) not found in DOM');
}

// =============================
// React App Render
// =============================
console.log('🚀 Initializing React App...');

try {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <NotificationProvider>
            <WorkspaceProvider>
            <Elements stripe={stripePromise}>
              <ToastContainer position="top-right" autoClose={3000} />
              <RouterProvider router={router} />
            </Elements>
            </WorkspaceProvider>
          </NotificationProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );

  console.log('✅ React App Mounted Successfully');
  
  // Signal to Flutter WebView that React is ready
  if (window.FlutterLog) {
    window.FlutterLog.postMessage('React app mounted and ready');
  }
  
} catch (error) {
  console.error('🔴 Failed to render React app:', error);
  
  // Show error in DOM
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; padding: 20px;">
      <div style="text-align: center;">
        <h1 style="color: #e74c3c;">App Initialization Failed</h1>
        <p style="color: #7f8c8d;">Please refresh the page or contact support.</p>
        <pre style="background: #ecf0f1; padding: 10px; border-radius: 5px; text-align: left; overflow: auto;">
          ${error.toString()}
        </pre>
        <button 
          onclick="window.location.reload()"
          style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;"
        >
          Reload
        </button>
      </div>
    </div>
  `;
}
