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
  FiX,
  FiMessageCircle,
  FiTwitter,
  FiShare,
} from 'react-icons/fi';
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';
import ProfileImg from '../../assets/images/Profile.png';
import SuccessImg from '../../assets/images/success-img.png';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';
import { baseURL } from '../../config';
import './Profile.css';
import shareProfile from '../../assets/images/shareProfile.svg';
import { FaSlideshare, FaTelegram, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { AtSign, Share, Share2 } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
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

const defaultCountryData = [
  { name: "Afghanistan", dialCode: "+93" },
  { name: "Albania", dialCode: "+355" },
  { name: "Algeria", dialCode: "+213" },
  { name: "Andorra", dialCode: "+376" },
  { name: "Angola", dialCode: "+244" },
  { name: "Argentina", dialCode: "+54" },
  { name: "Armenia", dialCode: "+374" },
  { name: "Australia", dialCode: "+61" },
  { name: "Austria", dialCode: "+43" },
  { name: "Azerbaijan", dialCode: "+994" },
  { name: "Bahamas", dialCode: "+1" },
  { name: "Bahrain", dialCode: "+973" },
  { name: "Bangladesh", dialCode: "+880" },
  { name: "Belgium", dialCode: "+32" },
  { name: "Bolivia", dialCode: "+591" },
  { name: "Brazil", dialCode: "+55" },
  { name: "Bulgaria", dialCode: "+359" },
  { name: "Cambodia", dialCode: "+855" },
  { name: "Cameroon", dialCode: "+237" },
  { name: "Canada", dialCode: "+1" },
  { name: "Chile", dialCode: "+56" },
  { name: "China", dialCode: "+86" },
  { name: "Colombia", dialCode: "+57" },
  { name: "Costa Rica", dialCode: "+506" },
  { name: "Croatia", dialCode: "+385" },
  { name: "Cuba", dialCode: "+53" },
  { name: "Cyprus", dialCode: "+357" },
  { name: "Czechia", dialCode: "+420" },
  { name: "Denmark", dialCode: "+45" },
  { name: "Dominican Republic", dialCode: "+1" },
  { name: "Ecuador", dialCode: "+593" },
  { name: "Egypt", dialCode: "+20" },
  { name: "El Salvador", dialCode: "+503" },
  { name: "Estonia", dialCode: "+372" },
  { name: "Ethiopia", dialCode: "+251" },
  { name: "Finland", dialCode: "+358" },
  { name: "France", dialCode: "+33" },
  { name: "Georgia", dialCode: "+995" },
  { name: "Germany", dialCode: "+49" },
  { name: "Ghana", dialCode: "+233" },
  { name: "Greece", dialCode: "+30" },
  { name: "Guatemala", dialCode: "+502" },
  { name: "Honduras", dialCode: "+504" },
  { name: "Hong Kong", dialCode: "+852" },
  { name: "Hungary", dialCode: "+36" },
  { name: "Iceland", dialCode: "+354" },
  { name: "India", dialCode: "+91" },
  { name: "Indonesia", dialCode: "+62" },
  { name: "Iran", dialCode: "+98" },
  { name: "Iraq", dialCode: "+964" },
  { name: "Ireland", dialCode: "+353" },
  { name: "Israel", dialCode: "+972" },
  { name: "Italy", dialCode: "+39" },
  { name: "Jamaica", dialCode: "+1" },
  { name: "Japan", dialCode: "+81" },
  { name: "Jordan", dialCode: "+962" },
  { name: "Kazakhstan", dialCode: "+7" },
  { name: "Kenya", dialCode: "+254" },
  { name: "Kuwait", dialCode: "+965" },
  { name: "Lebanon", dialCode: "+961" },
  { name: "Libya", dialCode: "+218" },
  { name: "Lithuania", dialCode: "+370" },
  { name: "Luxembourg", dialCode: "+352" },
  { name: "Malaysia", dialCode: "+60" },
  { name: "Maldives", dialCode: "+960" },
  { name: "Malta", dialCode: "+356" },
  { name: "Mexico", dialCode: "+52" },
  { name: "Monaco", dialCode: "+377" },
  { name: "Mongolia", dialCode: "+976" },
  { name: "Morocco", dialCode: "+212" },
  { name: "Nepal", dialCode: "+977" },
  { name: "Netherlands", dialCode: "+31" },
  { name: "New Zealand", dialCode: "+64" },
  { name: "Nicaragua", dialCode: "+505" },
  { name: "Nigeria", dialCode: "+234" },
  { name: "Norway", dialCode: "+47" },
  { name: "Oman", dialCode: "+968" },
  { name: "Pakistan", dialCode: "+92" },
  { name: "Palestine", dialCode: "+970" },
  { name: "Panama", dialCode: "+507" },
  { name: "Paraguay", dialCode: "+595" },
  { name: "Peru", dialCode: "+51" },
  { name: "Philippines", dialCode: "+63" },
  { name: "Poland", dialCode: "+48" },
  { name: "Portugal", dialCode: "+351" },
  { name: "Qatar", dialCode: "+974" },
  { name: "Romania", dialCode: "+40" },
  { name: "Russia", dialCode: "+7" },
  { name: "Saudi Arabia", dialCode: "+966" },
  { name: "Senegal", dialCode: "+221" },
  { name: "Serbia", dialCode: "+381" },
  { name: "Singapore", dialCode: "+65" },
  { name: "Slovakia", dialCode: "+421" },
  { name: "Slovenia", dialCode: "+386" },
  { name: "South Africa", dialCode: "+27" },
  { name: "South Korea", dialCode: "+82" },
  { name: "Spain", dialCode: "+34" },
  { name: "Sri Lanka", dialCode: "+94" },
  { name: "Sudan", dialCode: "+249" },
  { name: "Sweden", dialCode: "+46" },
  { name: "Switzerland", dialCode: "+41" },
  { name: "Syria", dialCode: "+963" },
  { name: "Taiwan", dialCode: "+886" },
  { name: "Tajikistan", dialCode: "+992" },
  { name: "Tanzania", dialCode: "+255" },
  { name: "Thailand", dialCode: "+66" },
  { name: "Tunisia", dialCode: "+216" },
  { name: "Turkey", dialCode: "+90" },
  { name: "Uganda", dialCode: "+256" },
  { name: "Ukraine", dialCode: "+380" },
  { name: "United Arab Emirates", dialCode: "+971" },
  { name: "United Kingdom", dialCode: "+44" },
  { name: "United States", dialCode: "+1" },
  { name: "Uruguay", dialCode: "+598" },
  { name: "Uzbekistan", dialCode: "+998" },
  { name: "Venezuela", dialCode: "+58" },
  { name: "Vietnam", dialCode: "+84" },
  { name: "Yemen", dialCode: "+967" },
  { name: "Zimbabwe", dialCode: "+263" }
];

const countryList = Array.from(new Set(defaultCountryData.map(c => c.name))).sort();
if (!countryList.includes("Other")) {
  countryList.push("Other");
}

const uniqueDialCodesStatic = Array.from(new Set(defaultCountryData.map(c => c.dialCode))).sort((a, b) => {
  const numA = parseInt(a.replace(/[^\d]/g, ''), 10);
  const numB = parseInt(b.replace(/[^\d]/g, ''), 10);
  return numA - numB;
});
const countryDialCodes = uniqueDialCodesStatic.map(code => ({ value: code, label: code }));
let timeZoneList = [];
try {
  timeZoneList = Intl.supportedValuesOf('timeZone');
} catch (e) {
  timeZoneList = [
    'Africa/Cairo',
    'America/Argentina/Buenos_Aires',
    'America/Bogota',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Mexico_City',
    'America/New_York',
    'America/Sao_Paulo',
    'Asia/Bangkok',
    'Asia/Dubai',
    'Asia/Hong_Kong',
    'Asia/Jakarta',
    'Asia/Karachi',
    'Asia/Kolkata',
    'Asia/Manila',
    'Asia/Riyadh',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Europe/Berlin',
    'Europe/London',
    'Europe/Madrid',
    'Europe/Moscow',
    'Europe/Paris',
    'Europe/Rome',
    'UTC',
  ];
}
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
  const [filterType, setFilterType] = useState('all');

  const [activeIcon, setActiveIcon] = useState(null);

  const icons = [
    { id: 'chat', icon: <FiMessageCircle size={25} />, name: 'Chat' },
    { id: 'telegram', icon: <FaTelegramPlane size={25} />, name: 'Telegram' },
    { id: 'twitter', icon: <FiTwitter size={25} />, name: 'Twitter' },
    { id: 'whatsapp', icon: <FaWhatsapp size={25} />, name: 'Whatsapp' },
    { id: 'email', icon: <AtSign size={25} />, name: 'Email' },
    { id: 'others', icon: <Share2 size={25} />, name: 'Others' },
  ];


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

  const rawName = (user.name || '').trim();
  const isNameEmail = rawName.includes('@');
  const displayName = !rawName || isNameEmail
    ? (user.email || '').split('@')[0] || 'User'
    : rawName;
  const showEmailUnderName = Boolean(user.email && user.email !== displayName);

  // Profile image logic
  let profileImg = '';
  if (user.avatar) {
    profileImg = user.avatar.startsWith('http')
      ? user.avatar
      : `storage/${user.avatar.replace(/^\//, '')}`;
  } else if (user.image) {
    profileImg = user.image.startsWith('http')
      ? user.image
      : `storage/${user.image.replace(/^\//, '')}`;
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
            display: none !important;
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
            padding: 0 0px !important;
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
            <div className="d-flex justify-content-between">
              <h3 className="share-title">Share with</h3>
              <span onClick={() => setShowShareModal(false)} aria-label="Close">
                <FiX size={16} />
              </span>
            </div>

            <div className="share-through-icons d-flex justify-content-between"  style={{ overflowX: 'auto', scrollBehavior: 'smooth', gap: '10px' }}>
              {icons.map(({ id, icon, name }) => (
                <div
                  key={id}
                  className="d-flex flex-column align-items-center justify-content-center"
                  onClick={() => setActiveIcon(id)}>
                  <span
                    className={`share-through-icons-span-tag ${activeIcon === id ? 'active' : ''}`}>
                    {icon}
                  </span>
                  <span
                    className={`share-through-icons-span-name-tag ${
                      activeIcon === id ? 'active' : '' }`}>
                    {name}
                  </span>
                </div>
              ))}
            </div>

            <p className="share-subtitle">Or share with link</p>
            <div className="share-input-row">
              <input className="share-input" type="text" readOnly value={shareUrl} />
              <span className="share-copy-btn" onClick={copyShareUrl}>
                <FiCopy size={18} />
              </span>
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
            <h1 className="profile-welcome-text">Welcome, {displayName}</h1>
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

                    {/* <div style={{ 
                              fontSize: '11px', 
                              color: '#888', 
                              padding: '8px 16px', 
                              borderBottom: '1px solid #f3e6f3',
                              fontStyle: 'italic'
                            }}>
                              Click to toggle read/unread status
                            </div> */}

                    {/* <div className="notif-dropdown-list">
                              <div className="d-flex flex-column">
                                <span className='last-days-notif'>Last 7 Days</span>
                                <span className='older-days-notif'>Older</span>
                              </div>
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
                                      
                                      {isToggling ? (
                                        <span className="notif-status-icon notif-loading">
                                          <div className="loading-spinner"></div>
                                        </span>
                                      ) : notif.read_at ? (
                                        <span className="notif-status-icon notif-tick"><FiCheck /></span>
                                      ) : (
                                        <span className="notif-status-icon notif-dot"></span>
                                      )}
                                      <div className="notif-message">
                                        {notif.data?.message || notif.message || notif.text || notif.title || 'New notification'}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="notif-empty">No notifications</div>
                              )}
                            </div> */}

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

        {/* Top Profile */}
        <div className="profile-top-row">
          <div className="profile-identity">
            {profileImg ? (
              <img
                src={profileImg}
                alt="Profile"
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-placeholder-avatar">
                {(displayName || 'U')
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="profile-identity-text">
              <div className="profile-name">{displayName}</div>
              {showEmailUnderName ? (
                <div className="profile-email">{user.email}</div>
              ) : null}
            </div>
          </div>
          <div className="profile-actions">
            <button
              className="profile-action-btn share-btn"
              style={{
                background: '#22223b',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize : '14px',
                gap: 8,
              }}
              onClick={openShareModal}
            >
              <span className="btn-label">Share</span> <FiShare2 size={16} />
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
                fontSize : '14px',
                gap: 8,
              }}
              onClick={() => {
                closeAllModals();
                setShowEditModal(true);
              }}
            >
              <span className="btn-label">Edit Profile</span> <FiArrowRight size={16} color="#ffffff" />
            </button>
          </div>
        </div>
        {/* 2-column form */}
        <div className="profile-grid">
          {(() => {
            const profileFields = [
              { label: 'Name', value: user.name || '' },
              { label: 'Email Address', value: user.email || '' },
              { label: 'Gender', value: user.gender || '' },
              { label: 'Country', value: user.country || '' },
              { label: 'Language', value: user.language || '' },
              { label: 'Phone Number', value: user.phone || '' },
              { label: 'Time Zone', value: user.time_zone || '' },
              { label: 'AI Model Setting', value: user.ai_model_setting || user.aiModel || '' },
            ];

            const filteredFields = profileFields.filter((field) => {
              if (!searchQuery.trim()) return true;
              const query = searchQuery.toLowerCase();
              return (
                field.label.toLowerCase().includes(query) ||
                field.value.toString().toLowerCase().includes(query)
              );
            });

            if (filteredFields.length === 0) {
              return (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px 16px', color: '#888', fontSize: '18px' }}>
                  No fields match your search.
                </div>
              );
            }

            return filteredFields.map((field, index) => (
              <div key={index}>
                <label className="form-label">{field.label}</label>
                <input className="form-control profile-input" value={field.value} disabled />
              </div>
            ));
          })()}
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
  const [formErrors, setFormErrors] = useState({});
  const { token } = useAuth();
  const fileInputRef = React.useRef();

  const [countries, setCountries] = useState(countryList);
  const [phoneCodes, setPhoneCodes] = useState(countryDialCodes);
  const [countryDataList, setCountryDataList] = useState(defaultCountryData);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2')
      .then((res) => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data)) {
          const fetched = data.map((item) => {
            const name = item.name?.common || '';
            let dialCode = '';
            if (item.idd && item.idd.root) {
              const root = item.idd.root;
              const suffixes = item.idd.suffixes || [];
              if (root === '+1') {
                dialCode = '+1';
              } else if (suffixes.length === 1) {
                dialCode = root + suffixes[0];
              } else if (suffixes.length > 1) {
                if (root === '+7') {
                  dialCode = '+7';
                } else {
                  dialCode = root + (suffixes[0].length <= 2 ? suffixes[0] : '');
                }
              } else {
                dialCode = root;
              }
            }
            return { name, dialCode };
          })
          .filter(c => c.name && c.dialCode);

          fetched.sort((a, b) => a.name.localeCompare(b.name));

          const uniqueNames = Array.from(new Set(fetched.map(c => c.name)));
          if (!uniqueNames.includes('Other')) {
            uniqueNames.push('Other');
          }

          const uniqueCodesMap = new Map();
          fetched.forEach(c => {
            if (c.dialCode && !uniqueCodesMap.has(c.dialCode)) {
              uniqueCodesMap.set(c.dialCode, { value: c.dialCode, label: c.dialCode });
            }
          });
          
          defaultCountryData.forEach(c => {
            if (c.dialCode && !uniqueCodesMap.has(c.dialCode)) {
              uniqueCodesMap.set(c.dialCode, { value: c.dialCode, label: c.dialCode });
            }
          });

          const sortedCodes = Array.from(uniqueCodesMap.values()).sort((a, b) => {
            const numA = parseInt(a.value.replace(/[^\d]/g, ''), 10);
            const numB = parseInt(b.value.replace(/[^\d]/g, ''), 10);
            return numA - numB;
          });

          setCountries(uniqueNames);
          setPhoneCodes(sortedCodes);
          setCountryDataList(fetched);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch country list from API:', err);
      });
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setForm((prev) => {
      const updated = { ...prev, country: selectedCountry };
      if (selectedCountry) {
        const countryInfo = countryDataList.find(
          (c) => c.name.toLowerCase() === selectedCountry.toLowerCase()
        );
        if (countryInfo && countryInfo.dialCode) {
          updated.phone_country_code = countryInfo.dialCode;
        } else {
          let defaultCode = '';
          const cLower = selectedCountry.toLowerCase();
          if (cLower.includes('pakistan')) defaultCode = '+92';
          else if (cLower.includes('india')) defaultCode = '+91';
          else if (cLower.includes('united states') || cLower === 'usa' || cLower === 'us')
            defaultCode = '+1';
          else if (cLower.includes('united kingdom') || cLower === 'uk') defaultCode = '+44';
          else if (cLower.includes('canada')) defaultCode = '+1';
          else if (cLower.includes('australia')) defaultCode = '+61';
          else if (cLower.includes('germany')) defaultCode = '+49';
          else if (cLower.includes('france')) defaultCode = '+33';
          else if (cLower.includes('china')) defaultCode = '+86';
          else if (cLower.includes('japan')) defaultCode = '+81';
          if (defaultCode) {
            updated.phone_country_code = defaultCode;
          }
        }
      }
      return updated;
    });

    if (error) setError('');
    if (formErrors.country) {
      setFormErrors((prev) => ({ ...prev, country: '' }));
    }
  };

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
    if (formErrors[e.target.name]) {
      setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
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
    const errors = {};
    for (let field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === '') {
        errors[field] = 'This field is required';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    setError('');
    if (!validateForm()) {
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
        .edit-modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(34,34,59,0.18); z-index: 4000; display: flex; align-items: center; justify-content: center; }
        .edit-modal { background: #fff; border-radius: 18px; padding: 28px 16px 24px 16px; min-width: 750px; max-width: 900px; min-height: 400px; max-height: 95vh; box-shadow: 0 8px 32px rgba(34,34,59,0.13); position: relative; animation: popIn 0.35s cubic-bezier(.68,-0.55,.27,1.55); overflow-y: auto; }
        @media (min-width: 600px) { .edit-modal {  padding: 36px 40px 32px 40px; } }
        @media (max-width: 787px) {
          .edit-modal-backdrop { align-items: stretch; justify-content: stretch; }
          .edit-modal { min-width: 100%; width: 100%; max-width: 100%; height: 100%; max-height: 100%; min-height: 0; margin: 0; border-radius: 0; padding: 20px 16px 0; display: flex; flex-direction: column; overflow: hidden; }
          .edit-modal .form-grid { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 12px; }
          .edit-modal .modal-actions { position: sticky; bottom: 0; margin-top: auto; padding: 12px 0 calc(16px + env(safe-area-inset-bottom, 0px)); background: #fff; box-shadow: 0 -8px 16px rgba(0,0,0,0.06); justify-content: stretch; gap: 8px; flex-wrap: nowrap; }
          .edit-modal .modal-actions button { flex: 1; }
        }
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
        .edit-modal .error-msg-inline { color: #DE3996; font-size: 0.8rem; margin-top: 4px; display: block; text-align: start; }
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
                src={imgUrl.startsWith('http') ? imgUrl : `storage/${imgUrl.replace(/^\//, '')}`}
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
                maxLength={15}
              />
              {formErrors.name && <span className="error-msg-inline">{formErrors.name}</span>}
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
              {formErrors.email && <span className="error-msg-inline">{formErrors.email}</span>}
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
              {formErrors.gender && <span className="error-msg-inline">{formErrors.gender}</span>}
            </div>
            <div>
              <label>
                Country <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  name="country"
                  value={form.country || ''}
                  onChange={handleCountryChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="select-chevron" />
              </div>
              {formErrors.country && <span className="error-msg-inline">{formErrors.country}</span>}
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
              {formErrors.language && <span className="error-msg-inline">{formErrors.language}</span>}
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
                    {phoneCodes.map((opt) => (
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
              {formErrors.phone && <span className="error-msg-inline">{formErrors.phone}</span>}
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
              {formErrors.time_zone && <span className="error-msg-inline">{formErrors.time_zone}</span>}
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
              {formErrors.ai_model_setting && <span className="error-msg-inline">{formErrors.ai_model_setting}</span>}
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
              {saving ? 'Updating...' : 'Update'}
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
                autoComplete="off"
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              />
              <span className="password-eye" onClick={() => setShowOld((s) => !s)}>
                {showOld ? <FiEye size={20} /> : <FiEyeOff size={20} />}
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
                autoComplete="off"
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              />
              <span className="password-eye" onClick={() => setShowNew((s) => !s)}>
                {showNew ? <FiEye size={18} /> : <FiEyeOff size={18} />}
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
                autoComplete="off"
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              />
              <span className="password-eye" onClick={() => setShowConfirm((s) => !s)}>
                {showConfirm ? <FiEye size={20} /> : <FiEyeOff size={20} />}
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
                    autoComplete="off"
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
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
                    {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
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
                    autoComplete="off"
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
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
                    {showCPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
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
