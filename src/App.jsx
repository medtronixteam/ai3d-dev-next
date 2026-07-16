import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import CookieConsent from './components/CookieConsent';

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <Outlet />
        <CookieConsent />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;