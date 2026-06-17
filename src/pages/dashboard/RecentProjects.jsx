
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
  FaFileExport,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BiSortAZ } from 'react-icons/bi';
import img1 from '../../assets/images/horse.png';
import img2 from '../../assets/images/products/dslr.png';
import img3 from '../../assets/images/products/laptop.png';
import './RecentProjects.css';
import Success from '../../assets/images/success-img.png';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import CreateTeamPopup from '../../components/popup/CreateTeamPopup';
import ConfirmModal from '../../components/popup/ConfirmLogoutPopup';
import { FiCheck, FiX } from 'react-icons/fi';
import CustomLoader from '../../components/loader/CustomLoader';
import { useNavigate, useLocation } from 'react-router-dom';
import GridIcon from '../../assets/images/grid-icon.svg';
import CardIcon from '../../assets/images/card-icon.svg';
import sorticon from '../../assets/images/sort-icon.svg';
import { Download, Eye, FolderPen, Grid, Image, LayoutGrid, Pen, Send, TabletSmartphone, Trash, Trash2 } from 'lucide-react';
import '../settings/Profile.css';
import SkeletonListLoader from '../../components/loader/SkeletonListLoader';
import PublicShareLinkSection from '../../components/popup/PublicShareLinkSection';

const FILTERS = ['All', 'Recent Project', 'Favourite Project', 'Shared Project'];

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
  const [loadingMore, setLoadingMore] = useState(false);
  const sortBtnRef = useRef();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameProjectId, setRenameProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [renameLoading, setRenameLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [imgLoadedById, setImgLoadedById] = useState({});
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [shareMessage, setShareMessage] = useState('');
  const [shareMessageType, setShareMessageType] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);
  const observerTarget = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleSearch = (e) => {
      setSearchQuery(e.detail?.query || '');
    };
    window.addEventListener('recentProjectsSearch', handleSearch);
    return () => {
      window.removeEventListener('recentProjectsSearch', handleSearch);
    };
  }, []);

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

  const fetchProjects = async (filter, page = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setImgLoadedById({});
    }

    try {
      let url = `${baseURL}/project?page=${page}`;

      if (filter === "Recent Project") url += `&recent=recent`;
      if (filter === "Favourite Project") url += `&favorite=favorite`;

      let pageProjects = [];

      if (filter === "Shared Project") {
        const res = await axios.get(`${baseURL}/project/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sharedData = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        pageProjects = sharedData.map((item) => ({
          id: item.project_token || item.token || item.project_id,
          name: item.project,
          thumbnail: item.project_thumbnail,
          created_at: item.shared_at,
          type: item.type,
          prompt: item.text,
          isShared: true,
        }));

        setProjects(pageProjects);
        setHasMore(false);
        setTotalProjects(pageProjects.length);

        const newLoadedState = {};
        pageProjects.forEach(p => {
          newLoadedState[getProjectKey(p)] = false;
        });
        setImgLoadedById(newLoadedState);
      } else {
        const safeUrl = url.replace("http://", "https://");

        const res = await axios.get(safeUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        pageProjects = res.data?.data?.data || [];

        pageProjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const newLoadedState = {};
        pageProjects.forEach(p => {
          newLoadedState[getProjectKey(p)] = false;
        });

        if (append) {
          setProjects(prev => [...prev, ...pageProjects]);
          setImgLoadedById(prev => ({ ...prev, ...newLoadedState }));
        } else {
          setProjects(pageProjects);
          setImgLoadedById(newLoadedState);
        }

        setHasMore(!!res.data?.data?.next_page_url);
        setTotalProjects(res.data?.data?.total || 0);
      }

    } catch (err) {
      console.log("API ERROR:", err);
      if (!append) {
        setProjects([]);
        setTotalProjects(0);
        setImgLoadedById({});
      }
      setHasMore(false);
      setLoading(false);
      setLoadingMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore && activeFilter !== 'Shared Project') {
          setCurrentPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, loadingMore, activeFilter]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchProjects(activeFilter, currentPage, true);
    }
  }, [currentPage]);

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
    setCurrentPage(1);
    setProjects([]);
    setHasMore(true);
    fetchProjects(activeFilter, 1, false);
  }, [activeFilter, location.pathname]);

  useEffect(() => {
    setImgLoadedById((prev) => {
      const next = { ...prev };
      (projects || []).forEach((p) => {
        const key = getProjectKey(p);
        if (!(key in next)) {
          next[key] = false;
        }
      });
      return next;
    });
  }, [projects]);

  const markImageLoaded = (projectKey) => {
    if (projectKey === undefined || projectKey === null) return;
    setImgLoadedById((prev) => {
      if (prev[projectKey] === true) return prev;
      return { ...prev, [projectKey]: true };
    });
  };

  const markImageError = (projectKey) => {
    if (projectKey === undefined || projectKey === null) return;
    setImgLoadedById((prev) => {
      if (prev[projectKey] === true) return prev;
      return { ...prev, [projectKey]: true };
    });
  };

  useEffect(() => {
    if (activeFilter) {
      setImgLoadedById({});
    }
  }, [activeFilter]);


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

  if (searchQuery.trim()) {
    filtered = filtered.filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortOption === 'Name') {
    filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sortOption === 'Date') {
    filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOption === 'Size') {
    filtered = [...filtered].sort((a, b) => {
      if (a.file_size && b.file_size) {
        return b.file_size - a.file_size;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
  } else {
    filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

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
      setCurrentPage(1);
      setProjects([]);
      fetchProjects(activeFilter, 1, false);
    } catch (err) {
      // Optionally show error
    } finally {
      setRenameLoading(false);
    }
  };

  const handleFavoriteToggle = async (project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, favorite: !p.favorite } : p)),
    );
    try {
      await axios.post(
        `${baseURL}/project/favorite`,
        { token: project.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, favorite: project.favorite } : p)),
      );
    }
  };

  // const handleViewProject = (project) => {
  //   setDropdownOpen(null);
  //   navigate(`//3dio/new/scan/${project.id}`);
  // };

  const handleViewProject = (project) => {
    setDropdownOpen(null);
    const targetToken = project.token || project.id;
    console.log('[Recent Projects] 🚀 Navigating to view project:', targetToken);
    console.log('[Recent Projects] 📦 Project data:', project);

    navigate('/3dio/new/scan', {
      state: {
        projectId: targetToken,
        viewMode: true,
        feedbackGiven: project.feedback_given,
      },
    });
  };

  const handleShareClick = (project) => {
    setDropdownOpen(null);
    setSelectedProject(project);
    setShareModalOpen(true);
    setShareMessage('');
    setShareMessageType('');
  };

  useEffect(() => {
    if (!shareEmail) {
      setFoundUsers([]);
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleEmailLookup(shareEmail);
      setSearchPerformed(true);
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [shareEmail]);

  const handleEmailLookup = async (value) => {
    if (!value) {
      setFoundUsers([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axios.post(`${baseURL}/referral/search/email`, {
        email: value.toLowerCase().trim(),
      });
      const usersList = response.data?.data || response.data || [];
      setFoundUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      console.error('Error searching email:', error);
      setFoundUsers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleShareProject = async () => {
    if (!selectedUser || !selectedUser.email) {
      setShareMessage('Please select a user before sharing.');
      setShareMessageType('error');
      setTimeout(() => {
        setShareMessage('');
        setShareMessageType('');
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/project/share/byemail`,
        {
          project_id: selectedProject.id,
          shared_to_email: selectedUser.email,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShareMessage('Project shared successfully!');
      setShareMessageType('success');

      setShareEmail('');
      setSelectedUser(null);
      setFoundUsers([]);
      setSearchPerformed(false);

      setTimeout(() => {
        setShareMessage('');
        setShareMessageType('');
      }, 2000);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to share project.';
      setShareMessage(errMsg);
      setShareMessageType('error');
      setTimeout(() => {
        setShareMessage('');
        setShareMessageType('');
      }, 2000);
    } finally {
      setLoading(false);
    }
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
      setCurrentPage(1);
      setProjects([]);
      fetchProjects(activeFilter, 1, false);
    } catch (err) {
      setDeleteModalOpen(false);
      setDeleteProjectId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExportClick = async (project) => {
    setDropdownOpen(null);
    try {
      const response = await axios.get(`${baseURL}/project/export/${project.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `${project.name || 'project'}.glb`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch?.[1]) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`"${project.name}" exported successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Export failed:', err);
      let errMsg = 'Failed to export project. Please try again.';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed.message) {
            errMsg = parsed.message;
          }
        } catch (e) {
          console.error('Error parsing error blob:', e);
        }
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      toast.error(errMsg, {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  const ProjectPreview = ({ project, pKey, isListView = false }) => {
    const isTextTo3D = project.type === 'text_to_3d' || project.type === 'prompt_to_3d';
    const isVideoTo3D = project.type === 'video_to_3d' || project.type === 'video';

    let textLabel = 'Image to 3D';
    if (isTextTo3D) {
      textLabel = 'Text to 3D';
    } else if (isVideoTo3D) {
      textLabel = 'Video to 3D';
    }

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
          {textLabel}
        </span>
      </div>
    );
  };

  return (
    <div className="recent-projects-modern-container mt-5 mb-4">
      <style>{`
        @keyframes modalDotBounce {
          0% { opacity: 0.7; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(-14px); }
        }
        
        .loading-more-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          gap: 12px;
        }
        
        .loading-more-text {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #e63399;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

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
              <LayoutGrid color={isDarkMode ? '#fff' : '#000'} />
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
                    onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#FFF2F7')}
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
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888', fontSize: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {projects.length === 0 ? '📂' : '🔍'}
          </div>
          {projects.length === 0 ? 'No projects found' : 'No projects match your search'}
        </div>
      ) : viewMode === 'grid' ? (
        <>
          <div className="rp-grid">
            {filtered.map((project) => {
              const pKey = getProjectKey(project);
              const isSharedView = activeFilter === 'Shared Project';
              return (
                <div className="rp-card" key={pKey}>
                  {!isSharedView && (
                    <button
                      className="rec-rp-fav-btn"
                      onClick={() => handleFavoriteToggle(project)}
                    >
                      {project.favorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                    </button>
                  )}
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
                        <button onClick={() => handleViewProject(project)}>
                          <TabletSmartphone size={16} /> View
                        </button>
                        {!isSharedView && (
                          <>
                            <button onClick={() => handleRenameClick(project)}>
                              <Pen size={16} /> Rename
                            </button>
                            <button onClick={() => handleExportClick(project)}>
                              <Download size={16} /> Export
                            </button>
                            <button onClick={() => handleShareClick(project)}>
                              <Send size={16} /> Share
                            </button>
                            <button onClick={() => handleDeleteClick(project)}>
                              <Trash2 size={16} /> Remove
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {loadingMore && (
            <div className="text-center mx-auto my-5">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #e63399',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto',
                }}
              ></div>
              <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
          )}

          {hasMore && !loadingMore && (
            <div ref={observerTarget} style={{ height: 20, width: '100%' }} />
          )}
        </>
      ) : (
        <>
          <div className="rp-list-view">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="rp-list-group">
                {items.map((project) => {
                  const pKey = getProjectKey(project);
                  const isSharedView = activeFilter === 'Shared Project';
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
                          <button onClick={() => handleViewProject(project)}>
                            <TabletSmartphone size={16} /> View
                          </button>
                          {!isSharedView && (
                            <>
                              <button onClick={() => handleRenameClick(project)}>
                                <FolderPen size={16} /> Rename
                              </button>
                              <button onClick={() => handleFavoriteToggle(project)}>
                                {project.favorite ? <FaHeart className='pinky' size={13} /> : <FaRegHeart size={16} />} Favorite
                              </button>
                              <button onClick={() => handleExportClick(project)}>
                                <Download size={16} /> Export
                              </button>
                              <button onClick={() => handleShareClick(project)}>
                                <Send size={16} /> Share
                              </button>
                              <button onClick={() => handleDeleteClick(project)}>
                                <Trash2 size={16} /> Remove
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {loadingMore && (
            <div>
              <SkeletonListLoader />
            </div>
          )}

          {hasMore && !loadingMore && (
            <div ref={observerTarget} style={{ height: 20, width: '100%' }} />
          )}
        </>
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
        message="Are you sure you want to delete this model?"
        confirmText="Delete"
        cancelText="Cancel"
        iconType="warning"
      />

      {shareModalOpen && (
        <div
          className="share-modal-backdrop"
          onClick={() => {
            setShareModalOpen(false);
            setShareEmail('');
            setSelectedUser(null);
            setFoundUsers([]);
            setSearchPerformed(false);
            setShareMessage('');
            setShareMessageType('');
          }}
        >
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column">
                <h3 className="share-title" style={{ fontSize: '1.2rem' }}>
                  Share Project
                </h3>
                <p style={{ fontSize: '14px' }}>
                  Share your project with friends and please select an email before sharing.
                </p>
              </div>
              <button
                className="close-popup-btn"
                onClick={() => {
                  setShareModalOpen(false);
                  setShareEmail('');
                  setSelectedUser(null);
                  setFoundUsers([]);
                  setSearchPerformed(false);
                  setShareMessage('');
                  setShareMessageType('');
                }}
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="popup-body">
              <div className="form-group">
                <label htmlFor="email" className="enter-amount-label">
                  Send to
                </label>

                {shareMessage && (
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      fontSize: '13px',
                      background: shareMessageType === 'error' ? '#ffebee' : '#e7f7ed',
                      color: shareMessageType === 'error' ? '#c62828' : '#2e7d32',
                      border: `1px solid ${shareMessageType === 'error' ? '#c62828' : '#2e7d32'}`,
                    }}
                  >
                    {shareMessage}
                  </div>
                )}

                <input
                  type="email"
                  id="share-email"
                  className="share-email-input"
                  value={shareEmail}
                  onChange={(e) => {
                    setShareEmail(e.target.value);
                    setSearchPerformed(false);
                    setFoundUsers([]);
                    setSelectedUser(null);
                  }}
                  placeholder="Enter email address"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEmailLookup(shareEmail);
                      setSearchPerformed(true);
                    }
                  }}
                />

                <div className="share-coin-user-list">
                  {searchLoading && (
                    <div className="share-loading">
                      <div className="share-spinner"></div>
                      <p>Searching...</p>
                    </div>
                  )}

                  {!searchLoading && foundUsers.length > 0 && (
                    <div className="share-users-container">
                      {foundUsers.map((user) => (
                        <div
                          key={user.id || user.email}
                          className={`share-coin-user-item ${selectedUser?.email === user.email ? 'selected' : ''
                            }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="share-coin-avatar">
                            {user.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2) || '?'}
                          </div>
                          <div className="share-coin-user-info">
                            <h4>{user.name}</h4>
                            <p>{user.email}</p>
                          </div>
                          {selectedUser?.email === user.email && (
                            <div className="selected-share-coin-icon">
                              <FiCheck
                                size={15}
                                color="#fff"
                                className="d-flex align-items-center justify-content-center"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!searchLoading && searchPerformed && shareEmail && foundUsers.length === 0 && (
                    <div className="share-no-results">
                      <p>No users found with this email</p>
                    </div>
                  )}
                </div>
              </div>

              <PublicShareLinkSection
                projectId={selectedProject?.id || selectedProject?.token}
                authToken={token}
              />
            </div>

            <div className="d-flex gap-2 align-items-center justify-content-end">
              <button
                className="btn btn-cancel"
                onClick={() => {
                  setShareModalOpen(false);
                  setShareEmail('');
                  setSelectedUser(null);
                  setFoundUsers([]);
                  setSearchPerformed(false);
                  setShareMessage('');
                  setShareMessageType('');
                }}
              >
                Cancel
              </button>

              <button
                className="btn btn-create"
                onClick={handleShareProject}
                disabled={loading || !selectedUser}
              >
                {loading ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="ticket-success-popup-overlay" onClick={() => setShowSuccessPopup(false)}>
          <div className="ticket-success-popup">
            <img src={Success} alt="" />
            <h3>Project shared successfully!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
