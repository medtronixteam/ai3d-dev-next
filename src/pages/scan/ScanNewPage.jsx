import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import lottie from 'lottie-web';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useNotification } from '../../context/NotificationContext';
import { baseURL } from '../../config';
import loaderAnimationData from '../../assets/images/loader.json';
import './ModelGenerator.css';
import LeftScan from '../../components/scan/LeftScan';
import CenterScan from '../../components/scan/CenterScan';
import RightScan from '../../components/scan/RightScan';
import PublicShareLinkSection from '../../components/popup/PublicShareLinkSection';
import OpenInEditorModal from '../../components/popup/OpenInEditorModal';
import { useRouteLeave } from '../../hooks/useRouteLeave';
import { useWorkspace } from '../../context/WorkspaceContext';
import * as THREE from 'three';
import { FiX, FiCheck } from 'react-icons/fi';
import { Hourglass } from 'lucide-react';
import { fetchPublicProject, isPublicProjectRoute } from '../../utils/publicProjectShare';
import {
  generateVideoProject,
  pollProjectFramesUntilReady,
  submitVideoPublicUrl,
} from '../../services/videoProjectApi';

import {
  createMultiImageProject,
  uploadProjectFile,
  completeMultiImageProject,
} from '../../services/multipleImagesTo3dApi';

const hasProjectFeedback = (value) =>
  value === true || value === 1 || value === '1';

const getApiErrorMessage = (errorOrData, fallback = 'Something went wrong. Please try again.') => {
  const data = errorOrData?.response?.data ?? errorOrData;
  const raw =
    data?.message ??
    data?.error ??
    data?.errors ??
    errorOrData?.message;

  if (!raw) return fallback;
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) return raw.filter(Boolean).join(', ') || fallback;
  if (typeof raw === 'object') {
    const parts = Object.values(raw).flat().filter((v) => typeof v === 'string');
    if (parts.length) return parts.join(', ');
  }
  return fallback;
};

const isApiErrorPayload = (data) => {
  if (!data || typeof data !== 'object') return false;
  const status = String(data.status || '').toLowerCase();
  return status === 'error' || status === 'failed' || data.success === false;
};

const PROJECT_POLL_INTERVAL_MS = 5000;
const PROJECT_POLL_MAX_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours — covers ~1hr generation
const PROJECT_TERMINAL_STATUSES = new Set([
  'completed',
  'failed',
  'error',
  'cancelled',
  'canceled',
]);
const PROJECT_FAILED_STATUSES = new Set(['failed', 'error', 'cancelled', 'canceled']);

const detectFileExtensionAndName = (response, defaultName = 'model', fallbackUrls = [], explicitType = '') => {
  let fileName = null;
  let extension = null;

  const contentDisposition = response?.headers?.['content-disposition'];
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    if (fileNameMatch?.[1]) {
      fileName = fileNameMatch[1].trim();
      const dotIndex = fileName.lastIndexOf('.');
      if (dotIndex !== -1 && dotIndex < fileName.length - 1) {
        extension = fileName.substring(dotIndex + 1).toLowerCase();
      }
    }
  }

  if (!extension && explicitType && typeof explicitType === 'string') {
    const cleanType = explicitType.replace(/^\./, '').trim().toLowerCase();
    if (cleanType && !cleanType.includes('_') && cleanType.length <= 6) {
      extension = cleanType;
    }
  }

  if (!extension) {
    const urls = Array.isArray(fallbackUrls) ? fallbackUrls : [fallbackUrls];
    for (const u of urls) {
      if (u && typeof u === 'string') {
        const cleanUrl = u.split('?')[0].split('#')[0];
        const match = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
        if (match?.[1]) {
          const ext = match[1].toLowerCase();
          if (['glb', 'gltf', 'splat', 'ply', 'blend', 'obj', 'fbx', 'usdz', 'stl'].includes(ext)) {
            extension = ext;
            break;
          }
        }
      }
    }
  }

  if (!extension) {
    const contentType = (response?.headers?.['content-type'] || '').toLowerCase();
    if (contentType.includes('splat')) extension = 'splat';
    else if (contentType.includes('gltf-binary') || contentType.includes('glb')) extension = 'glb';
    else if (contentType.includes('gltf')) extension = 'gltf';
    else if (contentType.includes('blender') || contentType.includes('blend')) extension = 'blend';
    else if (contentType.includes('ply')) extension = 'ply';
    else if (contentType.includes('obj')) extension = 'obj';
  }

  if (!extension) extension = 'glb';

  if (!fileName) {
    const cleanDefault = (defaultName || 'model').replace(/\.[a-zA-Z0-9]+$/, '').trim();
    fileName = `${cleanDefault || 'model'}.${extension}`;
  }

  return { fileName, extension };
};

