import React, { useEffect, useRef, useState } from 'react';
import VideoGif from '../../assets/images/video.gif';
import './SubscriptionHistory.css';
import SwitchPlan from '../../assets/images/switch_plan.svg';
import SwitchActive from '../../assets/images/Switch_Active.svg';
import DotVector from '../../assets/images/threedot_vector.svg';
import { FiBell, FiCheck, FiEdit, FiPlay, FiSearch, FiX } from 'react-icons/fi';
import RequestRefundPopup from '../../components/popup/RequestRefundPopup';
import CancelPlan from '../../assets/images/CancelPlan.svg';
import TotalProjects from '../../assets/images/Bulb.svg';
import Usage from '../../assets/images/TotalProjects.svg';
import ActiveSwitch from '../../assets/images/ActiveSwitch.svg';
import PlanSwitch from '../../assets/images/PlanSwitch.png';
import Drop from '../../assets/images/Drop.svg';
import Visa from '../../assets/images/current-visa.svg';
import UpgradeCoin from '../../assets/images/UpgradeCoin.svg';
import CoinsPopup from '../../components/popup/CoinsPopup';
import { RxCross2, RxHamburgerMenu } from 'react-icons/rx';
import { useAuth } from '../../context/AuthContext';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Diamond from '../../assets/images/diamond.png';
import modalVideo from '../../assets/images/3dModal.mp4';
import CustomLoader from '../../components/loader/CustomLoader';
import SubscriptionModal from '../../components/popup/SubscriptionModal';
import { baseURL } from '../../config';
import { toast } from 'react-toastify';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';

