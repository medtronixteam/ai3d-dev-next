import React, { useState, useEffect } from 'react';
import './MyTeamPopup.css';
import { FiX, FiCheck, FiPlus, FiMoreHorizontal, FiTrash2, FiSettings } from 'react-icons/fi';
import TeamSettingsPopup from './TeamSettingsPopup';
import CreateTeamPopup from './CreateTeamPopup';
import { baseURL } from '../../config';
import ConfirmModal from './ConfirmLogoutPopup';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const MyTeamPopup = ({ onClose, user, teams }) => {
  const [showDeleteFor, setShowDeleteFor] = useState(null);
  const [isTeamSettingsOpen, setTeamSettingsOpen] = useState(false);
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const { token } = useAuth();
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [teamsState, setTeamsState] = useState(teams);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleDelete = (teamId) => {
    setShowDeleteFor(showDeleteFor === teamId ? null : teamId);
  };

  // Profile image logic
  let profileImg = '';
  if (user?.avatar) {
    profileImg = user.avatar.startsWith('http') ? user.avatar : `https://dev-backend.ai3dscanning.com/storage/${user.avatar.replace(/^\//, '')}`;
  } else if (user?.image) {
    profileImg = user.image.startsWith('http') ? user.image : `https://dev-backend.ai3dscanning.com/storage/${user.image.replace(/^\//, '')}`;
  }

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleRemoveTeam = (id) => {
    setDeleteTeamId(id);
    setErrorMsg('');
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTeamId) return;
    try {
      await axios.delete(`${baseURL}/team/delete/${deleteTeamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamsState(teamsState.filter(team => team.id !== deleteTeamId));
      setConfirmOpen(false);
      setDeleteTeamId(null);
      setShowDeleteFor(null);
      setSuccessOpen(true);
    } catch (err) {
      setErrorMsg('Failed to delete team!');
      setConfirmOpen(true);
    }
  };

  return (
    <div
      className="my-team-overlay"
      onClick={isCreateTeamOpen ? undefined : onClose}
    >
      <div className="my-team-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h4>Personal</h4>
          <button className="close-popup-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="popup-body">
          <div className="personal-account-item">
            {profileImg ? (
              <img src={profileImg} alt="User" className="user-initials" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="user-initials">
                {user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : ''}
              </div>
            )}
            <div className="account-details">
              <span className="account-name">{user?.name || ''}</span>
              <span className="account-type">{user?.email || 'Personal account'}</span>
            </div>
            <FiCheck className="selected-icon" />
          </div>

          <div className="teams-list-header">
            <h5>Teams</h5>
            <button className="add-team-btn" onClick={() => setCreateTeamOpen(true)}>
              <FiPlus />
            </button>
          </div>
          <div className="teams-cards-list">
            {teams && teams.length > 0 ? teams.map((team) => (
              <div key={team.id} className="team-card-item">
                <div className="team-card-icon">
                  {team.name ? team.name[0].toUpperCase() : '?'}
                </div>
                <span className="team-card-name">{team.name}</span>
                <div className="team-card-actions">
                  <button className="team-card-menu-btn" onClick={() => toggleDelete(team.id)}>
                    <FiMoreHorizontal />
                  </button>
                  {showDeleteFor === team.id && (
                    <div className="team-card-dropdown">
                      <button className="dropdown-item" onClick={() => { setSelectedTeamId(team.id); setTeamSettingsOpen(true); setShowDeleteFor(null); }}>
                        <FiSettings /> Team Setting
                      </button>
                      <button className="dropdown-item remove" onClick={() => handleRemoveTeam(team.id)}>
                        <FiTrash2 /> Remove Team
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div style={{ color: '#888', fontSize: 15, padding: 12, textAlign: 'center' }}>No teams found.</div>
            )}
          </div>
        </div>
      </div>
      {isTeamSettingsOpen && <TeamSettingsPopup onClose={() => setTeamSettingsOpen(false)} team_id={selectedTeamId} initialTeamName={teamsState.find(t => t.id === selectedTeamId)?.name || ''} />}
      {isCreateTeamOpen && <CreateTeamPopup onClose={() => setCreateTeamOpen(false)} />}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Team"
        message="Are you sure you want to delete this team? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        error={errorMsg}
      />
      {successOpen && (
        <ConfirmModal
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          title="Team Deleted"
          message="Team deleted successfully!"
          confirmText="OK"
          cancelText=""
          iconType="success"
        />
      )}
    </div>
  );
};

export default MyTeamPopup; 