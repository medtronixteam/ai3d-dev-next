import React, { useEffect, useMemo, useRef, useState } from 'react';
import VideoGif from '../../assets/images/video.gif';
import './SubscriptionHistory.css';
import '../ApiSdk.css';
import SwitchPlan from '../../assets/images/switch_plan.svg';
import SwitchActive from '../../assets/images/Switch_Active.svg';
import DotVector from '../../assets/images/threedot_vector.svg';
import { FiBell, FiCheck, FiEdit, FiPlay, FiSearch, FiX, FiCreditCard } from 'react-icons/fi';
import { MdApi } from 'react-icons/md';
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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SkeletonLoader from '../../components/loader/SkeletonLoader';
import SubscriptionLoader from '../../components/loader/SubscriptionLoader';

const Subscription = () => {
  return (
    <div className="api-sdk-container">
      <div className="api-sdk-card">
        <MdApi className="api-sdk-icon" />
        <h2 className="api-sdk-title">Coming Soon</h2>
        <div className="api-sdk-desc">
          Subscription features are launching soon. Stay tuned!
        </div>
      </div>
    </div>
  );

  /*
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
  const [selectedInactivePlanId, setSelectedInactivePlanId] = useState(null);

  // API data states
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  // const [autoRenewal, setAutoRenewal] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState(false);
  // const [autoRenewalLoading, setAutoRenewalLoading] = useState(false);
  const [isDark, setIsDarkMode] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

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

  const statusStyles = useMemo(() => ({
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
  }), [isDark]);

  const filteredTable =
    activeFilter === 'All'
      ? formattedSubscriptions
      : formattedSubscriptions.filter((row) =>
          row.StatusOrder.toLowerCase().includes(activeFilter.toLowerCase()),
        );

  const totalPages = Math.ceil(filteredTable.length / rowsPerPage);
  const paginatedData = filteredTable.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
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

    // Only treat as error if it's a network/server failure (e.g., 5xx, or network issue)
    if (!response.ok) {
      // Optional: suppress error for 404 if your API returns 404 for no subs
      if (response.status === 404) {
        // No subscriptions is normal for new users
        setSubscriptions([]);
        setSubscriptionData([]);
        setLoadingSubscriptions(false);
        return;
      }

      // For real errors (500, etc.)
      console.error('Failed to fetch subscriptions:', response.status);
      toast.error('Error loading subscription data');
      setSubscriptions([]);
      setSubscriptionData([]);
      return;
    }

    const data = await response.json();
    console.log('Subscription API Response:', data);

    // Handle empty or missing subscriptions gracefully (no error)
    if (!data.subscriptions || data.subscriptions.length === 0) {
      setSubscriptions([]);
      setSubscriptionData([]);
      return;
    }

    // Process valid subscriptions
    setSubscriptions(data.subscriptions);
    const validSubs = data.subscriptions.filter(
      (sub) => sub.status === 'active' || sub.status === 'inactive'
    );

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
        planName:
          (sub.type || 'Pro Plan').charAt(0).toUpperCase() +
          (sub.type || 'Pro Plan').slice(1).toLowerCase(),
        status: sub.status,
        buyDate: createdDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        expiryDate: expiryDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        amount: sub.price_amount || '$19.99',
        billingCycle: sub.interval === 'year' ? 'Yearly' : 'Monthly',
        nextBillingDate: (() => {
          const nextBilling = new Date(createdDate);
          if (sub.interval === 'year') nextBilling.setFullYear(nextBilling.getFullYear() + 1);
          else nextBilling.setMonth(nextBilling.getMonth() + 1);
          return nextBilling.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        })(),
      };
    });

    setSubscriptionData(formattedSubscriptions);
  } catch (err) {
    console.error('Network error while fetching subscriptions:', err);
    // Only show toast for actual network failures
    toast.error('Unable to connect to subscription service');
    setSubscriptions([]);
    setSubscriptionData([]);
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
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    } finally {
      setLoadingSubscriptions(false);
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
  */
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

export const SwitchActivePlan = ({ onClose, token, onPlanSwitched, selectedInactivePlanId }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(selectedInactivePlanId);
  const [isDark, setIsDarkMode] = useState();

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchAllPlans();
  }, []);

  // ✅ Debug log when modal opens
  useEffect(() => {
    console.log('🔴 Modal opened with selectedInactivePlanId:', selectedInactivePlanId);
    console.log('🔴 All plans:', plans);
  }, [selectedInactivePlanId, plans]);

  const fetchAllPlans = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/subscriptions`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('All Plans:', data);
        
        if (data.subscriptions && data.subscriptions.length > 0) {
          const formattedPlans = data.subscriptions.map((sub) => {
            const createdDate = new Date(sub.created_at);
            let expiryDate = sub.ends_at ? new Date(sub.ends_at) : new Date(createdDate);
            
            if (!sub.ends_at) {
              if (sub.interval === 'year') {
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
              } else {
                expiryDate.setMonth(expiryDate.getMonth() + 1);
              }
            }

            const now = new Date();
            const diffInDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

            const planId = sub.stripe_id || sub.id;
            
            console.log('📦 Formatted Plan:', {
              id: planId,
              status: sub.status,
              type: sub.type
            });

            return {
              id: planId,
              planName: (sub.type || 'Pro Plan').charAt(0).toUpperCase() + 
                        (sub.type || 'Pro Plan').slice(1).toLowerCase(),
              status: sub.status,
              startDate: createdDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
              expiryDate: expiryDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
              daysUntilExpiry: diffInDays > 0 ? diffInDays : 0,
              isExpired: diffInDays <= 0,
              coins: sub.price_amount || '2900',
              interval: sub.interval,
            };
          });

          setPlans(formattedPlans);
        } else {
          setPlans([]);
        }
      } else {
        toast.error('Failed to fetch plans');
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      toast.error('Network error while fetching plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchPlan = async () => {
    console.log('--- Switch Plan Triggered ---');

    if (!selectedPlanId) {
      console.warn('No plan selected');
      toast.error('Please select a plan to activate');
      return;
    }
    console.log('Selected Plan ID:', selectedPlanId);

    if (!token) {
      console.warn('No authentication token found');
      toast.error('Authentication required');
      return;
    }

    setSwitching(true);

    try {
      const response = await fetch(`${baseURL}/subscriptions/${selectedPlanId}/activate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Plan activated successfully:', data);
        toast.success('Plan switched successfully!');

        if (onPlanSwitched) {
          onPlanSwitched();
        }

        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error('API returned an error:', errorData);
        toast.error(errorData.message || 'Failed to switch plan');
      }
    } catch (err) {
      console.error('Network or unexpected error:', err);
      toast.error('Network error while switching plan');
    } finally {
      setSwitching(false);
    }
  };

  // ✅ Get the active plan
  const activePlan = plans.find(plan => plan.status === 'active');
  
  // ✅ Get the specific clicked inactive plan with better matching
  const clickedInactivePlan = plans.find(plan => {
    const matches = (
      plan.status === 'inactive' && 
      (plan.id === selectedInactivePlanId || 
       plan.id === String(selectedInactivePlanId) ||
       String(plan.id) === String(selectedInactivePlanId))
    );
    
    if (matches) {
      console.log('✅ Found matching inactive plan:', plan);
    }
    
    return matches;
  });
  
  console.log('📊 Display Plans:', { 
    activePlan, 
    clickedInactivePlan, 
    selectedInactivePlanId,
    allPlans: plans 
  });
  
  // ✅ Show only these two plans
  const displayPlans = [activePlan, clickedInactivePlan].filter(Boolean);

  return (
    <div className="switch-active-plan-overlay" onClick={onClose}>
      <div className="switch-active-plan-content" onClick={(e) => e.stopPropagation()}>
        <button className="switch-active-plan-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="switch-active-plan-header">
          <h2>Switch Active Plan</h2>
          <p>Select which subscription you want to make active</p>
        </div>

        {loading ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            color: '#757575'
          }}>
            <SubscriptionLoader />
          </div>
        ) : displayPlans.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            color: '#757575'
          }}>
            <p>No plans available to switch</p>
            <p style={{ fontSize: '12px', marginTop: '8px', color: '#999' }}>
              Selected ID: {selectedInactivePlanId}
            </p>
          </div>
        ) : (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {displayPlans.map((plan) => {
              const isActive = plan.status === 'active';
              const isClickable = !isActive;
              
              return (
                <div
                  key={plan.id}
                  className={`main-starter-${isActive ? 'active' : 'enterprise'}-plan-container`}
                  style={{
                    marginBottom: '16px',
                    cursor: isClickable ? 'pointer' : 'default',
                    opacity: isActive ? 0.7 : 1,
                    background: selectedPlanId === plan.id && !isActive ? '#DE399633' : 'none',
                    boxShadow: selectedPlanId === plan.id && !isActive ? '0 0 8px #00000012' : '0 0 8px #00000012',
                    border: selectedPlanId === plan.id && plan.status !== 'active' 
                    ? `1px solid #DE3996` 
                    : `1px solid ${isDark ? '#555' : '#252525'}`   

                  }}
                  onClick={() => {
                    if (isClickable) {
                      setSelectedPlanId(plan.id);
                      console.log('🔵 Selected plan for switching:', plan.id);
                    }
                  }}
                >
                  <div className="main-starter-plan">
                    <div className="main-starter-plan-content">
                      <div className="starter-plan">
                        <h2 className={isActive ? 'starter-plan-h2' : 'starter-plan-h2'}>
                          {plan.planName}
                        </h2>
                        <h2 className={isActive ? 'starter-plan-h2-tag' : 'Enterprise-plan-h2-tag'}>
                          {isActive ? 'Active' : 'InActive'}
                        </h2>
                      </div>

                      <div className="flex-plan">
                        <span style={{
                          color: isDark ? '#fff' : 'rgba(61, 61, 61, 1)',
                          fontWeight: 600,
                          fontSize: '14px',
                          minWidth: isMobile ? '100px' : '120px',
                        }}>
                          Started:
                        </span>
                        <span style={{
                          color: isDark ? '#DADADA' : 'rgba(117, 117, 117, 1)',
                          fontSize: isMobile ? '12px' : '14px',
                          fontWeight: 600,
                        }}>
                          {plan.startDate}
                        </span>
                      </div>

                      {isActive ? (
                        <div className="flex-plan">
                          <span style={{
                            color: isDark ? '#fff' : 'rgba(61, 61, 61, 1)',
                            fontWeight: 600,
                            fontSize: '14px',
                            minWidth: isMobile ? '100px' : '120px',
                          }}>
                            Status:
                          </span>
                          <span style={{
                            color: plan.isExpired ? 'rgba(231, 76, 60, 1)' : '#E74C3C',
                            fontSize: isMobile ? '12px' : '14px',
                            fontWeight: 600,
                          }}>
                            {plan.isExpired 
                              ? 'Expired' 
                              : `Expiring in ${plan.daysUntilExpiry} days`}
                          </span>
                        </div>
                      ) : (
                        <div className="flex-plan">
                          <span style={{
                            color: isDark ? '#fff' : 'rgba(61, 61, 61, 1)',
                            minWidth: isMobile ? '100px' : '120px',
                            fontWeight: 600,
                            fontSize: '14px',
                          }}>
                            Valid Until:
                          </span>
                          <span style={{
                            color: isDark ? '#DADADA' : 'rgba(117, 117, 117, 1)',
                            fontSize: isMobile ? '12px' : '14px',
                            fontWeight: 600,
                          }}>
                            {plan.expiryDate} ({plan.interval === 'year' ? '12 months' : '1 month'})
                          </span>
                        </div>
                      )}

                      <div className="flex-plan">
                        <span style={{
                          color: isDark ? '#fff' : 'rgba(61, 61, 61, 1)',
                          minWidth: isMobile ? '100px' : '120px',
                          fontWeight: 600,
                          fontSize: '14px',
                        }}>
                          Plan Type:
                        </span>
                        <span style={{
                          color: isDark ? '#DADADA' : 'rgba(117, 117, 117, 1)',
                          fontSize: isMobile ? '12px' : '14px',
                          fontWeight: 600,
                        }}>
                          {plan.interval === 'year' ? 'Yearly' : 'Monthly'}
                        </span>
                      </div>
                    </div>

                    <div className="payment-type">
                      <h1>${plan.coins}</h1>
                      <p>Stripe Payment</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="req-refund-buttons">
          <button 
            className="btn-cancel-active-plan" 
            onClick={onClose}
            disabled={switching}
          >
            Cancel
          </button>
          <button 
            className="btn-switch-active-plan"
            onClick={handleSwitchPlan}
            disabled={switching || !selectedPlanId || loading}
            style={{
              opacity: (switching || !selectedPlanId || loading) ? 0.6 : 1,
              cursor: (switching || !selectedPlanId || loading) ? 'not-allowed' : 'pointer',
            }}
          >
            {switching ? (
              <>
                <div className="loading-spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                Switching...
              </>
            ) : (
              'Switch Plan'
            )}
          </button>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
