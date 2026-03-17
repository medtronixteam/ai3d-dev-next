import React, { useState, useEffect } from 'react';
import './MyTeamPopup.css';
import { FiX, FiCheck, FiPlus, FiMoreHorizontal, FiTrash2, FiSettings } from 'react-icons/fi';
import TeamSettingsPopup from './TeamSettingsPopup';
import CreateTeamPopup from './CreateTeamPopup';
import { baseURL } from '../../config';
import ConfirmModal from './ConfirmLogoutPopup'; 
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const MyTeamPopup = ({ onClose, user, teams, onTeamUpdate }) => { 
  const [showDeleteFor, setShowDeleteFor] = useState(null);
  const [isTeamSettingsOpen, setTeamSettingsOpen] = useState(false);
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const { token, setActiveTeam, activeTeam } = useAuth();
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [teamsState, setTeamsState] = useState(teams);
  const [successOpen, setSuccessOpen] = useState(false);
  // Confirm before switching to a team
  const [selectConfirmOpen, setSelectConfirmOpen] = useState(false);
  const [teamToSelect, setTeamToSelect] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setTeamsState(teams);
  }, [teams]);

  const toggleDelete = (teamId) => {
    setShowDeleteFor(showDeleteFor === teamId ? null : teamId);
  };

  const openSelectConfirm = (team) => {
    setTeamToSelect(team);
    setSelectConfirmOpen(true);
  };

  const confirmSelectTeam = () => {
    if (!teamToSelect) return;
    try {
      const selected = {
        id: teamToSelect.id,
        name: teamToSelect.name,
        avatar: teamToSelect.avatar || null,
        members: teamToSelect.total_members,
      };
      setActiveTeam(selected);
      setSelectConfirmOpen(false);
      setTeamToSelect(null);
      if (typeof onClose === 'function') onClose();
    } catch (e) {
      console.error('Failed to select team:', e);
    }
  };

  let profileImg = '';
  if (user?.avatar) {
    profileImg = user.avatar.startsWith('http')
      ? user.avatar
      : `https://dev-backend.ai3dscanning.com/storage/${user.avatar.replace(/^\//, '')}`;
  } else if (user?.image) {
    profileImg = user.image.startsWith('http')
      ? user.image
      : `https://dev-backend.ai3dscanning.com/storage/${user.image.replace(/^\//, '')}`;
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
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedTeams = teamsState.filter((team) => team.id !== deleteTeamId);
      setTeamsState(updatedTeams);
      if (onTeamUpdate) onTeamUpdate(updatedTeams);

      setConfirmOpen(false);
      setDeleteTeamId(null);
      setShowDeleteFor(null);
      setErrorMsg('');
      setSuccessOpen(true);
    } catch (err) {
      console.error('Delete team error:', err);
      setErrorMsg('Failed to delete team!');
      setConfirmOpen(true);
    }
  };

  const handleTeamCreated = (newTeam) => {
    const updatedTeams = [...teamsState, newTeam];
    setTeamsState(updatedTeams);
    if (onTeamUpdate) {
      onTeamUpdate(updatedTeams);
    }
  };

  const handleTeamUpdated = (updatedTeam) => {
    const updatedTeams = teamsState.map((team) =>
      team.id === updatedTeam.id ? updatedTeam : team
    );
    setTeamsState(updatedTeams);
    if (onTeamUpdate) {
      onTeamUpdate(updatedTeams);
    }
  };

  const handleMemberChanged = async (teamId) => {
   try {
      const res = await axios.get(`${baseURL}/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data?.data) {
        const updatedTeams = teamsState.map((team) =>
          team.id === teamId 
            ? { ...team, total_members: res.data.data.total_members } 
            : team
        );
        setTeamsState(updatedTeams);
        if (onTeamUpdate) {
          onTeamUpdate(updatedTeams);
        }
      }
    } catch (err) {
      console.error('Failed to refresh team data:', err);
    }
  };

  if (isTeamSettingsOpen) {
    return (
      <TeamSettingsPopup
        onClose={() => setTeamSettingsOpen(false)}
        team_id={selectedTeamId}
        initialTeamName={teamsState.find((t) => t.id === selectedTeamId)?.name || ''}
        onTeamUpdated={handleTeamUpdated}
        onMemberChanged={handleMemberChanged}
      />
    );
  }

  if (isCreateTeamOpen) {
    return (
      <CreateTeamPopup
        onClose={() => setCreateTeamOpen(false)}
        onTeamCreated={handleTeamCreated}
      />
    );
  }

  return (
    <div className="my-team-overlay" onClick={isCreateTeamOpen ? undefined : onClose}>
      <div className="my-team-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h4>{activeTeam ? 'Current team' : 'Personal'}</h4>
          <button className="close-popup-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="popup-body">
          {activeTeam && (
            <div className="personal-account-item" style={{ marginBottom: 16 }}>
              <div className="user-initials">
                {(activeTeam.name || '?').substring(0,1).toUpperCase()}
              </div>
              <div className="account-details">
                <span className="account-name">{activeTeam.name}</span>
                <span className="account-type">Active team</span>
              </div>
              <FiCheck className="selected-icon" />
            </div>
          )}
          {/* Always show personal account; check only when not in team mode */}
          <div className="personal-account-item">
            {profileImg ? (
              <img
                src={profileImg}
                alt="User"
                className="user-initials"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="user-initials">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : ''}
              </div>
            )}
            <div className="account-details">
              <span className="account-name">{user?.name || ''}</span>
              <span className="account-type">{user?.email || 'Personal account'}</span>
            </div>
            {!activeTeam && <FiCheck className="selected-icon" />}
          </div>

          <div className="teams-list-header">
            <h5>My Teams</h5>
            {!activeTeam && (
              <button className="add-team-btn" onClick={() => setCreateTeamOpen(true)}>
                <FiPlus />
              </button>
            )}
          </div>
          <div className="teams-cards-list">
            {teamsState && teamsState.length > 0 ? (
              teamsState
                .filter((team) => !activeTeam || team.id !== activeTeam.id)
                .map((team) => (
                <div key={team.id} className="team-card-item" onClick={() => openSelectConfirm(team)} style={{ cursor: 'pointer' }}>
                  <div className="team-card-icon">
                    {team.name ? team.name[0].toUpperCase() : '?'}
                  </div>
                  <div className="team-card-info">
                    <span className="team-card-name">{team.name}</span>
                    <span className="team-card-members">
                      {team.total_members} {team.total_members === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                  <div className="team-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="team-card-menu-btn" onClick={(e) => { e.stopPropagation(); toggleDelete(team.id); }}>
                      <FiMoreHorizontal />
                    </button>
                    {showDeleteFor === team.id && (
                      <div className="team-card-dropdown">
                        <button
                          className="dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeamId(team.id);
                            setTeamSettingsOpen(true);
                            setShowDeleteFor(null);
                          }}
                        >
                          <FiSettings /> Team Setting
                        </button>
                        <button
                          className="dropdown-item remove"
                          onClick={(e) => { e.stopPropagation(); handleRemoveTeam(team.id); }}
                        >
                          <FiTrash2 /> Remove Team
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#888', fontSize: 15, padding: 12, textAlign: 'center' }}>
                No teams found.
              </div>
            )}
          </div>
        </div>
      </div>

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

      {/* Confirm switch to team */}
      {selectConfirmOpen && (
        <ConfirmModal
          open={selectConfirmOpen}
          onClose={() => setSelectConfirmOpen(false)}
          onConfirm={confirmSelectTeam}
          title="Switch to team"
          message={`Are you sure you want to switch to team "${teamToSelect?.name || ''}"?`}
          confirmText="Switch"
          cancelText="Cancel"
          iconType="info"
        />
      )}

      {successOpen && (
        <ConfirmModal
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          onConfirm={() => setSuccessOpen(false)}
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