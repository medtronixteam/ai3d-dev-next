import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Film, Loader2, Plus, Sparkles, X } from 'lucide-react';

const VideoFramesPanel = ({
  videoFrames,
  removedFrames,
  setRemovedFrames,
  videoFileName,
  handleGenerate,
  isProcessing,
  isViewOnly,
  isExtractingFrames,
  isGenerating,
  isArrowLoading,
  variant = 'center',
}) => {
  const frameScrollRef = useRef(null);

  const scrollFrames = (direction) => {
    if (!frameScrollRef.current) return;
    const scrollAmount = frameScrollRef.current.offsetWidth * 0.7;
    frameScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const removeFrame = (index) => {
    if (isProcessing || isViewOnly) return;
    setRemovedFrames((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const revertFrame = (index) => {
    if (isProcessing || isViewOnly) return;
    setRemovedFrames((prev) => prev.filter((i) => i !== index));
  };

  const activeFrameCount = videoFrames.length - removedFrames.length;
  const isCenter = variant === 'center';

  return (
    <div
      className={`video-frames-panel fade-in w-100${isCenter ? ' video-frames-panel--center' : ''}`}
    >
      <div className="video-frames-section">
        {isCenter ? (
          <div className="video-frames-header">
            <div className="video-frames-header-icon" aria-hidden="true">
              <Film size={20} />
            </div>
            <div className="video-frames-header-copy">
              <div className="video-frames-title-row">
                <h3 className="video-frames-title">Extracted Frames</h3>
                <span className="video-frames-count-badge">
                  {activeFrameCount}/{videoFrames.length}
                </span>
              </div>
              {videoFileName && (
                <p className="video-frames-filename" title={videoFileName}>
                  {videoFileName}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <label className="fw-bold small mb-2 d-flex justify-content-between align-items-center">
              <span>Extracted Frames</span>
              <span className="text-muted fw-normal video-frames-count">
                {activeFrameCount}/{videoFrames.length}
              </span>
            </label>
            {videoFileName && (
              <p className="video-frames-filename mb-2" title={videoFileName}>
                {videoFileName}
              </p>
            )}
          </>
        )}

        <div className={`video-frames-carousel${isCenter ? ' video-frames-carousel--center' : ''}`}>
          <button
            type="button"
            className="video-frames-arrow"
            onClick={() => scrollFrames('left')}
            disabled={isProcessing || isViewOnly}
            aria-label="Scroll frames left"
          >
            <ChevronLeft size={isCenter ? 18 : 16} />
          </button>

          <div className="video-frames-slider-track">
            <div className="video-frames-slider" ref={frameScrollRef}>
              {videoFrames.map((frame, index) => {
                const isRemoved = removedFrames.includes(index);

                return (
                  <div
                    key={`${frame}-${index}`}
                    className={`video-frame-item${isRemoved ? ' is-removed' : ' is-active'}`}
                  >
                    <img src={frame} alt={`Frame ${index + 1}`} />
                    {isCenter && (
                      <span className="video-frame-index">{index + 1}</span>
                    )}
                    {isRemoved ? (
                      <button
                        type="button"
                        className="video-frame-action restore"
                        onClick={() => revertFrame(index)}
                        disabled={isProcessing || isViewOnly}
                        aria-label={`Restore frame ${index + 1}`}
                      >
                        <Plus size={12} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="video-frame-action remove"
                        onClick={() => removeFrame(index)}
                        disabled={isProcessing || isViewOnly}
                        aria-label={`Remove frame ${index + 1}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="video-frames-arrow"
            onClick={() => scrollFrames('right')}
            disabled={isProcessing || isViewOnly}
            aria-label="Scroll frames right"
          >
            <ChevronRight size={isCenter ? 18 : 16} />
          </button>
        </div>

        <p className={`video-frames-hint${isCenter ? ' video-frames-hint--center' : ''}`}>
          Tap <span className="video-frames-hint-x">×</span> to remove frames. Keep at least{' '}
          <strong>2</strong>, then click Generate.
        </p>
      </div>

      <button
        type="button"
        className={`btn-generate video-frames-generate-btn${isCenter ? ' video-frames-generate-btn--center' : ''}`}
        onClick={handleGenerate}
        disabled={isProcessing || isViewOnly || activeFrameCount < 2}
      >
        {isExtractingFrames ? (
          <>
            <Loader2 size={16} className="video-frames-generate-icon animate-spin" />
            <span>Extracting frames...</span>
          </>
        ) : isGenerating || isArrowLoading ? (
          <>
            <Loader2 size={16} className="video-frames-generate-icon animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles size={16} className="video-frames-generate-icon" />
            <span>Generate</span>
          </>
        )}
      </button>
    </div>
  );
};

export default VideoFramesPanel;
