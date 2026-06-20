import axios from 'axios';
import { baseURL } from '../config';

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const readPinned = (note) => {
  if (!note || typeof note !== 'object') return undefined;
  if (note.pinned !== undefined && note.pinned !== null) return Boolean(note.pinned);
  if (note.is_pinned !== undefined && note.is_pinned !== null) return Boolean(note.is_pinned);
  if (note.isPinned !== undefined && note.isPinned !== null) return Boolean(note.isPinned);
  return undefined;
};

export const normalizeNote = (note) => {
  if (!note) return null;

  return {
    id: note.id ?? note.note_id,
    title: note.title || 'Untitled note',
    content: note.content || '',
    workspaceId: note.workspace_id ?? note.workspace ?? note.workspaceId ?? null,
    pinned: readPinned(note) ?? false,
    createdAt: note.created_at ?? note.createdAt ?? null,
    updatedAt: note.updated_at ?? note.updatedAt ?? null,
  };
};

export const readPinnedFromApiResponse = (body) => {
  if (!body || typeof body !== 'object') return undefined;

  const fromRoot = readPinned(body);
  if (fromRoot !== undefined) return fromRoot;

  const payload = body.data ?? body.note;
  if (payload && typeof payload === 'object') {
    const fromPayload = readPinned(payload);
    if (fromPayload !== undefined) return fromPayload;
  }

  return undefined;
};

const extractNotesList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.notes)) return data.notes;
  return [];
};

export const getNotesApiError = (err) => {
  const data = err?.response?.data;
  if (!data) return '';

  if (typeof data.errors === 'string' && data.errors.trim()) {
    return data.errors.trim();
  }

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }

  if (data.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) return String(first[0]).trim();
    if (typeof first === 'string' && first.trim()) return first.trim();
  }

  return '';
};

export const fetchNotes = async (token, workspaceId) => {
  const response = await axios.get(`${baseURL}/notes`, {
    headers: authHeaders(token),
    params: workspaceId ? { workspace: workspaceId } : undefined,
  });

  return extractNotesList(response.data).map(normalizeNote).filter(Boolean);
};

export const createNoteApi = async (token, { title, content, workspaceId }) => {
  const response = await axios.post(
    `${baseURL}/notes`,
    {
      title: title?.trim() || 'Untitled note',
      content: content || '',
      workspace_id: workspaceId,
    },
    { headers: authHeaders(token) },
  );

  const payload = response.data?.data ?? response.data?.note ?? response.data;
  return normalizeNote(payload);
};

export const updateNoteApi = async (token, noteId, { title, content }) => {
  const response = await axios.put(
    `${baseURL}/notes/${noteId}`,
    {
      title: title?.trim() || 'Untitled note',
      content: content || '',
    },
    { headers: authHeaders(token) },
  );

  const payload = response.data?.data ?? response.data?.note ?? response.data;
  return normalizeNote(payload) || { id: noteId, title, content };
};

export const deleteNoteApi = async (token, noteId) => {
  await axios.delete(`${baseURL}/notes/${noteId}`, {
    headers: authHeaders(token),
  });
};

export const toggleNotePinApi = async (token, noteId) => {
  const response = await axios.post(
    `${baseURL}/notes/${noteId}/pin`,
    {},
    { headers: authHeaders(token) },
  );

  const body = response.data;
  const payload = body?.data ?? body?.note ?? body;
  const normalized =
    payload && typeof payload === 'object' && (payload.id || payload.note_id)
      ? normalizeNote(payload)
      : null;
  const pinned = readPinnedFromApiResponse(body);

  return { note: normalized, pinned };
};
