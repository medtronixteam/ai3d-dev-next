import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { useRouteLeave } from '../../hooks/useRouteLeave';
import * as THREE from 'three';
import { FiX, FiCheck } from 'react-icons/fi';
import { Hourglass } from 'lucide-react';

const ModelGenerator = ({ isDarkMode = false }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { queue_system, frame_extraction, clearActiveQueueRegistration } = useSocket();
  const { fcmToken, notifications } = useNotification();

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
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');

  const [projectToken, setProjectToken] = useState(null);
  const [projectStatus, setProjectStatus] = useState('pending');
  const [modelUrl, setModelUrl] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [isModelRendering, setIsModelRendering] = useState(true);
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [screenshotData, setScreenshotData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [videoFileName, setVideoFileName] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoFrames, setVideoFrames] = useState([]);
  const [showVideoFrames, setShowVideoFrames] = useState(false);
  const [videoProjectToken, setVideoProjectToken] = useState(null);
  const [removedFrames, setRemovedFrames] = useState([]);
  const [showCookingLoader, setShowCookingLoader] = useState(false);
  const [isActuallyRendered, setIsActuallyRendered] = useState(false);
  const [comingSoonModalOpen, setComingSoonModalOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const socketRef = useRef(null);

  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
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

      const formattedData = rawData.map(item => {
        const rawImg = item.screenshot || item.thumbnail;
        const imgUrl = getFullImageUrl(rawImg);
        return {
          id: item.token || item.id,
          token: item.token || item.id,
          name: item.name || 'Untitled',
          time: item.created_at ? new Date(item.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Recent',
          type: item.type === 'text_to_3d' ? 'prompt' : (item.type === 'video_to_3d' ? 'video' : 'image'),
          rawType: item.type,
          status: item.status,
          progress: item.progress || 0,
          thumbnail: imgUrl,
          favorite: !!item.favorite,
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
      const response = await axios.get(`${baseURL}/project/export/${project.token}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${project.name || 'model'}.glb`);
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

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token, fetchHistory]);

  const [transformControls, setTransformControls] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  });

  const lottieRef = useRef(null);
  const modelViewerRef = useRef(null);

  const isProcessing = isGenerating || showSuccessUI || showQueueUI || showLoadingUI || isArrowLoading || videoLoading;
  const isCancelled = projectStatus === 'canceled' || projectStatus === 'cancelled';

  // fetch recent projects model
  useEffect(() => {
    if (location.state?.projectId && location.state?.viewMode) {
      const projectId = location.state.projectId;
      console.log('Loading project:', projectId);

      setIsViewOnly(true);
      setProjectToken(projectId);
      fetchInitialProject(projectId);

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  const fetchInitialProject = async (projectId) => {
    try {
      console.log('Fetching project details:', projectId);

      const res = await axios.get(`${baseURL}/project/detail/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const proj = res.data?.data;

      if (!proj) {
        throw new Error('Project not found');
      }

      console.log('Project data:', proj);

      setProjectStatus(proj.status);
      setGeneratedPrompt(proj.prompt || proj.name || 'Project');

      const statusMap = {
        submitted: 1,
        pending: 2,
        in_queue: 2,
        processing: 3,
        completed: 4,
      };
      setCurrentStep(statusMap[proj.status] || 1);

      if (proj.status === 'completed') {
        await fetchModelUrl(projectId);
      } else if (proj.status === 'pending' || proj.status === 'in_queue' || proj.status === 'submitted') {
        setShowQueueUI(true);
        queue_system(projectId, fcmToken);
      } else if (proj.status === 'processing') {
        setShowLoadingUI(true);
        setShowBlackOverlay(true);
        setProgress(0);
        queue_system(projectId, fcmToken);
      }

    } catch (err) {
      console.error('Failed to fetch project:', err);
      toast.error('Failed to load project');
      setShowLoadingUI(false);
      setShowBlackOverlay(false);
    } finally {
      setIsGenerating(false);
      setIsArrowLoading(false);
    }
  };

  const handleRouteLeave = useCallback(() => {
    console.log('[Disconnecting socket due to route change');
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useRouteLeave(isProcessing && !modelReady && !isCancelled, handleRouteLeave);


  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isProcessing && !modelReady && !isCancelled) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isProcessing]);

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
    if (!queueData || !projectToken) return;

    // Use deviceId if projectId is not present
    const qProjectId = queueData.projectId || queueData.deviceId;
    if (qProjectId !== projectToken) return;

    if (queueData.status === 'processing') {
      setShowQueueUI(false);
      setShowLoadingUI(true);
    }

    if (queueData.status === 'completed') {
      setShowQueueUI(false);
      setShowLoadingUI(true);
      setProjectStatus('completed');
      fetchModelUrl(projectToken);
    }

    if (queueData.progress) {
      setProgress(queueData.progress);
    }
  }, [queueData, projectToken]);

  useEffect(() => {
    if (!notifications || !videoProjectToken) return;

    const extractionNotif = notifications.find(
      (notif) => notif?.message?.toLowerCase().includes('extraction')
    );

    if (extractionNotif) {
      setShowCookingLoader(true);
      fetchFrames(videoProjectToken);
    }
  }, [notifications, videoProjectToken]);

  useEffect(() => {
    const handleProjectCompleteNotification = (event) => {
      console.log('Project processing complete notification received:', event.detail);
      if (projectToken) {
        fetchInitialProject(projectToken);
      }
    };

    window.addEventListener('projectProcessingComplete', handleProjectCompleteNotification);
    return () => {
      window.removeEventListener('projectProcessingComplete', handleProjectCompleteNotification);
    };
  }, [projectToken]);

  const resetAllInputs = useCallback(() => {
    setPrompt('');
    setImages([]);
    setImageFiles([]);
    setSingleImageName('');
    setSingleImageFile(null);
    setVideo(null);
    setVideoFrames([]);
    setRemovedFrames([]);
    setShowVideoFrames(false);
    setProjectToken(null);
    setProjectStatus('pending');
    setModelUrl(null);
    setModelReady(false);
    setIsViewOnly(false);
    setCurrentStep(1);
    setScreenshotTaken(false);
    setShowLoadingUI(false);
    setShowBlackOverlay(false);
    setProgress(0);
    setActiveTab('library');
    setIsActuallyRendered(false);
    clearActiveQueueRegistration();
  }, [clearActiveQueueRegistration]);

  useEffect(() => {
    const handleReset = () => {
      console.log('[ScanNewPage] Resetting Scan New page state due to sidebar click.');
      resetAllInputs();
    };

    window.addEventListener('reset-scan-new', handleReset);
    return () => {
      window.removeEventListener('reset-scan-new', handleReset);
    };
  }, [resetAllInputs]);

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

  const fetchModelUrl = async (token_id) => {
    try {
      setModelLoading(true);
      console.log(`Fetching temp model URL for project: ${token_id}`);

      const response = await axios.get(`${baseURL}/project/temp/url/${token_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API Response:', response.data);

      let url = response.data?.url || response.data?.temp_url || response.data?.data?.url;

      if (url) {
        url = url.replace(/\\\//g, '/').trim();
        const finalUrl = adjustUrlForLocalhost(addCacheBuster(url));

        console.log('URL loaded:', finalUrl);



        setModelUrl(finalUrl);
        setProjectStatus('completed');
        setShowLoadingUI(false);
        setShowBlackOverlay(false);
        setModelReady(true);
        setShowQueueUI(false);
        setActiveTab('transform');
        setIsViewOnly(true);
        clearActiveQueueRegistration();
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
        setGeneratedPrompt(singleImageName);
        startGenerationFlow(token_id);
      } else {
        throw new Error('Project token not returned');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Upload failed');
      setIsArrowLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (isProcessing || isViewOnly) return;
    if (!prompt.trim() && images.length === 0 && !video) return;

    try {
      setIsGenerating(true);
      const projectName = Date.now().toString();

      if (prompt.trim() && images.length === 0 && !video) {
        const res = await axios.post(
          `${baseURL}/project/prompt`,
          { name: projectName, prompt },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const token_id = res.data?.token || res.data?.data?.token;
        if (token_id) {
          setProjectToken(token_id);
          setGeneratedPrompt(prompt);
          startGenerationFlow(token_id);
        }
      }
      else if (images.length >= 2) {
        const projectRes = await axios.post(
          `${baseURL}/project`,
          { name: projectName },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const token_id = projectRes.data?.token || projectRes.data?.data?.token;
        if (!token_id) throw new Error('Project token not returned');

        setProjectToken(token_id);

        for (let i = 0; i < imageFiles.length; i++) {
          const formData = new FormData();
          formData.append('file', imageFiles[i], imageFiles[i].name);
          formData.append('token', token_id);

          await axios.post(`${baseURL}/project/file`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        await axios.post(
          `${baseURL}/project/complete`,
          { token: token_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setGeneratedPrompt('Multiple Images');
        startGenerationFlow(token_id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Generation failed');
      setIsGenerating(false);
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

    const data = await response.json();
    return data.secure_url;
  };

  const sendVideo = async (cloudinaryUrl) => {
    try {
      const res = await axios.post(
        `${baseURL}/projects/video/url`,
        { publicUrl: cloudinaryUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        success: true,
        token: res.data.token,
        publicUrl: cloudinaryUrl,
      };
    } catch (err) {
      console.error(err);
      toast.error('Video processing failed');
      return { success: false };
    }
  };

  const handleVideoSubmit = async () => {
    if (!video) {
      toast.error('Please select a video');
      return;
    }

    setVideoLoading(true);
    setShowCookingLoader(true);

    const cloudinaryUrl = await uploadToCloudinary(video);
    if (!cloudinaryUrl) {
      setVideoLoading(false);
      setShowCookingLoader(false);
      return;
    }

    const result = await sendVideo(cloudinaryUrl);

    if (result.success) {
      setVideoProjectToken(result.token);
      if (fcmToken) {
        frame_extraction(result.token, fcmToken);
      }
    }

    setVideo(null);
    setVideoFileName('');
    setVideoLoading(false);
  };

  const fetchFrames = async (projectToken) => {
    try {
      const response = await axios.post(
        `${baseURL}/projects/frames`,
        { token: projectToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.images?.length) {
        const frameUrls = response.data.images.map(img => img.temp_url);
        setVideoFrames(frameUrls);
        setShowVideoFrames(true);
        setShowCookingLoader(false);
        toast.success('Frames extracted successfully!');
      }
    } catch (err) {
      toast.error('Failed to fetch frames');
      setShowCookingLoader(false);
    }
  };

  const handleGenerateFromFrames = async () => {
    if (!videoProjectToken) {
      toast.error('Project token missing');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await axios.post(
        `${baseURL}/projects/video/generate`,
        { token: videoProjectToken, paths: removedFrames },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newToken = response.data.token;
      if (newToken) {
        setProjectToken(newToken);
        setGeneratedPrompt('Video Frames');
        startGenerationFlow(newToken);
      }
    } catch (err) {
      console.error(err);
      toast.error('Frame generation failed');
      setIsGenerating(false);
    }
  };

  const startGenerationFlow = (tokenId) => {
    setCurrentStep(1);
    fetchHistory();

    setTimeout(() => {
      fetchInitialProject(tokenId);
    }, 2000);
  };

  const handleTransformChange = (type, axis, value) => {
    setTransformControls((prev) => ({
      ...prev,
      [type]: axis
        ? { ...prev[type], [axis]: parseFloat(value) || 0 }
        : parseFloat(value) || 0,
    }));
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

  const handleExport = async () => {
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
      link.setAttribute('download', `model_${Date.now()}.glb`);
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
      {showCookingLoader && !showVideoFrames && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: 'clamp(120px, 25vw, 200px)',
              height: 'clamp(120px, 25vw, 200px)',
            }}
            ref={lottieRef}
          ></div>
          <p style={{ color: '#fff', marginTop: '20px' }}>Extracting frames...</p>
        </div>
      )}

      <div className="container-fluid pe-md-3 p-0">
        <div className="row g-0" style={{ height: 'calc(100vh - 80px)' }}>
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
            videoFrames={videoFrames}
            showVideoFrames={showVideoFrames}
            removedFrames={removedFrames}
            setRemovedFrames={setRemovedFrames}
            handleGenerateFromFrames={handleGenerateFromFrames}
            videoFileName={videoFileName}
            setVideoFileName={setVideoFileName}
            videoLoading={videoLoading}
            handleVideoSubmit={handleVideoSubmit}
            onShowComingSoon={(feature) => {
              setComingSoonFeature(feature);
              setComingSoonModalOpen(true);
            }}
          />

          <CenterScan
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
          />
          <RightScan
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            historyFilter={historyFilter}
            setHistoryFilter={setHistoryFilter}
            historyData={filteredHistoryData}
            modelReady={modelReady}
            transformControls={transformControls}
            handleTransformChange={handleTransformChange}
            handleExport={handleExport}
            onHistoryExport={handleHistoryExport}
            onHistoryFavorite={handleHistoryFavorite}
            onHistoryShare={handleHistoryShare}
            historySearchQuery={historySearchQuery}
            setHistorySearchQuery={setHistorySearchQuery}
            onSelectModel={(url) => {
              setModelUrl(adjustUrlForLocalhost(url));
              setModelReady(true);
              setProjectStatus('completed');
              setShowLoadingUI(false);
              setShowBlackOverlay(false);
              setShowQueueUI(false);
              setActiveTab('transform');
              setIsViewOnly(true);
            }}
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
      </div>
    </div>
  );
};

export default ModelGenerator;