'use client';

import { ToastContainer } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from '../src/context/AuthContext';
import CookieConsent from '../src/components/CookieConsent';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    'pk_live_51TvzB97QrDvHQjE0SWoiXc7NbgssynHx3okHicqJjyCrVtT4is9LXruQxAcZrcpWradpsF3cZc29oGa8h6XWSqAa008Rlpu4ce',
);

export default function MarketingShell({ children }) {
  return (
    <AuthProvider ssrSafe>
      <Elements stripe={stripePromise}>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
        <CookieConsent />
      </Elements>
    </AuthProvider>
  );
}
