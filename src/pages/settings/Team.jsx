import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useAuth } from '../../context/AuthContext';
import "./Team.css";

const TeamSettings = () => {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(prev => !prev);
    // Dispatch custom event to communicate with parent layout
    const event = new CustomEvent('sidebarToggle', { detail: { open: !sidebarOpen } });
    window.dispatchEvent(event);
  };

  return (
    <div className="team-settings-page">
      {/* Responsive styles */}
      <style>{`
        .team-settings-page {
          min-height: 100vh;
          background: #fff;
          padding: 2rem 0;
        }
          .team-search-container:focus-within {
            outline: none;
            box-shadow: 0 0 10px var(--primary-color) !important;
          }
        
        .team-header-section {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-bottom: 2rem;
          padding: 0 2rem;
        }
        
        .team-search-container {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 237, 247, 1);
          border: none;
          border-radius: 8px;
          padding: 10px 16px !important;
          min-width: 265px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
          max-width: 400px;
          width: 100%;
        }
        
        .team-search-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          color: #232334;
          width: 100%;
        }
        
        .team-search-input::placeholder {
          color: #999;
        }
        
        .team-sidebar-toggle {
          display: none;
          background: #fff;
          color: #DE3996;
          border: 1px solid #eee;
          border-radius: 6px;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: background 0.2s, transform 0.3s, color 0.2s;
          position: relative;
          z-index: 1100;
          margin-right: 12px;
        }
          .team-search-container:focus-within{
  box-shadow: 0 0 10px var(--primary-color) !important;

}
        @media (max-width: 992px) {
          .team-header-section {
            justify-content: flex-start;
            padding: 0 1rem;
          }
          
          .team-sidebar-toggle {
            display: flex;
          }
          
          .team-search-container {
            flex: 1;
            min-width: 0;
            max-width: none;
            margin-left: 12px;
          }
        }
          .team-search-container input:focus + .team-search-container,
.team-search-container:has(input:focus) {
  box-shadow: 0 0 10px var(--primary-color) !important;
}
        
        /* Dark mode support */
        [data-theme='dark'] .team-settings-page,
        .dark .team-settings-page {
          background: #18182a;
          color: #f3f3fa;
        }
        
        [data-theme='dark'] .team-search-container,
        .dark .team-search-container {
          background: #232334;
        }
        
        [data-theme='dark'] .team-search-input,
        .dark .team-search-input {
          color: #f3f3fa;
        }
        
        [data-theme='dark'] .team-search-input::placeholder,
        .dark .team-search-input::placeholder {
          color: #b3b3c6;
        }
        
        [data-theme='dark'] .team-sidebar-toggle,
        .dark .team-sidebar-toggle {
          background: #232334;
          color: #DE3996;
          border: 1px solid #39395a;
        }
      `}</style>

      {/* Header with Search Bar */}
      <div className="team-header-section">
        <button
          className="team-sidebar-toggle"
          onClick={handleSidebarToggle}
          aria-label="Open sidebar"
        >
          <RxHamburgerMenu />
        </button>

        <div className="team-search-container">
          <FiSearch style={{ color: '#999', fontSize: '18px', marginRight: '12px' }} />
          <input
            type="text"
            placeholder="Search in team settings..."
            value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            className="team-search-input"
          />
        </div>
      </div>

      {/* Team Settings Content */}
      <div style={{ padding: '0 2rem' }}>
    <h2>Team Settings</h2>
        <p>Team settings content will go here...</p>
      </div>
  </div>
);
};

export default TeamSettings; 