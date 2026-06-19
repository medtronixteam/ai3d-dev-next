import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  FiCheck,
  FiChevronDown,
  FiEdit2,
  FiFolder,
  FiMoreHorizontal,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';
import { useWorkspace } from '../../context/WorkspaceContext';
import { WORKSPACE_FILTER_ALL, WORKSPACE_FILTER_NONE } from '../../utils/workspaceApi';
import WorkspaceFormModal from './WorkspaceFormModal';
import ConfirmModal from '../popup/ConfirmLogoutPopup';
import './WorkspaceDropdown.css';

const WorkspaceDropdown = ({ variant = 'page' }) => {
  const {
    workspaces,
    loading,
    selectedFilter,
    setSelectedFilter,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  } = useWorkspace();

  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [formLoading, setFormLoading] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [panelStyle, setPanelStyle] = useState(null);
  const rootRef = useRef(null);

  const staticItems = useMemo(
    () => [
      { id: WORKSPACE_FILTER_ALL, name: 'Models', hint: 'All your 3D models' },
      { id: WORKSPACE_FILTER_NONE, name: 'Unassigned', hint: 'Models without a workspace' },
    ],
    [],
  );

  const selectedLabel = useMemo(() => {
    if (selectedFilter === WORKSPACE_FILTER_ALL) return 'Models';
    if (selectedFilter === WORKSPACE_FILTER_NONE) return 'Unassigned';
    return workspaces.find((ws) => String(ws.id) === String(selectedFilter))?.name || 'Workspace';
  }, [selectedFilter, workspaces]);

  useEffect(() => {
    if (!open && !menuOpenId) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
        setMenuOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, menuOpenId]);

  useLayoutEffect(() => {
    if (!open || variant !== 'page' || !rootRef.current) {
      setPanelStyle(null);
      return undefined;
    }

    const updatePanelPosition = () => {
      const anchor = rootRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const viewportPadding = 16;
      const maxWidth = Math.min(320, window.innerWidth - viewportPadding * 2);
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        setPanelStyle({
          position: 'fixed',
          top: rect.bottom + 8,
          left: viewportPadding,
          right: viewportPadding,
          width: 'auto',
        });
        return;
      }

      let left = rect.right - maxWidth;
      left = Math.max(
        viewportPadding,
        Math.min(left, window.innerWidth - maxWidth - viewportPadding),
      );

      setPanelStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left,
        width: maxWidth,
      });
    };

    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);

    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
      setPanelStyle(null);
    };
  }, [open, variant]);

  const selectWorkspace = (id) => {
    setSelectedFilter(id);
    setOpen(false);
    setMenuOpenId(null);
  };

  const openCreate = () => {
    setOpen(false);
    setFormMode('create');
    setEditingWorkspace(null);
    setFormOpen(true);
  };

  const openEdit = (workspace) => {
    setMenuOpenId(null);
    setOpen(false);
    setFormMode('edit');
    setEditingWorkspace(workspace);
    setFormOpen(true);
  };

  const openDelete = (workspace) => {
    setMenuOpenId(null);
    setOpen(false);
    setDeleteTarget(workspace);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (name) => {
    setFormLoading(true);
    try {
      if (formMode === 'edit' && editingWorkspace) {
        await updateWorkspace(editingWorkspace.id, name);
      } else {
        const created = await createWorkspace(name);
        if (created?.id) {
          setSelectedFilter(String(created.id));
        }
      }
      setFormOpen(false);
      setEditingWorkspace(null);
    } catch {
      // toast handled in context
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setFormLoading(true);
    try {
      await deleteWorkspace(deleteTarget.id);
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch {
      // toast handled in context
    } finally {
      setFormLoading(false);
    }
  };

  const shouldShowPanel = open && (variant !== 'page' || panelStyle);

  const panel = shouldShowPanel ? (
    <div
      className={`ws-dropdown-panel${variant === 'page' ? ' ws-dropdown-panel--page ws-dropdown-panel--fixed' : ''}`}
      style={variant === 'page' ? panelStyle ?? undefined : undefined}
      role="listbox"
    >
      <div className="ws-dropdown-section">
        <p className="ws-dropdown-section-title">Browse</p>
        {staticItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`ws-dropdown-item${selectedFilter === item.id ? ' selected' : ''}`}
            onClick={() => selectWorkspace(item.id)}
          >
            <div className="ws-dropdown-item-main">
              <span className="ws-dropdown-item-name">{item.name}</span>
              <span className="ws-dropdown-item-hint">{item.hint}</span>
            </div>
            {selectedFilter === item.id && <FiCheck size={16} className="ws-dropdown-check" />}
          </button>
        ))}
      </div>

      <div className="ws-dropdown-divider" />

      <div className="ws-dropdown-section">
        <p className="ws-dropdown-section-title">Workspaces</p>

        {loading && workspaces.length === 0 && (
          <p className="ws-dropdown-empty">Loading workspaces...</p>
        )}

        {!loading && workspaces.length === 0 && (
          <p className="ws-dropdown-empty">No workspaces yet. Create one to organize projects.</p>
        )}

        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`ws-dropdown-item-row${selectedFilter === String(workspace.id) ? ' selected' : ''}`}
          >
            <button
              type="button"
              className="ws-dropdown-item ws-dropdown-item--grow"
              onClick={() => selectWorkspace(String(workspace.id))}
            >
              <div className="ws-dropdown-item-main">
                <span className="ws-dropdown-item-name">{workspace.name}</span>
                {workspace.projectsCount > 0 && (
                  <span className="ws-dropdown-item-hint">
                    {workspace.projectsCount} project{workspace.projectsCount === 1 ? '' : 's'}
                  </span>
                )}
              </div>
              {selectedFilter === String(workspace.id) && (
                <FiCheck size={16} className="ws-dropdown-check" />
              )}
            </button>

            <div className="ws-dropdown-item-actions">
              <button
                type="button"
                className="ws-dropdown-action-btn"
                aria-label={`Options for ${workspace.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(menuOpenId === workspace.id ? null : workspace.id);
                }}
              >
                <FiMoreHorizontal size={15} />
              </button>

              {menuOpenId === workspace.id && (
                <div className="ws-dropdown-action-menu">
                  <button type="button" onClick={() => openEdit(workspace)}>
                    <FiEdit2 size={13} /> Rename
                  </button>
                  <button type="button" className="danger" onClick={() => openDelete(workspace)}>
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="ws-dropdown-footer">
        <button type="button" className="ws-dropdown-create" onClick={openCreate}>
          <FiPlus size={15} />
          Create workspace
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      {variant === 'page' ? (
        <div className="rp-page-head">
          <div className="rp-page-head-copy">
            <h1 className="rp-page-title">Workspaces</h1>
            <p className="rp-page-subtitle">Browse, organize, and manage your 3D models by workspace.</p>
          </div>

          <div className="rp-page-head-actions" ref={rootRef}>
            <div className={`ws-dropdown ws-dropdown--page${open ? ' open' : ''}`}>
              <button
                type="button"
                className="ws-page-picker"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="listbox"
              >
                <FiFolder size={15} />
                <span title={selectedLabel}>{selectedLabel}</span>
                <FiChevronDown size={15} className="ws-dropdown-chevron" />
              </button>
            </div>

            <button type="button" className="ws-page-new-btn" onClick={openCreate}>
              <FiPlus size={15} />
              New workspace
            </button>

            {panel}
          </div>
        </div>
      ) : (
        <div className={`ws-dropdown${open ? ' open' : ''}`} ref={rootRef}>
          <button
            type="button"
            className="ws-dropdown-trigger"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            <span className="ws-dropdown-trigger-icon">
              <FiFolder size={15} />
            </span>
            <span className="ws-dropdown-trigger-text">
              <span className="ws-dropdown-trigger-label">Workspace</span>
              <span className="ws-dropdown-trigger-value">{selectedLabel}</span>
            </span>
            <FiChevronDown size={16} className="ws-dropdown-chevron" />
          </button>
          {panel}
        </div>
      )}

      <WorkspaceFormModal
        open={formOpen}
        mode={formMode}
        initialName={editingWorkspace?.name || ''}
        loading={formLoading}
        onClose={() => {
          setFormOpen(false);
          setEditingWorkspace(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete workspace?"
        message={`Delete "${deleteTarget?.name || 'this workspace'}"? Projects inside will remain available without a workspace.`}
        confirmText={formLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        iconType="warning"
      />
    </>
  );
};

export default WorkspaceDropdown;
