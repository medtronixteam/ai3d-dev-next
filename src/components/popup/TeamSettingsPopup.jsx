import React, { useState, useEffect, useRef } from 'react';
import './TeamSettingsPopup.css';
import {
  FiX,
  FiSend,
  FiSearch,
  FiMoreHorizontal,
  FiSettings,
  FiXCircle,
  FiUser,
  FiCheckCircle,
} from 'react-icons/fi';
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from './ConfirmLogoutPopup';

const TeamSettingsPopup = ({ onClose, team_id, initialTeamName, onMemberChanged }) => {
  const { token } = useAuth();
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [invitedEmail, setInvitedEmail] = useState('');
  const [teamName, setTeamName] = useState(initialTeamName || '');
  const [inviteModal, setInviteModal] = useState({ open: false, type: '', message: '' });

  // ✅ Reference for polling interval
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    if (team_id && token) {
      fetchMembers();
      // ✅ Start polling every 5 seconds to check for new members
      startPolling();
    }
    if (team_id && token && !initialTeamName) fetchTeamName();

    // ✅ Cleanup: Stop polling when component unmounts
    return () => {
      stopPolling();
    };
    // eslint-disable-next-line
  }, [team_id, token, initialTeamName]);

  useEffect(() => {
    if (successOpen) {
      const timer = setTimeout(() => setSuccessOpen(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [successOpen]);

  // ✅ Start polling to auto-refresh members
  const startPolling = () => {
    stopPolling(); // Clear any existing interval
    pollingIntervalRef.current = setInterval(() => {
      fetchMembers(true); // Silent fetch (no loading spinner)
    }, 5000); // Refresh every 5 seconds
  };

  // ✅ Stop polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const fetchMembers = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${baseURL}/team/member?team_id=${team_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Team Members API Response:', res.data);

      const newMembers = (res.data.data || []).map((m) => ({
        id: m.id,
        name: m.user,
        email: res.data.email,
        role: 'Member',
        since: res.data.created_at,
      }));

      // ✅ Only update if members actually changed
      setMembers((prevMembers) => {
        if (JSON.stringify(prevMembers) !== JSON.stringify(newMembers)) {
          // ✅ Notify parent if member count changed
          if (onMemberChanged && prevMembers.length !== newMembers.length) {
            onMemberChanged(team_id);
          }
          return newMembers;
        }
        return prevMembers;
      });
    } catch (err) {
      setError('Failed to load team members.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchTeamName = async () => {
    try {
      const res = await axios.get(`${baseURL}/team/${team_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamName(res.data?.data?.name || '');
    } catch (err) {
      setTeamName('');
    }
  };

  const handleSendInvite = async () => {
    if (!email.trim()) return;
    setInviteLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${baseURL}/team/invite`,
        {
          email,
          role,
          team_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const msg = res.data?.message || '';
      if (
        (res.data && res.data.status === 'success') ||
        (msg && msg.toLowerCase().includes('invitation sent'))
      ) {
        setInvitedEmail(email);
        setEmail('');
        setRole('member');
        // ✅ Fetch members immediately after invite
        fetchMembers();
        setInviteModal({
          open: true,
          type: 'success',
          message: msg || `Invitation sent to ${email}`,
        });
      } else {
        setInviteModal({ open: true, type: 'error', message: msg || 'Failed to send invite.' });
      }
    } catch (err) {
      setInviteModal({
        open: true,
        type: 'error',
        message: err?.response?.data?.message || 'Failed to send invite.',
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!memberId) return;
    setLoading(true);
    setError('');
    try {
      await axios.delete(`${baseURL}/team/member/delete/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMembers();
      setShowActionsFor(null);
      setSuccessMsg('Member removed successfully!');
      setSuccessOpen(false);
      setInviteModal({ open: false, type: '', message: '' });

      if (onMemberChanged) {
        onMemberChanged(team_id);
      }
    } catch (err) {
      setError('Failed to remove member.');
    } finally {
      setLoading(false);
    }
  };

  const toggleActions = (memberId) => {
    setShowActionsFor(showActionsFor === memberId ? null : memberId);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="team-settings-overlay">
      <div className="team-settings-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="header-text">
            <h2>{teamName || initialTeamName || 'Team Name'}</h2>
            <p>Manage the members or invite new members</p>
          </div>
          <button className="close-popup-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="popup-body">
          <div className="invite-section">
            <h4>Invite team members</h4>

            <div className="form-group">
              <label>Email Address</label>
              <div className="invite-form">
                <input
                  type="email"
                  placeholder="abcd.essdafda@gmail.com"
                  className="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="role-button-group">
                  <div className="role-select-wrapper">
                    <select
                      className="role-selector"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <button
                    className="send-invite-btn"
                    onClick={handleSendInvite}
                    disabled={inviteLoading}
                  >
                    {inviteLoading ? 'Sending...' : 'Send Invite'} <FiSend />
                  </button>
                </div>
              </div>
              {error && <div className="invite-error">{error}</div>}
            </div>
          </div>

          <div className="search-teams">
            <FiSearch />
            <input
              type="text"
              placeholder="Search teams"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="team-members-list">
            <div className="members-list-header">
              <span className="col-member">Team member</span>
              <span className="col-role">Role</span>
              <span className="col-since">Members since</span>
            </div>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>
            ) : (
              <ul className="members-list p-0">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <li key={member.id} className="member-item">
                      <div className="member-info col-member">
                        <div className="member-avatar-icon">
                          <FiUser />
                        </div>
                        <div className="member-details">
                          <span className="member-name">{member.name}</span>
                          <span className="member-email">{member.email}</span>
                        </div>
                      </div>
                      <div className="member-role col-role">{member.role}</div>
                      <div className="member-since col-since">
                        {member.since ? new Date(member.since).toLocaleDateString() : ''}
                      </div>
                      <div className="member-actions">
                        <button className="more-btn" onClick={() => toggleActions(member.id)}>
                          <FiMoreHorizontal />
                        </button>
                        {showActionsFor === member.id && (
                          <div className="actions-tooltip">
                            <button
                              className="tooltip-btn leave-btn"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <FiX /> Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li style={{ color: '#888', fontSize: 15, padding: 12 }}>No members found.</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
      {successOpen && (
        <div
          className="animated-success-modal-overlay"
          style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="animated-success-modal">
            <div className="animated-checkmark-wrap">
              <svg className="animated-checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path
                  className="checkmark-check"
                  fill="none"
                  d="M14 27l7 7 16-16"
                  stroke="#DE3996"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <h3 style={{ color: '#DE3996' }}>Invitation sent successfully!</h3>
            {invitedEmail && (
              <p className="invited-email">
                Invitation sent to <b>{invitedEmail}</b>
              </p>
            )}
            <button
              onClick={() => setSuccessOpen(false)}
              style={{
                background: '#DE3996',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 24px',
                fontWeight: 500,
                marginTop: 18,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {inviteModal.open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(34,34,59,0.18)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setInviteModal({ open: false, type: '', message: '' })}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 36,
              minWidth: 320,
              maxWidth: 420,
              boxShadow: '0 8px 32px rgba(34,34,59,0.13)',
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginLeft: '10px',
              marginRight: '10px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {inviteModal.type === 'success' ? (
              <FiCheckCircle size={48} style={{ color: '#DE3996', marginBottom: 16 }} />
            ) : (
              <FiXCircle size={48} style={{ color: '#DE3996', marginBottom: 16 }} />
            )}
            <h4
              style={{
                color: inviteModal.type === 'success' ? '#DE3996' : '#DE3996',
                marginBottom: 12,
              }}
            >
              {inviteModal.type === 'success' ? 'Success' : 'Error'}
            </h4>
            <div style={{ color: '#222', marginBottom: 18 }}>{inviteModal.message}</div>
            <button
              onClick={() => setInviteModal({ open: false, type: '', message: '' })}
              style={{
                background: '#DE3996',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 24px',
                fontWeight: 500,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSettingsPopup;
