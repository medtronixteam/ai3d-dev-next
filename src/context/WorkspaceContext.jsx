import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import {
  WORKSPACE_FILTER_ALL,
  WORKSPACE_FILTER_NONE,
  changeProjectWorkspace,
  removeProjectFromWorkspace as removeProjectFromWorkspaceApi,
  createWorkspace,
  deleteWorkspace,
  fetchWorkspaceDetail,
  fetchWorkspaces,
  getProjectWorkspaceId,
  getProjectId,
  updateWorkspace,
} from '../utils/workspaceApi';

const CREATION_KEY = 'activeCreationWorkspaceId';
const FILTER_KEY = 'selectedWorkspaceFilter';

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const { token } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilterState] = useState(
    () => localStorage.getItem(FILTER_KEY) || WORKSPACE_FILTER_ALL,
  );
  const [activeCreationWorkspaceId, setActiveCreationWorkspaceIdState] = useState(
    () => localStorage.getItem(CREATION_KEY) || '',
  );
  const [workspaceProjects, setWorkspaceProjects] = useState([]);
  const [workspaceProjectsLoading, setWorkspaceProjectsLoading] = useState(false);

  const setSelectedFilter = useCallback((value) => {
    setSelectedFilterState(value);
    localStorage.setItem(FILTER_KEY, value);
  }, []);

  const setActiveCreationWorkspaceId = useCallback((value) => {
    const next = value || '';
    setActiveCreationWorkspaceIdState(next);
    if (next) {
      localStorage.setItem(CREATION_KEY, next);
    } else {
      localStorage.removeItem(CREATION_KEY);
    }
  }, []);

  const refreshWorkspaces = useCallback(async () => {
    if (!token) {
      setWorkspaces([]);
      return [];
    }

    setLoading(true);
    try {
      const list = await fetchWorkspaces(token);
      setWorkspaces(list);
      return list;
    } catch (err) {
      console.error('Failed to fetch workspaces:', err);
      toast.error(err?.response?.data?.message || 'Failed to load workspaces.');
      setWorkspaces([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadWorkspaceProjects = useCallback(
    async (workspaceId) => {
      if (!token || !workspaceId || workspaceId === WORKSPACE_FILTER_ALL || workspaceId === WORKSPACE_FILTER_NONE) {
        setWorkspaceProjects([]);
        return [];
      }

      setWorkspaceProjectsLoading(true);
      try {
        const detail = await fetchWorkspaceDetail(token, workspaceId);
        const projects = detail?.projects || [];
        setWorkspaceProjects(projects);
        return projects;
      } catch (err) {
        console.error('Failed to fetch workspace detail:', err);
        toast.error(err?.response?.data?.message || 'Failed to load workspace projects.');
        setWorkspaceProjects([]);
        return [];
      } finally {
        setWorkspaceProjectsLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  useEffect(() => {
    if (
      selectedFilter &&
      selectedFilter !== WORKSPACE_FILTER_ALL &&
      selectedFilter !== WORKSPACE_FILTER_NONE
    ) {
      loadWorkspaceProjects(selectedFilter);
    } else {
      setWorkspaceProjects([]);
    }
  }, [selectedFilter, loadWorkspaceProjects]);

  const handleCreateWorkspace = useCallback(
    async (name) => {
      if (!token) throw new Error('Not authenticated');
      const created = await createWorkspace(token, name);
      await refreshWorkspaces();
      toast.success('Workspace created.');
      return created;
    },
    [token, refreshWorkspaces],
  );

  const handleUpdateWorkspace = useCallback(
    async (workspaceId, name) => {
      if (!token) throw new Error('Not authenticated');
      const updated = await updateWorkspace(token, workspaceId, name);
      await refreshWorkspaces();
      if (selectedFilter === String(workspaceId)) {
        await loadWorkspaceProjects(workspaceId);
      }
      toast.success('Workspace updated.');
      return updated;
    },
    [token, refreshWorkspaces, selectedFilter, loadWorkspaceProjects],
  );

  const handleDeleteWorkspace = useCallback(
    async (workspaceId) => {
      if (!token) throw new Error('Not authenticated');
      await deleteWorkspace(token, workspaceId);
      if (selectedFilter === String(workspaceId)) {
        setSelectedFilter(WORKSPACE_FILTER_ALL);
      }
      if (activeCreationWorkspaceId === String(workspaceId)) {
        setActiveCreationWorkspaceId('');
      }
      await refreshWorkspaces();
      toast.success('Workspace deleted.');
    },
    [
      token,
      selectedFilter,
      activeCreationWorkspaceId,
      setSelectedFilter,
      setActiveCreationWorkspaceId,
      refreshWorkspaces,
    ],
  );

  const assignProjectToWorkspace = useCallback(
    async (projectId, workspaceId) => {
      if (!token || !projectId) throw new Error('Missing project');
      if (!workspaceId || workspaceId === WORKSPACE_FILTER_NONE) {
        throw new Error('Use removeProjectFromWorkspace to unassign a project');
      }

      await changeProjectWorkspace(token, projectId, workspaceId);
      await refreshWorkspaces();
      if (
        selectedFilter &&
        selectedFilter !== WORKSPACE_FILTER_ALL &&
        selectedFilter !== WORKSPACE_FILTER_NONE
      ) {
        await loadWorkspaceProjects(selectedFilter);
      }
    },
    [token, refreshWorkspaces, selectedFilter, loadWorkspaceProjects],
  );

  const removeProjectFromWorkspace = useCallback(
    async (projectId, workspaceId) => {
      if (!token || !projectId || !workspaceId) throw new Error('Missing project or workspace');

      await removeProjectFromWorkspaceApi(token, projectId, workspaceId);
      await refreshWorkspaces();
      if (
        selectedFilter &&
        selectedFilter !== WORKSPACE_FILTER_ALL &&
        selectedFilter !== WORKSPACE_FILTER_NONE
      ) {
        await loadWorkspaceProjects(selectedFilter);
      }
    },
    [token, refreshWorkspaces, selectedFilter, loadWorkspaceProjects],
  );

  const filterProjectsByWorkspace = useCallback(
    (projects) => {
      if (!Array.isArray(projects)) return [];

      if (selectedFilter === WORKSPACE_FILTER_ALL) {
        return projects;
      }

      if (selectedFilter === WORKSPACE_FILTER_NONE) {
        return projects.filter((project) => !getProjectWorkspaceId(project));
      }

      if (workspaceProjects.length > 0) {
        const workspaceProjectIds = new Set(
          workspaceProjects.map((project) => String(getProjectId(project))).filter(Boolean),
        );

        return projects.filter((project) =>
          workspaceProjectIds.has(String(getProjectId(project))),
        );
      }

      return projects.filter(
        (project) => String(getProjectWorkspaceId(project)) === String(selectedFilter),
      );
    },
    [selectedFilter, workspaceProjects],
  );

  const value = useMemo(
    () => ({
      workspaces,
      loading,
      selectedFilter,
      setSelectedFilter,
      activeCreationWorkspaceId,
      setActiveCreationWorkspaceId,
      workspaceProjects,
      workspaceProjectsLoading,
      refreshWorkspaces,
      loadWorkspaceProjects,
      createWorkspace: handleCreateWorkspace,
      updateWorkspace: handleUpdateWorkspace,
      deleteWorkspace: handleDeleteWorkspace,
      assignProjectToWorkspace,
      removeProjectFromWorkspace,
      filterProjectsByWorkspace,
      getProjectWorkspaceId,
    }),
    [
      workspaces,
      loading,
      selectedFilter,
      setSelectedFilter,
      activeCreationWorkspaceId,
      setActiveCreationWorkspaceId,
      workspaceProjects,
      workspaceProjectsLoading,
      refreshWorkspaces,
      loadWorkspaceProjects,
      handleCreateWorkspace,
      handleUpdateWorkspace,
      handleDeleteWorkspace,
      assignProjectToWorkspace,
      removeProjectFromWorkspace,
      filterProjectsByWorkspace,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
};

export default WorkspaceContext;
