import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiSettings, FiClock } from 'react-icons/fi';
import { LuCalendarRange } from 'react-icons/lu';
import { BiScan } from 'react-icons/bi';
import './BottomNavBar.css';

const BottomNavBar = () => {
  return (
    <div className="bottom-nav-bar">
      <a href="/3dio/" className="bottom-nav-item">
        <FiHome className="bottom-nav-icon" />
        <span className="bottom-nav-label">Home</span>
      </a>
      <NavLink to="/3dio/api-sdk" className="bottom-nav-item">
        <LuCalendarRange className="bottom-nav-icon" />
        <span className="bottom-nav-label">API SDK</span>
      </NavLink>
      <NavLink 
        to="/3dio/new/scan" 
        className="bottom-nav-scan"
        onClick={() => window.dispatchEvent(new CustomEvent('reset-scan-new'))}
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