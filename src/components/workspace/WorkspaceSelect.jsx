import React, { useEffect, useMemo, useRef, useState } from 'react';

import { FiCheck, FiChevronDown, FiFolder } from 'react-icons/fi';

import { useWorkspace } from '../../context/WorkspaceContext';

import './WorkspaceSelect.css';

const WorkspaceSelect = ({ disabled = false, className = '' }) => {
  const {
    workspaces,
    loading,
    activeCreationWorkspaceId,
    setActiveCreationWorkspaceId,
  } = useWorkspace();

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedLabel = useMemo(() => {
    if (!activeCreationWorkspaceId) return 'Unassigned';
    return (
      workspaces.find((ws) => String(ws.id) === String(activeCreationWorkspaceId))?.name ||
      'Workspace'
    );
  }, [activeCreationWorkspaceId, workspaces]);

  const options = useMemo(
    () => [
      { value: '', label: 'Unassigned' },
      ...workspaces.map((workspace) => ({
        value: String(workspace.id),
        label: workspace.name,
      })),
    ],
    [workspaces],
  );

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const isDisabled = disabled || loading;

  const selectOption = (value) => {
    setActiveCreationWorkspaceId(value);
    setOpen(false);
  };

  return (
    <div className={`workspace-select ${className}`.trim()} ref={rootRef}>
      <div className="workspace-select-head">
        <span className="workspace-select-label">Save to workspace</span>
        <span className="workspace-select-optional">Optional</span>
      </div>

      <button
        type="button"
        className={`workspace-select-field${isDisabled ? ' is-disabled' : ''}${open ? ' is-open' : ''}`}
        disabled={isDisabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => !isDisabled && setOpen((prev) => !prev)}
      >
        <span className="workspace-select-icon" aria-hidden="true">
          <FiFolder size={15} />
        </span>

        <span className="workspace-select-value">
          {loading ? 'Loading...' : selectedLabel}
        </span>

        <FiChevronDown size={15} className="workspace-select-chevron" aria-hidden="true" />
      </button>

      {open && !isDisabled && (
        <div className="workspace-select-panel" role="listbox" aria-label="Save to workspace">
          {options.map((option) => {
            const isSelected = activeCreationWorkspaceId === option.value;
            return (
              <button
                key={option.value || 'unassigned'}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`workspace-select-option${isSelected ? ' selected' : ''}`}
                onClick={() => selectOption(option.value)}
              >
                <span className="workspace-select-option-label">{option.label}</span>
                {isSelected && <FiCheck size={15} className="workspace-select-option-check" />}
              </button>
            );
          })}
        </div>
      )}

      <p className="workspace-select-hint">
        {activeCreationWorkspaceId
          ? 'This model will be saved inside the selected workspace.'
          : 'Leave unassigned or pick a workspace to organize your model.'}
      </p>
    </div>
  );
};

export default WorkspaceSelect;