const Subscription = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showRefundPopup, setShowRefundPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showCoinsPopup, setShowCoinsPopup] = useState(false);
  const [showSwitchActivePopup, setShowSwitchActivePopup] = useState(false);
  const [cancelPlanType, setCancelPlanType] = useState(null);
  const [showEnterprisePopup, setShowEnterprisePopup] = useState(false);
  const [showEditPaymentPopup, setShowEditPaymentPopup] = useState(false);
  const [starterCanceled, setStarterCanceled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [videoOpen, setVideoOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [coins, setCoins] = useState(0);
  const [loadingCoinSpinner, setLoadingCoinsSpinner] = useState(false);

  // API data states
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState(false);
  const [autoRenewalLoading, setAutoRenewalLoading] = useState(false);
  const [isDark, setIsDarkMode] = useState(false);

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

  const notifBtnRef = useRef();
  const { token, logout, activeTeam } = useAuth();
  const navigate = useNavigate();
  const {
    unreadCount,
    notifications,
    markAllAsRead,
    toggleNotificationRead,
    togglingNotifications,
    markAllLoading,
  } = useNotification();

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
    const event = new CustomEvent('sidebarToggle', { detail: { open: !sidebarOpen } });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    const style = document.createElement('style');
    style.id = 'hide-scrollbar-style';
    style.innerHTML = `
      html, body { 
        scrollbar-width: none !important;
        -ms-overflow-style: none !important; 
      }
      html::-webkit-scrollbar, 
      body::-webkit-scrollbar { 
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;

    const existingStyle = document.getElementById('hide-scrollbar-style');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById('hide-scrollbar-style');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (notifBtnRef.current && !notifBtnRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 768 && scrollRef.current) {
      const scrollContainer = scrollRef.current;

      const autoScroll = () => {
        if (!scrollContainer) return;

        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        if (maxScroll <= 0) return;

        setTimeout(() => {
          scrollContainer.scrollTo({
            left: maxScroll,
            behavior: 'smooth',
          });
        }, 500);

        setTimeout(() => {
          scrollContainer.scrollTo({
            left: 0,
            behavior: 'smooth',
          });
        }, 3500);
      };
      autoScroll();
      const interval = setInterval(autoScroll, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Active', 'Expired', 'Canceled'];

  // Format subscriptions for table display
  const formattedSubscriptions = subscriptions.map((sub) => {
    const createdDate = new Date(sub.created_at);
    const expiryDate = sub.ends_at
      ? new Date(sub.ends_at)
      : (() => {
          const expDate = new Date(createdDate);
          expDate.setDate(expDate.getDate() + 30); // 30 days from created_at
          return expDate;
        })();

    return {
      id: sub.id,
      startDate: createdDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      endDate: expiryDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      PaymentMethod: 'Card Payment',
      Amount: sub.price_amount || '$19.99',
      StatusOrder: sub.status,
    };
  });

  const statusStyles = {
    ACTIVE: {
      background: isDark ? '#1A4A3A' : 'rgba(220, 252, 231, 1)',
      color: isDark ? '#2BC155' : 'rgba(43, 193, 85, 1)',
      border: isDark ? '1px solid #2BC155' : 'none',
    },
    INACTIVE: {
      background: isDark ? '#2A1A4A' : '#EDE6FF',
      color: isDark ? '#A787FA' : '#3900E6',
      border: isDark ? '1px solid #A787FA' : 'none',
    },
    EXPIRED: {
      background: isDark ? '#4A1A2A' : '#FEE2E2',
      color: isDark ? '#A51B3A' : '#A51B3A',
      border: isDark ? '1px solid #A51B3A' : 'none',
    },
    CANCELED: {
      background: isDark ? '#4A3A1A' : '#FEF3C7',
      color: isDark ? '#FBBF24' : '#92400E',
      border: isDark ? '1px solid #FBBF24' : 'none',
    },
  };

  const filteredTable =
    activeFilter === 'All'
      ? formattedSubscriptions
      : formattedSubscriptions.filter((row) =>
          row.StatusOrder.toLowerCase().includes(activeFilter.toLowerCase()),
        );

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
        const formattedCoins = new Intl.NumberFormat().format(coinValue);
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
    fetchSubscriptions();
    fetchCurrentPaymentMethod();
  }, [token]);

  const handleCoinsUpdate = (spentAmount) => {
    setCoins((prev) => prev - Number(spentAmount));
  };

   const fetchSubscriptions = async () => {
    if (!token) return;
    setLoadingSubscriptions(true);

    try {
      const response = await fetch(`${baseURL}/subscriptions`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast.error('Failed to fetch subscription data');
        console.error('Failed to fetch subscriptions');
        setSubscriptionData([]);
        setSubscriptions([]);
        setAutoRenewal(false);
        return;
      }

      const data = await response.json();
      console.log('Subscription API Response:', data);

      if (!data.subscriptions || data.subscriptions.length === 0) {
        setSubscriptionData([]);
        setSubscriptions([]);
        setAutoRenewal(false);
        return;
      }

      // Store ALL subscriptions for history table
      setSubscriptions(data.subscriptions);

      // Filter only active or inactive subscriptions for display cards
      const validSubs = data.subscriptions.filter(
        (sub) => sub.status === 'active' || sub.status === 'inactive'
      );

      if (validSubs.length === 0) {
        setSubscriptionData([]);
        setAutoRenewal(false);
        return;
      }

      // Map validSubs to formatted array
      const formattedSubscriptions = validSubs.map((sub) => {
        const createdDate = new Date(sub.created_at);
        let expiryDate = sub.ends_at ? new Date(sub.ends_at) : new Date(createdDate);

        if (!sub.ends_at) {
          if (sub.interval === 'year') expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          else expiryDate.setMonth(expiryDate.getMonth() + 1);
        }

        const correctedId = sub.id || sub['id '] || sub.ID || sub.Id;

        return {
          ...sub,
          id: correctedId,
          planName: (sub.type || 'Pro Plan').charAt(0).toUpperCase() + (sub.type || 'Pro Plan').slice(1).toLowerCase(),
          status: sub.status,
          buyDate: createdDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          expiryDate: expiryDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          amount: sub.price_amount || '$19.99',
          billingCycle: sub.interval === 'year' ? 'Yearly' : 'Monthly',
          nextBillingDate: (() => {
            const nextBilling = new Date(createdDate);
            if (sub.interval === 'year') nextBilling.setFullYear(nextBilling.getFullYear() + 1);
            else nextBilling.setMonth(nextBilling.getMonth() + 1);
            return nextBilling.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          })(),
        };
      });

      console.log('Formatted Subscriptions:', formattedSubscriptions);

      setSubscriptionData(formattedSubscriptions);

      // Set autoRenewal based on first active subscription
      const activeSub = validSubs.find((sub) => sub.status === 'active');
      setAutoRenewal(activeSub ? activeSub.auto_renew === 1 : false);

    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
      toast.error('Error fetching subscription data');
      setSubscriptionData([]);
      setSubscriptions([]);
      setAutoRenewal(false);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!token || !subscriptionId) return;
    try {
      const response = await fetch(`${baseURL}/subscription/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscriptionId,
        }),
      });
      if (response.ok) {
        toast.success('Subscription canceled successfully');
        fetchSubscriptions();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to cancel subscription');
      }
    } catch (err) {
      console.error('Cancel subscription error:', err);
      toast.error('Error canceling subscription');
    }
  };

  const handleAutoRenewalToggle = async (subscriptionId, renewStatus) => {
    if (!token || !subscriptionId) return;

    // Optimistically update UI
    setAutoRenewalLoading(true);
    const previousValue = autoRenewal;
    setAutoRenewal(renewStatus);

    try {
      const response = await fetch(`${baseURL}/subscription/auto-renew`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscriptionId,
          auto_renew: renewStatus ? 1 : 0,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setAutoRenewal(previousValue);
        toast.error('Failed to update auto-renewal');
      } else {
        toast.success(`Auto-renewal ${renewStatus ? 'enabled' : 'disabled'} successfully`);
      }
    } catch (err) {
      console.error('Auto-renewal update error:', err);
      setAutoRenewal(previousValue);
      toast.error('Error updating auto-renewal');
    } finally {
      setAutoRenewalLoading(false);
    }
  };

  const fetchCurrentPaymentMethod = async () => {
    if (!token) return;

    setLoadingPaymentMethod(true);
    try {
      const response = await fetch(`${baseURL}/subscription/payment`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentPaymentMethod(data);
      } else {
        console.error('Failed to fetch payment method');
      }
    } catch (err) {
      console.error('Failed to fetch payment method:', err);
    } finally {
      setLoadingPaymentMethod(false);
    }
  };

  return (
    <section className="subscition-main-container">
      <div className="subscr-history position-relative">
        <div className="subscr-history-head">
          <div className="subscr-history-content">
            <h2>Subscription History</h2>
            <p>Manage your subscriptions and billing history</p>
          </div>

          {subscriptionData &&
            subscriptionData.length > 0 &&
            (() => {
              const latestPlan = subscriptionData[subscriptionData.length - 1];
              return (
                <div className="subscr-history-main-plan">
                  <div className="subscr-history-plan">
                    <div className="subscr-history-plan-content">
                      <h4>{latestPlan.status === 'active' ? 'Active' : 'Inactive'}</h4>
                      <h2>{latestPlan.planName}</h2>
                      <p>
                        Next billing: <span>{latestPlan.nextBillingDate}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>

        <div className="sub-profile-actions-section">
          <button
            className="profile-sidebar-toggle"
            onClick={handleSidebarToggle}
            aria-label="Open sidebar"
            style={{
              display: 'none',
              background: '#fff',
              color: '#DE3996',
              border: '1px solid #eee',
              borderRadius: '6px',
              width: '44px',
              height: '44px',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.3s, color 0.2s',
              position: 'relative',
            }}
          >
            <RxHamburgerMenu />
          </button>

          <div className="d-flex gap-2">
            <div className="upgrade-coins-btn" onClick={() => setShowCoinsPopup(true)}>
              <img src={UpgradeCoin} alt="" className={loadingCoinSpinner ? 'coin-spin' : ''} />{' '}
              <span>{coins.toLocaleString()}</span>{' '}
            </div>

            {/* Search Bar */}
            <button
              className="upgrade-btn"
              onClick={() => {
                if (activeTeam) return; // disable in team mode
                setSubscriptionModalOpen(true);
              }}
              disabled={!!activeTeam}
              style={activeTeam ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            >
              <img src={Diamond} alt="Upgrade Icon" style={{ width: 18, marginRight: 6 }} />
              Upgrade your plan
            </button>

            <div>
              <button
                className="sub-navbar-icon-btn"
                onClick={() => setVideoOpen(true)}
                aria-label="Open 3D Model Video"
              >
                <FiPlay />
              </button>
              <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
            </div>

            {/* Notification Icon */}
            {token && (
              <div style={{ position: 'relative', display: 'inline-block' }} ref={notifBtnRef}>
                <button
                  className="sub-navbar-icon-btn notification-btn"
                  onClick={() => setNotifOpen((o) => !o)}
                  aria-label="Show notifications"
                  style={{ position: 'relative' }}
                >
                  <FiBell />
                  {unreadCount > 0 && (
                    <span
                      style={{
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
                      }}
                    />
                  )}
                </button>
                {notifOpen && (
                  <div className="sub-notif-dropdown">
                    <div className="notif-dropdown-header">
                      <span>All notifications</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '8px',
                        padding: '0 18px 6px 18px',
                        borderBottom: '1px solid #8D8D8D66',
                        marginBottom: '5px',
                      }}
                    >
                      <div className="notify">
                        <span
                          className={`all-notif ${filterType === 'all' ? 'active' : ''}`}
                          onClick={() => setFilterType('all')}
                        >
                          All
                        </span>
                        <span
                          className={`unread-notif ${filterType === 'unread' ? 'active' : ''}`}
                          onClick={() => setFilterType('unread')}
                        >
                          Unread ({unreadCount})
                        </span>
                      </div>

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
                            color: '#DE3996',
                            borderRadius: 'none',
                            boxShadow: 'none',
                            fontWeight: '600',
                            fontSize: '12px',
                            cursor: markAllLoading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s, color 0.2s',
                          }}
                        >
                          {markAllLoading ? (
                            <>
                              <div
                                className="loading-spinner"
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  border: '2px solid #fff',
                                  borderTop: '2px solid transparent',
                                }}
                              ></div>
                              Marking...
                            </>
                          ) : (
                            'Mark all as read'
                          )}
                        </button>
                      )}
                    </div>

                    <div className="notif-dropdown-list">
                      {notifications && notifications.length > 0 ? (
                        (() => {
                          const now = new Date();
                          const today = [];
                          const last7Days = [];
                          const older = [];

                          const filteredNotifications =
                            filterType === 'unread'
                              ? notifications.filter((n) => !n.read_at)
                              : notifications;

                          filteredNotifications.forEach((notif) => {
                            const notifDate = new Date(notif.created_at);
                            const isToday = notifDate.toDateString() === now.toDateString();
                            const diffInDays = (now - notifDate) / (1000 * 60 * 60 * 24);

                            if (isToday) {
                              today.push(notif);
                            } else if (diffInDays <= 7) {
                              last7Days.push(notif);
                            } else {
                              older.push(notif);
                            }
                          });

                          const renderNotif = (list) =>
                            list.map((notif, idx) => {
                              const isToggling = togglingNotifications?.has
                                ? togglingNotifications.has(notif.id)
                                : false;

                              return (
                                <div
                                  key={notif.id || idx}
                                  className={`notif-item${notif.read_at ? ' read' : ' unread'}${
                                    isToggling ? ' toggling' : ''
                                  }`}
                                  onClick={() => !isToggling && toggleNotificationRead(notif.id)}
                                  style={{ cursor: isToggling ? 'not-allowed' : 'pointer' }}
                                >
                                  {isToggling ? (
                                    <span className="notif-status-icon notif-loading">
                                      <div className="loading-spinner"></div>
                                    </span>
                                  ) : notif.read_at ? (
                                    <span className="notif-status-icon notif-tick">
                                      <FiCheck />
                                    </span>
                                  ) : (
                                    <span className="notif-status-icon notif-dot"></span>
                                  )}
                                  <div className="notif-item-content">
                                    <div className="notif-message">
                                      {notif.data?.message ||
                                        notif.message ||
                                        notif.text ||
                                        notif.title ||
                                        'New notification'}
                                    </div>
                                    <div className="notif-date">
                                      {new Date(notif.created_at).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'short',
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            });

                          return (
                            <>
                              {/* Today */}
                              {today.length > 0 && (
                                <>
                                  <span className="today-notif">Today</span>
                                  {renderNotif(today)}
                                </>
                              )}

                              {/* Last 7 Days */}
                              {last7Days.length > 0 && (
                                <>
                                  <span className="last-days-notif">Last 7 Days</span>
                                  {renderNotif(last7Days)}
                                </>
                              )}

                              {/* Older */}
                              {older.length > 0 && (
                                <>
                                  <span className="older-days-notif">Older</span>
                                  {renderNotif(older)}
                                </>
                              )}

                              {/* If nothing */}
                              {today.length === 0 &&
                                last7Days.length === 0 &&
                                older.length === 0 && (
                                  <div className="notif-empty">No notifications</div>
                                )}
                            </>
                          );
                        })()
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
          </div>
        </div>
      </div>

      {loadingSubscriptions ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            background: isDark ? '#110E20' : 'rgba(255, 255, 255, 1)',
            borderRadius: '8px',
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.25)',
            marginTop: '1.5rem',
          }}
        >
          <CustomLoader />
        </div>
      ) : subscriptionData && subscriptionData.length > 0 ? (
        subscriptionData.map((plan, index) => (
          <div className="main-starter-plan-container" key={index}>
            <div className="main-starter-plan">
              <div className="main-starter-plan-content">
                <div className="starter-plan">
                  <h2 className="starter-plan-h2">{plan.planName}</h2>
                  <h2 className="starter-plan-h2-tag">{plan.status}</h2>
                </div>
                <div className="flex-plan">
                  <span
                    style={{
                      color: isDark ? '#fff' : 'rgba(61, 61, 61, 1)',
                      fontWeight: 600,
                      fontSize: '14px',
                      minWidth: isMobile ? '100px' : '120px',
                    }}
                  >
                    Started:
                  </span>
                  <span
                    style={{
                      color: isDark ? '#fff' : 'rgba(117, 117, 117, 1)',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                    }}
                  >
                    {plan.buyDate}
                  </span>
                </div>
                <div className="flex-plan">
                  <span
                    style={{
                      color: isDark ? '#fff' : 'rgba(61, 61, 61, 1)',
                      fontWeight: 600,
                      fontSize: '14px',
                      minWidth: isMobile ? '100px' : '120px',
                    }}
                  >
                    Status:
                  </span>
                  <span
                    style={{
                      color: '#E74C3C',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                    }}
                  >
                    Expiring in{' '}
                    {(() => {
                      const now = new Date();
                      const expiry = new Date(plan.expiryDate);
                      const diffInDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                      return diffInDays > 0 ? `${diffInDays} days` : 'Expired';
                    })()}
                  </span>
                </div>
                <div className="flex-plan">
                  <span
                    style={{
                      color: isDark ? '#fff' : 'rgba(61, 61, 61, 1)',
                      fontWeight: 600,
                      fontSize: '14px',
                      minWidth: isMobile ? '100px' : '120px',
                    }}
                  >
                    Renewal Date:
                  </span>
                  <span
                    style={{
                      color: isDark ? '#fff' : 'rgba(117, 117, 117, 1)',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                    }}
                  >
                    {plan.nextBillingDate}
                  </span>
                </div>
              </div>

              <div className="payment-type">
                <h1>{coins.toLocaleString()}</h1>
                <p>Coins Payment</p>
              </div>
            </div>

            <div className="payment-cycle">
              <div className="billing-cycle">
                <h3>Billing Cycle</h3>
                <p>{plan.billingCycle}</p>
              </div>
              <div className="Next-Billing-Date">
                <h3>Next Billing Date</h3>
                <p>{plan.nextBillingDate}</p>
              </div>
              <div className="billing-amount">
                <h3>Billing Amount</h3>
                <p>{plan.price_amount}</p>
              </div>
              <div className="billing-method">
                <FiEdit size={18} style={{ color: 'rgba(222, 57, 150, 1)' }} />
                <h3 onClick={() => setShowEditPaymentPopup(true)} style={{ cursor: 'pointer' }}>
                  Edit Payment Method
                </h3>
              </div>
              <div className="Auto-Renewal">
                <h3>Auto Renewal</h3>
                <label className="switch-Renewal">
                  <input
                    type="checkbox"
                    checked={autoRenewal}
                    disabled={autoRenewalLoading}
                    onChange={(e) => {
                      const subscriptionIdToUse =
                        plan?.stripe_id ||
                        (subscriptions.length > 0 ? subscriptions[0].stripe_id : null);
                      handleAutoRenewalToggle(subscriptionIdToUse, e.target.checked);
                    }}
                  />
                  <span className="slider-Renewal"></span>
                </label>
              </div>
            </div>

            <div className="starter-plans-buttons">
              <div
                className="d-flex Switch-plan-button"
                onClick={() => {
                  if (activeTeam) return; // disable in team mode
                  setShowSwitchActivePopup(true);
                }}
                style={activeTeam ? { opacity: 0.6, pointerEvents: 'none' } : {}}
              >
                <img
                  src={SwitchPlan}
                  alt="icon"
                  width={18}
                  height={18}
                  style={{ marginTop: '2px' }}
                />
                <span>Switch plan</span>
              </div>
              {starterCanceled ? (
                <div
                  className="cancel-plan-button"
                  onClick={() => {
                    if (activeTeam) return; // disable in team mode
                    setShowRefundPopup(true);
                  }}
                  style={activeTeam ? { opacity: 0.6, pointerEvents: 'none' } : {}}
                >
                  <span>Request Refund</span>
                </div>
              ) : (
                <div
                  className="cancel-plan-button"
                  onClick={() => {
                    if (activeTeam) return; // disable in team mode
                    setCancelPlanType('starter');
                    setShowCancelPopup(true);
                  }}
                  style={activeTeam ? { opacity: 0.6, pointerEvents: 'none' } : {}}
                >
                  <span>Cancel Plan</span>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div
          style={{
            background: isDark ? '#110E20' : 'rgba(255, 255, 255, 1)',
            borderRadius: '8px',
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.25)',
            marginTop: '1.5rem',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              color: '#DE3996',
            }}
          >
            📋
          </div>
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: isDark ? '#fff' : 'rgba(61, 61, 61, 1)',
              marginBottom: '8px',
            }}
          >
            No Active Subscriptions
          </h3>
          <p
            style={{
              fontSize: '16px',
              color: isDark ? '#DADADA' : 'rgba(117, 117, 117, 1)',
              marginBottom: '24px',
            }}
          >
            You don't have any active subscriptions at the moment.
          </p>
          <button
            onClick={() => {
              if (activeTeam) return; // disable in team mode
              setSubscriptionModalOpen(true);
            }}
            disabled={!!activeTeam}
            style={{
              background: 'linear-gradient(135deg, #DE3996 0%, #FF6B35 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: activeTeam ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: ' center',
              gap: '8px',
              margin: '0 auto',
            }}
          >
            <img src={Diamond} alt="Upgrade Icon" style={{ width: 18 }} />
            Get Started with a Plan
          </button>
        </div>
      )}

      <div className="history-plan-main-container">
        <div className="history-plan-container">
          <h2>History</h2>
          <div className="history-plan-filter-buttons">
            {filters.map((filter) => (
              <span
                key={filter}
                className={activeFilter === filter ? 'active' : ''}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </span>
            ))}
          </div>
        </div>

        <div className="history-plan-table-container">
          <div className="history-plan-table-header">
            <span>Start Date</span>
            <span>End Date</span>
            <span>Payment Method</span>
            <span>Amount</span>
            <span>Status Order</span>
          </div>
          {loadingSubscriptions ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <CustomLoader />
            </div>
          ) : filteredTable.length > 0 ? (
            filteredTable.map((row, index) => (
              <div className="history-plan-table-content" key={index}>
                <span>{row.startDate}</span>
                <span>{row.endDate}</span>
                <span>{row.PaymentMethod}</span>
                <span>{row.Amount} Usd</span>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '17px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    ...(statusStyles[row.StatusOrder?.toUpperCase()] || {}),
                  }}
                >
                  {row.StatusOrder}
                </span>
                {/* <span>
                  <img src={row.icon} alt="status" />
                </span> */}
              </div>
            ))
          ) : (
            <div
              style={{ padding: '20px', textAlign: 'center', color: isDark ? '#DADADA' : '#666' }}
            >
              No subscription history found
            </div>
          )}
        </div>
      </div>

      <NotificationProvider fetchCoins={fetchCoins} />

      {showRefundPopup && <RequestRefundPopup onClose={() => setShowRefundPopup(false)} />}

      {showCoinsPopup && (
        <CoinsPopup
          onClose={() => setShowCoinsPopup(false)}
          coins={coins}
          onCoinsUpdate={handleCoinsUpdate}
        />
      )}

      {showCancelPopup && (
        <CancelPlanPopup
          subscriptionId={
            subscriptionData?.stripe_id ||
            (subscriptions.length > 0 ? subscriptions[0].stripe_id : null)
          }
          onClose={() => {
            setShowCancelPopup(false);
            setCancelPlanType(null);
          }}
          onConfirm={() => {
            fetchSubscriptions();
          }}
        />
      )}

      {showSwitchActivePopup && (
        <SwitchActivePlan onClose={() => setShowSwitchActivePopup(false)} />
      )}
      {showEditPaymentPopup && (
        <EditPaymentMethod
          onClose={() => setShowEditPaymentPopup(false)}
          onConfirm={() => setShowEditPaymentPopup(true)}
        />
      )}
      <SubscriptionModal
        open={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
      />
    </section>
  );
};

