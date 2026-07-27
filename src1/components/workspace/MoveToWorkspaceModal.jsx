import React, { useEffect, useState } from 'react';
import { FiFolder, FiX } from 'react-icons/fi';
import { getProjectWorkspaceId } from '../../utils/workspaceApi';
import './MoveToWorkspaceModal.css';

const MoveToWorkspaceModal = ({
  open,
  project,
  workspaces = [],
  loading = false,
  onClose,
  onMove,
}) => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('');

  useEffect(() => {
    if (open) {
      const currentWorkspaceId = getProjectWorkspaceId(project);
      setSelectedWorkspaceId(currentWorkspaceId ? String(currentWorkspaceId) : '');
    }
  }, [open, project]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedWorkspaceId) return;
    onMove?.(selectedWorkspaceId);
  };

  return (
    <div className="move-workspace-overlay" onClick={onClose} role="presentation">
      <div
        className="move-workspace-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="move-workspace-header">
          <div>
            <h3>Move to workspace</h3>
            <p>{project?.name || 'Selected project'}</p>
          </div>
          <button type="button" className="move-workspace-close" onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="move-workspace-list" role="radiogroup" aria-label="Choose workspace">
            {workspaces.map((workspace) => (
              <label
                key={workspace.id}
                className={`move-workspace-option${String(selectedWorkspaceId) === String(workspace.id) ? ' selected' : ''}`}
              >
                <input
                  type="radio"
                  name="move-workspace"
                  value={workspace.id}
                  checked={String(selectedWorkspaceId) === String(workspace.id)}
                  onChange={() => setSelectedWorkspaceId(String(workspace.id))}
                />
                <FiFolder size={16} />
                <span>{workspace.name}</span>
                {workspace.projectsCount > 0 && (
                  <span className="move-workspace-count">{workspace.projectsCount}</span>
                )}
              </label>
            ))}
          </div>

          {workspaces.length === 0 && (
            <p className="move-workspace-empty">Create a workspace first from the sidebar.</p>
          )}

          <div className="move-workspace-actions">
            <button type="button" className="move-workspace-btn move-workspace-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="move-workspace-btn move-workspace-btn--primary"
              disabled={!selectedWorkspaceId || loading}
            >
              {loading ? 'Moving...' : 'Move project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveToWorkspaceModal;
