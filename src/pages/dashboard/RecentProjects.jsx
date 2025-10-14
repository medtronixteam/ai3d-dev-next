import React, { useState, useRef, useEffect } from 'react';
import {
  FaPen,
  FaUpload,
  FaTrash,
  FaEllipsisV,
  FaRegHeart,
  FaHeart,
  FaEye,
  FaCube,
} from 'react-icons/fa';
import { BiSortAZ } from 'react-icons/bi';
import img1 from '../../assets/images/products/drone.png';
import img2 from '../../assets/images/products/dslr.png';
import img3 from '../../assets/images/products/laptop.png';
import './RecentProjects.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import CreateTeamPopup from '../../components/popup/CreateTeamPopup';
import ConfirmModal from '../../components/popup/ConfirmLogoutPopup';
import { FiX } from 'react-icons/fi';
import CustomLoader from '../../components/loader/CustomLoader';
import { useNavigate, useLocation } from 'react-router-dom';
import GridIcon from '../../assets/images/grid-icon.svg';
import CardIcon from '../../assets/images/card-icon.svg';
import sorticon from '../../assets/images/sort-icon.svg';

const FILTERS = ['All', 'Recent Project', 'Favourite Project'];

const projects = [
  {
    id: 1,
    title: 'Brightwoods Cabin',
    date: 'April 20,2025',
    image: img1,
    favorite: true,
    group: 'Today',
    time: '11:14 AM',
  },
  {
    id: 2,
    title: 'Urban Loft',
    date: 'May 20,2023',
    image: img2,
    favorite: false,
    group: 'Today',
    time: '10:10 AM',
  },
  {
    id: 3,
    title: 'Forestville Cottages',
    date: 'June 20,2024',
    image: img3,
    favorite: false,
    group: 'Earlier',
    time: 'June 20,2025',
  },
  {
    id: 4,
    title: 'Missisuaga Aistream',
    date: 'June 20,2024',
    image: img1,
    favorite: false,
    group: 'Earlier',
    time: 'April 20,2025',
  },
  {
    id: 5,
    title: 'Niagara Homes',
    date: 'May 20,2023',
    image: img2,
    favorite: true,
    group: 'Earlier',
    time: 'March 20,2023',
  },
  {
    id: 6,
    title: 'Sunny Estate',
    date: 'May 20,2023',
    image: img3,
    favorite: false,
    group: 'Earlier',
    time: 'May 20,2023',
  },
  {
    id: 7,
    title: 'Simcoe Lake Lodge',
    date: 'May 20,2023',
    image: img1,
    favorite: false,
    group: 'Earlier',
    time: 'May 20,2023',
  },
  {
    id: 8,
    title: 'Wasaga Beach Home',
    date: 'May 20,2023',
    image: img2,
    favorite: true,
    group: 'Earlier',
    time: 'May 20,2023',
  },
  {
    id: 9,
    title: 'Banff Hills',
    date: 'May 20,2023',
    image: img3,
    favorite: false,
    group: 'Earlier',
    time: 'May 20,2023',
  },
];

