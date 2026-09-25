import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { SocketProvider } from './context/SocketContext';
import CookieConsent from './components/CookieConsent';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    'pk_live_51TvzB97QrDvHQjE0SWoiXc7NbgssynHx3okHicqJjyCrVtT4is9LXruQxAcZrcpWradpsF3cZc29oGa8h6XWSqAa008Rlpu4ce'
);

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
      <Elements stripe={stripePromise}>
        <Outlet />
        <CookieConsent />
      </Elements>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;