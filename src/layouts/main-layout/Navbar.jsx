import React from 'react';
import { FiPlay, FiBell, FiPower, FiSearch } from 'react-icons/fi';
import { MdPowerSettingsNew } from 'react-icons/md';
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';
import { FaCrown } from 'react-icons/fa';
import Diamond from '../../assets/images/diamond.png';
import './Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { useState, useRef } from 'react';
import Starfield from '../../components/effects/Starfield';
import { useAuth } from '../../context/AuthContext';
import CustomLoader from '../../components/loader/CustomLoader';
import { FiCheck } from 'react-icons/fi';
import modalVideo from '../../assets/images/3dModal.mp4';
import SubscriptionModal from '../../components/popup/SubscriptionModal';

// const VIDEO_URL = modalVideo;

function VideoModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const [error, setError] = useState(false);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      setError(false);
      setVideoKey(prev => prev + 1); // force remount video
    }
  }, [open]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.38)',
      transition: 'none',
    }}>
      <div style={{
        position: 'relative',
        background: 'transparent',
        borderRadius: 18,
        boxShadow: 'none',
        maxWidth: 720,
        width: '97vw',
        maxHeight: '82vh',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transformStyle: 'none',
        perspective: 'none',
        border: 'none',
        backdropFilter: 'none',
        transition: 'none',
      }}>
        <button onClick={onClose} style={{
          position:'absolute',
          top:18,
          right:18,
          zIndex:10001,
          background:'var(--primary-color)',
          border:'none',
          borderRadius:'50%',
          width:38,
          height:38,
          color:'#fff',
          fontSize:26,
          cursor:'pointer',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          boxShadow:'0 2px 12px rgba(0,0,0,0.10)'
        }} aria-label="Close video">
          <RxCross2 style={{ fontSize: 22, color: '#fff', margin: 0, padding: 0 }} />
        </button>
        {/* Only one loader inside modal while video loads */}
        {loading && !error && (
          <div style={{
            position: 'absolute',
            left: 0, top: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.12)', zIndex: 10000
          }}>
            <CustomLoader />
          </div>
        )}
        {error && (
          <div style={{
            position: 'absolute',
            left: 0, top: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.12)', zIndex: 10000,
            color: '#e6339a', fontWeight: 700, fontSize: 22
          }}>
            Video failed to load.
          </div>
        )}
        <video
          key={videoKey}
          ref={videoRef}
          src={modalVideo}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            borderRadius: 10,
            background: 'transparent',
            boxShadow: 'none',
            zIndex: 10000,
            display: 'block',
          }}
          onLoadedData={() => setLoading(false)}
          onCanPlay={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
        />
      </div>
    </div>
  );
}

