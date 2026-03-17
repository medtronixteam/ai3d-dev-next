import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { SocketProvider } from './context/SocketContext';

const stripePromise = loadStripe('pk_test_51Ro0YlQ70PrIzDS75v3YwqGKLv5FOgPCS9zckYEyRKv8PMfEa21B6RWFbX1bdRIYXwhrcbaw88c6DOlKStzuMdVR00tP56C98S');

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
      <Elements stripe={stripePromise}>
        <Outlet />
      </Elements>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;