const projectStatusStepMap = {
  submitted: 1,
  pending: 2,
  in_queue: 2,
  processing: 3,
  completed: 4,
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ModelGenerator = ({ isDarkMode = false }) => {
  const { token, user } = useAuth();
  const { activeCreationWorkspaceId, assignProjectToWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug: routeSlug } = useParams();
  const isPublicView = isPublicProjectRoute(location.pathname) && Boolean(routeSlug);
  const ownedScanSlug =
    !isPublicView && routeSlug ? decodeURIComponent(String(routeSlug)) : null;
  const isPublicGuestView = isPublicView && !token;
  const { queue_system, clearActiveQueueRegistration, frame_extraction } = useSocket();
  const { fcmToken } = useNotification();

  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [singleImageName, setSingleImageName] = useState('');
  const [singleImageFile, setSingleImageFile] = useState(null);
  const [video, setVideo] = useState(null);

  const [activeTab, setActiveTab] = useState('library');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessUI, setShowSuccessUI] = useState(false);
  const [showQueueUI, setShowQueueUI] = useState(false);
  const [showLoadingUI, setShowLoadingUI] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBlackOverlay, setShowBlackOverlay] = useState(false);
  const [isArrowLoading, setIsArrowLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');

  const [projectToken, setProjectToken] = useState(null);
  const [projectType, setProjectType] = useState('text_to_3d');
  const [projectStatus, setProjectStatus] = useState('pending');
  const [modelUrl, setModelUrl] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [isModelRendering, setIsModelRendering] = useState(true);
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [screenshotData, setScreenshotData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [videoFileName, setVideoFileName] = useState('');
  const [aiExtractJobId, setAiExtractJobId] = useState(null);
  const [aiVideoCloudinaryUrl, setAiVideoCloudinaryUrl] = useState(null);
  const [videoFrameItems, setVideoFrameItems] = useState([]);
  const [videoFrames, setVideoFrames] = useState([]);
  const [showVideoFrames, setShowVideoFrames] = useState(false);
  const [removedFrames, setRemovedFrames] = useState([]);
  const [isExtractingFrames, setIsExtractingFrames] = useState(false);
  const [isActuallyRendered, setIsActuallyRendered] = useState(false);
  const [comingSoonModalOpen, setComingSoonModalOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const loadedProjectTokenRef = useRef(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [isOpeningEditor, setIsOpeningEditor] = useState(false);
  const socketRef = useRef(null);
  const shouldShowReviewRef = useRef(false);
  const openedFromRecentRef = useRef(false);
  const activeProjectPollRef = useRef(null);
  const projectPollGenerationRef = useRef(0);
  const slugResolveRef = useRef(null);

  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilterLoading, setHistoryFilterLoading] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState('');

  // Share Modal States
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [shareMessageType, setShareMessageType] = useState('');
  const [selectedProjectForShare, setSelectedProjectForShare] = useState(null);
  const typingTimeoutRef = useRef(null);

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
      return path;
    }
    const cleanPath = path.replace(/^\/+/, '');
    if (cleanPath.startsWith('storage/')) {
      return `https://app.ai3dscanning.com/${cleanPath}`;
    }
    return `https://app.ai3dscanning.com/storage/${cleanPath}`;
  };

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await axios.get(`${baseURL}/project`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawData = res.data?.data?.data || [];

      const formattedData = rawData
        .filter(item => item.status === 'completed')
        .map(item => {
        const rawImg = item.screenshot || item.thumbnail;
        const imgUrl = getFullImageUrl(rawImg);
        return {
          id: item.token || item.id,
          token: item.token || item.id,
          name: item.name || 'Untitled',
          time: item.created_at
            ? new Date(item.created_at)
                .toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
                .replace(/ (\b[AP]M\b)$/i, '\u00a0$1')
            : 'Recent',
          type: item.type === 'text_to_3d' ? 'prompt' : (item.type === 'video_to_3d' ? 'video' : 'image'),
          rawType: item.type,
          status: item.status,
          progress: item.progress || 0,
          thumbnail: imgUrl,
          favorite: !!item.favorite,
          splat_url: item.splat_url,
        };
      });

      setHistoryData(formattedData);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [token]);

  const handleHistoryExport = async (project) => {
    try {
      const response = await axios.get(`${baseURL}/project/export/${project.token || project.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const { fileName } = detectFileExtensionAndName(
        response,
        project.name || project.title || 'model',
        [project.splat_url, project.file_url, project.file_temp_url, project.thumbnail],
        project.file_type || project.format
      );

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Model exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      if (err.response?.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            toast.error(errorData.message || 'Failed to export model');
          } catch (e) {
            toast.error('Failed to export model');
          }
        };
        reader.readAsText(err.response.data);
      } else {
        const errMsg = err.response?.data?.message || 'Failed to export model';
        toast.error(errMsg);
      }
    }
  };

  const handleHistoryFavorite = async (project) => {
    // Optimistic update
    setHistoryData(prev => prev.map(p =>
      p.id === project.id ? { ...p, favorite: !p.favorite } : p
    ));

    try {
      await axios.post(
        `${baseURL}/project/favorite`,
        { token: project.token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Favorite toggle failed:', err);
      // Revert on error
      setHistoryData(prev => prev.map(p =>
        p.id === project.id ? { ...p, favorite: project.favorite } : p
      ));
      toast.error('Failed to update favorite status');
    }
  };

  const handleHistoryShare = (project) => {
    setSelectedProjectForShare(project);
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

    setIsGenerating(true); // Using isGenerating as a general loading state for buttons
    try {
      await axios.post(
        `${baseURL}/project/share/byemail`,
        {
          project_id: selectedProjectForShare.id,
          shared_to_email: selectedUser.email,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShareMessage('Project shared successfully!');
      setShareMessageType('success');
      toast.success('Project shared successfully!');

      setShareEmail('');
      setSelectedUser(null);
      setFoundUsers([]);
      setSearchPerformed(false);

      setTimeout(() => {
        setShareModalOpen(false);
        setShareMessage('');
        setShareMessageType('');
      }, 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to share project.';
      setShareMessage(errMsg);
      setShareMessageType('error');
      setTimeout(() => {
        setShareMessage('');
        setShareMessageType('');
      }, 2000);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredHistoryData = historyData.filter(item =>
    item.name.toLowerCase().includes(historySearchQuery.toLowerCase())
  );

  const handleHistoryFilterChange = (filter) => {
    if (filter === historyFilter) return;
    setHistoryFilterLoading(true);
    setHistoryFilter(filter);
  };

  useEffect(() => {
    if (!historyFilterLoading) return;
    const timer = setTimeout(() => setHistoryFilterLoading(false), 350);
    return () => clearTimeout(timer);
  }, [historyFilter, historyFilterLoading]);

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token, fetchHistory]);

  useEffect(() => {
    if (!showReviewModal) return;

    setActiveTab('transform');

    if (!window.matchMedia('(max-width: 991.98px)').matches) return;

    requestAnimationFrame(() => {
      document.getElementById('scan-review-panel')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  }, [showReviewModal]);

  const [transformControls, setTransformControls] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  });
  const defaultTransformControls = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  };
  const [transformHistory, setTransformHistory] = useState([defaultTransformControls]);
  const [transformHistoryIndex, setTransformHistoryIndex] = useState(0);
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [activeViewportTool, setActiveViewportTool] = useState('Picker');
  const [isUserOwnedProject, setIsUserOwnedProject] = useState(false);
  const transformHistoryRef = useRef([defaultTransformControls]);
  const transformHistoryIndexRef = useRef(0);

  const lottieRef = useRef(null);
  const modelViewerRef = useRef(null);
  const modelViewportRef = useRef(null);

  const scrollToModelViewport = useCallback(() => {
    if (window.matchMedia('(min-width: 992px)').matches) return;

    requestAnimationFrame(() => {
      modelViewportRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }, []);

  const isProcessing =
    (isGenerating ||
    isExtractingFrames ||
    showSuccessUI ||
    showQueueUI ||
    showLoadingUI ||
    isArrowLoading) && !isRedirecting;
  const isCancelled = projectStatus === 'canceled' || projectStatus === 'cancelled';

  // fetch recent projects model
  useEffect(() => {
    if (isPublicView) return;

    if (location.state?.projectId && location.state?.viewMode) {
      const projectId = location.state.projectId;
      const feedbackGiven = location.state.feedbackGiven;
      console.log('Loading project:', projectId);

      openedFromRecentRef.current = true;

      if (!hasProjectFeedback(feedbackGiven)) {
        shouldShowReviewRef.current = true;
      }

      setIsViewOnly(true);
      setIsUserOwnedProject(true);
      setActiveTab('transform');
      setProjectToken(projectId);
      if (ownedScanSlug) {
        slugResolveRef.current = ownedScanSlug;
      }
      fetchInitialProject(projectId);

      // Keep slug URL if present; only clear navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  // Open owned project from backend slug URL: /3dio/new/scan/{slug}
  useEffect(() => {
    if (isPublicView || !ownedScanSlug || !token) return;
    if (location.state?.projectId) return; // handled by state effect
    if (slugResolveRef.current === ownedScanSlug) return;

    slugResolveRef.current = ownedScanSlug;
    let cancelled = false;

    const resolveOwnedProjectBySlug = async () => {
      try {
        setShowLoadingUI(true);
        setShowBlackOverlay(true);
        setIsViewOnly(true);
        setIsUserOwnedProject(true);
        setActiveTab('transform');

        // Prefer public slug endpoint — returns project for slug from backend
        try {
          const result = await fetchPublicProject(ownedScanSlug);
          if (cancelled) return;
          const proj = result.project || {};
          const tokenId = proj.token || proj.id || proj.project_token || proj.project_id;
          if (tokenId) {
            setProjectToken(tokenId);
            await fetchInitialProject(tokenId);
            return;
          }
        } catch {
          // fall through to list search
        }

        // Fallback: find in user's project list by slug
        const res = await axios.get(`${baseURL}/project?page=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;

        const first = res.data?.data;
        const list = first?.data || [];

        let found = list.find(
          (p) => p.slug === ownedScanSlug || p.public_slug === ownedScanSlug,
        );

        // Light paginate a few pages if needed
        let nextUrl = first?.next_page_url;
        let guard = 0;
        while (!found && nextUrl && guard < 5) {
          guard += 1;
          const safeNext = String(nextUrl).replace('http://', 'https://');
          const nextRes = await axios.get(safeNext, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (cancelled) return;
          const pageData = nextRes.data?.data;
          const pageList = pageData?.data || [];
          found = pageList.find(
            (p) => p.slug === ownedScanSlug || p.public_slug === ownedScanSlug,
          );
          nextUrl = pageData?.next_page_url;
        }

        if (!found) {
          throw new Error('Project not found for this slug.');
        }

        const tokenId = found.token || found.id;
        setProjectToken(tokenId);
        if (!hasProjectFeedback(found.feedback_given)) {
          shouldShowReviewRef.current = true;
        }
        await fetchInitialProject(tokenId);
      } catch (err) {
        if (cancelled) return;
        slugResolveRef.current = null;
        console.error('Failed to resolve project slug:', err);
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            'Could not open this project.',
        );
        setShowLoadingUI(false);
        setShowBlackOverlay(false);
      }
    };

    resolveOwnedProjectBySlug();

    return () => {
      cancelled = true;
    };
  }, [isPublicView, ownedScanSlug, token, location.state?.projectId]);

  const fetchInitialProject = async (projectId) => {
    const pollGeneration = projectPollGenerationRef.current + 1;
    projectPollGenerationRef.current = pollGeneration;
    activeProjectPollRef.current = projectId;

    const isStalePoll = () =>
      projectPollGenerationRef.current !== pollGeneration || activeProjectPollRef.current !== projectId;

    const applyProjectDetail = (proj) => {
      setProjectStatus(proj.status);
      setGeneratedPrompt(proj.prompt || proj.name || 'Project');
      if (proj.type) {
        setProjectType(proj.type);
      }

      setCurrentStep(projectStatusStepMap[proj.status] || 1);

      if (proj.status === 'pending' || proj.status === 'in_queue' || proj.status === 'submitted') {
        setShowQueueUI(true);
        setShowLoadingUI(false);
        setShowBlackOverlay(false);
      } else if (proj.status === 'processing') {
        setShowQueueUI(false);
        setShowLoadingUI(true);
        setShowBlackOverlay(true);
      } else if (proj.status === 'completed') {
        setShowQueueUI(false);
        setShowLoadingUI(false);
        setShowBlackOverlay(false);
      }
    };

    const pollProjectDetailOnce = async () => {
      const res = await axios.get(`${baseURL}/project/detail/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const proj = res.data?.data;
      if (!proj) {
        throw new Error('Project not found');
      }

      return proj;
    };

    try {
      console.log('Fetching project details:', projectId);

      let proj = await pollProjectDetailOnce();
      if (isStalePoll()) return;

      console.log('Project data:', proj);

      if (openedFromRecentRef.current && proj.status === 'completed' && !hasProjectFeedback(proj.feedback_given)) {
        shouldShowReviewRef.current = true;
      }
      openedFromRecentRef.current = false;

      applyProjectDetail(proj);

      // If backend returned a slug, keep Scan New URL in sync
      const projectSlug = (proj.slug || proj.public_slug || '').toString().trim();
      if (
        projectSlug &&
        location.pathname.startsWith('/3dio/new/scan') &&
        !isPublicView
      ) {
        const targetPath = `/3dio/new/scan/${encodeURIComponent(projectSlug)}`;
        if (location.pathname !== targetPath) {
          navigate(targetPath, { replace: true });
        }
      }

      if (proj.status === 'completed') {
        await fetchModelUrl(projectId, proj.type);
        return;
      }

      if (PROJECT_FAILED_STATUSES.has(proj.status)) {
        throw new Error('Project generation failed');
      }

      queue_system(projectId, fcmToken);

      let status = proj.status;
      const pollStartedAt = Date.now();
      while (!PROJECT_TERMINAL_STATUSES.has(status)) {
        if (Date.now() - pollStartedAt > PROJECT_POLL_MAX_DURATION_MS) {
          throw new Error(
            'Model generation is taking longer than expected. Please check History — it may still complete in the background.',
          );
        }

        await delay(PROJECT_POLL_INTERVAL_MS);
        if (isStalePoll()) return;

        proj = await pollProjectDetailOnce();
        if (isStalePoll()) return;

        console.log('Project poll update:', proj.status);
        applyProjectDetail(proj);
        status = proj.status;
      }

      if (status === 'completed') {
        await fetchModelUrl(projectId, proj?.type);
      } else {
        throw new Error('Project generation failed');
      }
    } catch (err) {
      console.error('Failed to fetch project:', err);
      toast.error(err?.response?.data?.message || err.message || 'Failed to load project');
      setShowLoadingUI(false);
      setShowBlackOverlay(false);
      setShowQueueUI(false);
      openedFromRecentRef.current = false;
    } finally {
      if (!isStalePoll()) {
        setIsGenerating(false);
        setIsArrowLoading(false);
      }
    }
  };

  const handleHistoryOpen = (project) => {
    if (!project?.token) return;

    if (project.status === 'failed') {
      toast.error('This project failed to generate. Please try again.');
      return;
    }

    openedFromRecentRef.current = true;
    shouldShowReviewRef.current = false;
    setIsViewOnly(true);
    setIsUserOwnedProject(true);
    setProjectToken(project.token);
    if (project.rawType) {
      setProjectType(project.rawType);
    }
    setActiveTab('transform');
    scrollToModelViewport();
    fetchInitialProject(project.token);
  };

  const handleRouteLeave = useCallback(() => {
    console.log('[Disconnecting socket due to route change');
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useRouteLeave(isProcessing && !modelReady && !isCancelled && !isRedirecting, handleRouteLeave);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (window.isRedirectingToEditor) return;
      if (isProcessing && !modelReady && !isCancelled && !isRedirecting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isProcessing, modelReady, isCancelled, isRedirecting]);

  useEffect(() => {
    let anim = null;
    const initLottie = () => {
      if (lottieRef.current && !anim) {
        anim = lottie.loadAnimation({
          container: lottieRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: loaderAnimationData,
        });
      }
    };
    initLottie();
    const observer = new MutationObserver(initLottie);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      if (anim) anim.destroy();
      observer.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   if (projectToken) {
  //     console.log('Registering queue_system for token:', projectToken);
  //     queue_system(projectToken, token);
  //   }
  // }, [projectToken, token, queue_system]);

  const { queueData } = useSocket();

  useEffect(() => {
    if (!showLoadingUI && !showQueueUI) return;
    scrollToModelViewport();
  }, [showLoadingUI, showQueueUI, scrollToModelViewport]);

  useEffect(() => {
    if (!queueData || !projectToken) return;

    const qProjectId = queueData.projectId || queueData.deviceId;
    if (qProjectId !== projectToken) return;

    if (queueData.status === 'processing') {
      setShowQueueUI(false);
      setShowLoadingUI(true);
      setShowBlackOverlay(true);
    }

    if (queueData.status === 'completed') {
      setShowQueueUI(false);
      if (!modelReady && !modelUrl) {
        setShowLoadingUI(true);
      }
      setProjectStatus('completed');
      fetchModelUrl(projectToken, projectType);
    }

    if (queueData.progress) {
      setProgress(queueData.progress);
    }
  }, [queueData, projectToken, modelReady, modelUrl]);

  useEffect(() => {
    const handleProjectCompleteNotification = (event) => {
      console.log('Project processing complete notification received:', event.detail);
      if (projectToken && (!modelReady || !modelUrl || loadedProjectTokenRef.current !== projectToken)) {
        fetchInitialProject(projectToken);
      }
    };

    window.addEventListener('projectProcessingComplete', handleProjectCompleteNotification);
    return () => {
      window.removeEventListener('projectProcessingComplete', handleProjectCompleteNotification);
    };
  }, [projectToken, modelReady, modelUrl]);

  const resetAllInputs = useCallback(() => {
    projectPollGenerationRef.current += 1;
    activeProjectPollRef.current = null;
    setPrompt('');
    setImages([]);
    setImageFiles([]);
    setSingleImageName('');
    setSingleImageFile(null);
    setVideo(null);
    setVideoFileName('');
    setAiExtractJobId(null);
    setAiVideoCloudinaryUrl(null);
    setVideoFrameItems([]);
    setVideoFrames([]);
    setRemovedFrames([]);
    setShowVideoFrames(false);
    setIsExtractingFrames(false);
    setIsRedirecting(false);
    setProjectToken(null);
    loadedProjectTokenRef.current = null;
    setProjectStatus('pending');
    setModelUrl(null);
    setModelReady(false);
    setIsViewOnly(false);
    setCurrentStep(1);
    setScreenshotTaken(false);
    setShowLoadingUI(false);
    setShowBlackOverlay(false);
    setShowQueueUI(false);
    setShowSuccessUI(false);
    setIsGenerating(false);
    setIsArrowLoading(false);
    setProgress(0);
    setActiveTab('library');
    setIsActuallyRendered(false);
    setShowReviewModal(false);
    setShowEditorModal(false);
    setIsOpeningEditor(false);
    shouldShowReviewRef.current = false;
    openedFromRecentRef.current = false;
    setTransformControls(defaultTransformControls);
    setTransformHistory([defaultTransformControls]);
    setTransformHistoryIndex(0);
    setShadowsEnabled(true);
    setGridVisible(true);
    setAutoRotate(false);
    setActiveViewportTool('Picker');
    setIsUserOwnedProject(false);
    transformHistoryRef.current = [defaultTransformControls];
    transformHistoryIndexRef.current = 0;
    clearActiveQueueRegistration();
  }, [clearActiveQueueRegistration]);

  useEffect(() => {
    const handleReset = (event) => {
      const fromSamePage = event?.detail?.fromSamePage;
      if (fromSamePage) {
        const hasOpenModel =
          modelReady ||
          modelUrl ||
          projectToken ||
          isViewOnly ||
          showLoadingUI ||
          showQueueUI ||
          showSuccessUI ||
          isGenerating;

        if (!hasOpenModel) return;
      }

      console.log('[ScanNewPage] Resetting Scan New page state due to sidebar click.');
      resetAllInputs();
    };

    window.addEventListener('reset-scan-new', handleReset);
    return () => {
      window.removeEventListener('reset-scan-new', handleReset);
    };
  }, [
    resetAllInputs,
    modelReady,
    modelUrl,
    projectToken,
    isViewOnly,
    showLoadingUI,
    showQueueUI,
    showSuccessUI,
    isGenerating,
  ]);

  const addCacheBuster = (url) => {
    if (!url) return url;
    const isSigned = url.includes('Signature=') || 
                     url.includes('x-goog-signature=') || 
                     url.includes('X-Goog-Signature=') || 
                     url.includes('X-Amz-Signature=') || 
                     url.includes('sig=');
    if (isSigned) {
      return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${Date.now()}`;
  };

  const adjustUrlForLocalhost = (url) => {
    if (!url) return url;
    if (
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '0.0.0.0' ||
        window.location.port === '3000') &&
      url.includes('ai3dscanning-crm.s3.ap-south-1.amazonaws.com')
    ) {
      return url.replace('https://ai3dscanning-crm.s3.ap-south-1.amazonaws.com', '/s3-proxy');
    }
    return url;
  };

  useEffect(() => {
    if (!isPublicView || !routeSlug) return;

    let cancelled = false;

    const loadPublicProject = async () => {
      try {
        setShowLoadingUI(true);
        setShowBlackOverlay(true);
        setIsViewOnly(true);
        setIsUserOwnedProject(false);
        setModelReady(false);
        setModelUrl(null);
        setCurrentStep(4);
        setProjectStatus('completed');

        const result = await fetchPublicProject(routeSlug);
        if (cancelled) return;

        const { project, modelUrl: fetchedModelUrl } = result;

        if (!fetchedModelUrl) {
          throw new Error('Model file not available for this project.');
        }

        const finalUrl = adjustUrlForLocalhost(addCacheBuster(fetchedModelUrl));

        setGeneratedPrompt(project?.prompt || project?.name || 'Shared Project');
        setModelUrl(finalUrl);
        setModelReady(true);
        setShowLoadingUI(false);
        setShowBlackOverlay(false);
        setActiveTab('transform');
        setTransformControls(defaultTransformControls);
        setTransformHistory([defaultTransformControls]);
        setTransformHistoryIndex(0);
        transformHistoryRef.current = [defaultTransformControls];
        transformHistoryIndexRef.current = 0;
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load public project:', err);
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            'This shared project could not be loaded.',
        );
        setShowLoadingUI(false);
        setShowBlackOverlay(false);
      }
    };

    loadPublicProject();

    return () => {
      cancelled = true;
    };
  }, [isPublicView, routeSlug]);

  const fetchModelUrl = async (token_id, type) => {
    if (loadedProjectTokenRef.current === token_id && modelUrl && modelReady) {
      console.log('Model already loaded for this project, skipping duplicate fetch:', token_id);
      return;
    }

    try {
      setModelLoading(true);
      console.log(`Fetching temp model URL for project: ${token_id}`);

      if (type === 'video_to_3d' || type === 'images_to_3d') {
        const tempRes = await axios.get(`${baseURL}/project/temp/${token_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tempUrl =
          tempRes.data?.temp_url ||
          tempRes.data?.url ||
          tempRes.data?.data?.temp_url ||
          tempRes.data?.data?.url;

        if (tempUrl) {
          setShowQueueUI(false);
          setShowLoadingUI(false);
          setShowBlackOverlay(false);
          setIsGenerating(false);
          setIsRedirecting(true);
          window.isRedirectingToEditor = true;
          window.location.href = tempUrl;
          return;
        }

        console.warn(`No temp_url returned for ${type} project, falling back to model URL`);
      }

      const response = await axios.get(`${baseURL}/project/temp/url/${token_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API Response:', response.data);

      let url = response.data?.url || response.data?.temp_url || response.data?.data?.url;

      if (url) {
        url = url.replace(/\\\//g, '/').trim();
        const finalUrl = adjustUrlForLocalhost(addCacheBuster(url));

        console.log('URL loaded:', finalUrl);

        loadedProjectTokenRef.current = token_id;
        setModelUrl(finalUrl);
        setProjectStatus('completed');
        setShowLoadingUI(false);
        setShowBlackOverlay(false);
        setModelReady(true);
        setShowQueueUI(false);
        setActiveTab('transform');
        setIsViewOnly(true);
        setTransformControls(defaultTransformControls);
        setTransformHistory([defaultTransformControls]);
        setTransformHistoryIndex(0);
        transformHistoryRef.current = [defaultTransformControls];
        transformHistoryIndexRef.current = 0;
        clearActiveQueueRegistration();

        if (shouldShowReviewRef.current) {
          shouldShowReviewRef.current = false;
          setTimeout(() => setShowReviewModal(true), 10000);
        }
      } else {
        throw new Error('Model URL not found in response');
      }
    } catch (err) {
      console.error('Failed to fetch model URL:', err);
      toast.error('Failed to load model');
      setShowLoadingUI(false);
      setShowBlackOverlay(false);
    } finally {
      setModelLoading(false);
    }
  };

  const takeScreenshot = async () => {
    if (screenshotTaken || !modelViewerRef.current) return;

    try {
      const canvas = modelViewerRef.current.querySelector('canvas');

      if (!canvas) {
        console.error('Canvas not found');
        return;
      }

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to create blob from canvas');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result;
          setScreenshotData(base64data);
          setScreenshotTaken(true);

          console.log('Screenshot captured');
          await uploadScreenshot(base64data);
        };

        reader.readAsDataURL(blob);
      }, 'image/png');

    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  };

  const uploadScreenshot = async (base64Image) => {
    try {
      const response = await axios.post(
        `${baseURL}/project/captured/ss`,
        {
          project_id: projectToken,
          caputured_ss: base64Image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Backend Screenshot Upload Response:', response.data);
    } catch (err) {
      console.error('Screenshot upload failed:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!modelViewerRef.current || !modelUrl || screenshotTaken) return;

    const timer = setTimeout(() => {
      if (isActuallyRendered && !screenshotTaken) {
        takeScreenshot();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [modelUrl, isActuallyRendered, screenshotTaken]);

  const handleEnhancePrompt = async () => {
    if (isEnhancing || !prompt.trim()) return;

    if (originalPrompt && prompt !== originalPrompt) {
      setPrompt(originalPrompt);
      setOriginalPrompt('');
      return;
    }

    setIsEnhancing(true);
    setOriginalPrompt(prompt);

    try {
      const response = await axios.post(
        `${baseURL}/project/prompt/enchancer`,
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const enhancedText =
        response.data?.['enhanced-text'] ||
        response.data?.data?.['enhanced-text'] ||
        response.data?.enhancedText ||
        response.data?.data?.enhancedText;

      if (enhancedText) {
        setPrompt(enhancedText);
        toast.success('Prompt enhanced successfully!');
      }
    } catch (err) {
      console.error('Enhancement failed:', err);
      toast.error('Failed to enhance prompt');
      setOriginalPrompt('');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSingleImageGenerate = async () => {
    if (isProcessing || !singleImageFile || isViewOnly) return;

    scrollToModelViewport();
    setIsArrowLoading(true);

    try {
      const projectName = Date.now().toString();
      const formData = new FormData();
      formData.append('name', projectName);
      formData.append('file', singleImageFile, singleImageFile.name);

      const response = await axios.post(`${baseURL}/project/imageTo3d`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const token_id = response.data?.token || response.data?.data?.token;

      if (token_id) {
        setProjectToken(token_id);
        setProjectType('image_to_3d');
        setGeneratedPrompt(singleImageName);
        startGenerationFlow(token_id);
      } else {
        throw new Error('Project token not returned');
      }
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Upload failed'));
      setIsArrowLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (isProcessing || isViewOnly) return;

    if (showVideoFrames && videoFrames.length > 0) {
      const activeFrameCount = videoFrames.length - removedFrames.length;
      if (activeFrameCount < 2) {
        toast.error('Please keep at least 2 frames');
        return;
      }

      try {
        setIsGenerating(true);
        await handleGenerateFromFrames();
      } catch (err) {
        console.error(err);
        toast.error(getApiErrorMessage(err, 'Generation failed'));
        setIsGenerating(false);
      }
      return;
    }

    const trimmedPrompt = (prompt || '').trim();
    if (!trimmedPrompt && images.length === 0 && !video) {
      toast.error('Please enter a prompt or upload images/video.');
      return;
    }

    scrollToModelViewport();

    let generationStarted = false;

    try {
      setIsGenerating(true);
      const projectName = Date.now().toString();

      if (trimmedPrompt && images.length === 0 && !video) {
        const res = await axios.post(
          `${baseURL}/project/prompt`,
          { name: projectName, prompt: trimmedPrompt },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );

        const data = res.data;
        if (isApiErrorPayload(data)) {
          throw new Error(getApiErrorMessage(data, 'Generation failed'));
        }

        const token_id = data?.token || data?.data?.token;
        if (!token_id) {
          throw new Error(getApiErrorMessage(data, 'Project token not returned'));
        }

        setProjectToken(token_id);
        setProjectType('text_to_3d');
        setGeneratedPrompt(trimmedPrompt);
        generationStarted = true;
        startGenerationFlow(token_id);
      } else if (images.length > 0) {
        if (images.length < 10) {
          toast.warning('Minimum 10 images are required for 3D generation. Please upload at least 10 images.');
          setIsGenerating(false);
          return;
        }

        if (images.length > 100) {
          toast.warning('Maximum 100 images are allowed. Please remove extra images.');
          setIsGenerating(false);
          return;
        }

        setShowLoadingUI(true);
        setShowBlackOverlay(true);
        setProgress(0);

        const projectRes = await createMultiImageProject(token);

        const token_id = projectRes?.token || projectRes?.data?.token;
        if (!token_id) throw new Error('Project token not returned');

        setProjectToken(token_id);

        const totalFiles = imageFiles.length;
        const fileProgresses = new Array(totalFiles).fill(0);

        for (let i = 0; i < totalFiles; i++) {
          await uploadProjectFile({
            projectToken: token_id,
            file: imageFiles[i],
            token,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const currentPercent = progressEvent.loaded / progressEvent.total;
                fileProgresses[i] = currentPercent;
                const overallPercent = (fileProgresses.reduce((acc, curr) => acc + curr, 0) / totalFiles) * 100;
                setProgress(Math.round(overallPercent));
              }
            },
          });
          fileProgresses[i] = 1;
          const overallPercent = ((i + 1) / totalFiles) * 100;
          setProgress(Math.round(overallPercent));
        }

        const completeRes = await completeMultiImageProject({
          projectToken: token_id,
          token,
        });

        const directUrl =
          completeRes?.url ||
          completeRes?.temp_url ||
          completeRes?.data?.url ||
          completeRes?.data?.temp_url;

        if (directUrl) {
          setShowQueueUI(false);
          setShowLoadingUI(false);
          setShowBlackOverlay(false);
          setIsGenerating(false);
          setIsRedirecting(true);
          window.isRedirectingToEditor = true;
          window.location.href = directUrl;
          return;
        }

        setProjectType('images_to_3d');
        setGeneratedPrompt(`${totalFiles} Images`);
        generationStarted = true;
        startGenerationFlow(token_id);
      } else if (video) {
        generationStarted = true;
        await handleVideoFrameExtraction();
      }
    } catch (err) {
      console.error('Generation error:', err);
      toast.error(getApiErrorMessage(err, 'Generation failed'));
      setShowLoadingUI(false);
      setShowBlackOverlay(false);
      setShowQueueUI(false);
      setIsGenerating(false);
      setIsArrowLoading(false);
    } finally {
      // Soft-fail safety: if flow never started, never leave the button spinning
      if (!generationStarted) {
        setIsGenerating(false);
      }
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'test_preset');
    formData.append('cloud_name', 'dpypih1wo');
    formData.append('folder', 'netsoo');

    const response = await fetch('https://api.cloudinary.com/v1_1/dpypih1wo/auto/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    // AI API swagger example uses Cloudinary `url` (http); fallback to secure_url.
    return data.url || data.secure_url;
  };

  const handleVideoFrameExtraction = async () => {
    if (!video) {
      toast.error('Please select a video');
      setIsGenerating(false);
      return;
    }

    const videoName = video.name;

    setIsExtractingFrames(true);
    setProjectType('video_to_3d');
    setGeneratedPrompt(videoName);
    setShowQueueUI(true);
    setShowLoadingUI(false);
    setShowBlackOverlay(false);
    setCurrentStep(2);
    scrollToModelViewport();

    try {
      const cloudinaryUrl = await uploadToCloudinary(video);
      if (!cloudinaryUrl) {
        throw new Error('Video upload failed');
      }

      const { token: sessionToken } = await submitVideoPublicUrl(cloudinaryUrl, token);
      setAiExtractJobId(sessionToken);
      setAiVideoCloudinaryUrl(cloudinaryUrl);

      if (fcmToken && frame_extraction) {
        frame_extraction(sessionToken, fcmToken);
      }

      const frameItems = await pollProjectFramesUntilReady(sessionToken, token, {
        onPending: () => {
          setShowQueueUI(true);
          setShowLoadingUI(false);
          setShowBlackOverlay(false);
          setCurrentStep(2);
        },
        onFrameProgress: (attempt, maxAttempts) => {
          setShowQueueUI(true);
          setShowLoadingUI(false);
          setShowBlackOverlay(false);
          setCurrentStep(2);
          if (maxAttempts) {
            const calculatedProgress = Math.min(90, Math.round((attempt / maxAttempts) * 90));
            setProgress(calculatedProgress);
          }
        },
      });

      setVideoFrameItems(frameItems);
      setVideoFrames(frameItems.map((frame) => frame.temp_url));
      setRemovedFrames([]);
      setShowVideoFrames(true);
      setVideo(null);
      setVideoFileName(videoName);
      setShowQueueUI(false);
      setShowLoadingUI(false);
      setShowBlackOverlay(false);
      toast.success('Frames extracted! Remove unwanted frames, then click Generate.');
    } catch (err) {
      console.error(err);
      const errMsg =
        err?.response?.data?.message || err.message || 'Failed to extract video frames';
      toast.error(errMsg);
      setShowQueueUI(false);
      setShowLoadingUI(false);
      setShowBlackOverlay(false);
    } finally {
      setIsExtractingFrames(false);
      setIsGenerating(false);
    }
  };

  const handleGenerateFromFrames = async () => {
    if (!aiExtractJobId) {
      throw new Error('Video job id missing');
    }

    const activeFrameCount = videoFrameItems.length - removedFrames.length;
    if (activeFrameCount < 2) {
      throw new Error('Please keep at least 2 frames');
    }

    scrollToModelViewport();
    shouldShowReviewRef.current = true;
    setIsUserOwnedProject(true);
    setProjectType('video_to_3d');
    setCurrentStep(1);

    const newToken = await generateVideoProject(aiExtractJobId, removedFrames, token);

    setProjectToken(newToken);
    setShowVideoFrames(false);
    setVideoFrameItems([]);
    setVideoFrames([]);
    setRemovedFrames([]);
    setIsGenerating(false);
    startGenerationFlow(newToken);
  };

  const startGenerationFlow = (tokenId) => {
    shouldShowReviewRef.current = true;
    setIsUserOwnedProject(true);
    setCurrentStep(1);
    fetchHistory();

    if (activeCreationWorkspaceId) {
      assignProjectToWorkspace(tokenId, activeCreationWorkspaceId).catch((err) => {
        console.error('Failed to assign project to workspace:', err);
        toast.warn('Model created, but could not assign to workspace.');
      });
    }

    setTimeout(() => {
      fetchInitialProject(tokenId);
    }, 2000);
  };

  const handleTransformChange = (type, axis, value) => {
    let numericValue = parseFloat(value) || 0;
    if (type === 'scale') {
      numericValue = Math.max(-5, Math.min(5, numericValue));
    }

    setTransformControls((prev) => {
      const newControls = {
        ...prev,
        [type]: axis
          ? { ...prev[type], [axis]: numericValue }
          : numericValue,
      };

      const index = transformHistoryIndexRef.current;
      const nextHistory = [...transformHistoryRef.current.slice(0, index + 1), newControls];
      transformHistoryRef.current = nextHistory;
      transformHistoryIndexRef.current = nextHistory.length - 1;
      setTransformHistory(nextHistory);
      setTransformHistoryIndex(transformHistoryIndexRef.current);

      return newControls;
    });
  };

  const handleViewportUndo = () => {
    if (transformHistoryIndexRef.current <= 0) return;

    transformHistoryIndexRef.current -= 1;
    const previousState = transformHistoryRef.current[transformHistoryIndexRef.current];
    setTransformControls(previousState);
    setTransformHistoryIndex(transformHistoryIndexRef.current);
  };

  const handleViewportRedo = () => {
    if (transformHistoryIndexRef.current >= transformHistoryRef.current.length - 1) return;

    transformHistoryIndexRef.current += 1;
    const nextState = transformHistoryRef.current[transformHistoryIndexRef.current];
    setTransformControls(nextState);
    setTransformHistoryIndex(transformHistoryIndexRef.current);
  };

  const handleToggleAutoRotate = () => {
    setAutoRotate((prev) => !prev);
  };

  const handleToggleShadows = () => {
    setShadowsEnabled((prev) => !prev);
  };

  const handleToggleGrid = () => {
    setGridVisible((prev) => !prev);
  };

  const handleViewportHelp = () => {
    // Help info shown via tooltip/title — no toast
  };

  const handleViewportScreenshot = () => {
    const canvas = modelViewerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `3d_capture_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleResetTransform = () => {
    setTransformControls(defaultTransformControls);
    const index = transformHistoryIndexRef.current;
    const nextHistory = [...transformHistoryRef.current.slice(0, index + 1), defaultTransformControls];
    transformHistoryRef.current = nextHistory;
    transformHistoryIndexRef.current = nextHistory.length - 1;
    setTransformHistory(nextHistory);
    setTransformHistoryIndex(transformHistoryIndexRef.current);
  };

  const handleSelectViewportTool = (toolName) => {
    setActiveViewportTool(toolName);
    setShowEditorModal(true);
  };

  const handleConfirmOpenEditor = async () => {
    const pid = typeof projectToken === 'object' ? (projectToken?.token || projectToken?.id) : projectToken;

    if (!pid) {
      toast.error('Project ID not found for this model.');
      setShowEditorModal(false);
      return;
    }

    // Pre-open window to prevent browser popup blocker on async call
    const editorWindow = window.open('about:blank', '_blank');

    try {
      setIsOpeningEditor(true);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const payload = {
        pid: pid,
        project_id: pid,
      };

      const response = await axios.post(`${baseURL}/editor/auth/code`, payload, {
        headers,
      });
      const resData = response.data;

      console.log('Editor auth code response:', resData);

      let editorUrl = null;
      if (typeof resData === 'string' && resData.startsWith('http')) {
        editorUrl = resData;
      } else if (resData?.url) {
        editorUrl = resData.url;
      } else if (resData?.editor_url) {
        editorUrl = resData.editor_url;
      } else if (resData?.data?.url) {
        editorUrl = resData.data.url;
      } else if (resData?.data?.editor_url) {
        editorUrl = resData.data.editor_url;
      } else if (resData?.code || resData?.data?.code) {
        const code = resData?.code || resData?.data?.code;
        editorUrl = `https://playground.ai3dscanning.com/editor/?code=${code}&pid=${pid}`;
      }

      if (editorUrl) {
        if (editorWindow) {
          editorWindow.location.href = editorUrl;
        } else {
          window.open(editorUrl, '_blank');
        }
        setShowEditorModal(false);
      } else {
        if (editorWindow) editorWindow.close();
        toast.error('Editor URL not found in response');
      }
    } catch (err) {
      if (editorWindow) editorWindow.close();
      console.error('Failed to get editor auth code:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to open editor');
    } finally {
      setIsOpeningEditor(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success('Prompt copied!');
  };

  const sharePrompt = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Generated Model',
        text: generatedPrompt,
      }).catch(console.error);
    } else {
      copyPrompt();
    }
  };

  const handleShareCurrentProject = () => {
    if (!isUserOwnedProject) return;

    if (!projectToken) {
      toast.error('Project not found');
      return;
    }

    handleHistoryShare({
      id: projectToken,
      token: projectToken,
      name: generatedPrompt || 'My Model',
    });
  };

  const handleExport = async () => {
    if (!isUserOwnedProject) return;

    if (!projectToken) {
      toast.error('Project token not found');
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/project/export/${projectToken}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const { fileName } = detectFileExtensionAndName(
        response,
        generatedPrompt || 'model',
        [modelUrl],
        projectType
      );

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Model exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      let errMsg = 'Failed to export model';
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
      toast.error(errMsg);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="container-fluid pe-md-3 p-0">
        <div className={`row g-0 scan-layout-row${isPublicView ? ' scan-public-view' : ''}`}>
          {!isPublicView && (
          <LeftScan
            prompt={prompt}
            setPrompt={setPrompt}
            images={images}
            setImages={setImages}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            singleImageName={singleImageName}
            setSingleImageName={setSingleImageName}
            singleImageFile={singleImageFile}
            setSingleImageFile={setSingleImageFile}
            video={video}
            setVideo={setVideo}
            isProcessing={isProcessing}
            isViewOnly={isViewOnly}
            isArrowLoading={isArrowLoading}
            handleSingleImageGenerate={handleSingleImageGenerate}
            handleGenerate={handleGenerate}
            isGenerating={isGenerating}
            modelReady={modelReady}
            generatedPrompt={generatedPrompt}
            copyPrompt={copyPrompt}
            sharePrompt={sharePrompt}
            isEnhancing={isEnhancing}
            handleEnhancePrompt={handleEnhancePrompt}
            originalPrompt={originalPrompt}
            showVideoFrames={showVideoFrames}
            setRemovedFrames={setRemovedFrames}
            setShowVideoFrames={setShowVideoFrames}
            setVideoFrames={setVideoFrames}
            setAiExtractJobId={setAiExtractJobId}
            setVideoFrameItems={setVideoFrameItems}
            videoFileName={videoFileName}
            setVideoFileName={setVideoFileName}
            isExtractingFrames={isExtractingFrames}
            onShowComingSoon={(feature) => {
              setComingSoonFeature(feature);
              setComingSoonModalOpen(true);
            }}
            userEmail={user?.email}
          />
          )}

          <CenterScan
            expanded={isPublicView}
            hideContributorBanner={isPublicGuestView}
            showLoadingUI={showLoadingUI}
            showQueueUI={showQueueUI}
            showSuccessUI={showSuccessUI}
            modelReady={modelReady}
            progress={progress}
            setShowLoadingUI={setShowLoadingUI}
            setShowBlackOverlay={setShowBlackOverlay}
            setProgress={setProgress}
            resetAllInputs={resetAllInputs}
            showBlackOverlay={showBlackOverlay}
            modelUrl={modelUrl}
            modelViewerRef={modelViewerRef}
            lottieRef={lottieRef}
            isModelRendering={isModelRendering}
            currentStep={currentStep}
            projectStatus={projectStatus}
            onModelRendered={takeScreenshot}
            transformControls={transformControls}
            sectionRef={modelViewportRef}
            activeViewportTool={activeViewportTool}
            shadowsEnabled={shadowsEnabled}
            gridVisible={gridVisible}
            autoRotate={autoRotate}
            onSelectViewportTool={handleSelectViewportTool}
            onViewportUndo={handleViewportUndo}
            onViewportRedo={handleViewportRedo}
            onToggleAutoRotate={handleToggleAutoRotate}
            onToggleShadows={handleToggleShadows}
            onToggleGrid={handleToggleGrid}
            onViewportHelp={handleViewportHelp}
            onViewportScreenshot={handleViewportScreenshot}
            onResetTransform={handleResetTransform}
            onOpenEditorModal={() => setShowEditorModal(true)}
            showVideoFrames={showVideoFrames}
            videoFrames={videoFrames}
            removedFrames={removedFrames}
            setRemovedFrames={setRemovedFrames}
            videoFileName={videoFileName}
            handleGenerate={handleGenerate}
            isProcessing={isProcessing}
            isViewOnly={isViewOnly}
            isExtractingFrames={isExtractingFrames}
            isGenerating={isGenerating}
            isArrowLoading={isArrowLoading}
            images={images}
            onRemoveImage={(index) => {
              if (isProcessing || isViewOnly) return;
              setImages((prev) => prev.filter((_, i) => i !== index));
              setImageFiles((prev) => prev.filter((_, i) => i !== index));
            }}
          />
          <RightScan
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            historyFilter={historyFilter}
            onHistoryFilterChange={handleHistoryFilterChange}
            historyData={filteredHistoryData}
            historyLoading={historyLoading}
            historyFilterLoading={historyFilterLoading}
            modelReady={modelReady}
            isUserOwnedProject={isUserOwnedProject}
            hideUpgradePromo={isPublicGuestView}
            transformControls={transformControls}
            handleTransformChange={handleTransformChange}
            handleExport={handleExport}
            onShareProject={handleShareCurrentProject}
            onOpenEditor={() => setShowEditorModal(true)}
            onHistoryExport={handleHistoryExport}
            onHistoryFavorite={handleHistoryFavorite}
            onHistoryShare={handleHistoryShare}
            onHistoryOpen={handleHistoryOpen}
            historySearchQuery={historySearchQuery}
            setHistorySearchQuery={setHistorySearchQuery}
            onSelectModel={(url) => {
              shouldShowReviewRef.current = false;
              setIsUserOwnedProject(false);
              setModelUrl(adjustUrlForLocalhost(url));
              setModelReady(true);
              setProjectStatus('completed');
              setShowLoadingUI(false);
              setShowBlackOverlay(false);
              setShowQueueUI(false);
              setActiveTab('transform');
              setIsViewOnly(true);
              setTransformControls(defaultTransformControls);
              setTransformHistory([defaultTransformControls]);
              setTransformHistoryIndex(0);
              transformHistoryRef.current = [defaultTransformControls];
              transformHistoryIndexRef.current = 0;
            }}
            showReviewModal={showReviewModal}
            onCloseReviewModal={() => setShowReviewModal(false)}
            reviewProjectToken={projectToken}
            reviewProjectType={projectType}
          />
        </div>

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
                <div className="form-group mb-3">
                  <label htmlFor="email" className="enter-amount-label mb-2 d-block">
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
                    className="form-control"
                    value={shareEmail}
                    onChange={(e) => {
                      setShareEmail(e.target.value);
                      setSearchPerformed(false);
                      setFoundUsers([]);
                      setSelectedUser(null);
                    }}
                    placeholder="Enter email address"
                    style={{ borderRadius: '8px', fontSize: '14px' }}
                  />

                  <div className="share-coin-user-list mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {searchLoading && (
                      <div className="share-loading py-3 text-center">
                        <div className="spinner-border spinner-border-sm text-pink" role="status"></div>
                        <p className="small mb-0 mt-2">Searching...</p>
                      </div>
                    )}

                    {!searchLoading && foundUsers.length > 0 && (
                      <div className="share-users-container">
                        {foundUsers.map((user) => (
                          <div
                            key={user.id || user.email}
                            className={`share-coin-user-item d-flex align-items-center gap-2 p-2 mb-1 rounded cursor-pointer ${selectedUser?.email === user.email ? 'bg-pink-light' : 'bg-light'
                              }`}
                            onClick={() => setSelectedUser(user)}
                            style={{ border: selectedUser?.email === user.email ? '1px solid #DE3996' : '1px solid transparent' }}
                          >
                            <div className="share-coin-avatar rounded-circle bg-pink text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', minWidth: '32px', fontSize: '12px' }}>
                              {user.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2) || '?'}
                            </div>
                            <div className="share-coin-user-info flex-grow-1 overflow-hidden">
                              <h6 className="mb-0 text-truncate" style={{ fontSize: '13px' }}>{user.name}</h6>
                              <p className="mb-0 text-muted text-truncate" style={{ fontSize: '11px' }}>{user.email}</p>
                            </div>
                            {selectedUser?.email === user.email && (
                              <div className="selected-share-coin-icon text-pink">
                                <FiCheck size={15} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {!searchLoading && searchPerformed && shareEmail && foundUsers.length === 0 && (
                      <div className="share-no-results text-center py-3">
                        <p className="small text-muted mb-0">No users found with this email</p>
                      </div>
                    )}
                  </div>
                </div>

                <PublicShareLinkSection
                  projectId={selectedProjectForShare?.id || selectedProjectForShare?.token}
                  authToken={token}
                />
              </div>

              <div className="d-flex gap-2 align-items-center justify-content-end">
                <button
                  className="btn btn-outline-secondary btn-sm rounded-pill px-4"
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
                  className="btn btn-pink btn-sm rounded-pill px-4"
                  onClick={handleShareProject}
                  disabled={isGenerating || !selectedUser}
                >
                  {isGenerating ? 'Sharing...' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        )}

        {comingSoonModalOpen && (
          <div className="coming-soon-backdrop" onClick={() => setComingSoonModalOpen(false)}>
            <style>{`
              .coming-soon-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(240, 240, 245, 0.45);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: cs-fade-in 0.3s ease-out;
              }

              [data-theme='dark'] .coming-soon-backdrop {
                background: rgba(15, 15, 20, 0.7);
              }

              @keyframes cs-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }

              .coming-soon-card {
                background: linear-gradient(135deg, #ffffff 0%, #f7f5fa 100%);
                border: 1px solid rgba(222, 57, 150, 0.2);
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);
                border-radius: 24px;
                width: 90%;
                max-width: 460px;
                padding: 35px 25px;
                text-align: center;
                position: relative;
                overflow: hidden;
                animation: cs-zoom-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
              }

              [data-theme='dark'] .coming-soon-card {
                background: linear-gradient(135deg, #1b1424 0%, #100b18 100%);
                border: 1px solid rgba(222, 57, 150, 0.3);
                box-shadow: 0 20px 50px rgba(222, 57, 150, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
              }

              @keyframes cs-zoom-in {
                from { transform: scale(0.9) translateY(20px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
              }

              .coming-soon-glow {
                position: absolute;
                top: -50px;
                left: 50%;
                transform: translateX(-50%);
                width: 150px;
                height: 150px;
                background: radial-gradient(circle, rgba(222, 57, 150, 0.2) 0%, transparent 70%);
                filter: blur(20px);
                pointer-events: none;
              }

              [data-theme='dark'] .coming-soon-glow {
                background: radial-gradient(circle, rgba(222, 57, 150, 0.4) 0%, transparent 70%);
              }

              .coming-soon-icon-wrap {
                width: 76px;
                height: 76px;
                background: rgba(222, 57, 150, 0.08);
                border: 1px solid rgba(222, 57, 150, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                color: #DE3996;
                position: relative;
              }

              [data-theme='dark'] .coming-soon-icon-wrap {
                background: rgba(222, 57, 150, 0.1);
                border: 1px solid rgba(222, 57, 150, 0.3);
              }

              .coming-soon-icon-wrap svg {
                animation: cs-float 3s ease-in-out infinite;
              }

              @keyframes cs-float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-6px) rotate(8deg); }
              }

              .coming-soon-title {
                font-family: 'Exo 2', 'Manrope', sans-serif;
                font-size: 22px;
                font-weight: 700;
                color: #1a1625;
                margin-bottom: 12px;
              }

              [data-theme='dark'] .coming-soon-title {
                color: #ffffff;
              }

              .coming-soon-text {
                font-family: 'DM Sans', sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: rgba(26, 22, 37, 0.75);
                margin-bottom: 26px;
                padding: 0 10px;
              }

              [data-theme='dark'] .coming-soon-text {
                color: rgba(255, 255, 255, 0.7);
              }

              .coming-soon-btn {
                background: linear-gradient(90deg, #DE3996 0%, #BA35FF 100%);
                color: #ffffff;
                border: none;
                border-radius: 30px;
                padding: 12px 35px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s ease;
                box-shadow: 0 4px 15px rgba(222, 57, 150, 0.3);
              }

              .coming-soon-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(222, 57, 150, 0.45);
              }

              .coming-soon-btn:active {
                transform: translateY(0);
              }
            `}</style>
            <div className="coming-soon-card" onClick={(e) => e.stopPropagation()}>
              <div className="coming-soon-glow"></div>
              <div className="coming-soon-icon-wrap">
                <Hourglass size={32} />
              </div>
              <h3 className="coming-soon-title">{comingSoonFeature} In Progress</h3>
              <p className="coming-soon-text">
                {comingSoonFeature === 'Video to 3D' 
                  ? 'We are actively developing our advanced Video-to-3D pipeline. You will soon be able to upload short clips and generate high-fidelity, textured 3D models automatically.'
                  : 'Multi-Image 3D reconstruction is currently in the engineering phase. This feature will let you upload multi-angle photos to generate extremely precise 3D assets.'
                }
              </p>
              <button className="coming-soon-btn" onClick={() => setComingSoonModalOpen(false)}>
                Got it
              </button>
            </div>
          </div>
        )}

        <OpenInEditorModal
          isOpen={showEditorModal}
          isLoading={isOpeningEditor}
          onClose={() => {
            if (!isOpeningEditor) setShowEditorModal(false);
          }}
          onConfirm={handleConfirmOpenEditor}
          title="Open in 3D Editor"
          message="Do you want to open this project in the 3D Editor?"
        />
      </div>
      <Outlet />
    </div>
  );
};

export default ModelGenerator;