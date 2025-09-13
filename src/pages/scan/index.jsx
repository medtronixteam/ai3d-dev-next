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
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import { FaReact, FaCloudUploadAlt, FaCube } from 'react-icons/fa';
import { MdCamera } from 'react-icons/md';
import videoGif from '../../assets/images/video.gif';
import darkGif from '../../assets/images/dark.gif';
import scan1 from '../../assets/images/scan1.png';
import promptImg2 from '../../assets/images/prompt-img2.png';
import LoginPopup from '../../components/popup/LoginPopup';
import CustomLoader from '../../components/loader/CustomLoader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MIN_SLOTS = 5;
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const ScanPage = () => {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
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

  const fileInputRef = useRef(null);
  const previewContainerRef = useRef(null);
  const promptBoxRef = useRef(null);
  const navigate = useNavigate();

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // Get the appropriate prompt icon based on theme
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
      const validFiles = [];
      let errorFiles = [];
      droppedFiles.forEach((f) => {
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
    },
    [token],
  );

  const handleFileSelect = (e) => {
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

  const openFilePicker = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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

  // Show modal with animation
  useEffect(() => {
    if (showLoginModal) {
      setLoginModalVisible(true);
    }
  }, [showLoginModal]);

  const handleCloseLoginModal = () => {
    setLoginModalVisible(false);
    setTimeout(() => setShowLoginModal(false), 250); // match animation duration
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

  // Auto-expand textarea height
  useEffect(() => {
    if (promptFocused && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 220) + 'px';
    }
  }, [prompt, promptFocused]);

  const showSlider = files.length > 0;
  const slotsToFill = Math.max(0, MIN_SLOTS - files.length);

  // Keep prompt collapsed while images exist; auto-collapse on upload
  useEffect(() => {
    if (files.length > 0) {
      setPromptFocused(false);
    }
  }, [files.length]);

  // Helper to get current timestamp in ms
  const getTimestamp = () => Date.now().toString();

  // Main handler for submit
  const handleSubmit = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    setProgress(0); // Reset progress
    setUploadErrors([]);
    setSuccessMsg('');
    setFailedFiles([]);
    setShowCompletionCard(false);
    setCompletionMsg('');
    // Initialize uploadStatus
    let statusArr = files.map((file) => ({ file, status: 'pending', errorMsg: '' }));
    setUploadStatus(statusArr);
    let createdProjectToken = null;
    try {
      // 1. Create project
      const projectName = getTimestamp();
      const projectRes = await axios.post(
        `${baseURL}/project`,
        { name: projectName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      createdProjectToken = projectRes.data?.token || projectRes.data?.data?.token;
      setProjectToken(createdProjectToken);
      if (!createdProjectToken) throw new Error('Project token not returned');

      // 2. Upload files one by one
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
              // Calculate total progress across all files
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
      setProgress(100); // Ensure progress is 100% at the end
      // Remove success files from state
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
        // Call project complete API (POST to /project/complete, token in body)
        try {
          const completeRes = await axios.post(
            `${baseURL}/project/complete`,
            { token: createdProjectToken },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (completeRes.status === 200) {
            // Instead of showing completion card, go to preview page with full refresh
            window.location.href = `/platform/preview/${createdProjectToken}`;
          }
        } catch (err) {
          // If error, still go to preview (or handle as needed)
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

  // Retry handler for failed uploads
  const handleRetryFailed = async () => {
    if (failedFiles.length === 0) return;
    setIsLoading(true);
    setUploadErrors([]);
    setSuccessMsg('');
    // Prepare statusArr for retry
    let statusArr = uploadStatus.map((s) =>
      failedFiles.find((f) => f.name === s.file.name && f.size === s.file.size)
        ? { ...s, status: 'pending', errorMsg: '' }
        : s,
    );
    setUploadStatus(statusArr);
    try {
      // Re-create project for retry (or use last token if you want)
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

  // Handler for prompt 'Generate' button
  const handlePromptGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    setIsLoading(true);
    setShowComingSoonModal(false); // Close any modal if open
    setPromptError('');
    try {
      const projectName = getTimestamp();
      const res = await axios.post(
        `${baseURL}/project/prompt`,
        { name: projectName, prompt },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Assuming the response contains a token or id for the new project
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
      {/* subtle overlay to improve contrast over the GIF (light and dark) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: isDarkMode
            ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.78) 82%, #000 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.75) 60%, #fff 100%)',
        }}
      />
      <section
        ref={promptBoxRef}
        className={`prompt-box${promptFocused ? ' prompt-expanded' : ''}`}
        aria-labelledby="promptLabel"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="row">
          <div className="col-12">
            <div
              className={`d-flex flex-column flex-md-row align-items-stretch align-items-md-center${promptFocused ? ' prompt-expanded-row' : ''}`}
            >
              <div
                className={`d-flex flex-grow-1 align-items-center mb-2 mb-md-0${promptFocused ? ' prompt-expanded-img' : ''}`}
              >
                <img
                  src={getPromptIcon()}
                  alt="scan1"
                  className={`prompt-icon${promptFocused ? ' prompt-icon-small' : ''}`}
                />
                {/* Prompt input/textarea */}
                {promptFocused ? (
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
                      overflowY:
                        textareaRef.current && textareaRef.current.scrollHeight > 220
                          ? 'auto'
                          : 'hidden',
                      resize: 'none',
                    }}
                    onBlur={() => {}}
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control prompt-input"
                    placeholder="Write prompt to generate"
                    aria-label="Prompt input"
                    id="promptInput"
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
              {/* {promptError && (
          <div style={{ color: '#e6339a', background: '#fff0f6', border: '1px solid #e6339a33', borderRadius: 6, padding: '8px 14px', marginTop: 8, fontWeight: 500, fontSize: 15 }}>
            {promptError}
          </div>
        )} */}
              {promptFocused ? (
                <div className="prompt-generate-btn-wrap">
                  <button
                    type="button"
                    id="generateBtn"
                    aria-label="Generate prompt"
                    onClick={handlePromptGenerate}
                    disabled={isLoading || !prompt.trim()}
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
                    <span style={{ marginTop: 1 }}>Generate</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id="generateBtn"
                  aria-label="Generate prompt"
                  onClick={handlePromptGenerate}
                  disabled={isLoading || !prompt.trim()}
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
                  <span style={{ marginTop: 1 }}>Generate</span>
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
          onClick={openFilePicker}
          onDrop={handleDrop}
          style={{ cursor: 'pointer', position: 'relative' }}
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
          <FiUploadCloud
            aria-hidden="true"
            className={`upload-cloud-icon${promptFocused ? ' collapsed' : ''}`}
            style={{
              width: promptFocused ? '28px' : '4.375rem',
              height: promptFocused ? '28px' : '4.375rem',
              marginBottom: promptFocused ? 8 : 12,
            }}
          />
          <p>
            <strong>
              Drag &amp; Drop or Click to{' '}
              <span className="highlight" tabIndex={0} role="button" aria-label="Browse files">
                Browse
              </span>
              <br />
              Images, video, CAD, blueprint or sketch
            </strong>
            <br />
            <small>Supported formats: JPG, PNG, MP4, MOV, AVI</small>
            <br />
            <small>Video Duration Up to 3 mins, Frame Sampling, Rotate</small>
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
          />

          {showSlider && (
            <div
              className="image-preview-slider-container"
              aria-live="polite"
              aria-relevant="additions removals"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="slider-arrow" onClick={() => scrollPreview('left')}>
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
                    <button className="remove" onClick={() => removeFile(index)}>
                      <FiX />
                    </button>
                  </div>
                ))}
                {[...Array(slotsToFill)].map((_, i) => (
                  <div key={`dummy-${i}`} className="preview-item dummy" />
                ))}
              </div>
              <button className="slider-arrow" onClick={() => scrollPreview('right')}>
                <FiArrowRight />
              </button>
            </div>
          )}

          <button
            type="submit"
            id="generateBtn1"
            style={{ display: showSlider ? 'inline-flex' : 'none' }}
            onClick={handleSubmit}
            disabled={files.length === 0 || isLoading}
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
            <span style={{ marginTop: 1 }}>Generate</span>
          </button>
          {/* Show upload errors as slider above upload section */}
          {uploadErrors.length > 0 && (
            <div className="upload-error-slider">
              {uploadErrors.map((err, idx) => (
                <div key={idx} className="upload-error-item">
                  {err}
                </div>
              ))}
            </div>
          )}
          {/* Show success message */}
          {successMsg && <div className="upload-success-msg">{successMsg}</div>}
        </section>
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
