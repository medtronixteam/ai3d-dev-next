import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import CustomSidebar from './sidebar/CustomSidebar';
import Navbar from './Navbar';
import './MainLayout.css';
import ChatIcon from '../../components/chat/ChatIcon';
import ChatScreen from '../../components/chat/ChatScreen';
import { useAuth } from '../../context/AuthContext';
import BottomNavBar from 'components/base/BottomNavBar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const location = useLocation();
  const theme = useTheme();
  const isMobile992 = useMediaQuery('(max-width:992px)');
  const navigate = useNavigate();
  const { token } = useAuth();

  // Reset sidebar open state on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Listen for sidebar toggle events from child components
  useEffect(() => {
    const handleSidebarToggleEvent = (event) => {
      setSidebarOpen(event.detail.open);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggleEvent);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggleEvent);
  }, []);

  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);
  const toggleChat = () => setChatOpen((open) => !open);
  const handleCollapseToggle = () => setIsCollapsed(prev => !prev);
  const handleAutoCollapse = () => setIsCollapsed(true);

  // Show custom sidebar for /platform/settings routes only (not /team) on mobile
  const isCustomSidebarRoute = location.pathname.startsWith('/platform/settings');
  let shouldShowCustomSidebar = false;
  let shouldShowMainSidebar = true;
  let shouldShowNavbar = true;

  // Hide navbar on all settings pages
  if (isCustomSidebarRoute) {
    shouldShowNavbar = false;
  }

  if (isMobile992) {
    if (isCustomSidebarRoute) {
      // On mobile, show both main sidebar and custom sidebar for settings
      shouldShowCustomSidebar = true;
      shouldShowMainSidebar = true;
    } else {
      shouldShowCustomSidebar = false;
      shouldShowMainSidebar = true;
    }
  } else {
    // Desktop logic
    if (isCustomSidebarRoute || location.pathname.startsWith('/platform/team')) {
      shouldShowCustomSidebar = isCollapsed;
      shouldShowMainSidebar = true;
    }
  }

  // Auto-collapse sidebar on desktop for settings/team pages, expand otherwise
  useEffect(() => {
    if (!isMobile992) {
      if (isCustomSidebarRoute) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    }
    // eslint-disable-next-line
  }, [location.pathname, isMobile992]);

  // Auto-uncollapse sidebar when screen goes below 992px
  useEffect(() => {
    if (isMobile992 && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [isMobile992, isCollapsed]);

  return (
    <div className="main-layout">
      {shouldShowMainSidebar && (
        <Sidebar 
          open={sidebarOpen} 
          onClose={handleSidebarClose} 
          isCollapsed={isCollapsed}
          onToggleCollapse={handleCollapseToggle} 
          onAutoCollapse={handleAutoCollapse}
        />
      )}
      {shouldShowCustomSidebar && <CustomSidebar onClose={handleSidebarClose} />}
      <Box component="main" className="main-content">
        {shouldShowNavbar && (
          <Navbar onSidebarToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />
        )}
        {children}
      </Box>
      <ChatIcon onClick={toggleChat} />
      {isChatOpen && <ChatScreen onClose={toggleChat} />}
      {isMobile992 && token && <BottomNavBar />}
    </div>
  );
};

export default MainLayout;