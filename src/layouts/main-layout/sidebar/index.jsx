import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { sitemap, bottomLinks } from './sitemap';
import SidebarItem from './SidebarItem';
import './Sidebar.css';
import SidebarToggleIcon from '../../../assets/images/Toggle-icon.png';
import SidebarToggleIconDark from '../../../assets/images/Toggle-img2.png';

export function SidebarPopover({ show, top, left, itemHeight, colorCSS, title, desc }) {
  const color = colorCSS || 'var(--primary-color)';
  const tooltip = (
    <div
      className={`sidebar-tooltip${show ? ' show' : ''}`}
      style={{
        top: (top || 0) - (itemHeight ? itemHeight / 2 : 20) + 2, // Move tooltip 2px lower
        left: (left || 0) + 12,
        background: 'transparent',
        position: 'fixed', // Use fixed to avoid clipping by parent containers
        zIndex: 99999, // Very high z-index to ensure always on top
        pointerEvents: 'none',
      }}
    >
      <div className="sidebar-tooltip-box" style={{ background: color }}>
        <span className="sidebar-tooltip-title">{title}</span>
        {desc && <span className="sidebar-tooltip-desc">{desc}</span>}
        <span className="sidebar-tooltip-arrow" style={{ borderRightColor: color }} />
      </div>
    </div>
  );
  return createPortal(tooltip, document.body);
}

// Add CSS for the tooltip (can be moved to Sidebar.css)
if (typeof document !== 'undefined' && !document.getElementById('sidebar-tooltip-style')) {
  const style = document.createElement('style');
  style.id = 'sidebar-tooltip-style';
  style.innerHTML = `
    .sidebar-tooltip {
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.28s cubic-bezier(.25,1.7,.45,1.32), transform 0.28s cubic-bezier(.25,1.7,.45,1.32);
      transform: translateY(10px) scale(0.98);
      position: fixed; /* Use fixed to avoid clipping */
      pointer-events: none;
      z-index: 99999; /* Very high z-index to stay on top */
    }

    .sidebar-tooltip.show {
      visibility: visible;
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .sidebar-tooltip-box {
      position: relative;
      min-width: 100px;
      max-width: 160px;
      background: var(--primary-color);
      color: #fff;
      border-radius: 8px;
      padding: 6px 12px;
      box-shadow: 0 4px 18px 0 var(--primary-color-light, #e6339a33);
      display: flex;
      flex-direction: column;
      align-items: center; 
      font-family: Nunito, Segoe UI, Arial, sans-serif;
    }

    .sidebar-tooltip-title {
      font-weight: 700;
      font-size: 15px;
      margin-bottom: 1px;
      line-height: 1.2;
      text-align: center; /* Center text */
      width: 100%;
    }

    .sidebar-tooltip-desc {
      font-weight: 400;
      font-size: 13px;
      opacity: 0.92;
      margin-top: 2px;
      line-height: 1.35;
      text-align: center; /* Center text */
      width: 100%;
    }

    .sidebar-tooltip-arrow {
      position: absolute;
      left: -10px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: 10px solid var(--primary-color);
      content: '';
      z-index: 2;
    }
  `;
  document.head.appendChild(style);
}
import ThemeToggle from './ThemeToggle';
import Profile from 'assets/images/Profile.png';
import Logo from 'assets/images/Logo.png';
import ProfilePopup from 'components/popup/ProfilePopup';
import axios from 'axios';
import { baseURL } from '../../../config';
import { FiSearch } from 'react-icons/fi';
// SVG icon assets (explicit per request)
import HomeIcon from 'assets/images/Home.svg';
import ScanIcon from 'assets/images/scan.svg';
import ApiIcon from 'assets/images/ApiSdk1.svg';
import RecentProjectsIcon from 'assets/images/Recent.svg';
import SettingsIcon from 'assets/images/icon4.svg';
import SupportIcon from '../../../assets/icon/SupportIcon.svg';
import ProfileIcon from 'assets/images/ProfileIcon.svg';
import TeamIcon from 'assets/images/team.svg';
import AccountIcon from '../../../assets/icon/SupportIcon.svg';
import LoginIcon from 'assets/images/loginIcon.svg';
import SubscriptionIcon from 'assets/images/subscriptionIcon.svg';
import { useMediaQuery } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import useSidebarCollapse from '../../../hooks/useSidebarCollapse';
import { useLocation } from 'react-router-dom';
import Referal from '../../../assets/images/Referal.svg';
import ProjectIcon from '../../../assets/images/project.svg';
import AiModel from '../../../assets/images/aimodal.svg';
import UpgradeCoin from '../../../assets/images/UpgradeCoin.svg';

