import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiShare2,
  FiEdit,
  FiMail,
  FiLogOut,
  FiTrash2,
  FiChevronDown,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiBell,
  FiSearch,
  FiCheck,
  FiCopy,
  FiArrowRight,
} from 'react-icons/fi';
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';
import ProfileImg from '../../assets/images/Profile.png';
import SuccessImg from '../../assets/images/success-img.png';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';
import { baseURL } from '../../config';
import './Profile.css';
const themeColor = '#DE3996';

const modalBackdrop = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};
const modalAnim = {
  animation: 'modalPopIn 0.35s cubic-bezier(.68,-0.55,.27,1.55)',
};
const keyframes = `@keyframes modalPopIn { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }`;

const countryList = [
  'Pakistan',
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'China',
  'Japan',
  'Other',
];
// Country dial codes for phone number prefix selection (show codes only)
const countryDialCodes = [
  { value: '+92', label: '+92' },
  { value: '+91', label: '+91' },
  { value: '+1', label: '+1' },
  { value: '+44', label: '+44' },
  { value: '+61', label: '+61' },
  { value: '+49', label: '+49' },
  { value: '+33', label: '+33' },
  { value: '+86', label: '+86' },
  { value: '+81', label: '+81' },
];
const timeZoneList = [
  'Asia/Karachi',
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Europe/Berlin',
  'Australia/Sydney',
  'Asia/Tokyo',
  'Africa/Cairo',
  'Europe/Paris',
  'UTC',
];
const aiModelOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'advanced', label: 'Advanced' },
];
const genderOptions = [
  { value: '', label: 'Select Gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
const languageList = [
  'English',
  'Urdu',
  'Arabic',
  'French',
  'German',
  'Spanish',
  'Chinese',
  'Japanese',
  'Russian',
  'Hindi',
  'Other',
];

const Profile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const {
    unreadCount,
    notifications,
    markAllAsRead,
    toggleNotificationRead,
    togglingNotifications,
    markAllLoading,
  } = useNotification();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [primaryEmails, setPrimaryEmails] = useState([]);
  const [editData, setEditData] = useState(user);
  const [deleteEmailId, setDeleteEmailId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showSuccessMsg, setShowSuccessMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notifBtnRef = useRef();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://app.ai3dscanning.com';
    setShareUrl(`${origin}/profile/share-demo`);
  }, []);

  // Ensure only one profile modal is open at a time
  const closeAllModals = React.useCallback(() => {
    setShowEditModal(false);
    setShowChangePassword(false);
    setShowForgotPassword(false);
    setShowSuccess(false);
    setShowAddEmailModal(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseURL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    fetchPrimaryEmails();
  }, [token]);

  // Close notification dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifBtnRef.current && !notifBtnRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
    // Dispatch custom event to communicate with parent layout
    const event = new CustomEvent('sidebarToggle', { detail: { open: !sidebarOpen } });
    window.dispatchEvent(event);
  };

  const openShareModal = () => {
    closeAllModals();
    setShowShareModal(true);
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const fetchPrimaryEmails = async () => {
    try {
      const res = await axios.get(`${baseURL}/primary/email`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrimaryEmails(res.data.data || []);
    } catch (err) {
      setPrimaryEmails([]);
    }
  };

  const handleDeleteEmail = async (id) => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await axios.delete(`${baseURL}/primary/email/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteEmailId(null);
      setLoading(true);
      axios
        .get(`${baseURL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
      fetchPrimaryEmails();
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete email.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading profile...</div>;
  if (!user)
    return (
      <div style={{ padding: 40, color: 'red', textAlign: 'center' }}>Failed to load profile.</div>
    );

  // Profile image logic
  let profileImg = '';
  if (user.avatar) {
    profileImg = user.avatar.startsWith('http')
      ? user.avatar
      : `https://app.ai3dscanning.com/storage/${user.avatar.replace(/^\//, '')}`;
  } else if (user.image) {
    profileImg = user.image.startsWith('http')
      ? user.image
      : `https://app.ai3dscanning.com/storage/${user.image.replace(/^\//, '')}`;
  }

  return (
    <div className="profile-page-root">
      <style>{`
        /* Large screen layout */
        .profile-header-section {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          width: 100% !important;
          margin-bottom: 20px !important;
        }
        
        .profile-welcome-section {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
        }
        
        .profile-welcome-text {
          font-size: 24px !important;
          font-weight: 700 !important;
          color: #232334 !important;
          margin: 0 !important;
        }
        
        .profile-welcome-date {
          font-size: 14px !important;
          color: #888 !important;
          margin: 4px 0 0 0 !important;
        }
        
        .profile-actions-section {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        
        /* Mobile layout */
        @media (max-width: 992px) {
          .profile-sidebar-toggle {
            display: flex !important;
            background: #fff !important;
            color: #DE3996 !important;
            border: 1px solid #eee !important;
          }
          
          .profile-header-section {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
          }
          
          .profile-welcome-section {
            order: 2 !important;
           
            text-align: center !important;
          }
          
          .profile-actions-section {
            order: 1 !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 8px !important;
            flex-direction: row !important;
          }
          
          .profile-search-container {
            flex: 1 !important;
            min-width: 0 !important;
            max-width: none !important;
            margin: 0 8px !important;
          }
          
          // .navbar-icon-btn {
          //   flex-shrink: 0 !important;
          // }
        }
        
        /* Dark mode for menu button */
        [data-theme='dark'] .profile-sidebar-toggle,
        .dark .profile-sidebar-toggle {
          background: #232334 !important;
          color: #DE3996 !important;
          border: 1px solid #39395a !important;
        }
        
        @media (max-width: 768px) {
          .profile-header-section {
            flex-direction: column !important;
            // justify-content: space-between !important;
            // align-items: center !important;
            gap: 8px !important;
            padding: 0 16px !important;
          }
          
          .profile-search-container {
            flex: 1 !important;
            min-width: 0 !important;
            max-width: 100% !important;
            margin: 0 8px !important;
          }
          
          .profile-sidebar-toggle {
            width: 40px !important;
            height: 40px !important;
            font-size: 18px !important;
          }
          
          // .navbar-icon-btn {
          //   width: 40px !important;
          //   height: 40px !important;
          //   font-size: 18px !important;
          // }
        }
        
        @media (max-width: 600px) {
          .profile-header-section {
            gap: 6px !important;
            padding: 0 12px !important;
          }
          
          .profile-search-container {
            margin: 0 6px !important;
          }
          
          .profile-sidebar-toggle {
            width: 38px !important;
            height: 38px !important;
            font-size: 16px !important;
          }
          
          // .navbar-icon-btn {
          //   width: 38px !important;
          //   height: 38px !important;
          //   font-size: 18px !important;
          // }
        }
        
        @media (max-width: 480px) {
          .profile-header-section {
            gap: 4px !important;
            padding: 0 8px !important;
          }
          
          .profile-search-container {
            margin: 0 4px !important;
          }
          
          .profile-sidebar-toggle {
            width: 36px !important;
            height: 36px !important;
            font-size: 15px !important;
          }
          
          // .navbar-icon-btn {
          //   width: 36px !important;
          //   height: 36px !important;
          //   font-size: 18px !important;
          // }
        }
        
        .profile-sidebar-toggle svg {
          transition: transform 0.3s, opacity 0.3s;
        }
        
        .profile-sidebar-toggle.open svg {
          transform: rotate(90deg) scale(1.1);
          color: #DE3996;
        }
        
        /* Ensure notification dropdown is properly positioned on mobile */
      //   @media (max-width: 768px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 30% ;
      //       left: 50% ;
      //       transform: translate(-50%, -50%) ;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }

      //     @media (max-width: 600px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 20% ;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      //   }

      //   @media (max-width: 540px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 18% ;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      //   }

      //    @media (max-width: 450px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 14% ;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }

      // @media (max-width: 426px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 26%;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }

      // @media (max-width: 420px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 14%;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }

      //    @media (max-width: 390px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 15% ;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }

      // @media (max-width: 380px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 26% ;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }

      // @media (max-width: 360px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 17% ;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }

      // @media (max-width: 350px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 14% ;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }

      // @media (max-width: 345px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 15%;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }

      // @media (max-width: 340px) {
      //     .notif-dropdown {
      //       position: fixed !important;
      //       top: 26% ;
      //       left: 50% !important;
      //       transform: translate(-50%, -50%) !important;
      //       margin-top: 0 !important;
      //       width: 90vw !important;
      //       max-width: 90vw !important;
      //       min-width: 90vw !important;
      //       z-index: 1001 !important;
      //     }
      // }


      `}</style>

      {/* Search and Notification Header */}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="profile-modal">
          <EditProfileModal
            onClose={() => setShowEditModal(false)}
            user={user}
            setUser={setUser}
            onChangePassword={() => {
              closeAllModals();
              setShowChangePassword(true);
            }}
            onSuccess={() => {
              closeAllModals();
              setShowSuccess(true);
            }}
          />
        </div>
      )}
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="profile-modal">
          <ChangePasswordModal
            onClose={() => setShowChangePassword(false)}
            onSuccess={() => {
              closeAllModals();
              setShowSuccess(true);
            }}
            onForgotPassword={() => {
              closeAllModals();
              setShowForgotPassword(true);
            }}
          />
        </div>
      )}
      {showForgotPassword && (
        <div className="profile-modal">
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        </div>
      )}
      {/* Success Modal */}
      {showSuccess && (
        <div className="profile-modal">
          <SuccessModal
            onClose={() => setShowSuccess(false)}
            message={showSuccessMsg || undefined}
          />
        </div>
      )}
      {/* Add Email Modal */}
      {showAddEmailModal && (
        <div className="profile-modal">
          <AddEmailModal
            onClose={() => setShowAddEmailModal(false)}
            onSuccess={() => {
              closeAllModals();
              setShowSuccessMsg('Email added and verification sent!');
              setShowSuccess(true);
              setLoading(true);
              axios
                .get(`${baseURL}/user`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setUser(res.data.user))
                .catch(() => setUser(null))
                .finally(() => setLoading(false));
              fetchPrimaryEmails();
            }}
            token={token}
          />
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="share-close"
              onClick={() => setShowShareModal(false)}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 className="share-title">Share your profile</h3>
            <p className="share-subtitle">
              Copy the secure link below to quickly share your profile with teammates or clients.{' '}
            </p>
            <div className="share-input-row">
              <input className="share-input" type="text" readOnly value={shareUrl} />
              <button className="share-copy-btn" onClick={copyShareUrl} aria-label="Copy">
                <FiCopy />
              </button>
            </div>
            {copied && <div className="share-copied">Copied!</div>}
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      {deleteEmailId && (
        <div
          className="profile-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(34,34,59,0.18)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              minWidth: 340,
              maxWidth: 420,
              boxShadow: '0 8px 32px rgba(34,34,59,0.13)',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Delete Email</div>
            <div style={{ color: '#555', marginBottom: 24 }}>
              Are you sure you want to delete this email address?
            </div>
            {deleteError && <div style={{ color: '#DE3996', marginBottom: 12 }}>{deleteError}</div>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                onClick={() => setDeleteEmailId(null)}
                style={{
                  background: '#eee',
                  color: '#22223b',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 22px',
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setDeleteError('');
                  await handleDeleteEmail(deleteEmailId);
                  if (deleteError === 'First delete the team.') {
                    // Show this error in the modal, do not show success
                    // Modal stays open
                    return;
                  }
                  if (!deleteError) {
                    setShowSuccessMsg('Email deleted successfully!');
                    setShowSuccess(true);
                    setDeleteEmailId(null);
                  }
                }}
                style={{
                  background: '#DE3996',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 22px',
                  fontWeight: 500,
                  fontSize: 16,
                }}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="profile-main-card">
        <div className="profile-header-section">
          {/* Welcome Section - Left side on large screens, bottom on mobile */}
          <div className="profile-welcome-section">
            <h1 className="profile-welcome-text">Welcome, {user?.name || 'User'}</h1>
            <p className="profile-welcome-date">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
            </p>
          </div>

          {/* Actions Section - Right side on large screens, top on mobile */}
          <div className="profile-actions-section">
            {/* Responsive Menu Button - Only show on mobile */}
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

            {/* Search Bar */}
            <div
              className="profile-search-container"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 237, 247, 1)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                minWidth: '265px',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                flex: 1,
                maxWidth: '360px',
                width: '100%',
              }}
            >
              <FiSearch style={{ color: '#999', fontSize: '18px', marginRight: '12px' }} />
              <input
                type="text"
                placeholder="Search in profile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '16px',
                  color: '#232334',
                  width: '100%',
                }}
              />
            </div>

            {/* Notification Icon */}
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
                              gap: '4px',
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
                                <span className="notif-status-icon notif-tick">
                                  <FiCheck />
                                </span>
                              ) : (
                                <span className="notif-status-icon notif-dot"></span>
                              )}
                              <div className="notif-message">
                                {notif.data?.message ||
                                  notif.message ||
                                  notif.text ||
                                  notif.title ||
                                  'New notification'}
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
              </div>
            )}

          </div>
        </div>

        {/* Top Profile */}
        <div className="profile-top-row">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {profileImg ? (
              <img
                src={profileImg}
                alt="Profile"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: 24,
                }}
              />
            ) : (
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: '#fceded',
                  color: '#DE3996',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 28,
                  marginRight: 24,
                }}
              >
                {user.name
                  ? user.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : ''}
              </div>
            )}
            <div>
              <div className="profile-name" style={{ fontWeight: 700, fontSize: 22 }}>
                {user.name || ''}
              </div>
              <div className="profile-email" style={{ color: '#888', fontSize: 16 }}>
                {user.email || ''}
              </div>
            </div>
          </div>
          <div className="profile-actions" style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <button
              className="profile-action-btn share-btn"
              style={{
                background: '#22223b',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 18px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onClick={openShareModal}
            >
              <span className="btn-label">Share</span> <FiShare2 />
            </button>
            <button
              className="profile-action-btn edit-btn"
              style={{
                background: themeColor,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px ',
                fontWeight: 500,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }}
              onClick={() => {
                closeAllModals();
                setShowEditModal(true);
              }}
            >
              <span className="btn-label">Edit Profile</span> <FiArrowRight color="#ffffff" />
            </button>
          </div>
        </div>
        {/* 2-column form */}
        <div className="profile-grid">
          <div>
            <label className="form-label">Name</label>
            <input className="form-control profile-input" value={user.name || ''} disabled />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input className="form-control profile-input" value={user.email || ''} disabled />
          </div>
          <div>
            <label className="form-label">Gender</label>
            <input className="form-control profile-input" value={user.gender || ''} disabled />
          </div>
          <div>
            <label className="form-label">Country</label>
            <input className="form-control profile-input" value={user.country || ''} disabled />
          </div>
          <div>
            <label className="form-label">Language</label>
            <input className="form-control profile-input" value={user.language || ''} disabled />
          </div>
          <div>
            <label className="form-label">Phone Number</label>
            <input className="form-control profile-input" value={user.phone || ''} disabled />
          </div>
          <div>
            <label className="form-label">Time Zone</label>
            <input className="form-control profile-input" value={user.time_zone || ''} disabled />
          </div>
          <div>
            <label className="form-label">AI Model Setting</label>
            <input
              className="form-control profile-input"
              value={user.ai_model_setting || user.aiModel || ''}
              disabled
            />
          </div>
        </div>
        {/* My email address section */}
        {/* <div className="emails-container" style={{ marginTop: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>My email Address</div>
          {primaryEmails.length > 0 ? (
            primaryEmails.map((e, idx) => (
              <div key={e.id || idx} className="profile-email-card">
                <div className="profile-email-icon">
                  <FiMail size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{e.email}</div>
                </div>
                {e.verified ? (
                  <span className="profile-email-verified">Verified</span>
                ) : (
                  <span className="profile-email-not-verified">Not Verified</span>
                )}
                <button
                  onClick={() => setDeleteEmailId(e.id)}
                  className="profile-email-remove-btn"
                  title="Remove Email"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))
          ) : Array.isArray(user?.emails) && user.emails.length > 0 ? (
            user.emails.map((e, idx) => (
              <div key={idx} className="profile-email-card">
                <div className="profile-email-icon">
                  <FiMail size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{e.email}</div>
                  <div style={{ color: '#888', fontSize: 14 }}>{e.added}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#888', marginBottom: 12 }}>No email addresses found.</div>
          )}
          <button className="btn profile-add-email-btn" onClick={() => { closeAllModals(); setShowAddEmailModal(true); }}>
            +Add Email Address
          </button>
        </div> */}
        {/* Logout Button - Bottom Right */}
        <button
          className="profile-logout-btn "
          onClick={handleLogout}
          style={{
            // marginLeft: 'auto',
            marginRight: 24,
            background: 'none',
            border: 'none',
            color: '#DE3996',
            fontWeight: 600,
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'color 0.2s',
            zIndex: 1000,
          }}
          onMouseEnter={(e) => (e.target.style.color = '#c91e7b')}
          onMouseLeave={(e) => (e.target.style.color = '#DE3996')}
        >
          <FiLogOut size={22} /> Logout
        </button>
      </div>
    </div>
  );
};

