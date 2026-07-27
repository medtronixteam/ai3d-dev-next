import axios from 'axios';
import { baseURL } from '../config';

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const WORKSPACE_FILTER_ALL = 'all';
export const WORKSPACE_FILTER_NONE = 'none';

export const extractWorkspacesList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.workspaces)) return data.workspaces;
  return [];
};

export const normalizeWorkspace = (workspace) => {
  if (!workspace) return null;

  const projects = Array.isArray(workspace.projects)
    ? workspace.projects
    : Array.isArray(workspace.project_list)
      ? workspace.project_list
      : null;

  return {
    id: workspace.id ?? workspace.workspace_id ?? workspace.token,
    name: workspace.name || 'Untitled workspace',
    projectsCount:
      workspace.projects_count ??
      workspace.project_count ??
      projects?.length ??
      0,
    projects,
    createdAt: workspace.created_at ?? null,
    updatedAt: workspace.updated_at ?? null,
  };
};

export const getProjectWorkspaceId = (project) => {
  if (!project) return null;

  const value =
    project.workspace_id ??
    project.workspaceId ??
    project.workspace?.id ??
    project.workspace?.workspace_id ??
    null;

  if (value === 0 || value === '0') return null;
  return value ?? null;
};

export const getProjectId = (project) =>
  project?.token ?? project?.id ?? project?.project_id ?? project?.project_token ?? null;

export const fetchWorkspaces = async (token) => {
  const response = await axios.get(`${baseURL}/workspaces`, {
    headers: authHeaders(token),
  });

  return extractWorkspacesList(response.data).map(normalizeWorkspace).filter(Boolean);
};

export const fetchWorkspaceDetail = async (token, workspaceId) => {
  const response = await axios.get(`${baseURL}/workspaces/${workspaceId}`, {
    headers: authHeaders(token),
  });

  const payload = response.data?.data ?? response.data?.workspace ?? response.data;
  return normalizeWorkspace(payload);
};

export const createWorkspace = async (token, name) => {
  const response = await axios.post(
    `${baseURL}/workspaces`,
    { name: name.trim() },
    { headers: authHeaders(token) },
  );

  const payload = response.data?.data ?? response.data?.workspace ?? response.data;
  return normalizeWorkspace(payload) || { id: payload?.id, name: name.trim() };
};

export const updateWorkspace = async (token, workspaceId, name) => {
  const response = await axios.put(
    `${baseURL}/workspaces/${workspaceId}`,
    { name: name.trim() },
    { headers: authHeaders(token) },
  );

  const payload = response.data?.data ?? response.data?.workspace ?? response.data;
  return normalizeWorkspace(payload) || { id: workspaceId, name: name.trim() };
};

export const deleteWorkspace = async (token, workspaceId) => {
  await axios.delete(`${baseURL}/workspaces/${workspaceId}`, {
    headers: authHeaders(token),
  });
};

export const changeProjectWorkspace = async (token, projectId, workspaceId) => {
  const payload = {
    project_id: projectId,
    workspace_id: workspaceId,
  };

  const response = await axios.post(`${baseURL}/project/change-workspace`, payload, {
    headers: authHeaders(token),
  });

  return response.data;
};

export const removeProjectFromWorkspace = async (token, projectId, workspaceId) => {
  const response = await axios.post(
    `${baseURL}/project/remove-workspace`,
    {
      project_id: projectId,
      workspace_id: workspaceId,
    },
    { headers: authHeaders(token) },
  );

  return response.data;
};