export default Subscription;

export const CancelPlanPopup = ({ onClose, subscriptionId, onConfirm }) => {
  const { token } = useAuth();
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!token || !subscriptionId) {
      toast.error('Subscription ID not found');
      return;
    }
    setCancelling(true);
    try {
      const res = await fetch(`${baseURL}/subscription/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription: subscriptionId }),
      });
      if (res.ok) {
        toast.success('Subscription cancelled successfully');
        if (onConfirm) onConfirm();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to cancel subscription');
      }
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error('Error cancelling subscription');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="confirm-logout-overlay" onClick={onClose}>
      <div
        className="confirm-logout-popup modern-confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="request-refund-close" onClick={onClose}>
          <FiX />
        </button>
        <div className="cancel-modal-icon-wrap">
          <img src={CancelPlan} alt="image" />
        </div>
        <h4 className="cancel-modal-title">Cancel Plan</h4>
        <p className="cancel-modal-message">
          Are you sure you want to cancel this plan?
          <br />
          This action cannot be undone.
        </p>
        <div className="cancel-modal-footer">
          <button className="keep-plan-button" onClick={onClose} disabled={cancelling}>
            Keep Plan
          </button>
          <button className="cancel-button" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Cancel Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const SwitchActivePlan = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="switch-active-plan-overlay" onClick={onClose}>
      <div className="switch-active-plan-content" onClick={(e) => e.stopPropagation()}>
        <button className="switch-active-plan-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="switch-active-plan-header">
          <h2>Switch Active Plan</h2>
          <p>Select with subscription you want to make active</p>
        </div>

        <div className="main-starter-active-plan-container">
          <div className="main-starter-plan">
            <div className="main-starter-plan-content">
              <div className="starter-plan">
                <h2 className="starter-plan-h2">Starter Plan</h2>
                <h2 className="starter-plan-h2-tag">Active</h2>
              </div>
              <div className="flex-plan">
                <span
                  style={{
                    color: 'rgba(61, 61, 61, 1)',
                    fontWeight: 600,
                    fontSize: '14px',
                    minWidth: isMobile ? '100px' : '120px',
                  }}
                >
                  Started:
                </span>
                <span
                  style={{
                    color: 'rgba(117, 117, 117, 1)',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                  }}
                >
                  August 30,2025
                </span>
              </div>
              <div className="flex-plan">
                <span
                  style={{
                    color: 'rgba(61, 61, 61, 1)',
                    fontWeight: 600,
                    fontSize: '14px',
                    minWidth: isMobile ? '100px' : '120px',
                  }}
                >
                  Status:
                </span>
                <span
                  style={{
                    color: 'rgba(231, 76, 60, 1)',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                  }}
                >
                  Expiring in 3 days
                </span>
              </div>
              <div className="flex-plan">
                <span
                  style={{
                    color: 'rgba(61, 61, 61, 1)',
                    fontWeight: 600,
                    fontSize: '14px',
                    minWidth: isMobile ? '100px' : '120px',
                  }}
                >
                  Renewal Date:
                </span>
                <span
                  style={{
                    color: 'rgba(117, 117, 117, 1)',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                  }}
                >
                  September 30, 2025{' '}
                </span>
              </div>
            </div>

            <div className="payment-type">
              <h1>2900</h1>
              <p>Coins Payment</p>
            </div>
          </div>
        </div>

        <div className="main-starter-enterprise-plan-container">
          <div className="main-starter-plan">
            <div className="main-starter-plan-content">
              <div className="starter-plan">
                <h2 className="Enterprise-plan-h2">Enterprise Plan</h2>
                <h2 className="Enterprise-plan-h2-tag">InActive</h2>
              </div>

              <div className="flex-plan">
                <span
                  style={{
                    color: 'rgba(61, 61, 61, 1)',
                    fontWeight: 600,
                    fontSize: '14px',
                    minWidth: isMobile ? '100px' : '120px',
                  }}
                >
                  Started:
                </span>
                <span
                  style={{
                    color: 'rgba(117, 117, 117, 1)',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                  }}
                >
                  August 30,2025
                </span>
              </div>

              <div className="flex-plan">
                <span
                  style={{
                    color: 'rgba(61, 61, 61, 1)',
                    minWidth: isMobile ? '100px' : '120px',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Valid Until
                </span>
                <span
                  style={{
                    color: 'rgba(117, 117, 117, 1)',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                  }}
                >
                  Feb 20, 2026 (6 months)
                </span>
              </div>

              <div className="flex-plan">
                <span
                  style={{
                    color: 'rgba(61, 61, 61, 1)',
                    minWidth: isMobile ? '100px' : '120px',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Renewal Date:
                </span>
                <span
                  style={{
                    color: 'rgba(117, 117, 117, 1)',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                  }}
                >
                  September 30, 2025{' '}
                </span>
              </div>
            </div>

            <div className="payment-type">
              <h1>2900</h1>
              <p>Coins Payment</p>
            </div>
          </div>
        </div>

        <div className="req-refund-buttons">
          <button className="btn-cancel-active-plan">Cancel</button>
          <button className="btn-switch-active-plan">Switch Plan</button>
        </div>
      </div>
    </div>
  );
};

export const EditPaymentMethod = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [cardName, setCardName] = useState('');
  const [isDark, setIsDarkMode] = useState(false);

  // Fetch current payment method
  useEffect(() => {
    const fetchCurrentPaymentMethod = async () => {
      if (!token) return;
      setLoadingPayment(true);
      try {
        const response = await fetch(`${baseURL}/subscription/payment`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.payment_method) {
            const { card, billing_details } = data.payment_method;
            setCurrentPaymentMethod({
              last4: card?.last4 || '****',
              brand: card?.brand || 'Card',
              exp_month: card?.exp_month,
              exp_year: card?.exp_year,
              name: billing_details?.name || '',
            });
            setCardName(billing_details?.name || '');
          }
        }
      } catch (err) {
        console.error('Fetch payment method error:', err);
      } finally {
        setLoadingPayment(false);
      }
    };
    fetchCurrentPaymentMethod();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe is not ready.');
      return;
    }

    if (!cardName.trim()) {
      toast.error('Please enter the name on card.');
      return;
    }

    setUpdatingPayment(true);
    try {
      // ✅ Create payment method using separate elements
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: cardName,
        },
      });

      if (error) {
        toast.error(error.message || 'Invalid card details');
        return;
      }

      // ✅ Send to backend
      const res = await fetch(`${baseURL}/subscription/payment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_method: paymentMethod.id }),
      });

      if (res.ok) {
        toast.success('Payment method updated successfully');
        onClose();
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Failed to update payment method');
      }
    } catch (err) {
      console.error('Update payment error:', err);
      toast.error('Error updating payment method');
    } finally {
      setUpdatingPayment(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

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

  return (
    <div className="switch-active-plan-overlay" onClick={onClose}>
      <div className="enterprise-active-plan-content" onClick={(e) => e.stopPropagation()}>
        <button className="switch-active-plan-close" onClick={onClose}>
          <FiX />
        </button>
        <div className="switch-active-plan-header">
          <h2>Update Payment Method</h2>
          <p>Securely update your payment information</p>
        </div>

        {/* Current Payment Method Display */}
        {loadingPayment ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div
              style={{
                color: '#666',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ddd',
                  borderTop: '2px solid #DE3996',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              ></div>
              Loading...
            </div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : currentPaymentMethod ? (
          <div
            className="current-payment-method"
            style={{
              background: isDark ? '#1A4A3AAD' : 'rgba(240, 248, 255, 0.8)',
              border: isDark ? '1px solid #22C55E' : '1px solid rgba(222, 57, 150, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <h4
              style={{
                color: isDark ? '#22C55E' : 'rgba(61, 61, 61, 1)',
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '16px',
              }}
            >
              Current Payment Method
            </h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: isDark ? '#fff' : '#5A5A5A',
              }}
            >
              <span>•••• •••• •••• {currentPaymentMethod.last4}</span>
              {currentPaymentMethod.brand && (
                <div
                  style={{
                    background: '#000',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  {currentPaymentMethod.brand.toUpperCase()}
                </div>
              )}
              <span>
                Expires: {currentPaymentMethod.exp_month}/
                {String(currentPaymentMethod.exp_year).slice(-2)}
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(255, 245, 238, 0.8)',
              border: '1px solid rgba(255, 140, 0, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px', color: '#DE3996' }}>💳</div>
            <h4>No Payment Method Found</h4>
            <p>Please add a payment method below.</p>
          </div>
        )}

        {/* ✅ CUSTOM LAYOUT with Stripe Elements (separate fields) */}
        <form onSubmit={handleSubmit} className="edit-payment-form mt-4">
          <div className="form-group">
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
              Card Number
            </label>
            <div
              style={{
                padding: '12px',
                border: isDark ? '1px solid #0000001A' : '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: isDark ? '#110E20' : '#F9F9F9',
              }}
            >
              <CardNumberElement options={elementOptions} />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
              Name on Card
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '12px',
                border: isDark ? '1px solid #0000001A' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                background: isDark ? '#110E20' : '#F9F9F9',
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: isDark ? '#fff' : '#262626',
                  fontSize: '14px',
                }}
              >
                Expiry Date
              </label>
              <div
                style={{
                  padding: '12px',
                  border: isDark ? '1px solid #0000001A' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: isDark ? '#110E20' : '#F9F9F9',
                }}
              >
                <CardExpiryElement options={elementOptions} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: isDark ? '#fff' : '#262626',
                  fontSize: '14px',
                }}
              >
                CVV
              </label>
              <div
                style={{
                  padding: '12px',
                  border: isDark ? '1px solid #0000001A' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: isDark ? '#110E20' : '#F9F9F9',
                }}
              >
                <CardCvcElement options={elementOptions} />
              </div>
            </div>
          </div>

          <div
            className="edit-payment-form-buttons"
            style={{ display: 'flex', gap: '12px', marginTop: '24px' }}
          >
            <button
              type="button"
              className="btn-cancel-active-plan"
              onClick={onClose}
              disabled={updatingPayment}
            >
              Cancel
            </button>
            <button type="submit" className="btn-switch-active-plan" disabled={updatingPayment}>
              {updatingPayment ? 'Updating...' : 'Update Payment Method'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function VideoModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const [error, setError] = useState(false);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      setError(false);
      setVideoKey((prev) => prev + 1); // force remount video
    }
  }, [open]);

  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.38)',
        transition: 'none',
      }}
    >
      <div
        style={{
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
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            zIndex: 10001,
            background: 'var(--primary-color)',
            border: 'none',
            borderRadius: '50%',
            width: 38,
            height: 38,
            color: '#fff',
            fontSize: 26,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          }}
          aria-label="Close video"
        >
          <RxCross2 style={{ fontSize: 22, color: '#fff', margin: 0, padding: 0 }} />
        </button>
        {/* Only one loader inside modal while video loads */}
        {loading && !error && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.12)',
              zIndex: 10000,
            }}
          >
            <CustomLoader />
          </div>
        )}
        {error && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.12)',
              zIndex: 10000,
              color: '#e6339a',
              fontWeight: 700,
              fontSize: 22,
            }}
          >
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
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      </div>
    </div>
  );
}
