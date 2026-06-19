import React, { useMemo } from 'react';

import { FiChevronDown, FiFolder } from 'react-icons/fi';

import { useWorkspace } from '../../context/WorkspaceContext';

import './WorkspaceSelect.css';



const WorkspaceSelect = ({ disabled = false, className = '' }) => {

  const {

    workspaces,

    loading,

    activeCreationWorkspaceId,

    setActiveCreationWorkspaceId,

  } = useWorkspace();



  const selectedLabel = useMemo(() => {

    if (!activeCreationWorkspaceId) return 'Unassigned';

    return (

      workspaces.find((ws) => String(ws.id) === String(activeCreationWorkspaceId))?.name ||

      'Workspace'

    );

  }, [activeCreationWorkspaceId, workspaces]);



  return (

    <div className={`workspace-select ${className}`.trim()}>

      <div className="workspace-select-head">

        <span className="workspace-select-label">Save to workspace</span>

        <span className="workspace-select-optional">Optional</span>

      </div>



      <div className={`workspace-select-field${disabled || loading ? ' is-disabled' : ''}`}>

        <span className="workspace-select-icon" aria-hidden="true">

          <FiFolder size={15} />

        </span>



        <select

          id="workspace-select"

          className="workspace-select-control"

          value={activeCreationWorkspaceId}

          disabled={disabled || loading}

          onChange={(e) => setActiveCreationWorkspaceId(e.target.value)}

          aria-label="Save to workspace"

        >

          <option value="">Unassigned</option>

          {workspaces.map((workspace) => (

            <option key={workspace.id} value={String(workspace.id)}>

              {workspace.name}

            </option>

          ))}

        </select>



        <span className="workspace-select-value" aria-hidden="true">

          {loading ? 'Loading...' : selectedLabel}

        </span>



        <FiChevronDown size={15} className="workspace-select-chevron" aria-hidden="true" />

      </div>



      <p className="workspace-select-hint">

        {activeCreationWorkspaceId

          ? 'This model will be saved inside the selected workspace.'

          : 'Leave unassigned or pick a workspace to organize your model.'}

      </p>

    </div>

  );

};



export default WorkspaceSelect;

