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
        top: (top || 0) - (itemHeight ? itemHeight / 2 : 20) + 2,
        left: (left || 0) + 12,
        background: 'transparent',
        position: 'fixed',
        zIndex: 99999,
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

if (typeof document !== 'undefined' && !document.getElementById('sidebar-tooltip-style')) {
  const style = document.createElement('style');
  style.id = 'sidebar-tooltip-style';
  style.innerHTML = `
    .sidebar-tooltip {
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.28s cubic-bezier(.25,1.7,.45,1.32), transform 0.28s cubic-bezier(.25,1.7,.45,1.32);
      transform: translateY(10px) scale(0.98);
      position: fixed;
      pointer-events: none;
      z-index: 99999;
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
      text-align: center;
      width: 100%;
    }

    .sidebar-tooltip-desc {
      font-weight: 400;
      font-size: 13px;
      opacity: 0.92;
      margin-top: 2px;
      line-height: 1.35;
      text-align: center;
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
import BuyerIcon from '../../../assets/icon/buyer.svg';
import SellerIcon from '../../../assets/icon/seller.svg';
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
import { isPublicProjectRoute } from '../../../utils/publicProjectShare';
import Referal from '../../../assets/images/Referal.svg';
import ProjectIcon from '../../../assets/images/project.svg';
import AiModel from '../../../assets/images/aimodal.svg';
import UpgradeCoin from '../../../assets/images/UpgradeCoin.svg';
import { Gift, CheckCircle, XCircle } from 'lucide-react';

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
const IconReferal = () => <Gift className="sidebar-svg-icon" />;

const sidebarOptions = [
  { title: 'Home', icon: IconHome, path: '/3dio/' },
  { title: 'Scan new', icon: IconScan, path: '/3dio/new/scan' },
  { title: 'API & SDK', icon: IconApi, path: '/3dio/api-sdk' },
  { title: 'Recent projects', icon: IconRecent, path: '/3dio/recent-projects' },
  { title: 'Settings', icon: IconSettings, path: '/3dio/settings/profile' },
  { title: 'Support', icon: IconSupport, path: '/3dio/support' },
  { title: 'Profile', icon: IconProfile, path: '/3dio/settings/profile' },
  { title: 'Team', icon: IconTeam, path: '/3dio/settings/team' },
  { title: 'Account', icon: IconAccount, path: '/3dio/settings/account' },
  { title: 'Login', icon: IconLogin, path: '/3dio/settings/login' },
  { title: 'Subscription', icon: IconSubscription, path: '/3dio/settings/subscription' },
  { title: 'Referral', icon: IconReferal, path: '/3dio/settings/referal' },
];

const Sidebar = ({ open = false, onClose, disableExpand = false }) => {
  const [isCollapsed, toggleCollapse] = useSidebarCollapse();
  const { user, token, tokens, activeTeam } = useAuth();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userType, setUserType] = useState('buyer');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [coins, setCoins] = useState(0);
  const [loadingCoinSpinner, setLoadingCoinsSpinner] = useState(false);
  const [contributorModalOpen, setContributorModalOpen] = useState(false);
  const [contributorLoading, setContributorLoading] = useState(false);
  const [contributorError, setContributorError] = useState('');

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
  const isSettingsPage = location.pathname.startsWith('/3dio/settings');
  const isScanNewPage = location.pathname === '/3dio/new/scan';
  const isPublicProjectPage = isPublicProjectRoute(location.pathname);
  const isFixedCollapsedPage = isScanNewPage || isPublicProjectPage;

  useEffect(() => {
    if ((isSettingsPage || isFixedCollapsedPage) && !isCollapsed) {
      toggleCollapse();
    }
  }, [isSettingsPage, isFixedCollapsedPage, isCollapsed, toggleCollapse]);
  const handleToggleClick = () => {
    if (!isSettingsPage && !isFixedCollapsedPage && !disableExpand) toggleCollapse();
  };

  const [toggleHovered, setToggleHovered] = useState(false);
  const [togglePopoverPos, setTogglePopoverPos] = useState({ top: 0, left: 0, itemHeight: 0 });
  const toggleBtnRef = React.useRef(null);

  const [buyerHovered, setBuyerHovered] = useState(false);
  const [buyerPopoverPos, setBuyerPopoverPos] = useState({ top: 0, left: 0, itemHeight: 0 });
  const buyerBtnRef = React.useRef(null);
  const handleSellerClick = async () => {
    // 👇 Mobile par sidebar band karo
    if (isMobile && onClose) {
      onClose();
    }

    setContributorError('');
    setContributorLoading(true);
    setContributorModalOpen(true);

    try {
      const response = await axios.get(`${baseURL}/redirect/contributor`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 10000,
      });

      const redirectUrl = response.data?.url || response.data;
      if (redirectUrl && typeof redirectUrl === 'string') {
        setContributorModalOpen(false);
        window.location.href = redirectUrl;
      } else {
        throw new Error('Invalid redirect URL received.');
      }
    } catch (err) {
      console.error('Contributor redirect failed:', err);
      let message = 'Failed to redirect. Please try again later.';
      if (err.code === 'ECONNABORTED') {
        message = 'Request timed out. Please try again.';
      } else if (err.response?.status === 403) {
        message = 'You do not have access to the contributor portal.';
      } else if (err.response?.status === 401) {
        message = 'Session expired. Please log in again.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setContributorError(message);
    } finally {
      setContributorLoading(false);
    }
  };

  const [sellerHovered, setSellerHovered] = useState(false);
  const [sellerPopoverPos, setSellerPopoverPos] = useState({ top: 0, left: 0, itemHeight: 0 });
  const sellerBtnRef = React.useRef(null);

  const isMobile = useMediaQuery('(max-width:992px)');

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    checkTheme();
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

  const getFilteredItems = (items, isMobileView = false) => {
    if (token) {
      if (isMobileView) {
        return items.filter((item) => {
          if (activeTeam && item.title === 'Settings') return false;
          if (item.title === 'Home') return true;
          if (customSidebarItems.includes(item.title)) return true;
          if (item.title === 'Subscription') return true;
          if (!itemsToHideForAuthenticatedMobile.includes(item.title)) return true;
          return false;
        });
      } else {
        return items.filter((item) => {
          if (activeTeam && item.title === 'Settings') return false;
          return true;
        });
      }
    } else {
      return items.filter((item) => allowedItemsForUnauthenticated.includes(item.title));
    }
  };

  const filteredSidebarItems = getFilteredItems(allSidebarItems, false);
  const mobileSidebarOptions = getFilteredItems(sidebarOptions, isMobile);

  useEffect(() => {
    if (!token) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

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
        headers: { Authorization: `Bearer ${activeAccount.token}` },
      })
      .then((res) => {
        console.log('Profile fetched successfully:', res.data);
        setProfile(res.data.user || res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        setProfile({
          name: activeAccount.name,
          email: activeAccount.email,
          avatar: activeAccount.avatar || activeAccount.image,
        });
      })
      .finally(() => setLoadingProfile(false));
  }, [token, tokens]);

  const toggleProfilePopup = () => setProfileOpen((prev) => !prev);

  let profileImg = '';
  let displayName = '';
  let emailText = '';
  let showSignIn = false;

  if (activeTeam) {
    emailText = '';
    displayName = activeTeam.name || 'Team';
    if (activeTeam.avatar) {
      profileImg = activeTeam.avatar.startsWith('http')
        ? activeTeam.avatar
        : `${baseURL}/storage/${activeTeam.avatar.replace(/^\//, '')}`;
    }
  } else if (!loadingProfile && profile && profile.email) {
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
    if (token && user) {
      displayName = user.name || 'User';
      emailText = user.email || '';
      profileImg = user.avatar || user.image || '';
    } else {
      showSignIn = true;
      profileImg = Profile;
      displayName = 'Sign in';
      emailText = '';
    }
  } else {
    profileImg = Profile;
    displayName = 'Loading...';
    emailText = '';
  }

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1][0] || parts[0][1] || '')).toUpperCase();
  };

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  }

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

  const handleBuyerMouseEnter = () => {
    if (isCollapsed && buyerBtnRef.current) {
      const rect = buyerBtnRef.current.getBoundingClientRect();
      setBuyerPopoverPos({
        top: rect.top + rect.height / 2,
        left: rect.right,
        itemHeight: rect.height,
      });
    }
    setBuyerHovered(true);
  };
  const handleBuyerMouseLeave = () => setBuyerHovered(false);

  const handleSellerMouseEnter = () => {
    if (isCollapsed && sellerBtnRef.current) {
      const rect = sellerBtnRef.current.getBoundingClientRect();
      setSellerPopoverPos({
        top: rect.top + rect.height / 2,
        left: rect.right,
        itemHeight: rect.height,
      });
    }
    setSellerHovered(true);
  };
  const handleSellerMouseLeave = () => setSellerHovered(false);

  return (
    <>
      {isMobile && open && <div className="sidebar-overlay show" onClick={onClose} />}
      <div className={`sidebar${isCollapsed ? ' collapsed' : ''}${open ? ' open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            {!isCollapsed && (
              <div>
                <Link to="/3dio">
                  <img src={Logo} className="sidebar-logo-icon" />
                </Link>
              </div>
            )}
            <button
              className="collapse-btn"
              ref={toggleBtnRef}
              onClick={handleToggleClick}
              onMouseEnter={handleToggleMouseEnter}
              onMouseLeave={handleToggleMouseLeave}
              disabled={isSettingsPage || isFixedCollapsedPage || disableExpand}
              style={{
                display: window.innerWidth > 992 ? 'flex' : 'none',
                ...(isSettingsPage || isFixedCollapsedPage || disableExpand
                  ? { cursor: 'not-allowed' }
                  : {}),
              }}
              aria-label={isCollapsed ? 'Expand Menu' : 'Close Menu'}
            >
              <img src={getToggleIcon()} alt="Toggle Sidebar" style={{ width: 22, height: 22 }} />
            </button>
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

          <div className="user-type-toggle">
            <button
              ref={buyerBtnRef}
              className={`toggle-option ${userType === 'buyer' ? 'active' : ''}`}
              onClick={() => setUserType('buyer')}
              onMouseEnter={handleBuyerMouseEnter}
              onMouseLeave={handleBuyerMouseLeave}
            >
              <img src={BuyerIcon} alt="Buyer" className="toggle-icon" />
              {!isCollapsed && <span>Buyer</span>}
            </button>
            <button
              ref={sellerBtnRef}
              className={`toggle-option ${userType === 'seller' ? 'active' : ''}`}
              onMouseEnter={handleSellerMouseEnter}
              onMouseLeave={handleSellerMouseLeave}
              onClick={handleSellerClick}
            >
              <img src={SellerIcon} alt="Seller" className="toggle-icon" />
              {!isCollapsed && <span>Seller</span>}
            </button>
          </div>

          {isCollapsed && (
            <>
              <SidebarPopover
                show={buyerHovered}
                top={buyerPopoverPos.top}
                left={buyerPopoverPos.left}
                itemHeight={buyerPopoverPos.itemHeight}
                colorCSS="var(--primary-color)"
                title="Creator Mode"
                desc=""
              />
              <SidebarPopover
                show={sellerHovered}
                top={sellerPopoverPos.top}
                left={sellerPopoverPos.left}
                itemHeight={sellerPopoverPos.itemHeight}
                colorCSS="var(--primary-color)"
                title="Seller Mode"
                desc=""
              />
            </>
          )}

          <div className="sidebar-menu">
            {isMobile ? (
              mobileSidebarOptions.map((item) => (
                <SidebarItem key={item.path} item={item} isCollapsed={isCollapsed} />
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
                    <SidebarItem key={item.id} item={item} isCollapsed={isCollapsed} />
                  ))}
                <hr className="sidebar-divider" />
                {filteredSidebarItems
                  .filter((item) => item.id >= 7)
                  .map((item) => (
                    <SidebarItem key={item.id} item={item} isCollapsed={isCollapsed} />
                  ))}
              </>
            )}
          </div>
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
                  <span className="user-name">
                    {displayName && displayName.length > 10 ? displayName.split(' ')[0] : displayName}
                  </span>
                  <div className="upgrade-coins-btn">
                    <img
                      src={UpgradeCoin}
                      alt=""
                      className={loadingCoinSpinner ? 'coin-spin' : ''}
                    />{' '}
                    <span>{coins.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {token && isProfileOpen && <ProfilePopup onClose={toggleProfilePopup} />}

      {/* 👇 CONTRIBUTOR REDIRECT MODAL WITH TOP-RIGHT CLOSE ICON */}
      {contributorModalOpen && (
        <div
          className="create-team-overlay"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1060,
          }}
          onClick={() => {
            if (!contributorLoading && !contributorError) {
              setContributorModalOpen(false);
            }
          }}
        >
          <div
            className="create-team-popup"
            style={{
              maxWidth: '420px',
              width: '90%',
              padding: '32px 24px 24px',
              textAlign: 'center',
              position: 'relative',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close (X) icon — top right */}
            {(contributorError || !contributorLoading) && (
              <button
                onClick={() => {
                  setContributorModalOpen(false);
                  setContributorError('');
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#e63399',
                }}
                aria-label="Close"
              >
                <span style={{ lineHeight: 1 }}>×</span>
              </button>
            )}

            {/* Icon at top */}
            {contributorLoading ? (
              <div
                style={{
                  display: 'inline-block',
                  width: '60px',
                  height: '60px',
                  border: '6px solid #f3f3f3',
                  borderTop: '6px solid #e63399',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 24px',
                }}
              />
            ) : contributorError ? (
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                <img src="/assets/images/danger.png" size={48} alt="" />
              </div>
            ) : (
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                {/* <CheckCircle size={48} color="#28a745" /> */}
                <img src="/assets/images/success-img.png" size={48} alt="" />
              </div>
            )}

            <h3
              style={{
                margin: '0 0 12px',
                fontWeight: 600,
                fontSize: '1.25rem',
                color: contributorError ? 'black' : contributorLoading ? '#555' : '#28a745',
              }}
            >
              {contributorLoading
                ? 'Processing...'
                : contributorError
                  ? 'Failed to Redirect'
                  : 'Redirecting...'}
            </h3>

            {contributorLoading ? (
              <p style={{ marginBottom: '20px', color: '#171E1DC7', fontSize: '14px' }}>
                Please wait while we prepare your redirect...
              </p>
            ) : contributorError ? (
              <div style={{ color: '#171E1DC7', fontSize: '14px' }}>
                <p>{contributorError}</p>

                <a
                  href="/contributor/program"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'underline',
                    color: '#DE3996',
                    fontWeight: '500',
                  }}
                >
                  Join Contributor Program
                </a>
              </div>
            ) : (
              <p style={{ marginBottom: '24px', color: '#171E1DC7', fontSize: '14px' }}>
                You’re being redirected to the contributor portal. This will take just a moment.
              </p>
            )}
          </div>

          <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
        </div>
      )}
    </>
  );
};

export default Sidebar;
