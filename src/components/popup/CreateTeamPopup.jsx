import React, { useState } from 'react';
import './CreateTeamPopup.css';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import { baseURL } from '../../config';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import SuccessImg from '../../assets/images/success-img.png'

const CreateTeamPopup = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [error, setError] = useState('');

  const handleCreateTeam = async () => {
    if (teamName.trim() && teamEmail.trim()) {
      setLoading(true);
      setError('');
      try {
        const res = await axios.post(
          `${baseURL}/team`,
          { email: teamEmail, name: teamName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data && (res.data.status === 'error' || res.data.status !== 'success')) {
          setError(res.data.message || 'Failed to create team!');
        } else {
          setStep(2);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to create team!');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStepOne = () => (
    <>
      <div className="popup-header">
        <h4>Create a team</h4>
        <button className="close-popup-btn" onClick={onClose}>
          <FiX />
        </button>
      </div>
      <div className="popup-body">
        <div className="form-group">
          <label htmlFor="teamName">Name your team</label>
          <input
            type="text"
            id="teamName"
            placeholder="Enter your Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <p className="form-helper-static">This can be changed later in the team settings</p>
        </div>
        <div className="form-group">
          <label htmlFor="teamEmail">Enter Team Email</label>
          <input
            type="text"
            id="teamEmail"
            placeholder="Enter your Team Email"
            value={teamEmail}
            onChange={(e) => setTeamEmail(e.target.value)}
          />
           <p className="form-helper-static">You can change this later in the team settings</p>
        </div>
      </div>
      <div className="popup-footer">
        <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn btn-create" onClick={handleCreateTeam} disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div className="popup-header">
         <button className="close-popup-btn" onClick={onClose}>
          <FiX />
        </button>
      </div>
       <div className="popup-body success-step">
        <div className="success-icon">
            <img src={SuccessImg} alt="success-img" />
        </div>
        <h3>Team created successfully</h3>
        <p>You can now manage your team or invite members.</p>
        <button className="btn btn-create" onClick={onClose}>Back to Home Page</button>
      </div>
    </>
  );

  return (
    <div className="create-team-overlay">
      <div className="create-team-popup">
        {error && <div className="confirm-modal-error">{error}</div>}
        {step === 1 ? renderStepOne() : renderStepTwo()}
      </div>
    </div>
  );
};

export default CreateTeamPopup; 