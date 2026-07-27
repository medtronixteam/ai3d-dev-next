import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaEllipsisV, FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import RichTextEditor from '../base/RichTextEditor';
import ConfirmModal from '../popup/ConfirmLogoutPopup';
import {
  createNoteApi,
  deleteNoteApi,
  fetchNotes,
  getNotesApiError,
  toggleNotePinApi,
  updateNoteApi,
} from '../../utils/notesApi';
import './WorkspaceNotesPanel.css';

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const normalizeContent = (content) => {
  if (!content) return '';
  if (content.includes('<') && content.includes('>')) return content;
  return `<p>${content.replace(/\n/g, '<br />')}</p>`;
};

const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const WorkspaceNotesPanel = forwardRef(({ workspaceId, workspaceName, viewMode = 'grid' }, ref) => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [screen, setScreen] = useState('grid');
  const [editorMode, setEditorMode] = useState('create');
  const [selectedId, setSelectedId] = useState(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuWrapRef = useRef(null);

  const selectedNote = useMemo(
    () => notes.find((note) => String(note.id) === String(selectedId)) || null,
    [notes, selectedId],
  );

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
    });
  }, [notes]);

  const loadNotes = useCallback(async () => {
    if (!token || !workspaceId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const list = await fetchNotes(token, workspaceId);
      setNotes(list);
    } catch (err) {
      console.error('Failed to load notes:', err);
      const message = getNotesApiError(err);
      if (message) toast.error(message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [token, workspaceId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (!menuOpenId) return undefined;

    const handleOutside = (event) => {
      if (!event.target.closest('.rp-note-card-menu-wrap')) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpenId]);

  const openCreate = useCallback(() => {
    setEditorMode('create');
    setSelectedId(null);
    setDraftTitle('');
    setDraftContent('');
    setScreen('editor');
    setMenuOpenId(null);
  }, []);

  const openEdit = useCallback((note) => {
    setEditorMode('edit');
    setSelectedId(note.id);
    setDraftTitle(note.title || '');
    setDraftContent(normalizeContent(note.content));
    setScreen('editor');
    setMenuOpenId(null);
  }, []);

  const backToGrid = useCallback(() => {
    setScreen('grid');
    setSelectedId(null);
    setDraftTitle('');
    setDraftContent('');
  }, []);

  useImperativeHandle(ref, () => ({
    openCreate,
    backToGrid,
  }));

  const handleSave = async () => {
    if (!token || !workspaceId) return;

    const title = draftTitle.trim() || 'Untitled note';
    const content = draftContent;

    setSaving(true);
    try {
      if (editorMode === 'create') {
        const created = await createNoteApi(token, {
          title,
          content,
          workspaceId,
        });
        if (created) {
          setNotes((prev) => [created, ...prev]);
          backToGrid();
        }
      } else if (selectedId) {
        const updated = await updateNoteApi(token, selectedId, { title, content });
        setNotes((prev) =>
          prev.map((note) =>
            String(note.id) === String(selectedId)
              ? { ...note, ...updated, title, content }
              : note,
          ),
        );
        backToGrid();
      }
    } catch (err) {
      console.error('Failed to save note:', err);
      const message = getNotesApiError(err);
      if (message) toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !token) return;

    setSaving(true);
    try {
      await deleteNoteApi(token, deleteTarget.id);
      setNotes((prev) => prev.filter((note) => String(note.id) !== String(deleteTarget.id)));

      if (String(selectedId) === String(deleteTarget.id)) {
        backToGrid();
      }

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
      const message = getNotesApiError(err);
      if (message) toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePin = async (note) => {
    if (!token || !note?.id) return;
    setMenuOpenId(null);

    try {
      const result = await toggleNotePinApi(token, note.id);
      const nextPinned = result.pinned !== undefined ? result.pinned : !note.pinned;

      setNotes((prev) =>
        prev.map((item) =>
          String(item.id) === String(note.id)
            ? {
                ...item,
                ...(result.note || {}),
                pinned: nextPinned,
              }
            : item,
        ),
      );
    } catch (err) {
      console.error('Failed to toggle pin:', err);
      const message = getNotesApiError(err);
      if (message) toast.error(message);
    }
  };

  const previewText = (content) => {
    const text = stripHtml(content);
    if (!text) return 'Empty note';
    return text.length > 120 ? `${text.slice(0, 120)}…` : text;
  };

  if (screen === 'editor') {
    return (
      <div className="ws-notes-editor-screen">
        <div className="ws-notes-title-field">
          <input
            type="text"
            className="ws-notes-title-input"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Note title"
          />
          <div className="ws-notes-title-actions">
            {editorMode === 'edit' && selectedNote && (
              <>
                <button
                  type="button"
                  className="ws-notes-title-icon-btn"
                  aria-label={selectedNote.pinned ? 'Unpin note' : 'Pin note'}
                  onClick={() => handleTogglePin(selectedNote)}
                >
                  {selectedNote.pinned ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
                </button>
                <button
                  type="button"
                  className="ws-notes-title-icon-btn danger"
                  aria-label="Delete note"
                  onClick={() => {
                    setDeleteTarget(selectedNote);
                    setDeleteOpen(true);
                  }}
                >
                  <FiTrash2 size={15} />
                </button>
              </>
            )}
            <button
              type="button"
              className="ws-notes-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="ws-notes-editor-body">
          <RichTextEditor
            editorKey={editorMode === 'create' ? 'create' : selectedId}
            value={draftContent}
            onChange={setDraftContent}
            placeholder="Start writing your note..."
            minHeight={420}
          />
        </div>

        {editorMode === 'edit' && selectedNote && (
          <p className="ws-notes-meta">
            Last updated {formatDate(selectedNote.updatedAt || selectedNote.createdAt)}
          </p>
        )}

        <ConfirmModal
          open={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete note?"
          message={`Delete "${deleteTarget?.title || 'this note'}"? This cannot be undone.`}
          confirmText={saving ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          iconType="warning"
        />
      </div>
    );
  }

  if (loading) {
    return viewMode === 'grid' ? (
      <div className="recent-loader-item">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="recent-loader-loader" />
        ))}
      </div>
    ) : (
      <div className="ws-notes-list-loading">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="recent-loader-loader ws-notes-list-loader" />
        ))}
      </div>
    );
  }

  if (sortedNotes.length === 0) {
    return (
      <div className="rp-workspace-models-empty">
        <div className="ws-notes-models-empty-icon-wrap">
          <FiEdit2 size={32} />
        </div>
        <h3 className="rp-workspace-models-empty-title">No notes yet</h3>
        <p className="rp-workspace-models-empty-text">
          Create notes for ideas, prompts, and references in {workspaceName || 'this workspace'}.
        </p>
        <button type="button" className="rp-new-workspace-btn" onClick={openCreate}>
          <FiPlus size={15} />
          Create note
        </button>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="rp-list-view ws-notes-list-view">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className="rp-list-item ws-notes-list-item"
            role="button"
            tabIndex={0}
            onClick={() => openEdit(note)}
            onKeyDown={(e) => e.key === 'Enter' && openEdit(note)}
          >
            <div className="ws-notes-list-thumb">
              <FiEdit2 size={22} />
            </div>
            <div className="rp-list-info">
              <div className="rp-list-title">{note.title || 'Untitled note'}</div>
              <div className="rp-list-date">{previewText(note.content)}</div>
            </div>
            <div className="rp-note-card-menu-wrap" ref={menuWrapRef}>
              <button
                type="button"
                className={`ws-notes-pin-btn${note.pinned ? ' pinned' : ''}`}
                aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePin(note);
                }}
              >
                {note.pinned ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
              </button>
              <button
                type="button"
                className="rp-card-menu-btn"
                aria-label={`Options for ${note.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(menuOpenId === note.id ? null : note.id);
                }}
              >
                <FaEllipsisV size={16} />
              </button>
              {menuOpenId === note.id && (
                <div className="rp-card-menu">
                  <button type="button" onClick={(e) => { e.stopPropagation(); openEdit(note); }}>
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleTogglePin(note); }}>
                    {note.pinned ? <FaHeart size={13} /> : <FaRegHeart size={14} />}
                    {note.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(note);
                      setDeleteOpen(true);
                    }}
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <ConfirmModal
          open={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete note?"
          message={`Delete "${deleteTarget?.title || 'this note'}"? This cannot be undone.`}
          confirmText={saving ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          iconType="warning"
        />
      </div>
    );
  }

  return (
    <>
      <div className="rp-grid ws-notes-grid">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className="rp-card rp-note-card-item"
            role="button"
            tabIndex={0}
            onClick={() => openEdit(note)}
            onKeyDown={(e) => e.key === 'Enter' && openEdit(note)}
          >
            <button
              type="button"
              className={`rec-rp-fav-btn${note.pinned ? ' active' : ''}`}
              aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePin(note);
              }}
            >
              {note.pinned ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
            </button>

            <div className="rp-card-img-wrap">
              <div className="rp-note-card-visual">
                <span className="rp-note-card-visual-icon">
                  <FiEdit2 size={30} />
                </span>
              </div>
            </div>

            <div className="rp-card-body">
              <div className="rp-card-header-row">
                <div className="rp-card-title">{note.title || 'Untitled note'}</div>
                <div className="rp-note-card-menu-wrap">
                  <button
                    type="button"
                    className="rp-card-menu-btn"
                    aria-label={`Options for ${note.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === note.id ? null : note.id);
                    }}
                  >
                    <FaEllipsisV />
                  </button>

                  {menuOpenId === note.id && (
                    <div className="rp-card-menu">
                      <button type="button" onClick={(e) => { e.stopPropagation(); openEdit(note); }}>
                        <FiEdit2 size={14} /> Edit
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleTogglePin(note); }}>
                        {note.pinned ? <FaHeart size={13} /> : <FaRegHeart size={14} />}
                        {note.pinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(note);
                          setDeleteOpen(true);
                        }}
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="rp-card-meta">
                <div className="rp-card-date">
                  {formatDate(note.updatedAt || note.createdAt)}
                  {note.pinned ? ' · Pinned' : ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete note?"
        message={`Delete "${deleteTarget?.title || 'this note'}"? This cannot be undone.`}
        confirmText={saving ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        iconType="warning"
      />
    </>
  );
});

WorkspaceNotesPanel.displayName = 'WorkspaceNotesPanel';

export default WorkspaceNotesPanel;
