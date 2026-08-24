import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import './WorkspaceFormModal.css';

const WorkspaceFormModal = ({
  open,
  mode = 'create',
  initialName = '',
  loading = false,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) {
      setName(initialName);
    }
  }, [open, initialName]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit?.(name.trim());
  };

  return createPortal(
    <div className="workspace-form-overlay" onClick={onClose} role="presentation">
      <div
        className="workspace-form-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="workspace-form-header">
          <h3>{mode === 'edit' ? 'Rename workspace' : 'Create workspace'}</h3>
          <button type="button" className="workspace-form-close" onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="workspace-name" className="workspace-form-label">
            Workspace name
          </label>
          <input
            id="workspace-name"
            type="text"
            className="workspace-form-input"
            placeholder="e.g. Client projects, Personal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={80}
          />
          <p className="workspace-form-hint">
            Organize related 3D projects in one place. You can rename this later.
          </p>

          <div className="workspace-form-actions">
            <button type="button" className="workspace-form-btn workspace-form-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="workspace-form-btn workspace-form-btn--primary"
              disabled={!name.trim() || loading}
            >
              {loading ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Create workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default WorkspaceFormModal;
