import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiExternalLink, FiX } from 'react-icons/fi';
import './OpenInEditorModal.css';

const OpenInEditorModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Open in 3D Editor',
  message = 'Do you want to open this project in the 3D Editor?',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose?.();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="editor-modal-overlay"
      onClick={() => {
        if (!isLoading) onClose?.();
      }}
    >
      <div
        className="editor-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="editor-modal-close-btn"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        <div className="editor-modal-icon-badge">
          <FiExternalLink size={28} />
        </div>

        <div className="editor-modal-header">
          <h3 className="editor-modal-title">{title}</h3>
        </div>

        <div className="editor-modal-body">
          <p className="editor-modal-text">{message}</p>
        </div>

        <div className="editor-modal-footer">
          <button
            type="button"
            className="editor-modal-btn editor-modal-btn--cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            No
          </button>
          <button
            type="button"
            className="editor-modal-btn editor-modal-btn--confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Opening...
              </span>
            ) : (
              'Yes'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OpenInEditorModal;
