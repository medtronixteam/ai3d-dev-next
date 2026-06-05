import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import { FiShare2, FiDownload, FiExternalLink, FiCheck } from 'react-icons/fi';
import { FaRegLightbulb, FaCube, FaClock, FaCog, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import './Preview.css';
import CustomLoader from '../../components/loader/CustomLoader';
import videoGif from '../../assets/images/video.gif';
import darkGif from '../../assets/images/dark.gif';
import exporticon from '../../assets/images/export-icon.svg';
// import io from 'socket.io-client';
import { useRouteLeave } from '../../hooks/useRouteLeave';
import lottie from 'lottie-web';
import loaderAnimationData from '../../assets/images/project_loader.json';
import { toast } from 'react-toastify';
import { useSocket } from '../../context/SocketContext';

// Stepper Component
const Stepper = ({ currentStep, status }) => {
  const steps = [
    { id: 1, label: 'Submited', icon: <FiCheck size={16} /> },
    { id: 2, label: 'In Queue', icon: <FaClock size={16} /> },
    {
      id: 3,
      label: status === 'completed' ? 'Processed' : 'Processing',
      icon: <FaCog size={16} />,
    },
    {
      id: 4,
      label: status === 'completed' ? 'Completed' : 'Result',
      icon: <FaCube size={16} />,
    },
  ];

  return (
    <div className="stepper-container mt-5" style={{ textAlign: 'center' }}>
      <div
        className="stepper-steps"
        style={{ display: 'flex', justifyContent: 'center', gap: '10px', position: 'relative' }}
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`step ${step.id <= currentStep ? 'active' : 'inactive'}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                className={`step-circle ${step.id === currentStep ? 'current' : ''}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: step.id <= currentStep ? '#fff' : '#838383ff',
                  background:
                    step.id <= currentStep
                      ? 'linear-gradient(135deg, #DE3996, #6a82fb)'
                      : '#fffefe80',
                  border: step.id === currentStep ? '2px solid #DE3996' : 'none',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow:
                    'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                {step.id <= currentStep ? (
                  step.id === 3 ? (
                    status === 'completed' ? (
                      <FaCheckCircle size={16} color="#fff" />
                    ) : (
                      <FaSpinner
                        size={16}
                        style={{
                          animation: 'spin 1.2s linear infinite',
                          color: '#fff',
                        }}
                      />
                    )
                  ) : (
                    step.icon
                  )
                ) : (
                  step.id
                )}
              </div>
              <div
                className="step-label"
                style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: step.id <= currentStep ? '#333' : '#aaa',
                  fontWeight: step.id === currentStep ? 'bold' : 'normal',
                }}
              >
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className="step-connector"
                style={{
                  flex: 1,
                  height: '2px',
                  background:
                    step.id < currentStep
                      ? 'linear-gradient(90deg, #DE3996, #6a82fb)'
                      : '#ffffffb0',
                  alignSelf: 'center',
                  margin: '0 5px',
                  position: 'relative',
                  zIndex: 0,
                }}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const AnimatedText = ({ text, className = '' }) => (
  <span className={`animated-text ${className}`.trim()}>
    {text.split('').map((char, i) => (
      <span key={i} style={{ animationDelay: `${i * 0.04}s` }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))}
  </span>
);

const DUMMY_EXPORT_URL = 'https://ai3dscanning.com/download/your-model.glb';

const ExportModal = ({ open, onClose, url }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  if (!open) return null;
  return (
    <div className="export-modal-overlay">
      <div className="export-modal">
        <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">
          &#10005;
        </button>
        <h2>Download Link</h2>
        <div className="export-url-row">
          <input className="export-url-input" value={url} readOnly />
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// Helper function to map status to step number
const getStepFromStatus = (status) => {
  const statusMap = {
    submitted: 1,
    pending: 2,
    in_queue: 2,
    processing: 3,
    completed: 4,
    canceled: 1,
    cancelled: 1,
  };
  return statusMap[status] || 1;
};

const ImagePreview = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [fullResponse, setFullResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [exportOpen, setExportOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [modelUrl, setModelUrl] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [screenshotData, setScreenshotData] = useState(null);
  const [isModelRendering, setIsModelRendering] = useState(true);
  const {
  connected,
  queue_system,
  subscribe,
} = useSocket();

  const socketRef = useRef(null);
  const modelViewerRef = useRef(null);

  const isCancelled = status === 'canceled' || status === 'cancelled';

  const handleRouteLeave = useCallback(() => {
    console.log('[Disconnecting socket due to route change');
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useRouteLeave(status !== 'completed' && !isCancelled, handleRouteLeave);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (status !== 'completed' && !isCancelled) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status]);

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

  const fetchTempModelUrl = async () => {
    try {
      setModelLoading(true);
      console.log(`[Model URL] 📥 Fetching temp model URL for project: ${id}`);

      const apiUrl = `${baseURL}/project/temp/url/${id}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch model URL: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 API Response:', data);

      let urlFromApi =
        data.url || data.temp_url || data.model_url || data.data?.url || data.data?.temp_url;

      if (!urlFromApi) {
        throw new Error('No model URL returned from API');
      }

      console.log('📋 Original URL from API:', urlFromApi);
      urlFromApi = urlFromApi.replace(/\\\//g, '/');

      urlFromApi = urlFromApi.trim();

      const finalUrl = addCacheBuster(urlFromApi);

      setModelUrl(finalUrl);
      console.log('✅ Model URL cleaned and loaded:', finalUrl);
    } catch (err) {
      console.error('❌ Failed to fetch model URL:', err);
      console.error('❌ Error details:', err.message);
      setModelUrl(null);
    } finally {
      setModelLoading(false);
    }
  };

  useEffect(() => {
  const fetchInitialProject = async () => {
    try {
      console.log(`[API] 📥 Fetching initial project data for ID: ${id}`);
      const res = await axios.get(`${baseURL}/project/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fullApiResponse = res.data;
      const proj = fullApiResponse?.data;

      setFullResponse(fullApiResponse);
      setProject(proj);
      setStatus(proj.status);
      setLoading(false);

      const initialStep = getStepFromStatus(proj.status);
      setCurrentStep(initialStep);
      console.log(`Initial status: "${proj.status}" → Step: ${initialStep}`);

      if (proj.status === 'completed') {
        console.log('Project already completed, fetching model URL...');
        await fetchTempModelUrl();
      }

      if (proj.id) {
        queue_system(proj.id, token);
      }
    } catch (err) {
      console.error(`Error fetching initial project:`, err);
      console.error(`Error details:`, err.response?.data);
      setLoading(false);
      setCurrentStep(1);
    }
  };

  fetchInitialProject();
}, [id, token, queue_system]);


  const initSocketConnection = (projectId) => {
    if (!projectId) {
      console.warn('No projectId provided');
      return;
    }

    const deviceId = `${projectId}`;
    console.log(`Initializing connection for project: ${projectId}`);

    const socket = io('https://node.ai3dscanning.com');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`Connected! Socket ID: ${socket.id}`);
      console.log(`[Socket] 📤 Emitting 'register-device' for projectId: ${projectId}`);
      socket.emit('register-device', { deviceId, projectId });
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] 🔌Disconnected. Reason: ${reason}`);
    });

    socket.on('status_update', async (data) => {
      console.log(`[Socket] 📨 Received 'status_update':`, data);
      const newStatus = data.status;

      if (!newStatus) {
        console.warn(`[Socket] ⚠️ Invalid status received:`, data);
        return;
      }

      setStatus(newStatus);
      const newStep = getStepFromStatus(newStatus);
      setCurrentStep(newStep);

      console.log(`[Socket] 🔄 Status updated: "${newStatus}" → Step: ${newStep}`);

      if (newStatus === 'completed') {
        console.log(`[Socket] ✅ Status is "completed" — fetching project details and model URL.`);
        await fetchProjectDetails(projectId);
        await fetchTempModelUrl();
      }
    });

    socket.on('device_replaced', (data) => {
      console.warn(`[Socket] ⚠️ 'device_replaced' event:`, data);
    });

    return () => {
      console.log(`[Socket] 🧹 Disconnecting socket for project: ${projectId}`);
      if (socket) socket.disconnect();
    };
  };

  const fetchProjectDetails = async (projectId) => {
    try {
      console.log(`[API] 📥 Re-fetching project details (status=completed) for ID: ${projectId}`);
      const res = await axios.get(`${baseURL}/project/detail/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('[API] 📦 Re-fetch Raw Response:', res.data);

      const fullApiResponse = res.data;
      const proj = fullApiResponse?.data;

      console.log(`[API] ✅ Full response re-fetched:`, fullApiResponse);
      console.log(`[API] ✅ Project re-fetched:`, proj);

      setFullResponse(fullApiResponse);
      setProject(proj);
    } catch (err) {
      console.error(`[API] ❌ Failed to re-fetch project:`, err);
      console.error(`[API] ❌ Error details:`, err.response?.data);
    }
  };

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

  const handleExport = async (project) => {
    if (!project?.id) {
      toast.error('Project ID not found');
      return;
    }
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
      toast.error('Failed to export project. Please try again.', {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  const handleOpenEditor = async (projectId) => {
    if (!projectId) {
      toast.error('Project ID not found');
      return;
    }

    console.log('project:', projectId);
    console.log('URL', `${baseURL}/project/editor/${projectId}`);

    try {
      const res = await axios.get(`${baseURL}/project/editor/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Success response:', res.data);

      const editorUrl =
        res.data?.redirectionTo ||
        res.data?.redirectTo ||
        res.data?.url ||
        res.data?.editor_url ||
        res.data?.data?.url ||
        res.data?.data?.editor_url;

      if (!editorUrl) {
        toast.error('Editor URL not found in response');
        return;
      }
      
      window.location.href = editorUrl;
    } catch (error) {
      console.error('Request failed');
    }
  };

  const takeScreenshot = async () => {
    if (!modelViewerRef.current) {
      console.warn('Model viewer is not ready');
      return;
    }

    try {
      const blob = await modelViewerRef.current.toBlob({ mimeType: 'image/png' });

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        setScreenshotData(base64data);
        setScreenshotTaken(true);

        console.log('✅ Screenshot captured');
        await uploadScreenshot(base64data);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('❌ Screenshot failed:', err);
    }
  };

  const uploadScreenshot = async (base64Image) => {
    try {
      const response = await axios.post(
        `${baseURL}/project/captured/ss`,
        {
          project_id: id,
          caputured_ss: base64Image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('📤 Backend Screenshot Upload Response:', response.data);
    } catch (err) {
      console.error('❌ Screenshot upload failed:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !modelUrl) return;

    const handleLoad = () => {
      console.log('✅ Model loaded');
      setIsModelRendering(false);

      if (!screenshotTaken) {
        takeScreenshot();
      }
    };

    modelViewer.addEventListener('load', handleLoad);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
    };
  }, [modelUrl, screenshotTaken]);

  const lottieRef = useRef(null);
  const lottieRef2 = useRef(null);

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

  useEffect(() => {
    if (lottieRef2.current) {
      const anim = lottie.loadAnimation({
        container: lottieRef2.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: loaderAnimationData,
      });

      return () => anim.destroy();
    }
  }, []);

  const cardGradientBefore = isDarkMode
    ? 'linear-gradient(135deg, #0f1220 0%, #1a1020 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #f3e6f5 100%)';
  const cardGradientAfter = isDarkMode
    ? 'linear-gradient(135deg, #0f1220 0%, #0f1b2e 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e6eaff 100%)';
  const primaryTextColor = isDarkMode ? '#eaeaea' : '#333';
  const promptTextColor = isDarkMode ? '#f1f3f5' : 'black';
  const overlayBackground = isDarkMode ? 'rgba(12,12,18,0.55)' : 'rgba(30,30,40,0.45)';

  const thumbnail = project?.thumbnail || '';

  const getStatusMessage = () => {
    switch (status) {
      case 'submitted':
        return '';
      case 'pending':
      case 'in_queue':
        return '';
      case 'processing':
        return '';
      case 'completed':
        return '';
      case 'canceled':
      case 'cancelled':
        return 'Processing Cancelled';
      default:
        return '';
    }
  };

  return (
    <div
      className="preview-model-container preview-container"
      style={{
        backgroundImage: `url(${isDarkMode ? darkGif : videoGif})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <Stepper currentStep={currentStep} status={status} />

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} url={DUMMY_EXPORT_URL} />

      <div className="preview-header mb-4" style={{ position: 'relative', zIndex: 1 }}>
        {status === 'completed' && (
          <button className="btn-export" onClick={() => handleExport(project)}>
            <img src={exporticon} alt="Export Icon" className="export-icon" /> Export
          </button>
        )}
        {status === 'completed' && (
          <button className="btn-share" onClick={() => handleOpenEditor(project.id)}>
            <FiExternalLink />
            Open with editor
          </button>
        )}
      </div>

      {isCancelled ? (
        <div
          className="image-card before-card mb-2"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            margin: '0 auto',
            padding: '0 2rem',
            height: 'clamp(260px, 60vw, 420px)',
            background: cardGradientBefore,
            flex: 1,
            width: 'fit-content',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              padding: '40px 20px',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                borderRadius: '16px',
                background: isDarkMode ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.08)',
                border: `2px solid #de3996`,
                maxWidth: '500px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="hanger-button">
                <div className="pin"></div>
                <div className="string"></div>
                <div className="board">CANCELLED</div>
              </div>
              <p
                style={{
                  fontSize: 'clamp(14px, 1.8vw, 16px)',
                  marginBottom: '0',
                  color: isDarkMode ? '#aaa' : '#666',
                  marginTop: '1.5rem',
                  lineHeight: 1.6,
                }}
              >
                Your Project has been cancelled!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="preview-content" style={{ position: 'relative', zIndex: 1 }}>
          {loading ? (
            <div className="centered-loader">
              <CustomLoader />
            </div>
          ) : (
            <>
              {project &&
              (project.type === 'image_to_3d' ||
                project.type === 'images_to_3d' ||
                project.type === 'video_to_3d') ? (
                <div className="image-comparison">
                  <div
                    className="image-card before-card"
                    style={{
                      position: 'relative',
                      minHeight: 260,
                      maxHeight: 370,
                      height: 'clamp(260px, 60vw, 420px)',
                      background: cardGradientBefore,
                      flex: 1,
                    }}
                  >
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt="Before"
                        className="fade-in-img"
                        style={{
                          filter: 'none',
                          opacity: 1,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <div className="card-label">
                      <span>Before</span>
                    </div>
                  </div>

                  {/* After Card - 3D Model or Processing */}
                  <div
                    className="image-card after-card"
                    style={{
                      position: 'relative',
                      minHeight: 260,
                      maxHeight: 370,
                      height: 'clamp(260px, 60vw, 420px)',
                      overflow: 'hidden',
                      background: cardGradientAfter,
                      flex: 1,
                    }}
                  >
                    {status !== 'completed' || !modelUrl ? (
                      <>
                        {/* Background blur effect */}
                        {thumbnail && (
                          <img
                            src={thumbnail}
                            alt="After"
                            className="fade-in-img"
                            style={{
                              filter: 'blur(8px)',
                              zIndex: 1,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                            }}
                          />
                        )}
                        {/* Processing overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isDarkMode ? 'rgba(12,12,18,0.7)' : 'rgba(30,30,40,0.6)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 99,
                          }}
                        >
                          <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                            Processing your 3d model
                          </span>
                          <div
                            style={{
                              width: 'clamp(120px, 25vw, 200px)',
                              height: 'clamp(120px, 25vw, 200px)',
                            }}
                            ref={lottieRef}
                          ></div>
                        </div>
                      </>
                    ) : (
                      // Model viewer when completed
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          background: 'transparent',
                        }}
                      >
                        {modelUrl && (
                          <>
                            {isModelRendering && (
                              <div className="loader-overlay">
                                <CustomLoader />
                                <span className="mt-5">Loading your 3D model...</span>
                              </div>
                            )}

                            <model-viewer
                              ref={modelViewerRef}
                              key={modelUrl}
                              src={modelUrl}
                              alt="3D Model"
                              auto-rotate
                              camera-controls
                              ar
                              ar-modes="webxr scene-viewer quick-look"
                              shadow-intensity="1"
                              style={{ width: '100%', height: '100%', background: 'transparent' }}
                            />
                          </>
                        )}
                      </div>
                    )}
                    <div
                      className="card-label"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 120,
                      }}
                    >
                      <span>After</span>
                    </div>
                  </div>
                </div>
              ) : project && (project.type === 'prompt_to_3d' || project.type === 'text_to_3d') ? (
                <div className="image-comparison" style={{ gap: 32 }}>
                  <div
                    className="image-card before-card"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: 260,
                      maxHeight: 370,
                      height: 'clamp(260px, 60vw, 420px)',
                      background: cardGradientBefore,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '20px',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 'clamp(16px, 2vw, 24px)',
                          color: primaryTextColor,
                          marginBottom: 16,
                          textAlign: 'center',
                          lineHeight: 1.4,
                          maxWidth: '90%',
                        }}
                      ></div>
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: '11px',
                          color: promptTextColor,
                          textAlign: 'left',
                          wordWrap: 'break-word',
                          padding: '12px 16px',
                          borderRadius: '8px',
                        }}
                      >
                        {project?.prompt || 'No prompt available'}
                      </div>
                    </div>
                    <div
                      className="card-label"
                      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
                    >
                      <span>Before</span>
                    </div>
                  </div>

                  <div
                    className="image-card after-card"
                    style={{
                      position: 'relative',
                      minHeight: 260,
                      maxHeight: 370,
                      height: 'clamp(260px, 60vw, 420px)',
                      overflow: 'hidden',
                      background: cardGradientAfter,
                      flex: 1,
                    }}
                  >
                    {status !== 'completed' || !modelUrl ? (
                      <>
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1,
                            filter: 'blur(8px) opacity(0.5)',
                          }}
                        >
                          <FaCube
                            style={{ fontSize: 'clamp(90px, 16vw, 180px)', color: '#e63399' }}
                          />
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            // justifyContent: 'center',
                            background: isDarkMode ? 'rgba(12,12,18,0.7)' : 'rgba(30,30,40,0.6)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 99,
                          }}
                        >
                          <span
                            className="mt-md-5 mt-4"
                            style={{ fontSize: '1.2rem', fontWeight: 600 }}
                          >
                            Processing your 3d model
                          </span>
                          <div
                            style={{
                              width: 'clamp(120px, 25vw, 200px)',
                              height: 'clamp(120px, 25vw, 200px)',
                            }}
                            ref={lottieRef}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          background: 'transparent',
                        }}
                      >
                        {modelUrl && (
                          <>
                            {isModelRendering && (
                              <div className="loader-overlay">
                                <CustomLoader />
                                <span className="mt-5">Loading your 3D model...</span>
                              </div>
                            )}

                            <model-viewer
                              ref={modelViewerRef}
                              key={modelUrl}
                              src={modelUrl}
                              alt="3D Model"
                              auto-rotate
                              camera-controls
                              ar
                              ar-modes="webxr scene-viewer quick-look"
                              shadow-intensity="1"
                              style={{ width: '100%', height: '100%', background: 'transparent' }}
                            />
                          </>
                        )}
                      </div>
                    )}
                    <div
                      className="card-label"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 120,
                      }}
                    >
                      <span>After</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
