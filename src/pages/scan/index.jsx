import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPaperclip,
  FiSend,
  FiUploadCloud,
  FiArrowLeft,
  FiArrowRight,
  FiX,
  FiPower,
} from 'react-icons/fi';
import './Scan.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import { FaReact, FaCloudUploadAlt, FaCube, FaSpinner, FaVideo } from 'react-icons/fa';
import { MdCamera } from 'react-icons/md';
import videoGif from '../../assets/images/video.gif';
import darkGif from '../../assets/images/dark.gif';
import scan1 from '../../assets/images/scan1.png';
import promptImg2 from '../../assets/images/prompt-img2.png';
import LoginPopup from '../../components/popup/LoginPopup';
import CustomLoader from '../../components/loader/CustomLoader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MultiScan from '../../assets/images/MultiScan.svg';
import DarkMode from '../../assets/images/DarkMode.svg';
import SingleScan from '../../assets/images/SingleScan.svg';
import DarkMultiScan from '../../assets/images/DarkMultiScan.svg';
import lottie from 'lottie-web';
// import io from 'socket.io-client';
import loaderAnimationData from '../../assets/images/loader.json';
import {
  ArrowBigLeft,
  ArrowRight,
  BackpackIcon,
  CheckCircle2,
  Image,
  ImageIcon,
  ImageUp,
  ListVideo,
  Play,
  Share,
  Sparkles,
  Star,
  Undo,
  Upload,
  Video,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useSocket } from '../../context/SocketContext';

const MIN_SLOTS = 5;
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const CHUNK_SIZE = 20 * 1024 * 1024;