// Unified SVG icon components for sidebar
const Icon = (src, alt) => <img src={src} alt={alt} className="sidebar-svg-icon" />;
const IconHome = () => Icon(HomeIcon, 'Home');
const IconScan = () => Icon(ScanIcon, 'Scan');
const IconApi = () => Icon(ApiIcon, 'API & SDK');
const IconRecent = () => Icon(RecentProjectsIcon, 'Recent projects');
const IconSettings = () => Icon(SettingsIcon, 'Settings');
const IconSupport = () => Icon(SupportIcon, 'Support');
const IconProfile = () => Icon(ProfileIcon, 'Profile');
const IconTeam = () => Icon(TeamIcon, 'Team');
const IconAccount = () => Icon(AccountIcon, 'Account');
const IconLogin = () => Icon(LoginIcon, 'Login');
const IconSubscription = () => Icon(SubscriptionIcon, 'Subscription');
const IconReferal = () => Icon(Referal, 'Referral');
const IconProject = () => Icon(ProjectIcon, 'Project');
const IconAIModal = () => Icon(AiModel, 'AI Modal');

const sidebarOptions = [
  {
    title: 'Home',
    icon: IconHome,
    path: '/platform/',
  },
  {
    title: 'Scan new',
    icon: IconScan,
    path: '/platform/scan',
  },
  {
    title: 'API & SDK',
    icon: IconApi,
    path: '/platform/api-sdk',
  },
  {
    title: 'Recent projects',
    icon: IconRecent,
    path: '/platform/recent-projects',
  },
  {
    title: 'Settings',
    icon: IconSettings,
    path: '/platform/settings/profile',
  },
  {
    title: 'Support',
    icon: IconSupport,
    path: '/platform/support',
  },
  // CustomSidebar items for authenticated users on mobile
  {
    title: 'Profile',
    icon: IconProfile,
    path: '/platform/settings/profile',
  },
  {
    title: 'Team',
    icon: IconTeam,
    path: '/platform/settings/team',
  },
  {
    title: 'Account',
    icon: IconAccount,
    path: '/platform/settings/account',
  },
  {
    title: 'Login',
    icon: IconLogin,
    path: '/platform/settings/login',
  },
  {
    title: 'Subscription',
    icon: IconSubscription,
    path: '/platform/settings/subscription',
  },
  {
    title: 'Referral',
    icon: IconReferal,
    path: '/platform/settings/referal',
  },
  {
    title: 'Project',
    icon: IconProject,
    path: '/platform/settings/project',
  },
  {
    title: 'AI Modal',
    icon: IconAIModal,
    path: '/platform/settings/aimodal',
  },
];

