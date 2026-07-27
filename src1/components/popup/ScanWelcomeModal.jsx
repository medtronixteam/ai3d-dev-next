import React from 'react';
import { Box, Sparkles, X } from 'lucide-react';
import './ScanWelcomeModal.css';

const ScanWelcomeModal = ({ isOpen, onClose, onCreateModel, onExploreModels }) => {
  if (!isOpen) return null;

  return (
    <div className="scan-welcome-backdrop" onClick={onClose}>
      <div className="scan-welcome-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="scan-welcome-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="scan-welcome-glow" aria-hidden="true" />
        <div className="scan-welcome-icon-wrap" aria-hidden="true">
          <Box size={28} />
        </div>
        <h3 className="scan-welcome-title">
          Welcome to <span className="text-pink">AI3D Scanning</span>
        </h3>
        <p className="scan-welcome-text">
          Create your own 3D model from a photo, video, or prompt — or explore ready-made models in
          our library.
        </p>
        <div className="scan-welcome-actions">
          <button
            type="button"
            className="scan-welcome-btn scan-welcome-btn--primary d-inline-flex align-items-center justify-content-center gap-2"
            onClick={onCreateModel}
          >
            <Sparkles size={16} />
            Create Model
          </button>
          <button
            type="button"
            className="scan-welcome-btn scan-welcome-btn--secondary d-inline-flex align-items-center justify-content-center gap-2"
            onClick={onExploreModels}
          >
            <Box size={16} />
            Explore Our Models
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanWelcomeModal;
