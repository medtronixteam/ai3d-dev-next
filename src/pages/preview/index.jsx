import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import { FiShare2, FiDownload, FiExternalLink } from 'react-icons/fi';
import { FaRegLightbulb, FaCube } from 'react-icons/fa';
import './Preview.css';
import CustomLoader from '../../components/loader/CustomLoader';
import videoGif from '../../assets/images/video.gif';
import darkGif from '../../assets/images/dark.gif';
import exporticon from '../../assets/images/export-icon.svg';

const AnimatedText = ({ text, className = '' }) => (
  <span className={`animated-text ${className}`.trim()}>
    {text.split('').map((char, i) => (
      <span key={i} style={{ animationDelay: `${i * 0.04}s` }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))}
  </span>
);

const getBeforeText = (loading, status) => {
  if (loading) return 'Preparing your preview...';
  if (status === 'pending')
    return 'We are analysing your images and extracting features. Please wait...';
  return '';
};

const getAfterText = (loading, status) => {
  if (loading) return 'Hang tight! Your 3D model is being prepared.';
  if (status === 'pending') return 'Processing your 3D model. This may take a moment...';
  return '';
};

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

const ImagePreview = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [exportOpen, setExportOpen] = useState(false);
  const intervalRef = useRef();
  // const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Poll project detail API every 5s until completed
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${baseURL}/project/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const proj = res.data?.data;
        setProject(proj);
        setStatus(proj.status);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchProject();
    if (status !== 'completed') {
      intervalRef.current = setInterval(fetchProject, 5000);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [id, token, status]);

  // If status becomes completed, stop polling
  useEffect(() => {
    if (status === 'completed') {
      clearInterval(intervalRef.current);
    }
  }, [status]);

  // Detect theme for light/dark GIF selection (same approach as Scan page)
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

  const thumbnail = project?.thumbnail || '';

  // Theme-aware inline style helpers for dark/light mode
  const cardGradientBefore = isDarkMode
    ? 'linear-gradient(135deg, #0f1220 0%, #1a1020 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #f3e6f5 100%)';
  const cardGradientAfter = isDarkMode
    ? 'linear-gradient(135deg, #0f1220 0%, #0f1b2e 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e6eaff 100%)';
  const primaryTextColor = isDarkMode ? '#eaeaea' : '#333';
  const promptTextColor = isDarkMode ? '#f1f3f5' : 'black';
  const overlayBackground = isDarkMode ? 'rgba(12,12,18,0.55)' : 'rgba(30,30,40,0.45)';

  const handleExport = async () => {
    window.open(`${baseURL}/project/export/${id}`, '_blank');
  };

  return (
    <div
      className="preview-container"
      style={{
        backgroundImage: `url(${isDarkMode ? darkGif : videoGif})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // minHeight: '110vh',
        position: 'relative',
        // height: '100vh',
      }}
    >
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} url={DUMMY_EXPORT_URL} />
      <div className="preview-header" style={{ position: 'relative', zIndex: 1 }}>
        {status === 'completed' && (
          <button className="btn-export" onClick={handleExport}>
            <img src={exporticon} alt="Export Icon" className="export-icon" /> Export
          </button>
        )}
        {status === 'completed' && (
          <button
            className="btn-share"
            // onClick={() => {
            //   // For text_to_3d projects, open the GLB viewer
            //   if (project?.type === 'text_to_3d' || project?.type === 'prompt_to_3d') {
            //     window.open(`/platform/splat-viewer/${id}`, '_blank');
            //   } else {
            //     // For other project types, you can handle differently
            //     window.open(`/platform/splat-viewer/${id}`, '_blank');
            //   }
            // }}
          >
            <FiExternalLink />
            Open with editor
          </button>
        )}
      </div>
      <div className="preview-content" style={{ position: 'relative', zIndex: 1 }}>
        {loading ? (
          <div className="centered-loader">
            <CustomLoader />
          </div>
        ) : (
          <>
            {project && project.type === 'image_to_3d' ? (
              <div className="image-comparison">
                {/* Before card with image */}
                <div className="image-card before-card">
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="Before"
                      className="fade-in-img"
                      style={{ filter: 'none', opacity: 1 }}
                    />
                  )}
                  <div className="card-label">
                    <span>Before</span>
                  </div>
                </div>
                {/* After card with same image and overlay */}
                <div
                  className="image-card after-card"
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="After"
                      className="fade-in-img"
                      style={{ filter: 'blur(0px)', zIndex: 1 }}
                    />
                  )}
                  {/* Overlay for processing */}
                  <div
                    className="processing-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: overlayBackground,
                      backdropFilter: 'blur(6px)',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className='processing-3d-model'
                      // style={{
                      //   fontWeight: 700,
                      //   fontSize: '1.8rem',
                      //   color: '#fff',
                      //   marginBottom: 18,
                      //   textAlign: 'center',
                      //   textShadow: '0 2px 8px #0008',
                      //   letterSpacing: '0.5px',
                      //   // marginTop: window.innerWidth <= 768 ? '-5px' : '-5rem', // 👈 Responsive condition
                      //   lineHeight: 1.2,
                      //   // marginTop : '10px',
                      //   filter: 'drop-shadow(0 2px 8px #0006)',
                      // }}
                    >
                      Processing your 3D model
                    </span>
                    <div style={{ width: 200, height: 200, marginTop: 8 }}>
                      <div className="preview-dot-loader">
                        <div className="preview-dot preview-dot-1"></div>
                        <div className="preview-dot preview-dot-2"></div>
                        <div className="preview-dot preview-dot-3"></div>
                      </div>
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: 'none' }}
                      >
                        <defs>
                          <filter id="preview-goo">
                            <feGaussianBlur
                              result="blur"
                              stdDeviation="10"
                              in="SourceGraphic"
                            ></feGaussianBlur>
                            <feColorMatrix
                              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
                              mode="matrix"
                              in="blur"
                            ></feColorMatrix>
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div
                    className="card-label"
                    style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 3 }}
                  >
                    <span>After</span>
                  </div>
                </div>
              </div>
            ) : project && (project.type === 'prompt_to_3d' || project.type === 'text_to_3d') ? (
              <div className="image-comparison" style={{ gap: 32 }}>
                {/* Before card: show prompt instead of icon and heading */}
                <div
                  className="image-card before-card"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 260,
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
                        fontSize: '1rem',
                        color: promptTextColor,
                        textAlign: 'left',
                        lineHeight: 1.3,
                        maxWidth: '95%',
                        wordWrap: 'break-word',
                        padding: '12px 16px',
                        // background: 'rgba(230, 51, 153, 0.1)',
                        borderRadius: '8px',
                        // border: '1px solid rgba(230, 51, 153, 0.2)'
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
                {/* After card: loader/blur until completed, then clear icon+heading */}
                <div
                  className="image-card after-card"
                  style={{
                    position: 'relative',
                    minHeight: 260,
                    height: 'clamp(260px, 60vw, 420px)',
                    overflow: 'hidden',
                    background: cardGradientAfter,
                    flex: 1,
                  }}
                >
                  {status !== 'completed' ? (
                    <>
                      {/* Blurred icon as background */}
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
                      {/* Heading and loader overlay */}
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
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 'clamp(14px, 2vw, 32px)',
                            color: '#fff',
                            marginBottom: 'clamp(12px, 2vw, 4rem)',
                            textAlign: 'center',
                            textShadow: '0 2px 8px #0008',
                            letterSpacing: '0.5px',
                            lineHeight: 1.2,
                            filter: 'drop-shadow(0 2px 8px #0006)',
                            padding: '0 10px',
                          }}
                        >
                          Processing your 3D model
                        </span>
                        <div
                          style={{
                            width: 'clamp(120px, 25vw, 200px)',
                            height: 'clamp(120px, 25vw, 200px)',
                            marginTop: 8,
                          }}
                        >
                          <div className="preview-dot-loader">
                            <div className="preview-dot preview-dot-1"></div>
                            <div className="preview-dot preview-dot-2"></div>
                            <div className="preview-dot preview-dot-3"></div>
                          </div>
                          <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ display: 'none' }}
                          >
                            <defs>
                              <filter id="preview-goo">
                                <feGaussianBlur
                                  result="blur"
                                  stdDeviation="10"
                                  in="SourceGraphic"
                                ></feGaussianBlur>
                                <feColorMatrix
                                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
                                  mode="matrix"
                                  in="blur"
                                ></feColorMatrix>
                              </filter>
                            </defs>
                          </svg>
                        </div>
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
                      <FaCube
                        style={{
                          fontSize: 'clamp(60px, 10vw, 120px)',
                          color: '#e63399',
                          marginBottom: 18,
                          transition: 'font-size 0.2s',
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 'clamp(18px, 2.5vw, 32px)',
                          color: '#e63399',
                          marginBottom: 0,
                          textAlign: 'center',
                          textShadow: '0 2px 8px #e6339922',
                          letterSpacing: 1,
                        }}
                      >
                        {project?.type === 'prompt_to_3d' ? 'Prompt to 3D' : 'Text to 3D'}
                      </span>
                    </div>
                  )}
                  <div
                    className="card-label"
                    style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 3 }}
                  >
                    <span>After</span>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