const EditProfileModal = ({ onClose, user, setUser, onChangePassword, onSuccess }) => {
  const [form, setForm] = useState({ ...(user || {}), phone_country_code: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imgUploading, setImgUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState(user?.avatar || user?.image || '');
  const [successMsg, setSuccessMsg] = useState('');
  const { token } = useAuth();
  const fileInputRef = React.useRef();

  // List of required fields
  const requiredFields = [
    'name',
    'email',
    'gender',
    'country',
    'language',
    'phone',
    'time_zone',
    'ai_model_setting',
  ];

  // Auto-dismiss error after 4 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Dismiss error on any field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  useEffect(() => {
    if (!user) return;
    const rawPhone = user.phone || '';
    const match = rawPhone.match(/^\s*(\+\d{1,3})\s*(.*)$/);
    if (match) {
      setForm((prev) => ({
        ...prev,
        phone_country_code: match[1],
        phone: match[2]?.trim() || '',
      }));
    } else {
      let defaultCode = '';
      const country = (user.country || '').toLowerCase();
      if (country.includes('pakistan')) defaultCode = '+92';
      else if (country.includes('india')) defaultCode = '+91';
      else if (country.includes('united states') || country === 'usa' || country === 'us')
        defaultCode = '+1';
      else if (country.includes('united kingdom') || country === 'uk') defaultCode = '+44';
      else if (country.includes('canada')) defaultCode = '+1';
      else if (country.includes('australia')) defaultCode = '+61';
      else if (country.includes('germany')) defaultCode = '+49';
      else if (country.includes('france')) defaultCode = '+33';
      else if (country.includes('china')) defaultCode = '+86';
      else if (country.includes('japan')) defaultCode = '+81';
      setForm((prev) => ({ ...prev, phone_country_code: defaultCode }));
    }
  }, [user]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setImgUploading(true);
    setSuccessMsg('');
    try {
      const res = await axios.post(`${baseURL}/user/profile/photo`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setImgUrl(res.data.avatar || res.data.image || '');
      const userRes = await axios.get(`${baseURL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.user);
      setImgUrl(userRes.data.user.avatar || userRes.data.user.image || '');
      setSuccessMsg('Profile photo updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to update profile photo.');
    } finally {
      setImgUploading(false);
    }
  };

  const validateForm = () => {
    for (let field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === '') {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    setError('');
    if (!validateForm()) {
      setError('Please fill all required fields.');
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${baseURL}/user/profile`,
        {
          name: form.name,
          email: form.email,
          gender: form.gender,
          country: form.country,
          language: form.language,
          phone: `${(form.phone_country_code || '').trim()}${(form.phone || '').toString().trim()}`,
          time_zone: form.time_zone,
          ai_model_setting: form.ai_model_setting || form.aiModel,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUser({
        ...form,
        phone: `${(form.phone_country_code || '').trim()}${(form.phone || '').toString().trim()}`,
      });
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .edit-modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(34,34,59,0.18); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .edit-modal { background: #fff; border-radius: 18px; padding: 28px 16px 24px 16px; min-width: 750px; max-width: 900px; min-height: 400px; max-height: 95vh; box-shadow: 0 8px 32px rgba(34,34,59,0.13); position: relative; animation: popIn 0.35s cubic-bezier(.68,-0.55,.27,1.55); overflow-y: auto; }
        @media (min-width: 600px) { .edit-modal {  padding: 36px 40px 32px 40px; } }
        .edit-modal::-webkit-scrollbar { width: 6px; background: #f3e6f0; }
        .edit-modal::-webkit-scrollbar-thumb { background: #DE3996; border-radius: 6px; }
        .select-wrapper { position: relative; width: 100%; }
        .select-wrapper select.form-control { appearance: none; -webkit-appearance: none; -moz-appearance: none; padding-right: 36px; }
        .select-chevron { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #DE3996; font-size: 20px; }
        .edit-modal h2 { font-weight: 700; font-size: 2rem; margin-bottom: 28px; letter-spacing: -1px; }
        .edit-modal .profile-img-row { display: flex; align-items: center; margin-bottom: 28px; position: relative; }

        .edit-modal .profile-img-row img, .edit-modal .profile-img-row .img-placeholder { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; margin-right: 28px; background: #fceded; color: #DE3996; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 28px; position: relative; }

        .edit-modal .profile-img-row img, .edit-modal .profile-img-row .img-placeholder { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-right: 28px; background: #fceded; color: #DE3996; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 28px; position: relative; }

        .edit-modal .profile-img-row .pencil-icon-wrap { position: absolute; left: 52px; top: 44px; background: #fff; border-radius: 50%; box-shadow: 0 2px 8px #e9e9f7; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #DE3996; transition: background 0.2s; z-index: 2; }
        .edit-modal .profile-img-row .pencil-icon-wrap:hover { background: #DE3996; color: #fff; }
        .edit-modal .profile-img-row .pencil-icon { color: #DE3996; font-size: 18px; transition: color 0.2s; }
        .edit-modal .profile-img-row .pencil-icon-wrap:hover .pencil-icon { color: #fff; }
        .edit-modal .profile-img-row input[type='file'] { display: none; }
        .edit-modal .required { color: #DE3996; margin-left: 2px; }
        .edit-modal .form-grid { display: grid; grid-template-columns: 1fr; gap: 22px; }
        @media (min-width: 600px) { .edit-modal .form-grid { grid-template-columns: 1fr 1fr; } }
        .edit-modal label { font-weight: 500; margin-bottom: 4px; display: block; }
        .edit-modal .form-control { width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #e0e0e0 !important; background-color: #F9F9F9 !important; font-size: 1rem; margin-bottom: 0; }
        // :required:invalid { border-color: #DE3996; }
        .edit-modal .modal-actions { margin-top: 32px; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 3px; }
        .edit-modal .modal-actions button { border-radius: 6px; padding: 9px 22px; font-weight: 500; font-size: 1rem; border: none; cursor: pointer; }
        .edit-modal .modal-actions .cancel-btn { background: #eee; color: #22223b !important; }
        .edit-modal .modal-actions .save-btn { background: #DE3996; color: #fff; }
        .edit-modal .change-password-btn { background: none; color: #DE3996; border: none; text-decoration: underline; cursor: pointer; margin-right: auto; font-size: 1rem; }
        .edit-modal .error-msg { color: #DE3996; margin-top: 16px; font-weight: 500; }
      `}</style>
      <div className="edit-modal-backdrop">
        <div className="edit-modal">
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: window.innerWidth <= 768 ? '22px' : '42px',
              right: '37px',
              background: '#DE3996',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              width: '35px', // Updated button size
              height: '35px', // Updated button size
              borderRadius: '50%', // Perfect circle
              display: 'flex', // Flexbox for perfect centering
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0, // No extra padding
              transition: 'all 0.3s ease',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" // Adjusted SVG size for 35x35 button
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                display: 'block', // Removes any inline space
              }}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h2>Edit Profile</h2>
          {/* Error box at top */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fde8e8',
                color: '#d32f2f',
                borderRadius: 10,
                padding: '12px 18px',
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 16,
                boxShadow: '0 2px 8px #d32f2f11',
                gap: 10,
              }}
            >
              <FiAlertCircle style={{ fontSize: 22, color: '#d32f2f' }} />
              {error}
            </div>
          )}
          <div className="profile-img-row">
            {imgUrl ? (
              <img
                src={
                  imgUrl.startsWith('http')
                    ? imgUrl
                    : `https://app.ai3dscanning.com/storage/${imgUrl.replace(/^\//, '')}`
                }
                alt="Profile"
              />
            ) : (
              <div className="img-placeholder">
                {form.name
                  ? form.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : ''}
              </div>
            )}
            <div
              className="pencil-icon-wrap"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              title="Change photo"
            >
              <svg className="pencil-icon" viewBox="0 0 20 20" fill="none" width="18" height="18">
                <path
                  d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.25 8.25a2 2 0 0 1-.878.513l-3.464.99.99-3.464a2 2 0 0 1 .513-.878l8.25-8.25ZM15 2a4 4 0 0 0-2.828 1.172l-8.25 8.25a4 4 0 0 0-1.027 1.757l-.99 3.464A2 2 0 0 0 3.357 18.1l3.464-.99a4 4 0 0 0 1.757-1.027l8.25-8.25A4 4 0 0 0 15 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={imgUploading}
              />
            </div>
            {imgUploading && <span style={{ color: '#DE3996', marginLeft: 8 }}>Uploading...</span>}
            {successMsg && <span style={{ color: 'green', marginLeft: 8 }}>{successMsg}</span>}
          </div>
          <div className="form-grid">
            <div>
              <label>
                Name <span className="required">*</span>
              </label>
              <input
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div>
              <label>
                Email Address <span className="required">*</span>
              </label>
              <input
                name="email"
                value={form.email || ''}
                onChange={handleChange}
                className="form-control"
                required
                type="email"
              />
            </div>
            <div>
              <label>
                Gender <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  name="gender"
                  value={form.gender || ''}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  {genderOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="select-chevron" />
              </div>
            </div>
            <div>
              <label>
                Country <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  name="country"
                  value={form.country || ''}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Country</option>
                  {countryList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="select-chevron" />
              </div>
            </div>
            <div>
              <label>
                Language <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  name="language"
                  value={form.language || ''}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Language</option>
                  {languageList.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="select-chevron" />
              </div>
            </div>
            <div>
              <label>
                Phone Number <span className="required">*</span>
              </label>
              <div style={{ display: 'flex', gap: 0 }}>
                <div className="select-wrapper" style={{ maxWidth: 90, flex: '0 0 90px' }}>
                  <select
                    name="phone_country_code"
                    value={form.phone_country_code || ''}
                    onChange={handleChange}
                    className="form-control"
                    required
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      borderRight: 'none',
                      backgroundColor: '#F9F9F9',
                    }}
                  >
                    {/* <option value="">Code</option> */}
                    {countryDialCodes.map((opt) => (
                      <option key={`${opt.label}-${opt.value}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="select-chevron" />
                </div>
                <input
                  name="phone"
                  value={form.phone || ''}
                  onChange={handleChange}
                  className="form-control"
                  required
                  type="tel"
                  placeholder="Phone number"
                  style={{
                    flex: 1,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderLeft: 'none',
                    backgroundColor: '#F9F9F9',
                  }}
                />
              </div>
            </div>
            <div>
              <label>
                Time Zone <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  name="time_zone"
                  value={form.time_zone || ''}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Time Zone</option>
                  {timeZoneList.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="select-chevron" />
              </div>
            </div>
            <div>
              <label>
                AI Model Setting <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  name="ai_model_setting"
                  value={form.ai_model_setting || form.aiModel || 'basic'}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  {aiModelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="select-chevron" />
              </div>
            </div>
            <button className="change-password-btn" onClick={onChangePassword}>
              Change Password
            </button>
          </div>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ChangePasswordModal = ({ onClose, onSuccess, onForgotPassword }) => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError('');
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${baseURL}/change-password`,
        {
          current_password: form.oldPassword,
          new_password: form.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={modalBackdrop}>
        <div className="change-password-modal">
          {/* <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button> */}
          <h3 style={{ fontWeight: 600, fontSize: 24, marginBottom: 28 }}>Change Your Password</h3>
          <div style={{ marginBottom: 20 }}>
            <label>Old Password</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                name="oldPassword"
                type={showOld ? 'text' : 'password'}
                value={form.oldPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="Please enter your old password"
                required
                maxLength={30}
              />
              <span className="password-eye" onClick={() => setShowOld((s) => !s)}>
                {showOld ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onForgotPassword && onForgotPassword()}
              className="forgot-link mt-3"
              style={{
                marginTop: 10,
                background: 'none',
                border: 'none',
                color: '#DE3996',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Forget password?
            </button>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label>New Password</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                placeholder="Please enter your new password"
                value={form.newPassword}
                onChange={handleChange}
                className="form-control"
                required
                maxLength={30}
              />
              <span className="password-eye" onClick={() => setShowNew((s) => !s)}>
                {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </span>
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <label>Confirm Password</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Please confirm your new password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="form-control"
                required
                maxLength={30}
              />
              <span className="password-eye" onClick={() => setShowConfirm((s) => !s)}>
                {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </div>
          {error && (
            <div style={{ color: '#DE3996', marginBottom: 14, fontWeight: 500 }}>{error}</div>
          )}
          <div
            className="modal-actions"
            style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}
          >
            <button
              className="cancel-btn"
              onClick={onClose}
              style={{
                border: 'none',
                borderRadius: 6,
                padding: '10px 28px',
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              Cancel
            </button>
            <button
              className="save-btn"
              onClick={handleSave}
              style={{
                border: 'none',
                borderRadius: 6,
                padding: '10px 28px',
                fontWeight: 500,
                fontSize: 16,
                background: '#e6339a',
                color: '#fff',
                cursor: 'pointer',
              }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Forgot Password flow inside modal (reuses the same endpoints as ResetPassword page)
const ForgotPasswordModal = ({ onClose }) => {
  const themeColor = '#DE3996';
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(120);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === 2 && otpTimer > 0) timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  useEffect(() => {
    if (step === 2) setOtpTimer(120);
  }, [step]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) otpRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${baseURL}/forget-password`, { email });
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${baseURL}/verify-otp`, { email, otp: otpString });
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };
  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${baseURL}/resend-otp`, { email });
      setOtpTimer(120);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== cPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${baseURL}/reset-password`, { email, password });
      setStep(4);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="forgot-modal-backdrop">
        <div className="forgot-modal-content">
          <button className="forgot-modal-close" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <h4 className="mb-3" style={{ color: themeColor }}>
                Forget Password
              </h4>
              <p className="mb-3">Enter your email to receive an OTP.</p>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && (
                <div style={{ color: '#DE3996', marginBottom: 14, fontWeight: 500 }}>{error}</div>
              )}
              <div className="text-center">
                <button
                  className="btn"
                  style={{ background: themeColor, color: '#fff', width: 150, padding: '10px 0' }}
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <h4 className="mb-3" style={{ color: themeColor }}>
                Verify OTP
              </h4>
              <p className="mb-3">Enter the OTP sent to your email.</p>
              <div className="mb-3">
                <label className="form-label">OTP</label>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      className="form-control"
                      style={{ width: 45, height: 45, textAlign: 'center', fontSize: 18 }}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onFocus={(e) => e.target.select()}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-2" style={{ textAlign: 'center', color: '#888', fontSize: 15 }}>
                {otpTimer > 0
                  ? `Resend available in ${Math.floor(otpTimer / 60)}:${(otpTimer % 60).toString().padStart(2, '0')}`
                  : ''}
              </div>
              {error && (
                <div
                  style={{
                    color: '#DE3996',
                    marginBottom: 14,
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  {error}
                </div>
              )}
              <div className="text-center mb-2">
                <button
                  className="btn mb-2"
                  style={{ background: themeColor, color: '#fff', width: 150, padding: '10px 0' }}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  style={{ color: themeColor, width: 150, padding: '10px 0' }}
                  onClick={handleResendOtp}
                  disabled={loading || otpTimer > 0}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <h4 className="mb-3" style={{ color: themeColor }}>
                Reset Password
              </h4>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="New password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={30}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Confirm new password"
                    required
                    value={cPassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    maxLength={30}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowCPassword((s) => !s)}
                  >
                    {showCPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </span>
                </div>
              </div>
              {error && (
                <div style={{ color: '#DE3996', marginBottom: 14, fontWeight: 500 }}>{error}</div>
              )}
              <div className="text-center">
                <button
                  className="btn"
                  style={{ background: themeColor, color: '#fff', width: 150, padding: '10px 0' }}
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
          {step === 4 && (
            <div className="text-center">
              <img
                src={SuccessImg}
                alt="Success"
                style={{
                  width: 127,
                  height: 120,
                  objectFit: 'cover',
                  margin: '0 auto 20px',
                  display: 'block',
                }}
              />
              <h4 className="mb-3" style={{ color: themeColor, fontWeight: 'bold' }}>
                Password Changed Successfully!
              </h4>
              <p className="mb-4" style={{ color: '#666', fontSize: 14, lineHeight: 1.5 }}>
                Your password has been changed successfully.
              </p>
              <div className="text-center">
                <button
                  className="btn"
                  style={{ background: themeColor, color: '#fff', width: 150, padding: '10px 0' }}
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const SuccessModal = ({ onClose, message }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const emailMatch =
    typeof message === 'string' && message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const emailText = emailMatch ? emailMatch[0] : '';

  return (
    <div className={`umail-backdrop ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="umail-container">
        {/* Header */}
        <div className="umail-header">
          <img src={SuccessImg} alt="" />
          <button className="forgot-modal-close" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <h2 className="umail-title">Profile Updated Successfully!</h2>
        <p className="umail-message">Your profile changes have been saved successfully. </p>
      </div>
    </div>
  );
};

const AddEmailModal = ({ onClose, onSuccess, token }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/primary/email`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to verify email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.18)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="add-email-modal"
        style={{
          background: isDarkMode ? '#232334' : '#fff',
          color: isDarkMode ? '#f3f3fa' : '#232334',
          borderRadius: 16,
          padding: 40,
          Width: 420,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'popIn 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
          boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(34,34,59,0.13)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 22,
            cursor: 'pointer',
            color: isDarkMode ? '#b3b3c6' : '#888',
          }}
        >
          &times;
        </button>
        <h3
          style={{
            fontWeight: 600,
            fontSize: 24,
            marginBottom: 28,
            color: isDarkMode ? '#f3f3fa' : '#232334',
          }}
        >
          Add New Email
        </h3>
        <div style={{ width: '100%' }}>
          <label
            style={{
              color: isDarkMode ? '#f3f3fa' : '#232334',
              fontWeight: 500,
              marginBottom: 8,
              display: 'block',
            }}
          >
            Email Address
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email address"
              required
              style={{
                width: '100%',
                paddingLeft: '40px',
                background: isDarkMode ? '#110E20' : '#fff',
                color: isDarkMode ? '#f3f3fa' : '#232334',
                border: isDarkMode ? '1.5px solid #555' : '1.5px solid #e0e0e0',
                borderRadius: 8,
                padding: '10px 14px 10px 40px',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            <FiMail
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDarkMode ? '#b3b3c6' : '#888',
              }}
            />
          </div>
          {error && <div style={{ color: '#DE3996', marginTop: 8, fontSize: '14px' }}>{error}</div>}
        </div>
        <button
          onClick={handleSubmit}
          className="btn"
          style={{
            backgroundColor: '#e63399',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            width: '100%',
          }}
          disabled={loading}
        >
          {loading ? 'Sending Verification...' : 'Send Verification Link'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