const RecentProjects = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Default');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const sortBtnRef = useRef();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameProjectId, setRenameProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [renameLoading, setRenameLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  // Track image loaded state per project id for loader overlay
  const [imgLoadedById, setImgLoadedById] = useState({});

  const getProjectKey = (p) => p?.id ?? p?.token ?? p?.name ?? p?.title ?? Math.random();

  const fetchProjects = async (filter) => {
    setLoading(true);
    try {
      let finalProjects = [];

      if (filter === 'All') {
        // Parallel call: All + Recent
        const [allRes, recentRes] = await Promise.all([
          axios.get(`${baseURL}/project`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseURL}/project?recent=recent`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const allProjects = Array.isArray(allRes.data?.data?.data) ? allRes.data.data.data : [];
        const recentProjects = Array.isArray(recentRes.data?.data?.data)
          ? recentRes.data.data.data
          : [];

        // Merge: recent ko priority do
        finalProjects = [
          ...recentProjects,
          ...allProjects.filter((ap) => !recentProjects.some((rp) => rp.id === ap.id)),
        ];
      } else if (filter === 'Recent Project') {
        const res = await axios.get(`${baseURL}/project?recent=recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        finalProjects = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
      } else if (filter === 'Favourite Project') {
        const res = await axios.get(`${baseURL}/project?favorite=favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        finalProjects = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
      }

      // Sort latest first
      finalProjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setProjects(finalProjects);
    } catch (err) {
      setProjects([]);
      console.error('API ERROR:', err);
    } finally {
      setLoading(false);
    }
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
    function handleClickOutside(e) {
      if (!e.target.closest('.rp-card-menu-btn') && !e.target.closest('.rp-card-menu')) {
        setDropdownOpen(null);
      }
    }
    if (dropdownOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  useEffect(() => {
    fetchProjects(activeFilter);
  }, [activeFilter, location.pathname]);

  useEffect(() => {
    setImgLoadedById((prev) => {
      const next = { ...prev };
      (projects || []).forEach((p) => {
        const key = getProjectKey(p);
        if (!(key in next)) next[key] = false;
      });
      return next;
    });
  }, [projects]);

  const markImageLoaded = (projectKey) => {
    if (projectKey === undefined || projectKey === null) return;
    setImgLoadedById((prev) => ({ ...prev, [projectKey]: true }));
  };

  // Click outside to close sort dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortBtnRef.current && !sortBtnRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
    }
    if (sortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortDropdownOpen]);

  // Filtered and sorted projects
  let filtered = projects;

  // Apply frontend sorting
  if (sortOption === 'Name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'Date') {
    filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOption === 'Size') {
    // Sort by file size if available, otherwise by date
    filtered = [...filtered].sort((a, b) => {
      if (a.file_size && b.file_size) {
        return b.file_size - a.file_size;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }
  // Default sorting is by creation date (newest first)
  else {
    filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // Group for list view (no grouping, just one group)
  const grouped = { All: filtered };

  const handleRenameClick = (project) => {
    setDropdownOpen(null);
    setRenameProjectId(project.id);
    setNewProjectName(project.name);
    setRenameModalOpen(true);
  };

  const handleRenameSave = async () => {
    setRenameLoading(true);
    try {
      await axios.post(
        `${baseURL}/project/rename`,
        { token: renameProjectId, name: newProjectName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRenameModalOpen(false);
      fetchProjects(activeFilter);
    } catch (err) {
      // Optionally show error
    } finally {
      setRenameLoading(false);
    }
  };

  const handleFavoriteToggle = async (project) => {
    // Optimistically update UI
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, favorite: !p.favorite } : p)),
    );
    try {
      await axios.post(
        `${baseURL}/project/favorite`,
        { token: project.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Optionally refetch projects or handle response
    } catch (err) {
      // Revert UI if API fails
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, favorite: project.favorite } : p)),
      );
    }
  };

  const handleViewProject = (project) => {
    setDropdownOpen(null);
    navigate(`/platform/preview/${project.id}`);
  };

  const handleDeleteClick = (project) => {
    setDropdownOpen(null);
    setDeleteProjectId(project.id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProjectId) return;
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/project/delete/${deleteProjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteModalOpen(false);
      setDeleteProjectId(null);
      fetchProjects(activeFilter);
    } catch (err) {
      // Optionally show error
      setDeleteModalOpen(false);
      setDeleteProjectId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recent-projects-modern-container mt-5 mb-4">
      {/* Keyframes for modal-style dot loader used over thumbnails */}
      <style>{`
        @keyframes modalDotBounce {
          0% { opacity: 0.7; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(-14px); }
        }
      `}</style>
      {/* Filter Pills */}

      {/* Header Row */}
      <div className="recent-projects-header d-flex flex-wrap">
        <div className="rp-filter-bar">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`rp-filter-pill${activeFilter === filter ? ' active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="recent-projects-header-spacer" />
        <div className="recent-projects-header-actions">
          <div className="rp-toggle-group">
            <button
              className={`rp-view-toggle${viewMode === 'grid' ? ' active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <img src={GridIcon} alt="Grid view" />
            </button>
            <button
              className={`rp-view-toggle${viewMode === 'list' ? ' active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <img src={CardIcon} alt="List view" />
            </button>
          </div>
          {/* Custom Sort Dropdown */}
          <div className="rp-sort-dropdown" ref={sortBtnRef}>
            <button
              className={`rp-sort-btn${sortDropdownOpen ? ' open' : ''}`}
              type="button"
              onClick={() => setSortDropdownOpen((open) => !open)}
              aria-label="Sort"
            >
              <img
                src={sorticon}
                alt="Sort"
                style={{ width: 18, height: 18 }}
                className="rp-sort-icon"
              />
            </button>
            {sortDropdownOpen && (
              <ul className="dropdown-menu dropdown-menu-end show" style={{ display: 'block' }}>
                {/* <li className="dropdown-header">
                  <div className="sort-title">Sort by:</div>
                </li> */}
                {['Default', 'Name', 'Date', 'Size'].map((option) => (
                  <li key={option} 
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF2F7')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <label
                      className="dropdown-item d-flex align-items-center gap-2"
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <input
                        type="checkbox"
                        checked={sortOption === option}
                        onChange={() => {
                          setSortOption(option);
                          setSortDropdownOpen(false);
                        }}
                      style={{ accentColor: '#e63399' , width: 16, height: 16, border : 'none !important', outline: 'none'}}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {/* Grid View */}
      {loading ? (
        <div className="centered-loader">
          <CustomLoader />
        </div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888', fontSize: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
          No projects found
        </div>
      ) : viewMode === 'grid' ? (
        <div className="rp-grid">
          {filtered.map((project) => {
            const pKey = getProjectKey(project);
            return (
              <div className="rp-card" key={pKey}>
                <div className="rp-card-img-wrap">
                  <div
                    className="rp-card-img-clip"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {!project.thumbnail &&
                    (project.type === 'text_to_3d' || project.type === 'prompt_to_3d') ? (
                      <div
                        style={{
                          width: 120,
                          height: 90,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '22px',
                            color: '#e63399',
                            fontWeight: '600',
                            textAlign: 'center',
                            lineHeight: '1.2',
                          }}
                        >
                          Text to 3d
                        </span>
                      </div>
                    ) : (
                      <>
                        {!imgLoadedById[pKey] && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1,
                              background: 'transparent',
                            }}
                          >
                            <span className="rp-img-loader" aria-label="loading thumbnail"></span>
                          </div>
                        )}
                        <img
                          src={project.thumbnail ? `${project.thumbnail}` : img1}
                          alt={project.name}
                          className="rp-card-img"
                          style={{
                            opacity: imgLoadedById[pKey] ? 1 : 0,
                            transition: 'opacity 0.5s',
                            zIndex: 2,
                          }}
                          onLoad={() => markImageLoaded(pKey)}
                          onError={() => markImageLoaded(pKey)}
                        />
                      </>
                    )}
                    <button
                      className="rec-rp-fav-btn"
                      onClick={() => handleFavoriteToggle(project)}
                    >
                      {project.favorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                    </button>
                  </div>
                </div>
                <div className="rp-card-body">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <div>
                      <div className="rp-card-title">{project.name}</div>
                      <div className="rp-card-date">
                        {project.created_at
                          ? new Date(project.created_at).toLocaleDateString()
                          : ''}
                      </div>
                    </div>
                    <button
                      className="rp-card-menu-btn"
                      onClick={() =>
                        setDropdownOpen(dropdownOpen === project.id ? null : project.id)
                      }
                    >
                      <FaEllipsisV />
                    </button>
                  </div>
                  {dropdownOpen === project.id && (
                    <div className="rp-card-menu">
                      <button onClick={() => handleRenameClick(project)}>
                        <FaPen /> Rename
                      </button>
                      <button onClick={() => handleViewProject(project)}>
                        <FaEye /> View
                      </button>
                      <button onClick={() => handleDeleteClick(project)}>
                        <FaTrash /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rp-list-view">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="rp-list-group">
              {items.map((project) => {
                const pKey = getProjectKey(project);
                return (
                  <div className="rp-list-item" key={pKey}>
                    {!project.thumbnail &&
                    (project.type === 'text_to_3d' || project.type === 'prompt_to_3d') ? (
                      <div
                        style={{
                          width: 90,
                          height: 70,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#e63399',
                            fontWeight: '600',
                            textAlign: 'center',
                            lineHeight: '1.2',
                          }}
                        >
                          Text to 3d
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          position: 'relative',
                          width: 90,
                          height: 70,
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        {!imgLoadedById[pKey] && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1,
                              background: 'transparent',
                            }}
                          >
                            <span
                              className="rp-img-loader rp-sm"
                              aria-label="loading thumbnail"
                            ></span>
                          </div>
                        )}
                        <img
                          src={project.thumbnail ? `${project.thumbnail}` : img1}
                          alt={project.name}
                          className="rp-list-img"
                          style={{
                            opacity: imgLoadedById[pKey] ? 1 : 0,
                            transition: 'opacity 0.4s',
                            zIndex: 2,
                          }}
                          onLoad={() => markImageLoaded(pKey)}
                          onError={() => markImageLoaded(pKey)}
                        />
                      </div>
                    )}
                    <div className="rp-list-info">
                      <div className="rp-list-title">{project.name}</div>
                      <div className="rp-list-date">
                        {project.created_at
                          ? new Date(project.created_at).toLocaleDateString()
                          : ''}
                      </div>
                    </div>
                    <button className="rp-fav-btn" onClick={() => handleFavoriteToggle(project)}>
                      {project.favorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button
                      className="rp-card-menu-btn"
                      onClick={() =>
                        setDropdownOpen(dropdownOpen === project.id ? null : project.id)
                      }
                    >
                      <FaEllipsisV />
                    </button>
                    {dropdownOpen === project.id && (
                      <div className="rp-card-menu">
                        <button onClick={() => handleRenameClick(project)}>
                          <FaPen /> Rename
                        </button>
                        <button onClick={() => handleViewProject(project)}>
                          <FaEye /> View
                        </button>
                        <button onClick={() => handleDeleteClick(project)}>
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {renameModalOpen && (
        <div className="create-team-overlay">
          <div className="create-team-popup">
            <div className="popup-header">
              <h4>Rename Project</h4>
              <button className="close-popup-btn" onClick={() => setRenameModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="popup-body">
              <div className="form-group">
                <label htmlFor="renameProjectName">Project Name</label>
                <input
                  type="text"
                  id="renameProjectName"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter new project name"
                />
              </div>
            </div>
            <div className="popup-footer">
              <button className="btn btn-cancel" onClick={() => setRenameModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-create"
                onClick={handleRenameSave}
                disabled={renameLoading || !newProjectName.trim()}
              >
                {renameLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Model"
        message="Are you sure you want to delete this model? This action cannot be undo."
        confirmText="Delete"
        cancelText="Cancel"
        iconType="warning"
      />
    </div>
  );
};

export default RecentProjects;