const Navbar = ({ onSidebarToggle, sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, notifications, markAllAsRead, toggleNotificationRead, togglingNotifications, markAllLoading } = useNotification();
  const [videoOpen, setVideoOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifBtnRef = useRef();
  const { token } = useAuth();
  
  // Check if current route is a settings page or recent projects page
  const isSettingsPage = location.pathname.startsWith('/platform/settings');
  const isRecentProjectsPage = location.pathname === '/platform/recent-projects';

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (notifBtnRef.current && !notifBtnRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  // Remove auto mark as read on open
  // React.useEffect(() => {
  //   if (notifOpen) {
  //     markAllAsRead();
  //   }
  // }, [notifOpen, markAllAsRead]);

  return (
    <nav className="navbar">
      <button
        className={`navbar-sidebar-toggle${sidebarOpen ? ' open' : ''}`}
        onClick={onSidebarToggle}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <RxCross2 /> : <RxHamburgerMenu />}
      </button>

      {/* Left-aligned search for Recent Projects route */}
      {isRecentProjectsPage && (
        <div className="navbar-left">
          <div className={`navbar-search-container navbar-search-container--white`}>
            <FiSearch className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Search"
              className="navbar-search-input"
            />
          </div>
        </div>
      )}
      {/* Right section: search for settings pages OR default actions */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        {isSettingsPage ? (
          // Search input for settings pages (right-aligned)
          <div className={`navbar-search-container`}>
            <FiSearch className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Search"
              className="navbar-search-input"
            />
          </div>
        ) : (
          // Regular navbar content for non-settings pages
          <>
        <button
          className="upgrade-btn"
          onClick={() => setSubscriptionModalOpen(true)}
        >
          <img src={Diamond} alt="Upgrade Icon" style={{ width: 18, marginRight: 6 }} />
          Upgrade your plan
        </button>
        {!token && (
          <button
            className="sign-in-btn"
            onClick={() => navigate('/signup')}
            aria-label="Sign up"
          >
            Sign up
          </button>
            )}
          </>
        )}
      </div>
      {/* Play button - only show on non-settings pages */}
      {token && !isSettingsPage && (
        <>
          <button
            className="navbar-icon-btn"
            onClick={() => setVideoOpen(true)}
            aria-label="Open 3D Model Video"
          >
            <FiPlay />
          </button>
          <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
        </>
      )}
      
      {/* Notification icon - always show when user is authenticated */}
      {token && (
          <div style={{ position: 'relative', display: 'inline-block' }} ref={notifBtnRef}>
            <button
              className="navbar-icon-btn notification-btn"
              onClick={() => setNotifOpen((o) => !o)}
              aria-label="Show notifications"
              style={{ position: 'relative' }}
            >
              <FiBell />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'rgb(255, 214, 0)',
                  border: '2.5px solid rgb(255, 214, 0)',
                  display: 'block',
                  zIndex: 2,
                  animation: 'notif-dot-pop 0.5s cubic-bezier(.4,1.7,.6,1)',
                }} />
              )}
            </button>
            {notifOpen && (
              <div className="notif-dropdown">
                <div className="notif-dropdown-header">
                  <span>Notifications</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   
                    {unreadCount > 0 && (
                      <button 
                        className="notif-mark-all-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllAsRead();
                        }}
                        disabled={markAllLoading}
                        style={{ 
                       background: 'none',
                          color: 'black',
                          // borderBottom: '1px solid black',
                          textDecoration: 'underline',
                          borderRadius: 'none',
                          boxShadow: 'none',
                          fontWeight: '700',
                          fontSize: '12px',
                          padding: '6px 10px',
                          cursor: markAllLoading ? 'not-allowed' : 'pointer',
                          transition: 'background 0.2s, color 0.2s',
                          minWidth: '0',
                          minHeight: '0',
                          lineHeight: '1',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {markAllLoading ? (
                          <>
                            <div className="loading-spinner" style={{ width: '10px', height: '10px', border: '2px solid #fff', borderTop: '2px solid transparent' }}></div>
                            Marking...
                          </>
                        ) : (
                          'Mark all as read'
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {/* <div style={{ 
                  fontSize: '11px', 
                  color: '#888', 
                  padding: '8px 16px', 
                  borderBottom: '1px solid #f3e6f3',
                  fontStyle: 'italic'
                }}>
                  Click to toggle read/unread status
                </div> */}
                <div className="notif-dropdown-list">
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notif, idx) => {
                      const isToggling = togglingNotifications.has(notif.id);
                      return (
                        <div 
                          key={notif.id || idx} 
                          className={`notif-item${notif.read_at ? ' read' : ' unread'}${isToggling ? ' toggling' : ''}`}
                          onClick={() => !isToggling && toggleNotificationRead(notif.id)}
                          style={{ cursor: isToggling ? 'not-allowed' : 'pointer' }}
                        > 
                          {/* Dot, Tick, or Loading icon */}
                          {isToggling ? (
                            <span className="notif-status-icon notif-loading">
                              <div className="loading-spinner"></div>
                            </span>
                          ) : notif.read_at ? (
                            <span className="notif-status-icon notif-tick"><FiCheck /></span>
                          ) : (
                            <span className="notif-status-icon notif-dot"></span>
                          )}
                          <div className="notif-message">
                            {notif.data?.message || notif.message || notif.text || notif.title || 'New notification'}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="notif-empty">No notifications</div>
                  )}
                </div>
              </div>
            )}
            <style>{`
              @keyframes notif-dot-pop {
                0% { transform: scale(0.2); opacity: 0; }
                60% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
              }
              @keyframes notif-dropdown-in {
                0% { opacity: 0; transform: translateY(-18px) scale(0.95) rotateX(18deg); }
                60% { opacity: 1; transform: translateY(6px) scale(1.04) rotateX(-6deg); }
                100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
              }
              @keyframes notif-item-in {
                0% { opacity: 0; transform: translateY(18px) scale(0.95); }
                60% { opacity: 1; transform: translateY(-2px) scale(1.04); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal 
        open={subscriptionModalOpen} 
        onClose={() => setSubscriptionModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar; 