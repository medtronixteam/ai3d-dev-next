import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiSettings, FiClock } from 'react-icons/fi';
import { LuCalendarRange } from 'react-icons/lu';
import { BiScan } from 'react-icons/bi';
import { isDashboardHomePath } from '../../routes/paths';
import './BottomNavBar.css';

const BottomNavBar = () => {
  const location = useLocation();

  const handleScanNavClick = (e) => {
    if (location.pathname === '/3dio/new/scan') {
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent('reset-scan-new', { detail: { fromSamePage: true } }),
      );
      return;
    }

    window.dispatchEvent(
      new CustomEvent('reset-scan-new', { detail: { fromSamePage: false } }),
    );
  };

  return (
    <div className="bottom-nav-bar">
      <NavLink
        to="/3dio/"
        end
        className={() =>
          `bottom-nav-item${isDashboardHomePath(location.pathname) ? ' active' : ''}`
        }
      >
        <FiHome className="bottom-nav-icon" />
        <span className="bottom-nav-label">Home</span>
      </NavLink>
      <NavLink to="/3dio/api-sdk" className="bottom-nav-item">
        <LuCalendarRange className="bottom-nav-icon" />
        <span className="bottom-nav-label">API SDK</span>
      </NavLink>
      <NavLink 
        to="/3dio/new/scan" 
        className="bottom-nav-scan"
        onClick={handleScanNavClick}
      >
        <div className="scan-btn">
          <BiScan className="scan-icon" style={{ color: '#fff', fontSize: 32 }} />
        </div>
      </NavLink>
      <NavLink to="/3dio/models" className="bottom-nav-item">
        <FiClock className="bottom-nav-icon" />
        <span className="bottom-nav-label">Models</span>
      </NavLink>
      <NavLink to="/3dio/settings/profile" className="bottom-nav-item">
        <FiSettings className="bottom-nav-icon" />
        <span className="bottom-nav-label">Settings</span>
      </NavLink>
    </div>
  );
};

export default BottomNavBar; 