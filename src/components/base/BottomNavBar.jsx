import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiSettings, FiClock } from 'react-icons/fi';
import { LuCalendarRange } from 'react-icons/lu';
import { BiScan } from 'react-icons/bi';
import './BottomNavBar.css';

const BottomNavBar = () => {
  return (
    <div className="bottom-nav-bar">
      <a href="/platform/" className="bottom-nav-item">
        <FiHome className="bottom-nav-icon" />
        <span className="bottom-nav-label">Home</span>
      </a>
      <NavLink to="/platform/api-sdk" className="bottom-nav-item">
        <LuCalendarRange className="bottom-nav-icon" />
        <span className="bottom-nav-label">API SDK</span>
      </NavLink>
      <NavLink to="/platform/new/scan" className="bottom-nav-scan">
        <div className="scan-btn">
          <BiScan className="scan-icon" style={{ color: '#fff', fontSize: 32 }} />
        </div>
      </NavLink>
      <NavLink to="/platform/recent-projects" className="bottom-nav-item">
        <FiClock className="bottom-nav-icon" />
        <span className="bottom-nav-label">Recent</span>
      </NavLink>
      <NavLink to="/platform/settings/profile" className="bottom-nav-item">
        <FiSettings className="bottom-nav-icon" />
        <span className="bottom-nav-label">Settings</span>
      </NavLink>
    </div>
  );
};

export default BottomNavBar; 