import React, { useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { FiFolder } from 'react-icons/fi';
import './SidebarItem.css';
import { SidebarPopover } from './index';
import { useAuth } from '../../../context/AuthContext';
import { useMediaQuery } from '@mui/material';
import SubscriptionImg from '../../../assets/images/subsciption.png';
import DarkSubscriptionImg from '../../../assets/images/darkSubscription.png';
import ActiveSubscriptionImg from '../../../assets/images/darkSubscription.png';
// import ActiveSubscriptionImg from '../../../assets/images/activeSubscription.png';

const SidebarItem = ({ item, isCollapsed }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { token } = useAuth();
  const isMobile = useMediaQuery('(max-width:992px)');

  const isSubscription = item.title === 'Subscription';
  const isSubscriptionActive =
    isSubscription &&
    (location.pathname === item.path || location.pathname.startsWith('/3dio/subscription'));

  // Check for Settings active state
  const isSettings = item.title === 'Settings';
  const isSettingsActive = isSettings && location.pathname.startsWith('/3dio/settings');

  // check dark mode
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  // Update isActive logic to include Settings check
  const isActive = location.pathname === item.path || (isSettings && isSettingsActive);

  // 👇 Render icon logic
  const renderIcon = () => {
    if (item.title === 'Recent Projects' || item.title === 'Workspaces' || item.title === 'My Workspace') {
      return <FiFolder className="sidebar-react-icon" />;
    } else if (item.title === 'Subscription') {
      let subscriptionImage;
      if (!isDarkMode && isSubscriptionActive) {
        subscriptionImage = ActiveSubscriptionImg;
      } else if (isDarkMode) {
        subscriptionImage = DarkSubscriptionImg;
      } else {
        subscriptionImage = SubscriptionImg;
      }

      const imageStyle = {
        width: 20,
        objectFit: 'contain',
        ...(isCollapsed ? {} : { marginRight: 6 }),
      };

      return (
        <img
          src={subscriptionImage}
          alt="Subscription"
          style={imageStyle}
          className="sidebar-subscription-icon"
        />
      );
    } else if (item.icon && typeof item.icon === 'object') {
      let iconSrc = item.icon.light;
      if (isDarkMode) {
        iconSrc = item.icon.dark || item.icon.light;
      }
      // Use the updated isActive logic that includes Settings check
      if (!isDarkMode && isActive) {
        iconSrc = item.icon.active || item.icon.light;
      }

      const imageStyle = {
        width: 20,
        objectFit: 'contain',
        ...(isCollapsed ? {} : { marginRight: 6 }),
      };

      return (
        <img src={iconSrc} alt={item.title} style={imageStyle} className="sidebar-image-icon" />
      );
    } else {
      // fallback (in case item.icon is still a React component)
      const Icon = item.icon;
      return Icon ? <Icon className="sidebar-react-icon" /> : null;
    }
  };

  const handleNavClick = (e) => {
    if (item.path === '/3dio/new/scan') {
      window.dispatchEvent(new CustomEvent('reset-scan-new'));
    }
  };

  const isPreview =
    item.title === 'Preview' && item.path && item.path.startsWith('/3dio/preview');
  const isPreviewActive = isPreview && location.pathname.startsWith('/3dio/preview');

  const handleSubscriptionClick = (e) => {
    if (isSubscription && isMobile && !token) {
      e.preventDefault();
      window.location.href = '/3dio/subscription';
    }
  };

  const [hovered, setHovered] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, itemHeight: 0 });
  const itemRef = useRef(null);

  const handleMouseEnter = () => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.top + rect.height / 2,
        left: rect.right,
        itemHeight: rect.height,
      });
    }
    setHovered(true);
  };
  const handleMouseLeave = () => setHovered(false);

  return (
    <div
      className={`sidebar-item${hovered ? ' hovered' : ''}`}
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.title === 'Home' ? (
        <a
          href={item.path}
          className={`sidebar-link${location.pathname === item.path ? ' active' : ''}`}
          onClick={handleNavClick}
        >
          {renderIcon()}
          <span className="sidebar-title">{item.title}</span>
        </a>
      ) : isPreview ? (
        <a href={item.path} className={`sidebar-link${isPreviewActive ? ' active' : ''}`}>
          {renderIcon()}
          <span className="sidebar-title">{item.title}</span>
        </a>
      ) : isSubscription ? (
        <a
          href={item.path}
          className={`sidebar-link${isSubscriptionActive ? ' active' : ''}`}
          onClick={handleSubscriptionClick}
        >
          {renderIcon()}
          <span className="sidebar-title">{item.title}</span>
        </a>
      ) : (
        <NavLink
          to={item.path}
          className={({ isActive: navIsActive }) => {
            // For Settings, check if we're on any settings page
            const shouldBeActive = isSettings ? isSettingsActive : navIsActive;
            return `sidebar-link${shouldBeActive ? ' active' : ''}`;
          }}
          onClick={handleNavClick}
        >
          {renderIcon()}
          <span className="sidebar-title">{item.title}</span>
          {item.children &&
            (open ? (
              <MdKeyboardArrowUp className="sidebar-dropdown-arrow open" />
            ) : (
              <MdKeyboardArrowDown className="sidebar-dropdown-arrow" />
            ))}
        </NavLink>
      )}

      {hovered && isCollapsed && (
        <SidebarPopover
          show={hovered}
          top={popoverPos.top}
          left={popoverPos.left}
          itemHeight={popoverPos.itemHeight}
          colorCSS="var(--primary-color)"
          title={item.title}
          desc={item.desc}
        />
      )}
    </div>
  );
};

export default SidebarItem;
