import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ProfilePopup.css';
import { FiSettings, FiUsers, FiHelpCircle, FiCreditCard, FiLogOut, FiBox, FiChevronRight, FiUserPlus, FiX, FiCheckCircle, FiClock, FiGift } from 'react-icons/fi';
import CreateTeamPopup from './CreateTeamPopup';
import MyTeamPopup from './MyTeamPopup';
import TeamSettingsPopup from './TeamSettingsPopup';
import ConfirmModal from './ConfirmLogoutPopup';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { baseURL } from '../../config';

const ProfilePopup = ({ onClose, successMessage }) => {
  const { token, logout } = useAuth();
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);
  const [isMyTeamOpen, setMyTeamOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isConfirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeamName, setSelectedTeamName] = useState('');
  const navigate = useNavigate();
  const [showSuccessMsg, setShowSuccessMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoadingProfile(true);
    setProfileError('');
    axios.get(`${baseURL}/user`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProfile(res.data.user || res.data))
      .catch(() => {
        setProfile(null);
        setProfileError('Failed to load profile. Please try again later.');
      })
      .finally(() => setLoadingProfile(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoadingTeams(true);
    axios.get(`${baseURL}/team`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTeams(res.data.data || []))
      .catch(() => setTeams([]))
      .finally(() => setLoadingTeams(false));
  }, [token, isCreateTeamOpen]);

  // Listen for successMessage prop (if passed from parent)
  useEffect(() => {
    if (successMessage) {
      setShowSuccessMsg(successMessage);
      setTimeout(() => setShowSuccessMsg(""), 4000);
    }
  }, [successMessage]);

  // Profile image logic
  let profileImg = '';
  if (profile?.avatar) {
    profileImg = profile.avatar.startsWith('http') ? profile.avatar : `https://app.ai3dscanning.com/storage/${profile.avatar.replace(/^\//, '')}`;
  } else if (profile?.image) {
    profileImg = profile.image.startsWith('http') ? profile.image : `https://app.ai3dscanning.com/storage/${profile.image.replace(/^\//, '')}`;
  }

  const handleOpenCreateTeam = () => setCreateTeamOpen(true);
  const handleCloseCreateTeam = () => setCreateTeamOpen(false);

  const handleOpenMyTeam = () => setMyTeamOpen(true);
  const handleCloseMyTeam = () => setMyTeamOpen(false);

  const handleOpenSettings = (teamId, teamName) => {
    setSelectedTeamId(teamId);
    setSelectedTeamName(teamName);
    setSettingsOpen(true);
  };
  const handleCloseSettings = () => setSettingsOpen(false);

  const handleOpenConfirmLogout = () => setConfirmLogoutOpen(true);
  const handleCloseConfirmLogout = () => setConfirmLogoutOpen(false);

  const handleConfirmLogout = async () => {
    handleCloseConfirmLogout();
    onClose();
    await logout();
    navigate("/signin");
  };

  if (isCreateTeamOpen) {
    return <CreateTeamPopup onClose={handleCloseCreateTeam} />;
  }
  if (isMyTeamOpen) {
    return <MyTeamPopup onClose={handleCloseMyTeam} user={profile} teams={teams} />;
  }
  if (isSettingsOpen) {
    return (
      <TeamSettingsPopup
        onClose={handleCloseSettings}
        team_id={selectedTeamId}
        initialTeamName={selectedTeamName}
      />
    );
  }
  if (isConfirmLogoutOpen) {
    return (
      <ConfirmModal
        open={true}
        onClose={handleCloseConfirmLogout}
        onConfirm={handleConfirmLogout}
        title="Log out"
        message="Are you sure you want to log out?"
        confirmText="Log out"
        cancelText="Cancel"
        iconType="warning"
      />
    );
  }
  return (
    <>
      <div
        className="profile-popup-overlay"
        onClick={
          isMyTeamOpen || isSettingsOpen || isConfirmLogoutOpen
            ? undefined
            : onClose
        }
      >
        <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
          {/* Success message at top of modal */}
          {showSuccessMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#e6f9f0',
              color: '#27ae60',
              borderRadius: 10,
              padding: '12px 18px',
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 16,
              boxShadow: '0 2px 8px #27ae6011',
              gap: 10,
            }}>
              <FiCheckCircle style={{ fontSize: 22, color: '#27ae60' }} />
              {showSuccessMsg}
            </div>
          )}
          <div className="popup-header">
            <h4>Personal</h4>
            <button className="close-popup-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
          <div className="user-info-section">
            {loadingProfile ? (
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fceded', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <span style={{ color: '#DE3996', fontWeight: 700 }}>...</span>
              </div>
            ) : profileImg ? (
              <img src={profileImg} alt="User" className="user-avatar" style={{ objectFit: 'cover', width: 48, height: 48, borderRadius: '50%', marginRight: 16 }} />
            ) : (
              <div className="user-avatar" style={{ background: '#fceded', color: '#DE3996', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, width: 48, height: 48, borderRadius: '50%', marginRight: 16 }}>
                {profile?.name ? profile.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : ''}
              </div>
            )}
            <div className="user-details">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="user-name">{loadingProfile ? 'Loading...' : (profile?.name || '')}</span>
                <span className="pro-badge free-badge">Free</span>
              </div>
              <span className="user-email email-wrap">{loadingProfile ? '' : (profile?.email || '')}</span>
            </div>
            <FiChevronRight className="arrow-icon" />
          </div>
          {profileError && (
            <div style={{ color: '#DE3996', background: '#fceded', borderRadius: 8, padding: '10px 16px', margin: '16px 0', fontWeight: 500, textAlign: 'center' }}>
              {profileError}
            </div>
          )}
          <div className="teams-section">
            <h5>Teams</h5>
            <button className="create-team-btn" onClick={handleOpenCreateTeam}>
              <FiUserPlus />
              Create team
            </button>
        
          <div className="popup-menu">
            <Link to="/platform/settings/profile" className="menu-item" onClick={onClose}>
              <FiSettings />
              <span>Settings</span>
            </Link>
            <div className="menu-item" onClick={handleOpenMyTeam} style={{cursor: 'pointer'}}>
              <FiUsers />
              <span>My team</span>
            </div>
            <Link to="/support" className="menu-item" onClick={onClose}>
              <FiHelpCircle />
              <span>Help & resources</span>
            </Link>
            <Link to="/platform/subscription" className="menu-item" onClick={onClose}>
              <FiGift />
              <span>Plan & pricing</span>
            </Link>
            
            <Link to="/settings/purchase-history" className="menu-item" onClick={onClose}>
              <FiCreditCard />
              <span>Purchase history</span>
            </Link>
            <Link to="/session-history" className="menu-item" onClick={onClose}>
              <FiClock />
              <span>Session history</span>
            </Link>
          </div>
        
          <div className="logout-section">
            <div className="menu-item" onClick={handleOpenConfirmLogout} style={{cursor: 'pointer'}}>
              <FiLogOut />
              <span>Log out</span>
            </div>
          </div>
              </div>
        </div>
      </div>
      {isMyTeamOpen && <MyTeamPopup onClose={handleCloseMyTeam} user={profile} teams={teams} />}
      {isSettingsOpen && <TeamSettingsPopup onClose={handleCloseSettings} team_id={selectedTeamId} initialTeamName={selectedTeamName} />}
      {isConfirmLogoutOpen && (
        <ConfirmModal
          open={isConfirmLogoutOpen}
          onClose={handleCloseConfirmLogout}
          onConfirm={handleConfirmLogout}
          title="Log out"
          message="Are you sure you want to log out?"
          confirmText="Log out"
          cancelText="Cancel"
          iconType="warning"
        />
      )}
    </>
  );
};

export default ProfilePopup; 