const ScanPage = () => {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isToken, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [failedFiles, setFailedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [fileSizeError, setFileSizeError] = useState('');
  const [showCompletionCard, setShowCompletionCard] = useState(false);
  const [completionMsg, setCompletionMsg] = useState('');
  const [projectToken, setProjectToken] = useState(null);
  const [hideUploadSection, setHideUploadSection] = useState(false);
  const uploadSteps = ['Uploading...', 'Extracting...', 'Analysing...'];
  const [uploadStepIdx, setUploadStepIdx] = useState(0);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [promptError, setPromptError] = useState('');
  const [promptFocused, setPromptFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const textareaRef = useRef(null);
  const [removedFrames, setRemovedFrames] = useState([]);
  const [videoPublicUrl, setVideoPublicUrl] = useState(null);
  const { frame_extraction } = useSocket();
  const { fcmToken } = useNotification();

  const fileInputRef = useRef(null);
  const previewContainerRef = useRef(null);
  const videoPreviewContainerRef = useRef(null);
  const promptBoxRef = useRef(null);
  const navigate = useNavigate();

  const [fileName, setFileName] = useState('');
  const [singleFile, setSingleFile] = useState(null);
  const [singleFileLoading, setSingleFileLoading] = useState(false);
  const [singleFilePreview, setSingleFilePreview] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');

  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoFrames, setVideoFrames] = useState([]);
  const [showVideoFrames, setShowVideoFrames] = useState(false);
  const [videoProjectToken, setVideoProjectToken] = useState(null);
  const [selectedFrames, setSelectedFrames] = useState([]);
  const [showAllFramesModal, setShowAllFramesModal] = useState(false);
  const frameContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCookingLoader, setShowCookingLoader] = useState(false);
  const { notifications } = useNotification();
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const lottieRef = useRef(null);
  // const [frames, setFrames] = useState([]);

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
  }, [loaderAnimationData]);

  const handleClick = async () => {
    if (isEnhancing) return;

    if (originalPrompt && prompt !== originalPrompt) {
      setPrompt(originalPrompt);
      setOriginalPrompt('');
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 600);
      return;
    }

    if (!prompt.trim()) return;

    setIsClicked(true);
    setIsEnhancing(true);
    setOriginalPrompt(prompt);

    try {
      const response = await axios.post(
        `${baseURL}/project/prompt/enchancer`,
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const enhancedText =
        response.data?.['enhanced-text'] ||
        response.data?.data?.['enhanced-text'] ||
        response.data?.enhancedText ||
        response.data?.data?.enhancedText;

      if (enhancedText) {
        setPrompt(enhancedText);
      }
    } catch (err) {
      console.error('Enhancement failed:', err);
      toast.error('Failed to enhance prompt. Please try again.');
      setOriginalPrompt('');
    } finally {
      setIsEnhancing(false);
      setTimeout(() => setIsClicked(false), 600);
    }
  };

  const handleFileChange = (e) => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size <= MAX_FILE_SIZE && file.type.startsWith('image/')) {
        setFileName(file.name);
        setSingleFile(file);
        setSingleFilePreview(URL.createObjectURL(file));
        setFileSizeError('');
      } else if (file.size > MAX_FILE_SIZE) {
        setFileSizeError('File is too large (max 3MB)');
        setSingleFile(null);
        setFileName('');
        setSingleFilePreview(null);
      }
    }
  };
  const handleSingleSubmit = async () => {
    if (!singleFile) return;
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    setSingleFileLoading(true);
    try {
      const projectName = getTimestamp();

      const formData = new FormData();
      formData.append('name', projectName);
      formData.append('file', singleFile, singleFile.name);

      const response = await axios.post(`${baseURL}/project/imageTo3d`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const projectToken = response.data?.token || response.data?.data?.token;

      if (projectToken) {
        window.location.href = `/platform/preview/${projectToken}`;
      } else {
        throw new Error('Project token not returned');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSingleFileLoading(false);
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

  const getPromptIcon = () => {
    return isDarkMode ? promptImg2 : scan1;
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      if (!token) {
        e.preventDefault();
        setShowLoginModal(true);
        return;
      }

      e.preventDefault();
      setIsDragging(false);
      setFileSizeError('');

      const droppedFiles = Array.from(e.dataTransfer.files);

      const imageFiles = [];
      let droppedVideo = null;
      const errorFiles = [];

      droppedFiles.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          errorFiles.push(file.name);
          return;
        }

        if (file.type.startsWith('video/')) {
          droppedVideo = file;
          return;
        }
        if (file.type.startsWith('image/')) {
          imageFiles.push(file);
        }
      });

      if (errorFiles.length > 0) {
        setFileSizeError(`These files are too large (max 3MB): ${errorFiles.join(', ')}`);
      }

      if (imageFiles.length > 0) {
        setFiles((prev) => {
          const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
          const uniqueImages = imageFiles.filter((f) => !existing.has(`${f.name}-${f.size}`));
          return [...prev, ...uniqueImages];
        });
      }

      if (droppedVideo) {
        setVideoFile(droppedVideo);
        setVideoFileName(droppedVideo.name);
        setShowVideoPreview(true);
        setShowVideoFrames(false);
        setVideoFrames([]);
        setSelectedFrames([]);
      }
    },
    [token],
  );

  const handleVideoSelect = (e) => {
    e.stopPropagation();
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    setFileSizeError('');

    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setVideoFileName(file.name);
        setShowVideoFrames(false);
        setVideoFrames([]);
        setSelectedFrames([]);
      } else {
        toast.error('Please upload a valid video file');
      }
    }
  };

  const uploadInChunks = async (file, uploadUrl, objectName) => {
    const chunkSize = 5 * 1024 * 1024; 
    let offset = 0;
    const controller = new AbortController();
    while (offset < file.size) {
      const nextOffset = Math.min(offset + chunkSize, file.size);
      const chunk = file.slice(offset, nextOffset);
      const chunkEnd = nextOffset - 1;

      console.log(`Uploading bytes ${offset}-${chunkEnd}/${file.size}`);

      try {
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Length': chunk.size,
            'Content-Range': `bytes ${offset}-${chunkEnd}/${file.size}`,
          },
          body: chunk,
          signal: controller.signal,
        });

        if (response.status === 308) {
          offset = nextOffset;
        } else if (response.ok || response.status === 200 || response.status === 201) {
          await processVideo(objectName);
          break;
        } else {
          const errText = await response.text();
          console.warn('Unexpected final response:', errText);
          await processVideo(objectName);
          break;
        }
      } catch (err) {
        if (offset + chunk.size >= file.size) {
          console.warn('Final chunk error, likely complete:', err);
          // progressBar.style.width = "100%";
          //statusText.textContent = "Upload complete! Processing video...";
          await processVideo(objectName);
          break;
        } else {
          console.error('Chunk upload error:', err);
          break;
        }
      }
    }
  };

  // async function processVideo(objectName) {
  //   try {
  //     const response = await fetch(`${baseURL}/projects/video`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         publicUrl: objectName,

  //       })
  //     });

  //     const result = await response.json();
  //     console.log(result);
  //     if (result.success) {

  //     }
  //   } catch (err) {
  //     console.error("Processing error:", err);

  //   }
  // }

  const uploadVideo = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(
        `${baseURL}/projects/video/url`,
        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const { publicUrl, token: videoToken } = res.data;

      // if (uploadUrl) {
      //   await uploadInChunks(file, uploadUrl, objectPath);
      // }

      // const processRes = await axios.post(
      //   `${baseURL}/projects/video`,
      //   {
      //     publicUrl: publicUrl,
      //   },
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   },
      // );

      //const videoToken = processRes.data.token;

      return {
        success: true,
        token: videoToken,
        publicUrl: publicUrl,
        message: 'Video uploaded successfully',
      };
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Video upload failed');
      return { success: false };
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
    console.log(data.secure_url);
    return data.secure_url;
  };

  const sendVideo = async (cloudinaryUrl) => {
  try {
    const res = await axios.post(
      `${baseURL}/projects/video/url`,
      {
        publicUrl: cloudinaryUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // socket.emit('register-device', { deviceId:res.data.token });
     setToken(res.data.token)
    return {
      success: true,
      token: res.data.token,
      publicUrl: cloudinaryUrl,
    };
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || 'Backend video processing failed');
    return { success: false };
  }
  };

  useEffect(() => {
    if (videoProjectToken && fcmToken) {
      console.log('Calling frame_extraction now', videoProjectToken);
      frame_extraction(videoProjectToken, fcmToken);
    }
  }, [videoProjectToken, fcmToken, frame_extraction]);

  const fetchFrames = useCallback(
    async (projectToken) => {
      console.log(`Fetching frames for token: ${projectToken}`);

      try {
        const response = await axios.post(
          `${baseURL}/projects/frames`,
          {
            token: projectToken,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.images?.length) {
          const frameUrls = response.data.images.map(img => img.temp_url);
          setVideoFrames(frameUrls);
          setShowVideoFrames(true);
          setShowCookingLoader(false);   
          toast.success('Frames extracted successfully!');
        } else {
          console.warn('No frames in response', response.data);
          toast.error('No frames found in response');
          setShowCookingLoader(false);
        }
      } catch (err) {
        const errorMsg =
          err?.response?.data?.message || err?.message || 'Failed to fetch video frames';
        toast.error(errorMsg);
        setShowCookingLoader(false);
      }
    },
    [token],
  );

  useEffect(() => {
  if (!notifications || !videoProjectToken) return;

  const extractionNotif = notifications.find(
    (notif) => notif?.message?.toLowerCase().includes('extraction')
  );
  console.log("extractionNotif", extractionNotif);

  if (extractionNotif) {
    console.log('Extraction notification found');
    setShowCookingLoader(true);
    fetchFrames(videoProjectToken);
  }
  }, [notifications, videoProjectToken, fetchFrames]);

  const handleVideoSubmit = async () => {
    if (!videoFile) {
      toast.error('Please select a video');
      return;
    }

    setVideoLoading(true);
    setShowCookingLoader(true);
    const cloudinaryUrl = await uploadToCloudinary(videoFile);
    if (!cloudinaryUrl) {
      setVideoLoading(false);
      setShowCookingLoader(false);
      return;
    }

    const result = await sendVideo(cloudinaryUrl);

    if (result.success) {
      setVideoProjectToken(result.token);
      setVideoPublicUrl(result.publicUrl);
    }

    setVideoFile(null);
    setVideoFileName('');
    setVideoLoading(false);
  };

  useEffect(() => {
    if (videoFrames.length > 0) {
      setSelectedFrames(videoFrames.map((_, index) => index));
    }
  }, [videoFrames]);

  const handleGenerateFrames = async () => {
  if (!videoProjectToken) {
    toast.error("Project token missing");
    return;
  }

  try {
    const response = await axios.post(
      `${baseURL}/projects/video/generate`,
      {
        token: videoProjectToken,
        paths: removedFrames, 
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Generate response:", response.data);

    const newToken = response.data.token;
    if (newToken) {
      navigate(`/platform/preview/${newToken}`);
    } else {
      throw new Error("No token returned from generation");
    }
  } catch (err) {
    console.error("Generation error:", err);
    console.error("Error response:", err?.response?.data);

  } finally {
    setIsLoading(false);
    setShowAllFramesModal(false);
  }
};


  const handleFileSelect = (e) => {
    e.stopPropagation();
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    setFileSizeError('');
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    let errorFiles = [];
    selectedFiles.forEach((f) => {
      if (f.size <= MAX_FILE_SIZE && f.type.startsWith('image/')) {
        validFiles.push(f);
      } else if (f.size > MAX_FILE_SIZE) {
        errorFiles.push(f.name);
      }
    });
    if (errorFiles.length > 0) {
      setFileSizeError(`These files are too large (max 3MB): ${errorFiles.join(', ')}`);
    }
    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const openFilePicker = (e) => {
    e.stopPropagation();
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    imageInputRef.current?.click();
  };

  const removeFrame = (index) => {
    setRemovedFrames((prev) => [...prev, index]);
  };

  const revertFrames = (index) => {
    setRemovedFrames((prev) => prev.filter((i) => i !== index));
  };

  const revertFrame = () => {
    setRemovedFrames([]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoFileName('');
  };

  const scrollPreview = (direction) => {
    const container = previewContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollFrames = (direction) => {
    const container = frameContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // const handleFrameSelect = (frameIndex) => {
  //   setSelectedFrames((prev) => {
  //     if (prev.includes(frameIndex)) {
  //       return prev.filter((i) => i !== frameIndex);
  //     } else {
  //       return [...prev, frameIndex];
  //     }
  //   });
  // };

  // const handleGenerateFromFrames = async () => {
  //   if (selectedFrames.length === 0) {
  //     toast.error('Please select at least one frame');
  //     return;
  //   }

  //   if (!videoProjectToken) {
  //     toast.error('Project token not found');
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     navigate(`/platform/preview/${videoProjectToken}`, {
  //       state: { selectedFrames },
  //     });
  //   } catch (err) {
  //     console.error('Failed to generate from frames:', err);
  //     toast.error('Failed to generate 3D model');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setUploadStepIdx((idx) => (idx + 1) % uploadSteps.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (showCompletionCard) {
      const interval = setInterval(() => {
        setUploadStepIdx((idx) => (idx + 1) % uploadSteps.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [showCompletionCard]);

  useEffect(() => {
    if (showLoginModal) {
      setLoginModalVisible(true);
    }
  }, [showLoginModal]);

  const handleCloseLoginModal = () => {
    setLoginModalVisible(false);
    setTimeout(() => setShowLoginModal(false), 250);
  };

  useEffect(() => {
    if (!promptFocused) return;
    function handleClickOutside(e) {
      if (promptBoxRef.current && !promptBoxRef.current.contains(e.target)) {
        setPromptFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [promptFocused]);

  useEffect(() => {
    if (promptFocused && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 220) + 'px';
    }
  }, [prompt, promptFocused]);

  const showSlider = files.length > 0;
  const showVideoPreview = videoFile !== null;
  const slotsToFill = Math.max(0, MIN_SLOTS - files.length);

  useEffect(() => {
    if (files.length > 0) {
      setPromptFocused(false);
    }
  }, [files.length]);

  const getTimestamp = () => Date.now().toString();

  const handleSubmit = async (e) => {
    e.stopPropagation();

    if (videoFile) {
      await handleVideoSubmit();
      return;
    }

    if (files.length < 2) {
      toast.error('Please upload at least 2 images!');
      return;
    }
    setIsLoading(true);
    setProgress(0);
    setUploadErrors([]);
    setSuccessMsg('');
    setFailedFiles([]);
    setShowCompletionCard(false);
    setCompletionMsg('');
    let statusArr = files.map((file) => ({ file, status: 'pending', errorMsg: '' }));
    setUploadStatus(statusArr);
    let createdProjectToken = null;
    try {
      const projectName = getTimestamp();
      const projectRes = await axios.post(
        `${baseURL}/project`,
        { name: projectName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      createdProjectToken = projectRes.data?.token || projectRes.data?.data?.token;
      setProjectToken(createdProjectToken);
      if (!createdProjectToken) throw new Error('Project token not returned');

      let totalSize = files.reduce((sum, f) => sum + f.size, 0);
      let uploadedSize = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('token', createdProjectToken);
        try {
          await axios.post(`${baseURL}/project/file`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const percent = progressEvent.total
                ? ((uploadedSize + progressEvent.loaded) / totalSize) * 100
                : 0;
              setProgress(percent > 100 ? 100 : percent);
            },
          });
          uploadedSize += file.size;
          statusArr[i].status = 'success';
          statusArr[i].errorMsg = '';
        } catch (err) {
          statusArr[i].status = 'failed';
          statusArr[i].errorMsg = err?.response?.data?.message || 'Upload failed';
        }
        setUploadStatus([...statusArr]);
      }
      setProgress(100);
      setFiles((prev) =>
        prev.filter(
          (f) =>
            !statusArr.find(
              (s) => s.file.name === f.name && s.file.size === f.size && s.status === 'success',
            ),
        ),
      );
      setFailedFiles(statusArr.filter((s) => s.status === 'failed').map((s) => s.file));
      setUploadErrors(statusArr.filter((s) => s.status === 'failed').map((s) => s.file.name));
      if (statusArr.every((s) => s.status === 'success')) {
        setSuccessMsg('All images uploaded successfully!');
        setFailedFiles([]);
        try {
          const completeRes = await axios.post(
            `${baseURL}/project/complete`,
            { token: createdProjectToken },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (completeRes.status === 200) {
            window.location.href = `/platform/preview/${createdProjectToken}`;
          }
        } catch (err) {
          window.location.href = `/platform/preview/${createdProjectToken}`;
        }
      } else {
        setSuccessMsg('Some images failed to upload.');
      }
    } catch (err) {
      setUploadErrors(['Somthing went wrong!. Please try Again later']);
      setSuccessMsg('');
      setFailedFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryFailed = async () => {
    if (failedFiles.length === 0) return;
    setIsLoading(true);
    setUploadErrors([]);
    setSuccessMsg('');
    let statusArr = uploadStatus.map((s) =>
      failedFiles.find((f) => f.name === s.file.name && f.size === s.file.size)
        ? { ...s, status: 'pending', errorMsg: '' }
        : s,
    );
    setUploadStatus(statusArr);
    try {
      const projectName = getTimestamp();
      const projectRes = await axios.post(
        `${baseURL}/project`,
        { name: projectName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const projectToken = projectRes.data?.token || projectRes.data?.data?.token;
      if (!projectToken) throw new Error('Project token not returned');
      for (let i = 0; i < failedFiles.length; i++) {
        const file = failedFiles[i];
        const idx = statusArr.findIndex(
          (s) => s.file.name === file.name && s.file.size === file.size,
        );
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('token', projectToken);
        try {
          await axios.post(`${baseURL}/project/file`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          statusArr[idx].status = 'success';
          statusArr[idx].errorMsg = '';
        } catch (err) {
          statusArr[idx].status = 'failed';
          statusArr[idx].errorMsg = err?.response?.data?.message || 'Upload failed';
        }
        setUploadStatus([...statusArr]);
      }
      setFiles((prev) =>
        prev.filter(
          (f) =>
            !statusArr.find(
              (s) => s.file.name === f.name && s.file.size === f.size && s.status === 'success',
            ),
        ),
      );
      setFailedFiles(statusArr.filter((s) => s.status === 'failed').map((s) => s.file));
      setUploadErrors(statusArr.filter((s) => s.status === 'failed').map((s) => s.file.name));
      if (statusArr.every((s) => s.status === 'success')) {
        setSuccessMsg('All failed images uploaded successfully!');
        setFailedFiles([]);
        // navigate('/preview');
      } else {
        setSuccessMsg('Some images still failed to upload.');
      }
    } catch (err) {
      setUploadErrors(['Retry failed']);
      setSuccessMsg('');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    setIsLoading(true);
    setShowComingSoonModal(false);
    setPromptError('');
    try {
      const projectName = getTimestamp();
      const res = await axios.post(
        `${baseURL}/project/prompt`,
        { name: projectName, prompt },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const projectToken =
        res.data?.token || res.data?.data?.token || res.data?.id || res.data?.data?.id;
      if (res.status === 200 && projectToken) {
        navigate(`/platform/preview/${projectToken}`);
      }
    } catch (err) {
      setPromptError(
        err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="upload-container"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        backgroundImage: `url(${isDarkMode ? darkGif : videoGif})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        position: 'relative',
      }}
    >

        {showCookingLoader && !showVideoFrames ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection : 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
            }}
          >
           <div
            style={{
              width: 'clamp(120px, 25vw, 200px)',
              height: 'clamp(120px, 25vw, 200px)',
            }}
            ref={lottieRef}
          ></div>
          <p>We are Extracting your frames😄</p>
          </div>
        ) : (
         <> 
        <section>
          <div className="d-flex flex-column text-center mt-2">
            <h1
              style={{
                color: isDarkMode ? '#fff' : '#000000',
                fontSize: '30px',
                fontWeight: 600,
                margin: 0,
              }}
            >
              Create <span style={{ color: '#DE3996' }}>Your</span> Model
            </h1>
            <p
              style={{
                color: isDarkMode ? '#DADADA' : '#333743',
                fontSize: '20px',
                fontWeight: 400,
                margin: 0,
              }}
            >
              Choose your preferred scanning method
            </p>
          </div>

          <div className="single-scanning-container">
            <img src={isDarkMode ? DarkMode : SingleScan} alt="" width={100} height={100} />
            <div className="d-flex flex-column align-items-center justify-content-center">
              <h2>Transform Photo into 3D Model</h2>
              <p>
                Upload a single image and watch AI transform it into a detailed 3D model in seconds.
              </p>

              <div className="single-scanning-input-field">
                {singleFilePreview ? (
                  <img
                    src={singleFilePreview}
                    alt="preview"
                    width={20}
                    height={20}
                    style={{
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  <ImageUp size={18} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="fileInput"
                  style={{ flex: 1, cursor: 'pointer', color: isDarkMode ? '#fff' : '#000' }}
                >
                  {fileName
                    ? fileName.length > 15
                      ? fileName.slice(0, 15) + '...'
                      : fileName
                    : 'Upload your photo'}
                </label>
                <div
                  style={{
                    background: '#DE3996',
                    color: '#fff',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    padding: '5px',
                    cursor: singleFile && !singleFileLoading ? 'pointer' : 'default',
                    boxShadow: '0 0 2px #00000040',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={singleFile && !singleFileLoading ? handleSingleSubmit : undefined}
                  disabled={!singleFile || singleFileLoading}
                >
                  {singleFileLoading ? (
                    <FaSpinner size={18} className="rotating-icon" style={{ color: '#fff' }} />
                  ) : (
                    <ArrowRight size={18} style={{ color: '#fff' }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={promptBoxRef}
          className={`prompt-box${promptFocused ? ' prompt-expanded' : ''}`}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="row">
            <div className="col-12">
              <div
                className={`d-flex flex-column flex-md-row align-items-stretch align-items-md-center${promptFocused ? ' prompt-expanded-row' : ''}`}
              >
                <div
                  className={`d-flex flex-grow-1 align-items-start mb-2 mb-md-0${promptFocused ? ' prompt-expanded-img' : ''}`}
                >
                  <img
                    src={getPromptIcon()}
                    alt="scan1"
                    className={`prompt-icon${promptFocused ? ' prompt-icon-small' : ''}`}
                  />
                  {promptFocused ? (
                    <>
                      <textarea
                        ref={textareaRef}
                        className="form-control prompt-textarea"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Write prompt to generate"
                        style={{
                          border: 'none',
                          outline: 'none !important',
                          boxShadow: 'none !important',
                          width: '100%',
                          minHeight: '48px',
                          maxHeight: '220px',
                          scrollbarWidth: 'none',
                          overflowY:
                            textareaRef.current && textareaRef.current.scrollHeight > 220
                              ? 'auto'
                              : 'hidden',
                          resize: 'none',
                        }}
                        autoFocus
                      />

                      <span
                        onClick={handleClick}
                        className={`sparkle-wrapper ${isClicked ? 'clicked' : ''}`}
                        style={{
                          background: isDarkMode
                            ? 'linear-gradient(90deg, #661b47, #201734)'
                            : 'linear-gradient(90deg, #febbd1, #d7d1fd)',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isEnhancing ? 'wait' : 'pointer',
                          opacity: !prompt.trim() || isEnhancing ? 0.5 : 1,
                          pointerEvents: !prompt.trim() || isEnhancing ? 'none' : 'auto',
                        }}
                      >
                        <span className="main-sparkle">
                          <Sparkles color="#DE3996" size={18} />
                        </span>
                      </span>
                    </>
                  ) : (
                    <input
                      type="text"
                      className="form-control prompt-input"
                      placeholder="Write prompt to generate"
                      value={prompt}
                      onFocus={() => {
                        if (files.length === 0) setPromptFocused(true);
                      }}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePromptGenerate(e);
                      }}
                    />
                  )}
                </div>
                {promptFocused ? (
                  <div className="prompt-generate-btn-wrap">
                    <button
                      type="button"
                      id="generateBtn"
                      onClick={handlePromptGenerate}
                      disabled={isLoading || !prompt.trim() || isEnhancing}
                    >
                      <svg
                        style={{ marginRight: 5 }}
                        width="17"
                        height="17"
                        viewBox="0 0 22 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.9399 14.3438L17.6825 16.9751L16.7606 16.228L18.4302 14.875H12.1407V13.8125H18.4302L16.7606 12.4595L17.6825 11.7124L20.9399 14.3438ZM14.087 15.9375L15.3982 17H1.65137V0H13.0729L18.6966 4.55713V10.6499L17.3854 9.5874V5.3125H12.1407V1.0625H2.96254V15.9375H14.087ZM13.4519 4.25H16.4532L13.4519 1.81787V4.25Z"
                          fill="white"
                        />
                      </svg>
                      <span style={{ marginTop: 1 }}>
                        {isLoading ? 'Generating...' : isEnhancing ? 'Enhancing...' : 'Generate'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    id="generateBtn"
                    onClick={handlePromptGenerate}
                    disabled={isLoading || !prompt.trim() || isEnhancing}
                  >
                    <svg
                      style={{ marginRight: 5 }}
                      width="17"
                      height="17"
                      viewBox="0 0 22 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.9399 14.3438L17.6825 16.9751L16.7606 16.228L18.4302 14.875H12.1407V13.8125H18.4302L16.7606 12.4595L17.6825 11.7124L20.9399 14.3438ZM14.087 15.9375L15.3982 17H1.65137V0H13.0729L18.6966 4.55713V10.6499L17.3854 9.5874V5.3125H12.1407V1.0625H2.96254V15.9375H14.087ZM13.4519 4.25H16.4532L13.4519 1.81787V4.25Z"
                        fill="white"
                      />
                    </svg>
                    <span style={{ marginTop: 1 }}>
                      {isLoading ? 'Generating...' : isEnhancing ? 'Enhancing...' : 'Generate'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {!hideUploadSection && (
          <section
            className={`drop-area${isDragging ? ' hover' : ''}${promptFocused ? ' img-upload-collapsed' : ''}`}
            id="drop-area"
            aria-label="Drag and drop images or click to browse"
            onDrop={handleDrop}
            style={{ position: 'relative' }}
          >
            {isLoading && files.length > 0 && (
              <div
                className="loading-overlay"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}
              >
                <div className="loader-container">
                  <div className="circular-progress" style={{ '--progress': `${progress}%` }}>
                    <span className="progress-value">{Math.floor(progress)}%</span>
                  </div>
                  <h3 className="loading-title">Exporting</h3>
                  <p
                    className="loading-subtitle"
                    style={{ minHeight: 28, fontWeight: 500, fontSize: 17, color: '#fff' }}
                  >
                    We are working on it, give us a minute
                  </p>
                  <button
                    onClick={() => setIsLoading(false)}
                    className="cancel-btn btn-outline-light mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {fileSizeError && <div style={{ color: 'red', marginBottom: 8 }}>{fileSizeError}</div>}
            <img
              src={isDarkMode ? DarkMultiScan : MultiScan}
              aria-hidden="true"
              className={`upload-cloud-icon${promptFocused ? ' collapsed' : ''}`}
              style={{
                width: promptFocused ? '2px' : '4.375rem',
                height: promptFocused ? '2px' : '4.375rem',
                marginBottom: promptFocused ? 8 : 12,
              }}
            />
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#DE3996' }}>Multi scan</h1>
            <p>
              <strong>
                Upload multiple images, Videos, or CAD files for high-precision 3D reconstruction.
                <br />
                Video Duration Up to 3 mins, Frame Sampling Rotate
              </strong>
              <br />
              <small style={{ fontSize: '14px', lineHeight: 3 }}>Supported formats:</small>
              <br />
              <div className="d-flex gap-2 justify-content-center align-items-center">
                <span
                  style={{
                    color: '#DE3996',
                    background: isDarkMode ? '#DE399636' : '#FFEDF7',
                    fontSize: '11px',
                    padding: '2px 3px',
                    borderRadius: '3px',
                  }}
                >
                  JPG
                </span>
                <span
                  style={{
                    color: '#DE3996',
                    background: isDarkMode ? '#DE399636' : '#FFEDF7',
                    fontSize: '11px',
                    padding: '2px 3px',
                    borderRadius: '3px',
                  }}
                >
                  PNG
                </span>
                <span
                  style={{
                    color: '#DE3996',
                    background: isDarkMode ? '#DE399636' : '#FFEDF7',
                    fontSize: '11px',
                    padding: '2px 3px',
                    borderRadius: '3px',
                  }}
                >
                  MP4
                </span>
                <span
                  style={{
                    color: '#DE3996',
                    background: isDarkMode ? '#DE399636' : '#FFEDF7',
                    fontSize: '11px',
                    padding: '2px 3px',
                    borderRadius: '3px',
                  }}
                >
                  MOV
                </span>
                <span
                  style={{
                    color: '#DE3996',
                    background: isDarkMode ? '#DE399636' : '#FFEDF7',
                    fontSize: '11px',
                    padding: '2px 3px',
                    borderRadius: '3px',
                  }}
                >
                  AVI
                </span>
              </div>
            </p>
            {/* Browse Options */}
            {!showSlider && !showVideoPreview && !showVideoFrames && (
              <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                <div className="d-flex gap-2">
                  <span
                    className="highlight"
                    tabIndex={0}
                    role="button"
                    aria-label="Browse images"
                    onClick={(e) => {
                      e.stopPropagation();
                      imageInputRef.current.click();
                    }}
                  >
                    <Image size={16} />
                    Browse Images
                  </span>

                  {/* Browse Video */}
                  <span
                    className="highlight"
                    tabIndex={0}
                    role="button"
                    aria-label="Browse video"
                    onClick={(e) => {
                      e.stopPropagation();
                      videoInputRef.current.click();
                    }}
                  >
                    <Video size={16} />
                    Browse Video
                  </span>
                </div>
                <small style={{ marginTop: '5px', fontSize: '11px' }}>or drag & drop here</small>
              </div>
            )}

            <input
              type="file"
              ref={imageInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onClick={(e) => e.stopPropagation()}
            />

            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              style={{ display: 'none' }}
              onChange={handleVideoSelect}
              onClick={(e) => e.stopPropagation()}
            />

            {showSlider && (
              <div
                className="image-preview-slider-container"
                aria-live="polite"
                aria-relevant="additions removals"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="slider-arrow"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollPreview('left');
                  }}
                >
                  <FiArrowLeft />
                </button>
                <div className="image-preview-slider" ref={previewContainerRef}>
                  {files.map((file, index) => (
                    <div key={index} className="preview-item">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                      />
                      <button
                        className="remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  {[...Array(slotsToFill)].map((_, i) => (
                    <div
                      key={`dummy-${i}`}
                      className="preview-item dummy"
                      onClick={openFilePicker}
                      style={{ cursor: 'pointer' }}
                    ></div>
                  ))}
                </div>
                <button
                  className="slider-arrow"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollPreview('right');
                  }}
                >
                  <FiArrowRight />
                </button>
              </div>
            )}

            {showVideoPreview && (
              <div
                className="image-preview-slider-container"
                aria-live="polite"
                onClick={(e) => e.stopPropagation()}
                style={{ marginTop: showSlider ? '20px' : '0' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <div className="video-preview-item" style={{ position: 'relative' }}>
                      <video
                        src={URL.createObjectURL(videoFile)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                        // onLoadedData={(e) => URL.revokeObjectURL(e.target.src)}
                        onClick={(e) => {
                          if (e.target.paused) {
                            e.target.play();
                            setIsPlaying(true);
                          } else {
                            e.target.pause();
                            setIsPlaying(false);
                          }
                        }}
                      />

                      {!isPlaying && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.6)',
                            borderRadius: '50%',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                          }}
                        >
                          <Play size={20} color="#fff" />
                        </div>
                      )}

                      <button
                        className="remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVideo();
                        }}
                      >
                        <FiX />
                      </button>

                      <div
                        style={{
                          marginTop: '8px',
                          textAlign: 'center',
                          fontSize: '12px',
                          color: isDarkMode ? '#fff' : '#333',
                        }}
                      >
                        {videoFileName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showVideoFrames && videoFrames.length > 0 && (
              <>
                <div
                  className="image-preview-slider-container"
                  aria-live="polite"
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginTop: '20px' }}
                >
                  <button
                    className="slider-arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollFrames('left');
                    }}
                  >
                    <FiArrowLeft />
                  </button>

                  <div className="image-preview-slider" ref={frameContainerRef}>
                    {videoFrames.map((frame, index) => {
                      const isRemoved = removedFrames.includes(index);

                      return (
                        <div
                          key={index}
                          className="preview-item"
                          style={{
                            position: 'relative',
                            borderRadius: '8px',
                            cursor: 'default',
                            opacity: isRemoved ? 0.5 : 1,
                            transition: 'opacity 0.3s ease',
                          }}
                        >
                          <img
                            src={frame}
                            alt={`Frame ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              filter: isRemoved ? 'grayscale(1)' : 'none',
                            }}
                          />

                          {isRemoved ? (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                revertFrames(index);
                              }}
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: '#4CAF50',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              }}
                            >
                              <Undo size={14} />
                            </div>
                          ) : (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFrame(index);
                              }}
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: '#DE3996',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              }}
                            >
                              <FiX size={14} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    className="slider-arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollFrames('right');
                    }}
                  >
                    <FiArrowRight />
                  </button>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    onClick={() => setShowAllFramesModal(true)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'transparent',
                      color: '#DE3996',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: 'none',
                      textDecoration: 'underline',
                      outline: 'none',
                    }}
                  >
                    See All
                  </span>
                </div>
              </>
            )}

            {showAllFramesModal && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000,
                  padding: '20px',
                }}
                onClick={() => setShowAllFramesModal(false)}
              >
                <div
                  style={{
                    background: isDarkMode ? '#272727' : '#fff',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '80%',
                    height: '100%',
                    maxHeight: '90%',
                    overflowY: 'auto',
                    padding: '20px',
                    position: 'relative',
                    scrollbarWidth: 'none',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <h2
                      style={{
                        fontSize: '2rem',
                        color: '#DE3996',
                        textAlign: 'center',
                        fontWeight: 800,
                      }}
                    >
                      Create Stunning 3D Scenes
                    </h2>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        margin: 0,
                        color: isDarkMode ? '#fff' : '#000',
                        textAlign: 'center',
                        fontWeight: 400,
                      }}
                    >
                      Prepare your visuals for advanced video generation and more!
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAllFramesModal(false)}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '15px',
                      background: '#DE3996',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      color: '#fff',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    aria-label="Close"
                  >
                    <FiX size={16} />
                  </button>

                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}
                  >
                    {videoFrames.map((frame, index) => {
                      const isRemoved = removedFrames.includes(index);

                      return (
                        <div
                          key={index}
                          style={{
                            position: 'relative',
                            width: '220px',
                            height: '150px',
                            overflow: 'hidden',
                            borderRadius: '10px',
                            background: '#000',
                            border: '1.5px solid #fff',
                            display: isRemoved ? 'none' : 'block',
                          }}
                        >
                          <img
                            src={frame}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />

                          <div
                            onClick={() => removeFrame(index)}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: '#DE3996',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              cursor: 'pointer',
                            }}
                          >
                            <FiX />
                          </div>

                          <div
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              left: '8px',
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                            }}
                          >
                            {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      width: '100%',
                      marginTop: '40px',
                      display: 'flex',
                      justifyContent: 'end',
                      gap: '1rem',
                    }}
                  >
                    <button
                      onClick={revertFrame}
                      style={{
                        background: '#555',
                        border: 'none',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        width: 'auto',
                        transition: 'background-color 0.3s ease',
                        userSelect: 'none',
                        marginLeft: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Revert
                    </button>

                    <button
                      onClick={handleGenerateFrames}
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        backgroundColor: '#DE3996',
                        border: 'none',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        width: 'auto',
                        transition: 'background-color 0.3s ease',
                        userSelect: 'none',
                        marginLeft: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              id="generateBtn1"
              style={{
                display:
                  showSlider ||
                  showVideoPreview ||
                  (showVideoFrames && videoFrames.length - removedFrames.length >= 2)
                    ? 'inline-flex'
                    : 'none',
                marginTop: showVideoFrames ? '20px' : '0',
                opacity: showVideoFrames && videoFrames.length - removedFrames.length < 2 ? 0.5 : 1,
                cursor:
                  showVideoFrames && videoFrames.length - removedFrames.length < 2
                    ? 'not-allowed'
                    : 'pointer',
              }}
              onClick={showVideoFrames ? handleGenerateFrames : handleSubmit}
              disabled={
                isLoading ||
                videoLoading ||
                (showVideoFrames && videoFrames.length - removedFrames.length < 2)
              }
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 22 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.9399 14.3438L17.6825 16.9751L16.7606 16.228L18.4302 14.875H12.1407V13.8125H18.4302L16.7606 12.4595L17.6825 11.7124L20.9399 14.3438ZM14.087 15.9375L15.3982 17H1.65137V0H13.0729L18.6966 4.55713V10.6499L17.3854 9.5874V5.3125H12.1407V1.0625H2.96254V15.9375H14.087ZM13.4519 4.25H16.4532L13.4519 1.81787V4.25Z"
                  fill="white"
                />
              </svg>
              <span style={{ marginTop: 1 }}>
                {isLoading || videoLoading ? 'Generating...' : 'Generate'}
              </span>
            </button>

            {uploadErrors.length > 0 && (
              <div className="upload-error-slider">
                {uploadErrors.map((err, idx) => (
                  <div key={idx} className="upload-error-item">
                    {err}
                  </div>
                ))}
              </div>
            )}

            {successMsg && <div className="upload-success-msg">{successMsg}</div>}
          </section>
        )}
        </>
        )}


      {showCompletionCard && (
        <div
          style={{
            margin: '32px auto',
            maxWidth: 420,
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(34,34,59,0.13)',
            padding: 48,
            textAlign: 'center',
            border: '2px solid',
            borderImage: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%) 1',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <FaCube
              style={{ fontSize: 54, color: '#6a82fb', filter: 'drop-shadow(0 2px 8px #fc5c7d33)' }}
              className="react-spin"
            />
          </div>
          <h2 style={{ color: '#222', marginBottom: 12, fontWeight: 700, fontSize: 30 }}>
            Request Under Process
          </h2>
          <div
            style={{
              color: '#555',
              fontSize: 19,
              marginBottom: 16,
              minHeight: 28,
              fontWeight: 500,
            }}
          >
            Analysing...
          </div>
          <div style={{ color: '#888', fontSize: 16 }}>
            Your request is under process. As soon as your 3D model is ready, you will be notified.
            <br />
            You can close this page. We will notify you as soon as your 3D model is ready!
          </div>
        </div>
      )}

      {showComingSoonModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(34,34,59,0.18)',
            zIndex: 3005,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 8px 32px rgba(222,57,150,0.10)',
              padding: 48,
              textAlign: 'center',
              border: '2px solid #DE3996',
              maxWidth: 400,
            }}
          >
            <FaReact
              style={{
                fontSize: 54,
                color: '#DE3996',
                marginBottom: 18,
                animation: 'spin 1.2s linear infinite',
              }}
            />
            <h2 style={{ fontWeight: 700, marginBottom: 12, color: '#222' }}>Coming Soon</h2>
            <div style={{ color: '#555', fontSize: 17, marginBottom: 8 }}>
              Prompt-based generation feature is launching soon. Stay tuned!
            </div>
            <button
              className="btn btn-create"
              style={{ marginTop: 18 }}
              onClick={() => setShowComingSoonModal(false)}
            >
              OK
            </button>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}

      {showLoginModal && <LoginPopup onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default ScanPage;