const Sidebar = ({ open = false, onClose }) => {
  const [isCollapsed, toggleCollapse] = useSidebarCollapse();
  const { user, token, tokens, activeTeam } = useAuth();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [search, setSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [coins, setCoins] = useState(0);
  const [loadingCoinSpinner, setLoadingCoinsSpinner] = useState(false);

  const fetchCoins = async () => {
    if (!token) return;
    setLoadingCoinsSpinner(true);
    try {
      const response = await fetch(`${baseURL}/my/coins`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const coinValue = parseInt(data['coin-balance'], 10) || 0;
        setCoins(coinValue);
      }
    } catch (err) {
      console.error('Failed to fetch coins:', err);
    } finally {
      setLoadingCoinsSpinner(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, [token]);

  const location = useLocation();
  const isSettingsPage = location.pathname.startsWith('/platform/settings');

  useEffect(() => {
    if (isSettingsPage && !isCollapsed) {
      toggleCollapse();
    }
  }, [isSettingsPage, isCollapsed, toggleCollapse]);
  const handleToggleClick = () => {
    if (!isSettingsPage) toggleCollapse();
  };

  // Tooltip for collapse button
  const [toggleHovered, setToggleHovered] = useState(false);
  const [togglePopoverPos, setTogglePopoverPos] = useState({ top: 0, left: 0, itemHeight: 0 });
  const toggleBtnRef = React.useRef(null);

  const isMobile = useMediaQuery('(max-width:992px)');

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const getToggleIcon = () => {
    return isDarkMode ? SidebarToggleIconDark : SidebarToggleIcon;
  };

  const allSidebarItems = [...sitemap, ...bottomLinks];

  const allowedItemsForUnauthenticated = [
    'Home',
    'Scan new',
    'Subscription',
    'API & SDK',
    'Support',
  ];

  const itemsToHideForAuthenticatedMobile = [
    'API & SDK',
    'Scan new',
    'Recent projects',
    'Settings',
  ];

  const customSidebarItems = ['Profile', 'Team', 'Account', 'Login'];

  const getFilteredItems = (items, searchTerm, isMobileView = false) => {
    if (token) {
      if (isMobileView) {
        return items.filter((item) => {
          // Hide Settings when team context is active
          if (activeTeam && item.title === 'Settings') return false;
          if (item.title === 'Home') {
            if (!searchTerm.trim()) return true;
            return item.title?.toLowerCase().includes(searchTerm.trim().toLowerCase());
          }
          if (customSidebarItems.includes(item.title)) {
            if (!searchTerm.trim()) return true;
            return item.title?.toLowerCase().includes(searchTerm.trim().toLowerCase());
          }
          if (item.title === 'Subscription') {
            if (!searchTerm.trim()) return true;
            return item.title?.toLowerCase().includes(searchTerm.trim().toLowerCase());
          }
          if (!itemsToHideForAuthenticatedMobile.includes(item.title)) {
            if (!searchTerm.trim()) return true;
            return item.title?.toLowerCase().includes(searchTerm.trim().toLowerCase());
          }
          return false;
        });
      } else {
        return items.filter((item) => {
          // Hide Settings when team context is active
          if (activeTeam && item.title === 'Settings') return false;
          if (!searchTerm.trim()) return true;
          return item.title?.toLowerCase().includes(searchTerm.trim().toLowerCase());
        });
      }
    } else {
      // Unauthenticated users only see allowed items
      return items.filter((item) => {
        if (!allowedItemsForUnauthenticated.includes(item.title)) return false;
        if (!searchTerm.trim()) return true;
        return item.title?.toLowerCase().includes(searchTerm.trim().toLowerCase());
      });
    }
  };

  // Apply unified filtering to both desktop and mobile items
  const filteredSidebarItems = getFilteredItems(allSidebarItems, search, false); // Desktop
  const mobileSidebarOptions = getFilteredItems(sidebarOptions, search, isMobile); // Mobile

  useEffect(() => {
    if (!token) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    // Active account find karte hain
    const activeAccount = tokens?.find((acc) => acc.is_active === 1);

    if (!activeAccount) {
      console.warn('No active account found');
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    console.log('Fetching profile for active account:', activeAccount.email);
    setLoadingProfile(true);

    axios
      .get(`${baseURL}/user`, {
        headers: { Authorization: `Bearer ${activeAccount.token}` }, // Active account ka token use kar rahe hain
      })
      .then((res) => {
        console.log('Profile fetched successfully:', res.data);
        setProfile(res.data.user || res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        // Fallback: active account ke stored data use karte hain
        setProfile({
          name: activeAccount.name,
          email: activeAccount.email,
          avatar: activeAccount.avatar || activeAccount.image,
        });
      })
      .finally(() => setLoadingProfile(false));
  }, [token, tokens]); // tokens dependency bhi add kar rahe hain

  const toggleProfilePopup = () => setProfileOpen((prev) => !prev);

  // Profile image logic (shows team if activeTeam exists)
  let profileImg = '';
  let displayName = '';
  let emailText = '';
  let showSignIn = false;

  if (activeTeam) {
    // Team context active
    emailText = '';
    displayName = activeTeam.name || 'Team';
    if (activeTeam.avatar) {
      profileImg = activeTeam.avatar.startsWith('http')
        ? activeTeam.avatar
        : `${baseURL}/storage/${activeTeam.avatar.replace(/^\//, '')}`;
    }
  } else if (!loadingProfile && profile && profile.email) {
    // Profile API succeeded and email is present
    emailText = profile.email;
    if (profile?.avatar) {
      profileImg = profile.avatar.startsWith('http')
        ? profile.avatar
        : `${baseURL}/storage/${profile.avatar.replace(/^\//, '')}`;
    } else if (profile?.image) {
      profileImg = profile.image.startsWith('http')
        ? profile.image
        : `${baseURL}/storage/${profile.image.replace(/^\//, '')}`;
    }
    displayName = profile.name || user?.name || 'User';
  } else if (!loadingProfile && (!profile || !profile.email)) {
    // Profile API failed or email missing
    if (token && user) {
      // Agar token hai aur user context mein hai, to fallback data use karte hain
      displayName = user.name || 'User';
      emailText = user.email || '';
      profileImg = user.avatar || user.image || '';
    } else {
      // Complete fallback: sign in option
      showSignIn = true;
      profileImg = Profile;
      displayName = 'Sign in';
      emailText = '';
    }
  } else {
    // Loading or fallback
    profileImg = Profile;
    displayName = 'Loading...';
    emailText = '';
  }

  // Get initials (first two letters, uppercase)
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1][0] || parts[0][1] || '')).toUpperCase();
  };

  // Greeting based on time
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  }

  // Tooltip handlers for toggle button
  const handleToggleMouseEnter = () => {
    if (toggleBtnRef.current) {
      const rect = toggleBtnRef.current.getBoundingClientRect();
      setTogglePopoverPos({
        top: rect.top + rect.height / 2,
        left: rect.right,
        itemHeight: rect.height,
      });
    }
    setToggleHovered(true);
  };
  const handleToggleMouseLeave = () => setToggleHovered(false);

  // Responsive: show/hide sidebar on mobile
  return (
    <>
      {/* Overlay for mobile - only render if mobile and open */}
      {isMobile && open && <div className="sidebar-overlay show" onClick={onClose} />}
      <div className={`sidebar${isCollapsed ? ' collapsed' : ''}${open ? ' open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            {!isCollapsed && (
              <div>
                <Link to="/platform">
                  <img src={Logo} className="sidebar-logo-icon" />
                </Link>
              </div>
            )}
            {/* Sidebar toggle/collapse button: only show on desktop */}
            <button
              className="collapse-btn"
              ref={toggleBtnRef}
              onClick={() => {
                if (!isSettingsPage) toggleCollapse();
              }}
              onMouseEnter={handleToggleMouseEnter}
              onMouseLeave={handleToggleMouseLeave}
              disabled={isSettingsPage} // completely disable on settings page
              style={{
                display: window.innerWidth > 992 ? 'flex' : 'none',
                ...(isSettingsPage ? { cursor: 'not-allowed' } : {}),
              }}
              aria-label={isCollapsed ? 'Expand Menu' : 'Close Menu'}
            >
              <img src={getToggleIcon()} alt="Toggle Sidebar" style={{ width: 22, height: 22 }} />
            </button>
            {/* Tooltip for toggle button */}
            <SidebarPopover
              show={toggleHovered}
              top={togglePopoverPos.top}
              left={togglePopoverPos.left}
              itemHeight={togglePopoverPos.itemHeight}
              colorCSS="var(--primary-color)"
              title={isCollapsed ? 'Expand Menu' : 'Close Menu'}
              desc={''}
            />
          </div>

          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sidebar-menu">
            {isMobile ? (
              mobileSidebarOptions.map((item) => (
                <SidebarItem
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                  //  onAutoCollapse={onAutoCollapse}
                />
              ))
            ) : filteredSidebarItems.length === 0 ? (
              <div style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>
                No items found.
              </div>
            ) : (
              <>
                {filteredSidebarItems
                  .filter((item) => item.id < 7)
                  .map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      isCollapsed={isCollapsed}
                      //  onAutoCollapse={onAutoCollapse}
                    />
                  ))}
                <hr className="sidebar-divider" />
                {filteredSidebarItems
                  .filter((item) => item.id >= 7)
                  .map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      isCollapsed={isCollapsed}
                      //  onAutoCollapse={onAutoCollapse}
                    />
                  ))}
              </>
            )}
          </div>

          {/* Fixed bottom section for profile and theme toggle */}
        </div>
        <div className="sidebar-bottom-fixed">
          <div
            className="user-profile"
            onClick={!showSignIn && token ? toggleProfilePopup : undefined}
            style={{ cursor: !showSignIn && token ? 'pointer' : 'default' }}
          >
            {loadingProfile ? (
              <div
                className="profile-img"
                style={{
                  background: '#fceded',
                  color: '#DE3996',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  aspectRatio: '1/1',
                  overflow: 'hidden',
                }}
              >
                ...
              </div>
            ) : profileImg ? (
              <img
                src={profileImg}
                alt={displayName}
                className="profile-img"
                style={{
                  objectFit: 'cover',
                  border: '1px solid #c73081',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  aspectRatio: '1/1',
                  overflow: 'hidden',
                }}
              />
            ) : (
              <div
                className="profile-img"
                style={{
                  background: '#fceded',
                  color: '#DE3996',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  aspectRatio: '1/1',
                  overflow: 'hidden',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {getInitials(displayName)}
              </div>
            )}
            <div className="user-details">
              <span className="user-greeting">{getGreeting()}</span>
              {showSignIn ? (
                <span
                  className="user-name"
                  style={{ fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}
                  onClick={() => (window.location.href = '/signin')}
                >
                  Sign in
                </span>
              ) : (
                <div className="d-flex gap-2">
                  <span className="user-name">{displayName}</span>
                  <div className="upgrade-coins-btn">
                    <img
                      src={UpgradeCoin}
                      alt=""
                      className={loadingCoinSpinner ? 'coin-spin' : ''}
                    />{' '}
                    <span>{coins.toLocaleString()}</span>{' '}
                  </div>
                </div>
              )}
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
      {token && isProfileOpen && <ProfilePopup onClose={toggleProfilePopup} />}
      
    </>
  );
};

export default Sidebar;
