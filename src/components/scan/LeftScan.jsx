import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowRight,
  Sparkles,
  Loader2,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
  Trash2,
  Edit3,
} from 'lucide-react';
import SingleScan from '../../assets/images/SingleScan.svg';
import videoIcon from '../../pages/images/video-icon.svg';
import promptIcon from '../../pages/images/promptIcon.svg';
import ImgIcon from '../../pages/images/img-icon.svg';
import Logo from '../../pages/images/logo.png';
import SingleImgIcon from '../../pages/images/icons/single-img.svg';
import WorkspaceSelect from '../workspace/WorkspaceSelect';
import ImageUploadGuidelinesModal from '../popup/ImageUploadGuidelinesModal';
import ModelDetailsCard from './ModelDetailsCard';
import {
  markImageGuidelinesDismissed,
  shouldShowImageGuidelines,
} from '../popup/imageGuidelinesStorage';

const LeftScan = ({
  prompt,
  setPrompt,
  images,
  setImages,
  imageFiles,
  setImageFiles,
  singleImageName,
  setSingleImageName,
  singleImageFile,
  setSingleImageFile,
  video,
  setVideo,
  isProcessing,
  isViewOnly,
  showQueueUI,
  isArrowLoading,
  handleSingleImageGenerate,
  handleGenerate,
  isGenerating,
  modelReady,
  generatedPrompt,
  projectMeta,
  projectType,
  modelUrl,
  modelThumbnail,
  copyPrompt,
  sharePrompt,
  isEnhancing,
  handleEnhancePrompt,
  originalPrompt,
  showVideoFrames,
  setRemovedFrames,
  setShowVideoFrames,
  setVideoFrames,
  setAiExtractJobId,
  setVideoFrameItems,
  videoFileName,
  setVideoFileName,
  isExtractingFrames,
  onShowComingSoon,
  userEmail,
}) => {
  const singleImageInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const scrollRef = useRef(null);
  const pendingImagePickRef = useRef(false);
  const uploadTimeoutRef = useRef(null);
  const videoUploadTimeoutRef = useRef(null);
  const [singleImagePreview, setSingleImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imageGuidelinesOpen, setImageGuidelinesOpen] = useState(false);
  const [isSingleImageUploading, setIsSingleImageUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  const openSingleImagePicker = () => {
    singleImageInputRef.current?.click();
  };

  const handleSingleImageUploadClick = () => {
    if (isProcessing || isViewOnly) return;
    if (pendingImagePickRef.current) return;
    if (shouldShowImageGuidelines(userEmail)) {
      setImageGuidelinesOpen(true);
      return;
    }
    openSingleImagePicker();
  };

  const handleImageGuidelinesClose = () => {
    pendingImagePickRef.current = false;
    setImageGuidelinesOpen(false);
  };

  const handleImageGuidelinesContinue = () => {
    setImageGuidelinesOpen(false);
    pendingImagePickRef.current = true;
    requestAnimationFrame(() => {
      openSingleImagePicker();
    });
  };

  const handleImageGuidelinesDismissForever = () => {
    markImageGuidelinesDismissed(userEmail);
  };

  useEffect(() => {
    if (!singleImageFile) return;
    pendingImagePickRef.current = false;
    setImageGuidelinesOpen(false);
  }, [singleImageFile]);

  useEffect(() => {
    if (!singleImageFile) {
      setSingleImagePreview(null);
      return undefined;
    }

    const previewUrl = URL.createObjectURL(singleImageFile);
    setSingleImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [singleImageFile]);

  useEffect(() => {
    if (!video) {
      setVideoPreview(null);
      return undefined;
    }

    const previewUrl = URL.createObjectURL(video);
    setVideoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [video]);

  useEffect(() => {
    if (!singleImageFile && singleImageInputRef.current) {
      singleImageInputRef.current.value = '';
    }
  }, [singleImageFile]);

  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
      if (videoUploadTimeoutRef.current) {
        clearTimeout(videoUploadTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!video && videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  }, [video]);

  useEffect(() => {
    if (images.length === 0 && imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }, [images.length]);

  const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'svg'];
  const ALLOWED_ACCEPT = '.png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml';

  const isAllowedImage = (file) => {
    if (!file) return false;
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  };

  // url update
  const handleSingleImageChange = (e) => {
    if (isProcessing || isViewOnly) return;
    pendingImagePickRef.current = false;
    setImageGuidelinesOpen(false);
    const file = e.target.files?.[0];
    if (file) {
      if (!isAllowedImage(file)) {
        toast.error('Only PNG, JPG, JPEG, and SVG images are allowed!');
        e.target.value = '';
        return;
      }

      setIsSingleImageUploading(true);
      if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);

      uploadTimeoutRef.current = setTimeout(() => {
        setSingleImageName(file.name);
        setSingleImageFile(file);
        setImages([]);
        setImageFiles([]);
        setVideo(null);
        setPrompt('');
        setIsSingleImageUploading(false);
      }, 700);
    }
    e.target.value = '';
  };

  const handleCancelSingleImageUpload = (e) => {
    e?.stopPropagation();
    if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
    setIsSingleImageUploading(false);
    if (singleImageInputRef.current) {
      singleImageInputRef.current.value = '';
    }
  };

  const handleRemoveSingleImage = (e) => {
    e?.stopPropagation();
    if (isProcessing || isViewOnly) return;
    if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
    setSingleImageName('');
    setSingleImageFile(null);
    setSingleImagePreview(null);
    setIsSingleImageUploading(false);
    if (singleImageInputRef.current) {
      singleImageInputRef.current.value = '';
    }
  };

  const handleMultipleFileChange = (e) => {
    if (isProcessing || isViewOnly) return;
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) => isAllowedImage(file));

    if (validFiles.length < selectedFiles.length) {
      toast.error('Only PNG, JPG, JPEG, and SVG images are allowed!');
    }

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    if (images.length + validFiles.length > 100) {
      toast.warning('You can upload maximum 100 images');
      e.target.value = '';
      return;
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newPreviews]);
    setImageFiles((prev) => [...prev, ...validFiles]);
    setSingleImageName('');
    setSingleImageFile(null);
    setVideo(null);
    e.target.value = '';
  };

  const handleVideoChange = (e) => {
    if (isProcessing || isViewOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      setShowVideoFrames?.(false);
      setVideoFrames?.([]);
      setVideoFrameItems?.([]);
      setRemovedFrames([]);
      setAiExtractJobId?.(null);
      setImages([]);
      setImageFiles([]);
      setSingleImageName('');
      setSingleImageFile(null);
      setPrompt('');

      setIsVideoUploading(true);
      if (videoUploadTimeoutRef.current) clearTimeout(videoUploadTimeoutRef.current);

      videoUploadTimeoutRef.current = setTimeout(() => {
        setVideo(file);
        setVideoFileName?.(file.name);
        setIsVideoUploading(false);
      }, 700);
    }
    e.target.value = '';
  };

  const handleCancelVideoUpload = (e) => {
    e?.stopPropagation();
    if (videoUploadTimeoutRef.current) clearTimeout(videoUploadTimeoutRef.current);
    setIsVideoUploading(false);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = (e) => {
    e.stopPropagation();
    if (isProcessing || isViewOnly) return;
    if (videoUploadTimeoutRef.current) clearTimeout(videoUploadTimeoutRef.current);
    setVideo(null);
    setVideoFileName?.('');
    setVideoPreview(null);
    setIsVideoUploading(false);
    setShowVideoFrames?.(false);
    setVideoFrames?.([]);
    setVideoFrameItems?.([]);
    setRemovedFrames([]);
    setAiExtractJobId?.(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    if (isProcessing || isViewOnly) return;
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImageFiles(updatedFiles);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const hasSingleImage = Boolean(isSingleImageUploading || singleImageFile || singleImageName);
  const hasPrompt = Boolean(prompt.trim() || (isViewOnly && generatedPrompt) || modelReady);
  const hasMultipleImages = Boolean(images.length > 0);
  const hasVideo = Boolean(isVideoUploading || video || showVideoFrames);

  const showSingleImageBox = hasSingleImage || (!hasPrompt && !hasMultipleImages && !hasVideo);
  const showPromptBox = hasPrompt || (!hasSingleImage && !hasMultipleImages && !hasVideo);
  const showMultipleImagesBox = hasMultipleImages || (!hasSingleImage && !hasPrompt && !hasVideo);
  const showVideoBox = hasVideo || (!hasSingleImage && !hasPrompt && !hasMultipleImages);
  const showModelDetails = modelReady || (isViewOnly && Boolean(generatedPrompt));

  return (
    <div className="col-lg-3 col-md-4 pe-md-3 negative-margin">
      <img src={Logo} alt="logo" className="platform-logo mb-2 mx-3" />
      <div className="side-column p-3">
        {showModelDetails ? (
          <ModelDetailsCard
            projectMeta={projectMeta}
            projectType={projectType}
            generatedPrompt={generatedPrompt}
            modelUrl={modelUrl}
            thumbnail={modelThumbnail}
            onCopy={copyPrompt}
          />
        ) : (
        <>
        <h5 className="fw-bold mb-2">
          New <span className="text-pink">Model</span>
        </h5>

        {!isViewOnly && <WorkspaceSelect disabled={isProcessing} />}

        {/* TOP BANNER - SINGLE IMAGE UPLOAD / PREVIEW / LOADER */}
        {showSingleImageBox && (
          isSingleImageUploading ? (
            <div className="single-image-uploading-box mb-3 rounded-4 p-4 d-flex flex-column align-items-center justify-content-center text-center">
              <div className="single-upload-spinner mb-2">
                <Loader2 size={30} className="animate-spin text-pink" />
              </div>
              <p className="fw-semibold mb-3 single-uploading-text">Uploading ...</p>
              <button
                type="button"
                className="btn-cancel-upload rounded-pill px-4 py-1"
                onClick={handleCancelSingleImageUpload}
              >
                Cancel
              </button>
            </div>
          ) : singleImagePreview && singleImageFile ? (
            <div
              className={`single-image-preview-card mb-3 rounded-4 position-relative overflow-hidden ${
                isProcessing || isViewOnly ? 'pe-none opacity-75' : ''
              }`}
            >
              <img
                src={singleImagePreview}
                alt="Uploaded Preview"
                className="single-image-preview-img"
              />
              {!(isProcessing || isViewOnly) && (
                <button
                  type="button"
                  className="single-image-close-btn"
                  title="Remove photo"
                  onClick={handleRemoveSingleImage}
                  aria-label="Remove photo"
                >
                  <X size={14} />
                </button>
              )}
              {!(isProcessing || isViewOnly) && (
                <div
                  className="single-image-overlay"
                  onClick={handleSingleImageUploadClick}
                >
                  <div className="single-image-reupload-btn d-flex align-items-center gap-1">
                    <span>Re-Upload</span>
                  </div>
                  <div
                    className="single-image-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="single-image-action-btn"
                      title="Re-upload photo"
                      onClick={handleSingleImageUploadClick}
                      aria-label="Re-upload photo"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="single-image-action-btn delete-btn"
                      title="Delete photo"
                      onClick={handleRemoveSingleImage}
                      aria-label="Delete photo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
              <input
                type="file"
                hidden
                ref={singleImageInputRef}
                accept={ALLOWED_ACCEPT}
                onChange={handleSingleImageChange}
              />
            </div>
          ) : (
            <div
              className={`banner-pink p-3 rounded-4 mb-3 border ${
                isProcessing || isViewOnly ? 'pe-none opacity-75' : ''
              }`}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <img src={SingleScan} alt="Scan" width={50} height={50} className="single-scan-icon" />
                <div>
                  <span className="fw-bold small" style={{ color: '#DE3996', fontSize: '13px' }}>
                    Transform Photo into 3D
                  </span>
                  <p className="mb-0" style={{ fontSize: '10px', lineHeight: '1.2' }}>
                    Upload a single image and watch AI transform it into a detailed 3D model.
                  </p>
                </div>
              </div>
              <div
                className="banner-input rounded-pill d-flex align-items-center"
                onClick={handleSingleImageUploadClick}
              >
                <img src={SingleImgIcon} alt="" className="banner-input-icon" />
                <input
                  type="file"
                  hidden
                  ref={singleImageInputRef}
                  accept={ALLOWED_ACCEPT}
                  onChange={handleSingleImageChange}
                />
                <span className="banner-input-label">Upload your photo</span>
                <button
                  type="button"
                  className="btn-pink-circle"
                  disabled={isProcessing || isViewOnly}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSingleImageUploadClick();
                  }}
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )
        )}

        {/* PROMPT BOX */}
        {showPromptBox && (
          <div>
            <label className="fw-bold small mb-2">Prompt</label>
            {modelReady || (isViewOnly && generatedPrompt) ? (
              <div>
                <div
                  className={`prompt-box border rounded-4 p-2 mb-3 d-flex ${isProcessing ? 'bg-light opacity-75' : ''
                    }`}
                >
                  <img src={promptIcon} alt="Prompt" style={{ height: '30px', width: '20px' }} />
                  <div className="flex-grow-1 d-flex flex-column justify-content-between ms-2">
                    <p className="mb-1 text-dark" style={{ fontSize: '12px' }}>{generatedPrompt}</p>
                  </div>
                </div>
                <div className="d-flex gap-2 justify-content-end mb-4">
                  <a className="text-primary cursor-pointer" onClick={copyPrompt}>
                    Copy
                  </a>
                  <a className="text-primary cursor-pointer" onClick={sharePrompt}>
                    Share
                  </a>
                </div>
              </div>
            ) : (
              <div
                className={`prompt-box border rounded-4 p-2 mb-3 d-flex ${isProcessing ? 'bg-light opacity-75' : ''
                  }`}
              >
                <img src={promptIcon} alt="Prompt" style={{ height: '30px', width: '20px' }} />
                <textarea
                  className="form-control border-0 bg-transparent shadow-none small"
                  rows="3"
                  placeholder="Describe the object..."
                  value={prompt}
                  style={{ fontSize: '12px' }}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            )}
          </div>
        )}

        {/* MULTIPLE IMAGES SECTION */}
        {showMultipleImagesBox && (
          <>
            <label className="fw-bold small mb-2">
              Images <span className="text-muted">({images.length}/100)</span>
            </label>
            <div className="image-upload-zone border-dashed rounded-4 p-3 mb-3 position-relative">
              <div className="text-center mb-3">
                <p className="mb-0 fw-bold x-small">
                  {video ? video.name : 'Click / Drag & Drop Multi-angle Images'}
                </p>
                <p className="text-muted xx-small mb-0">Supported: .png, .jpg, .jpeg, .svg</p>
                <p className="text-muted xx-small">Min 10 - Max 100 images</p>
              </div>
              <div className="d-flex gap-2 justify-content-between">
                <div
                  className="upload-box d-flex flex-column align-items-center justify-content-center text-center"
                  onClick={() => !(isProcessing || isViewOnly) && imageInputRef.current?.click()}
                  style={{
                    padding: '10px',
                    cursor: isProcessing || isViewOnly ? 'not-allowed' : 'pointer',
                    minHeight: '50px',
                    width: 'calc(33.33% - 8px)',
                  }}
                >
                  <img src={ImgIcon} alt="upload" width="20" height="20" />
                </div>

                <div
                  className="upload-box d-flex flex-column align-items-center justify-content-center text-center"
                  onClick={() => !(isProcessing || isViewOnly) && imageInputRef.current?.click()}
                  style={{
                    padding: '10px',
                    cursor: isProcessing || isViewOnly ? 'not-allowed' : 'pointer',
                    minHeight: '50px',
                    width: 'calc(33.33% - 8px)',
                  }}
                >
                  <img src={ImgIcon} alt="upload" width="20" height="20" />
                </div>

                <div
                  className="upload-box d-flex flex-column align-items-center justify-content-center text-center"
                  onClick={() => !(isProcessing || isViewOnly) && imageInputRef.current?.click()}
                  style={{
                    padding: '10px',
                    cursor: isProcessing || isViewOnly ? 'not-allowed' : 'pointer',
                    minHeight: '50px',
                    width: 'calc(33.33% - 8px)',
                    fontSize: '12px',
                  }}
                >
                  <span className="text-color">
                    +100 <br /> Max
                  </span>
                </div>
              </div>
            </div>
            <input
              type="file"
              multiple
              hidden
              ref={imageInputRef}
              accept={ALLOWED_ACCEPT}
              onChange={handleMultipleFileChange}
            />
          </>
        )}

        {/* VIDEO SECTION */}
        {showVideoBox && !showVideoFrames && (
          <div>
            <label className="fw-bold small mb-2">Video</label>
            {isVideoUploading ? (
              <div className="single-image-uploading-box mb-4 rounded-4 p-4 d-flex flex-column align-items-center justify-content-center text-center">
                <div className="single-upload-spinner mb-2">
                  <Loader2 size={30} className="animate-spin text-pink" />
                </div>
                <p className="fw-semibold mb-3 single-uploading-text">Uploading ...</p>
                <button
                  type="button"
                  className="btn-cancel-upload rounded-pill px-4 py-1"
                  onClick={handleCancelVideoUpload}
                >
                  Cancel
                </button>
              </div>
            ) : video && videoPreview ? (
              <div
                className={`single-image-preview-card mb-4 rounded-4 position-relative overflow-hidden ${
                  isProcessing || isViewOnly ? 'pe-none opacity-75' : ''
                }`}
              >
                <video
                  src={videoPreview}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="single-image-preview-img"
                  style={{ objectFit: 'cover' }}
                />
                {!(isProcessing || isViewOnly) && (
                  <button
                    type="button"
                    className="single-image-close-btn"
                    title="Remove video"
                    onClick={handleRemoveVideo}
                    aria-label="Remove video"
                  >
                    <X size={14} />
                  </button>
                )}
                {!(isProcessing || isViewOnly) && (
                  <div
                    className="single-image-overlay"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="single-image-reupload-btn d-flex align-items-center gap-1">
                      <span>Re-Upload</span>
                    </div>
                    <div
                      className="single-image-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="single-image-action-btn"
                        title="Re-upload video"
                        onClick={() => videoInputRef.current?.click()}
                        aria-label="Re-upload video"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        className="single-image-action-btn delete-btn"
                        title="Delete video"
                        onClick={handleRemoveVideo}
                        aria-label="Delete video"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  hidden
                  ref={videoInputRef}
                  accept="video/*"
                  onChange={handleVideoChange}
                />
              </div>
            ) : (
              <div
                className={`video-upload-zone border-dashed rounded-4 p-3 text-center mb-4 cursor-pointer position-relative ${
                  isProcessing || isViewOnly ? 'pe-none opacity-50' : ''
                }`}
                onClick={() => !(isProcessing || isViewOnly) && videoInputRef.current?.click()}
              >
                <img
                  src={videoIcon}
                  alt="Video"
                  className="mb-2"
                  style={{ height: '28px', width: '28px' }}
                />
                <p className="mb-0 fw-bold x-small video-upload-filename">
                  Click / Drag & Drop / Paste Video
                </p>
                <p className="text-muted xx-small mb-0">Supported: .mp4, .mov, .avi</p>
                <p className="text-muted xx-small">Max: 3 min</p>
                <input
                  type="file"
                  hidden
                  ref={videoInputRef}
                  accept="video/*"
                  onChange={handleVideoChange}
                />
              </div>
            )}
          </div>
        )}

        {!showVideoFrames && (
        <button
          className="btn-generate w-100 py-2 shadow-sm fw-bold d-flex align-items-center justify-content-center"
          onClick={() => (singleImageName ? handleSingleImageGenerate() : handleGenerate())}
          disabled={
            isProcessing ||
            isViewOnly
          }
        >
          {showQueueUI ? (
            <>
              <Sparkles size={16} className="me-2" /> Generate
            </>
          ) : isExtractingFrames ? (
            <>
              <Loader2 size={16} className="me-2 animate-spin" /> Extracting frames...
            </>
          ) : (isGenerating || isArrowLoading) ? (
            <>
              <Loader2 size={16} className="me-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} className="me-2" /> Generate
            </>
          )}
        </button>
        )}
        </>
        )}
      </div>

      <ImageUploadGuidelinesModal
        isOpen={imageGuidelinesOpen}
        onClose={handleImageGuidelinesClose}
        onContinue={handleImageGuidelinesContinue}
        onDismissForever={handleImageGuidelinesDismissForever}
      />
    </div>
  );
};

export default LeftScan;