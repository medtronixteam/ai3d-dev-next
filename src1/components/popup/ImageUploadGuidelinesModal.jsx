import React, { useState } from 'react';
import { ImageUp, X } from 'lucide-react';
import './ImageUploadGuidelinesModal.css';

const GUIDELINES = [
  'Use a clear, well-lit photo with the object fully visible.',
  'Keep a single main object centered in the frame.',
  'Prefer a plain or uncluttered background for best results.',
  'Avoid blurry, dark, cropped, or heavily filtered images.',
];

const ImageUploadGuidelinesModal = ({ isOpen, onClose, onContinue, onDismissForever }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose?.();
  };

  const handleContinue = () => {
    if (dontShowAgain) {
      onDismissForever?.();
    }
    onContinue();
  };

  return (
    <div className="image-guide-backdrop" onClick={handleClose}>
      <div className="image-guide-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="image-guide-close" onClick={handleClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="image-guide-icon-wrap" aria-hidden="true">
          <ImageUp size={26} />
        </div>
        <h3 className="image-guide-title">Image Upload Guidelines</h3>
        <p className="image-guide-subtitle">
          Follow these tips before uploading for Image to 3D.
        </p>
        <ul className="image-guide-list">
          {GUIDELINES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="image-guide-formats">
          <span className="image-guide-format">JPG</span>
          <span className="image-guide-format">PNG</span>
          <span className="image-guide-format">WEBP</span>
        </div>
        <div className="image-guide-footer">
          <label className="image-guide-dismiss">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            Don&apos;t show again
          </label>
          <button type="button" className="image-guide-btn" onClick={handleContinue}>
            Continue to Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadGuidelinesModal;
