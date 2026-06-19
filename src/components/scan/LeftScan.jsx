import React, { useRef } from 'react';
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
} from 'lucide-react';
import SingleScan from '../../assets/images/SingleScan.svg';
import videoIcon from '../../pages/images/video-icon.svg';
import promptIcon from '../../pages/images/promptIcon.svg';
import ImgIcon from '../../pages/images/img-icon.svg';
import Logo from '../../pages/images/logo.png';
import SingleImgIcon from '../../pages/images/icons/single-img.svg';
import WorkspaceSelect from '../workspace/WorkspaceSelect';

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
  isArrowLoading,
  handleSingleImageGenerate,
  handleGenerate,
  isGenerating,
  modelReady,
  generatedPrompt,
  copyPrompt,
  sharePrompt,
  isEnhancing,
  handleEnhancePrompt,
  originalPrompt,
  videoFrames,
  showVideoFrames,
  removedFrames,
  setRemovedFrames,
  handleGenerateFromFrames,
  videoFileName,
  setVideoFileName,
  videoLoading,
  handleVideoSubmit,
  onShowComingSoon,
}) => {
  const singleImageInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const scrollRef = useRef(null);
  // url update
  const handleSingleImageChange = (e) => {
    if (isProcessing || isViewOnly) return;
    const file = e.target.files[0];
    if (file) {
      setSingleImageName(file.name);
      setSingleImageFile(file);
      setImages([]);
      setImageFiles([]);
      setVideo(null);
      setPrompt('');
    }
  };

  const handleMultipleFileChange = (e) => {
    if (isProcessing || isViewOnly) return;
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 15) {
      alert('You can upload maximum 15 images');
      return;
    }

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newPreviews]);
    setImageFiles((prev) => [...prev, ...selectedFiles]);
    setSingleImageName('');
    setSingleImageFile(null);
    setVideo(null);
  };

  const handleVideoChange = (e) => {
    if (isProcessing || isViewOnly) return;
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
      setImages([]);
      setImageFiles([]);
      setSingleImageName('');
      setSingleImageFile(null);
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

  return (
    <div className="col-lg-3 col-md-4 pe-md-3 negative-margin">
      <img src={Logo} alt="logo" className="mb-2 mx-3" style={{ width: '90px' }} />
      <div className="side-column p-3">
        <h5 className="fw-bold mb-2">
          New <span className="text-pink">Model</span>
        </h5>

        {!isViewOnly && <WorkspaceSelect disabled={isProcessing} />}

        {/* TOP BANNER - SINGLE IMAGE UPLOAD */}
        <div
          className={`banner-pink p-3 rounded-4 mb-3 border ${isProcessing || isViewOnly ? 'pe-none opacity-75' : ''
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
          <div className="banner-input rounded-pill d-flex align-items-center">
            <img src={SingleImgIcon} alt="" style={{ height: '18px', width: '18px' }} />
            <input
              type="file"
              hidden
              ref={singleImageInputRef}
              accept="image/*"
              onChange={handleSingleImageChange}
            />
            <input
              type="text"
              placeholder="Upload your photo"
              className="form-control bg-transparent small py-1 ps-2"
              value={singleImageName}
              readOnly
              onClick={() => !(isProcessing || isViewOnly) && singleImageInputRef.current?.click()}
            />
            <button
              className="btn-pink-circle"
              disabled={isProcessing || !singleImageName || isViewOnly}
              onClick={handleSingleImageGenerate}
            >
              {isArrowLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowRight size={14} />
              )}
            </button>
          </div>
        </div>

        {/* PROMPT BOX */}
        {!video && images.length === 0 && !singleImageName && (
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

        {!video && !prompt && !singleImageName && (
          <>
            <label className="fw-bold small mb-2">
              Images <span className="text-muted">({images.length}/15)</span>
            </label>

            {images.length === 0 && (
              <div className="image-upload-zone border-dashed rounded-4 p-3 mb-3 position-relative">
                <div className="text-center mb-3">
                  <p className="mb-0 fw-bold x-small">
                    {video ? video.name : 'Click / Drag & Drop / Paste Video'}
                  </p>
                  <p className="text-muted xx-small mb-0">Supported: .mp4, .mov, .avi</p>
                  <p className="text-muted xx-small">Max: 3 min</p>
                </div>
                <div className="d-flex gap-2 justify-content-between">
                  <div
                    className="upload-box d-flex flex-column align-items-center justify-content-center text-center"
                    onClick={() => !(isProcessing || isViewOnly) && onShowComingSoon('Multiple Image to 3D')}
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
                    onClick={() => !(isProcessing || isViewOnly) && onShowComingSoon('Multiple Image to 3D')}
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
                    onClick={() => !(isProcessing || isViewOnly) && onShowComingSoon('Multiple Image to 3D')}
                    style={{
                      padding: '10px',
                      cursor: isProcessing || isViewOnly ? 'not-allowed' : 'pointer',
                      minHeight: '50px',
                      width: 'calc(33.33% - 8px)',
                      fontSize: '12px',
                    }}
                  >
                    <span className="text-color">
                      +10 <br /> Max
                    </span>
                  </div>
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="image-upload-zone border-dashed rounded-4 p-2 mb-3 position-relative">
                <div className="thumb-scroll-wrapper position-relative">
                  {images.length > 0 && (
                    <button
                      className="scroll-btn left-btn"
                      onClick={scrollLeft}
                      disabled={isProcessing || isViewOnly}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  <div className="thumb-scroll" ref={scrollRef}>
                    {images.map((img, idx) => (
                      <div key={idx} className="thumb-box position-relative">
                        <img src={img} alt="preview" />
                        {!isViewOnly && (
                          <div className="remove-icon" onClick={() => removeImage(idx)}>
                            <X size={10} />
                          </div>
                        )}
                      </div>
                    ))}
                    {images.length < 15 && (
                      <div
                        className="thumb-box add"
                        onClick={() => !(isProcessing || isViewOnly) && onShowComingSoon('Multiple Image to 3D')}
                      >
                        <Plus size={20} />
                      </div>
                    )}
                  </div>
                  {images.length > 0 && (
                    <button
                      className="scroll-btn right-btn"
                      onClick={scrollRight}
                      disabled={isProcessing || isViewOnly}
                    >
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <input
              type="file"
              multiple
              hidden
              ref={imageInputRef}
              accept="image/*,video/*"
              onChange={handleMultipleFileChange}
            />
          </>
        )}

        {/* VIDEO SECTION */}
        {!prompt && images.length === 0 && !singleImageName && (
          <>
            <label className="fw-bold small mb-2">Video</label>
            <div
              className={`video-upload-zone border-dashed rounded-4 p-3 text-center mb-4 cursor-pointer ${isProcessing || isViewOnly ? 'pe-none opacity-50' : ''
                }`}
              onClick={() => !(isProcessing || isViewOnly) && onShowComingSoon('Video to 3D')}
            >
              <img
                src={videoIcon}
                alt="Video"
                className="mb-2"
                style={{ height: '28px', width: '28px' }}
              />
              <p className="mb-0 fw-bold x-small">
                {video ? video.name : 'Click / Drag & Drop / Paste Video'}
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
          </>
        )}

        <button
          className="btn-generate w-100 py-2 shadow-sm fw-bold d-flex align-items-center justify-content-center"
          onClick={() => singleImageName ? handleSingleImageGenerate() : handleGenerate()}
          disabled={isProcessing || isViewOnly}
        >
          {(isGenerating || isArrowLoading) ? (
            <>
              <Loader2 size={16} className="me-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} className="me-2" /> Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LeftScan;