import React, { useState, useRef, useEffect } from 'react';
import {
  FaEllipsisV,
  FaRegHeart,
  FaHeart,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import ConfirmModal from '../../components/popup/ConfirmLogoutPopup';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import GridIcon from '../../assets/images/grid-icon.svg';
import CardIcon from '../../assets/images/card-icon.svg';
import sorticon from '../../assets/images/sort-icon.svg';
import { RotateCcw, Trash2, TabletSmartphone, Image } from 'lucide-react';
import '../settings/Profile.css';
import SkeletonListLoader from '../../components/loader/SkeletonListLoader';
import './RecentProjects.css';

const TrashProjects = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('Default');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const sortBtnRef = useRef();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [imgLoadedById, setImgLoadedById] = useState({});
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoreProjectId, setRestoreProjectId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const getProjectKey = (p) => p?.id ?? p?.token ?? p?.name ?? p?.title ?? Math.random();

  const fetchTrashedProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/project/trashed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const trashedData = Array.isArray(response.data?.data) 
        ? response.data.data 
        : [];

      trashedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setProjects(trashedData);
      
      const newLoadedState = {};
      trashedData.forEach(p => {
        newLoadedState[getProjectKey(p)] = false;
      });
      setImgLoadedById(newLoadedState);
    } catch (err) {
      console.error('Failed to fetch trashed projects:', err);
      setProjects([]);
      toast.error('Failed to load trashed projects', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedProjects();
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

  const markImageError = (projectKey) => {
    if (projectKey === undefined || projectKey === null) return;
    setImgLoadedById((prev) => ({ ...prev, [projectKey]: true }));
  };

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

  let filtered = projects;

  if (sortOption === 'Name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'Date') {
    filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else {
    filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const grouped = { All: filtered };

  const handleViewProject = (project) => {
    setDropdownOpen(null);
    navigate(`/3dio/preview/${project.id}`);
  };

  const handleRestoreClick = (project) => {
    setDropdownOpen(null);
    setRestoreProjectId(project.id);
    setRestoreModalOpen(true);
  };

  const handleRestoreConfirm = async () => {
    if (!restoreProjectId) return;
    
    try {
      await axios.get(`${baseURL}/project/restore/${restoreProjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Project restored successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      setRestoreModalOpen(false);
      setRestoreProjectId(null);
      fetchTrashedProjects();
    } catch (err) {
      console.error('Restore failed:', err);
      toast.error('Failed to restore project', {
        position: 'top-right',
        autoClose: 3000,
      });
      setRestoreModalOpen(false);
      setRestoreProjectId(null);
    }
  };

  const handleDeleteClick = (project) => {
    setDropdownOpen(null);
    setDeleteProjectId(project.id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProjectId) return;
    
    try {
      await axios.delete(`${baseURL}/project/permanent-delete/${deleteProjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Project permanently deleted!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      setDeleteModalOpen(false);
      setDeleteProjectId(null);
      fetchTrashedProjects();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete project', {
        position: 'top-right',
        autoClose: 3000,
      });
      setDeleteModalOpen(false);
      setDeleteProjectId(null);
    }
  };

  const ProjectPreview = ({ project, pKey, isListView = false }) => {
    const isTextTo3D = project.type === 'text_to_3d' || project.type === 'prompt_to_3d';
    
    const hasImage = project.screenshot || project.thumbnail;

    if (isTextTo3D && !hasImage) {
      return (
        <div
          style={{
            width: isListView ? 90 : '100%',
            height: isListView ? 70 : '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(230, 51, 153, 0.05)',
            borderRadius: '8px',
          }}
        >
          <span
            style={{
              fontSize: isListView ? '12px' : '16px',
              color: '#e63399',
              fontWeight: '600',
              textAlign: 'center',
              lineHeight: '1.2',
              padding: '10px',
            }}
          >
            Text to 3D
          </span>
        </div>
      );
    }

    if (!hasImage) {
      return (
        <div
          style={{
            width: isListView ? 90 : '100%',
            height: isListView ? 70 : '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDarkMode ? '#2d2430' : '#fef5fa',
          }}
        >
          <Image
            size={isListView ? 24 : 40} 
            color= {'#aaa'}
            strokeWidth={1.5}
          />
        </div>
      );
    }

    return (
      <div
        style={{
          position: 'relative',
          width: isListView ? 90 : '100%',
          height: isListView ? 70 : '100%',
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
              className={`rp-img-loader ${isListView ? 'rp-sm' : ''}`}
              aria-label="loading thumbnail"
            ></span>
          </div>
        )}
        <img
          src={project.screenshot || project.thumbnail}
          alt={project.name}
          className={isListView ? 'rp-list-img' : 'rp-card-img'}
          style={{
            opacity: imgLoadedById[pKey] ? 1 : 0,
            transition: 'opacity 0.5s',
            zIndex: 2,
          }}
          onLoad={() => markImageLoaded(pKey)}
          onError={() => markImageError(pKey)}
        />
      </div>
    );
  };

  return (
    <div className="recent-projects-modern-container mt-5 mb-4">
      <div className="recent-projects-header d-flex flex-wrap">
        <div className="rp-filter-bar">
          <button className="rp-filter-pill active">
            All Trash
          </button>
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
                {['Default', 'Name', 'Date'].map((option) => (
                  <li
                    key={option}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF2F7')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
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
                        style={{
                          accentColor: '#e63399',
                          width: 16,
                          height: 16,
                          border: 'none !important',
                          outline: 'none',
                        }}
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

      {loading ? (
        viewMode === 'grid' ? (
          <div className="recent-loader-item">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="recent-loader-loader"></div>
            ))}
          </div>
        ) : (
          <SkeletonListLoader />
        )
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888', fontSize: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
          Trash is empty
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
                    <ProjectPreview project={project} pKey={pKey} />
                  </div>
                </div>
                <div className="rp-card-body">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <div>
                      <div className="rp-card-title">{project.name}</div>
                      <div className="rp-card-date">
                        {project.created_at
                          ? new Date(project.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
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
                      <button onClick={() => handleRestoreClick(project)}>
                        <RotateCcw size={16} /> Restore
                      </button>
                      <button onClick={() => handleDeleteClick(project)}>
                        <Trash2 size={16} /> Delete
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
                    <ProjectPreview project={project} pKey={pKey} isListView={true} />
                    <div className="rp-list-info">
                      <div className="rp-list-title">{project.name}</div>
                      <div className="rp-list-date">
                        {project.created_at
                          ? new Date(project.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : ''}
                      </div>
                    </div>
                    <button
                      className="rp-card-menu-btn"
                      onClick={() =>
                        setDropdownOpen(dropdownOpen === project.id ? null : project.id)
                      }
                    >
                      <FaEllipsisV size={16} />
                    </button>
                    {dropdownOpen === project.id && (
                      <div className="rp-card-menu">
                        <button onClick={() => handleRestoreClick(project)}>
                          <RotateCcw size={16} /> Restore
                        </button>
                        <button onClick={() => handleDeleteClick(project)}>
                          <Trash2 size={16} /> Delete
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

      <ConfirmModal
        open={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        onConfirm={handleRestoreConfirm}
        title="Restore Project"
        message="Are you sure you want to restore this project? It will be moved back to your projects."
        confirmText="Restore"
        cancelText="Cancel"
        iconType="info"
      />

      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete"
        message="Are you sure you want to permanently delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        iconType="warning"
      />
    </div>
  );
};

export default TrashProjects;