import React, { useEffect, useState, useRef } from 'react';
import "./Team.css"
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { FiMoreVertical, FiTrash2, FiMail, FiChevronDown, FiSearch } from 'react-icons/fi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/popup/ConfirmLogoutPopup';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Team = () => {
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
    'linear-gradient(to right, #e3fdfd, #cbf1f5)'
  ];

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/team`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeams(res.data.data || []);
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
// useEffect(() => {
//   if (!location.pathname.startsWith('/team')) {
//     window.location.reload();
//   }
// }, [location.pathname]);

  // Filter teams by name/email
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase()) ||
    team.email.toLowerCase().includes(search.toLowerCase())
  );

  // Dropdown toggle
  const handleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Sidebar toggle (mobile)
  const handleSidebarToggle = () => {
    setSidebarOpen(prev => !prev);
    const event = new CustomEvent('sidebarToggle', { detail: { open: !sidebarOpen } });
    window.dispatchEvent(event);
  };

  // Delete team (dummy, API integration if available)
  const handleDelete = (id) => {
    setDeleteTeamId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTeamId) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await axios.delete(`${baseURL}/team/delete/${deleteTeamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(teams.filter(team => team.id !== deleteTeamId));
      setConfirmOpen(false);
      setDeleteTeamId(null);
      setSuccessOpen(true);
      await fetchTeams();
    } catch (err) {
      setErrorMsg('Failed to delete team!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* Slim page header: centered search; on mobile shows menu + search */}
    

    <section className="team-section">
      <div className="team-page-header" style={{ width: '100%' }}>
      <style>{`
        .team-page-header { display: flex; justify-content: center; align-items: center; padding: 16px 18px 0 18px; }
        .team-header-inner { display: flex; align-items: center; justify-content: center; width: 100%; max-width: 820px; }
        .team-sidebar-toggle { display: none; background: #fff; color: #DE3996; border: 1px solid #eee; border-radius: 6px; width: 40px; height: 40px; align-items: center; justify-content: center; font-size: 20px; margin-right: 10px; }
        .team-search-container { position: relative;  display: flex; align-items: center; background: rgba(255,237,247,1); border: none; border-radius: 8px; padding: 8px 14px; min-width: 260px; width: 100%; max-width: 420px; }
        .team-search-container:focus-within{
  box-shadow: 0 0 10px var(--primary-color) !important;

}
        .team-search-input { border: none; outline: none; background: transparent; font-size: 15px; color: #232334; width: 100%; }
        @media (max-width: 992px) {.team-header-inner { justify-content: flex-start; } .team-sidebar-toggle { display: inline-flex; } .team-search-container { margin-left: 8px; max-width: none; } }
        @media (max-width: 500px) {.team-page-header {padding: 16px 10px 0 5px;} }
        [data-theme='dark'] .team-sidebar-toggle, .dark .team-sidebar-toggle { background: #232334 !important; color: #DE3996 !important; border: 1px solid #39395a !important; }
        [data-theme='dark'] .team-search-container, .dark .team-search-container { background: #232334 !important; }
        [data-theme='dark'] .team-search-input, .dark .team-search-input { color: #f3f3fa !important; }
      `}</style>
      <div className="team-header-inner">
        <button className="team-sidebar-toggle" onClick={handleSidebarToggle} aria-label="Open sidebar"><RxHamburgerMenu /></button>
        <div className="team-search-container">
          <FiSearch style={{ color: '#999', fontSize: 16, marginRight: 10 }} />
          <input className="team-search-input" placeholder="Search"  />
          {/* value={search} onChange={(e)=>setSearch(e.target.value)} */}
        </div>
      </div>
    </div>
      <div className="team-section-card">
        
        {/* Header */}
        <h2 className="font-weight-bold your-team" style={{ marginBottom: 24 }}>Your Teams</h2>
        {/* Modern Filter Row */}
        <div className="team-filters">
            <input
              type="search"
              className="form-control"
              placeholder="Search teams..."
              // value={search}
              // onChange={e => setSearch(e.target.value)}
            style={{
             backgroundColor: 'rgba(255,237,247,1)',
              border: '1px solid #eee',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: 15,
              width: 360,
              maxWidth: '100%',
            }}
            />
          <div style={{ position: 'relative', width: 180, maxWidth: '100%' }}>
            <select
              className="form-control team-role-select"
              id="role-select"
              style={{
                border: '1px solid #eee',
                borderRadius: 8,
                padding: '10px 36px 10px 16px',
                fontSize: 15,
                width: '100%',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <FiChevronDown style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#888',
              fontSize: 18,
            }} />
          </div>
          <style>{`
            @media (max-width: 700px) {
              .team-filters input, .team-filters .team-role-select { width: 100% !important; min-width: 0 !important; }
              .team-filters > div, .team-filters > input { width: 100% !important; }
            }
              @media (max-width: 500px) {
              .team-filters { flex-direction: column !important; gap: 10px !important; padding: 10px !important; }
            }
          `}</style>
        </div>
        {/* Team List */}
        <div className="row flex-wrap">
          {loading ? (
            <div className="col-12 text-center py-5">Loading...</div>
          ) : filteredTeams.length === 0 ? (
            <div className="col-12 text-center py-5">No teams found.</div>
          ) : (
            filteredTeams.map((team, idx) => (
              <div className="col-md-6 col-lg-4 mb-4 padding" key={team.id} 
              // style={filteredTeams.length === 1 ? { minWidth: 300, maxWidth: 340, width: '100%' } : { maxWidth: 340 }}
              >
                <div className="team-card card-gradient-1" style={{ background: 'white', position: 'relative', color: '#222', minHeight: filteredTeams.length === 1 ? 180 : undefined }}>
                  <div className="gradient-header" style={{ background: gradients[idx % gradients.length], height: 80, borderTopLeftRadius: 14, borderTopRightRadius: 14 }} />
                  <div className="card-content" style={{ display: 'flex', alignItems: 'center', padding: 20, background: 'white', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }}>

                    {/* Avatar and Name */}
                    <img
                      src={team.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=DE3996&color=fff&size=128`}
                      className="profile-img"
                      alt="Profile"
                      style={{ width: 56, height: 56, borderRadius: '50%', marginRight: 16 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: 18 }}>{team.name}</span>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          className="action-btn"
                          type="button"
                          onClick={() => handleDropdown(team.id)}
                            style={{ background: 'none', border: 'none', padding: 0, marginLeft: 8, position: 'relative', zIndex: 201 }}
                        >
                          <FiMoreVertical size={20} />
                        </button>
                          {dropdownOpen === team.id && (
                            <div ref={dropdownRef} className="dropdown-menu dropdown-menu-right show" style={{ position: 'absolute', left: '0',   transform: 'translateX(-80%)', top: '100%', marginTop: 10, zIndex: 200, minWidth: 140, background: '#f7f7f7', boxShadow: '0 4px 12px rgba(34,34,59,0.10)', borderRadius: 10, padding: '6px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                              <button className="dropdown-item delete delete-team" onClick={() => handleDelete(team.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '90%',
                                  background: 'none',
                                  border: 'none',
                                  color: '#222',
                                  fontWeight: 600,
                                  fontSize: 15,
                                  padding: '6px 0',
                                  borderRadius: 7,
                                  cursor: 'pointer',
                                  gap: 8,
                                  transition: 'color 0.18s',
                                }}
                                
                              >
                                <FiTrash2 style={{ marginRight: 6, fontSize: 18, color: '#222', transition: 'color 0.18s' }} /> Delete team
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="team-date-row" style={{ color: '#888', fontSize: 15, marginTop: 6 }}>
                        {team.created_at ? new Date(team.created_at).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
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
        onConfirm={() => setSuccessOpen(false)}
        title="Team Deleted"
        message="Team deleted successfully!"
        confirmText="OK"
        cancelText=""
        iconType="success"
      />
    )}
    </>
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
            <svg className="animated-checkmark" viewBox="0 0 52 52"><circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark-check" fill="none" d="M14 27l7 7 16-16"/></svg>
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
          <svg className="animated-checkmark" viewBox="0 0 52 52"><circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark-check" fill="none" d="M14 27l7 7 16-16"/></svg>
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