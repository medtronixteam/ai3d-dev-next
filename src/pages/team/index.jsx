import React, { useEffect, useState, useRef } from 'react';
import './Team.css';
import '../ApiSdk.css';
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { FiMoreVertical, FiTrash2, FiMail, FiChevronDown, FiSearch, FiUsers } from 'react-icons/fi';
import { MdApi } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/popup/ConfirmLogoutPopup';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Team = ({ onTeamCreated, newTeam }) => {
  /*
  const { token } = useAuth();
  const location = useLocation();
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const dropdownRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const gradients = [
    'linear-gradient(to right, #ffe0c3, #ffc1cc)',
    'linear-gradient(to right, #d4fcf9, #96e6f3)',
    'linear-gradient(to right, #f3e7ff, #e3d7ff)',
    'linear-gradient(to right, #e0ffe9, #ccffd8)',
    'linear-gradient(to right, #fffecb, #fef7a1)',
    'linear-gradient(to right, #ffe3e3, #ffcfd2)',
    'linear-gradient(to right, #d6f0ff, #add8e6)',
    'linear-gradient(to right, #ffe6e6, #ffd9cc)',
    'linear-gradient(to right, #f9f3ff, #f0e6fa)',
    'linear-gradient(to right, #e3fdfd, #cbf1f5)',
  ];

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/team`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(res.data.teams || []);
      } catch (err) {
        setErrorMsg('Failed to fetch teams!');
        toast.error('Failed to fetch teams!');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    }
    if (dropdownOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(search.toLowerCase()) ||
      team.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
    const event = new CustomEvent('sidebarToggle', { detail: { open: !sidebarOpen } });
    window.dispatchEvent(event);
  };

  const handleDelete = (id) => {
    setDeleteTeamId(id);
    setErrorMsg('');
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTeamId) return;
    setErrorMsg('');
    try {
      await axios.delete(`${baseURL}/team/delete/${deleteTeamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(teams.filter((team) => team.id !== deleteTeamId));
      setConfirmOpen(false);
      setDeleteTeamId(null);
      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete team!');
      setConfirmOpen(true);
    }
  };
  */

  return (
    <div className="api-sdk-container">
      <div className="api-sdk-card">
        <MdApi className="api-sdk-icon" />
        <h2 className="api-sdk-title">Coming Soon</h2>
        <div className="api-sdk-desc">
          Team features are launching soon. Stay tuned!
        </div>
      </div>
    </div>
  );
};

const InviteAccept = () => {
  const { token: inviteToken } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  useEffect(() => {
    if (inviteToken) {
      localStorage.setItem('invite_token', inviteToken);
    }
    if (!token) {
      navigate('/auth/signin');
    }
  }, [inviteToken, token, navigate]);
  if (!token) return null;
  return <InviteAcceptCard />;
};

const InviteAcceptCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const inviteToken = localStorage.getItem('invite_token');
  const handleAccept = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${baseURL}/team/invite/accept`, { token: inviteToken });
      if (res.status === 200) {
        setSuccess(true);
        localStorage.removeItem('invite_token');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setError(res.data?.message || 'Failed to accept invitation.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to accept invitation.');
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <div className="animated-success-modal-overlay">
        <div className="animated-success-modal">
          <div className="animated-checkmark-wrap">
            <svg className="animated-checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
            </svg>
          </div>
          <h3>Invitation accepted!</h3>
          <p>You have joined the team. Redirecting to home...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="animated-success-modal-overlay">
      <div className="animated-success-modal">
        <div className="animated-checkmark-wrap">
          <svg className="animated-checkmark" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
          </svg>
        </div>
        <h3>Accept Team Invitation</h3>
        <p>Click below to accept your invitation and join the team.</p>
        {error && <div className="confirm-modal-error">{error}</div>}
        <button className="btn btn-create" onClick={handleAccept} disabled={loading}>
          {loading ? 'Accepting...' : 'Accept Invitation'}
        </button>
      </div>
    </div>
  );
};

export default Team;
export { InviteAccept };
