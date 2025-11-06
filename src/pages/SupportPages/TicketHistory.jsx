import React, { useEffect, useState } from 'react';
import './TicketHistory.css';
import {
  Calendar,
  ChevronDown,
  CircleAlert,
  CircleCheckBig,
  Clock,
  Delete,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from 'lucide-react';
import CancelPlan from '../../assets/images/CancelPlan.svg'

const TicketHistory = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{background: isDarkMode
      ? "linear-gradient(90deg, #3E112C, #190F21)"
      : "linear-gradient(90deg, #FFEDF7, #F2F0FE)" }}>
      <div className="support-ticket-system-container">
        <h1 className="support-ticket-system-h1-tag">Support Tickets</h1>
        <p className="support-ticket-system-p-tag">Manage and track your support requests</p>

        <div className="ticket-actions-bar">
          <div className="ticket-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search tickets..." />
          </div>
          <div className="filter-and-new-ticket">
            <div className="custom-support-select">
              <select>
                <option>All Status</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
              <ChevronDown className="select-icon" size={18} />
            </div>
            <button className="new-ticket-btn">
              <Plus size={18} /> New Ticket
            </button>
          </div>
        </div>

        <h2 className="track-history-title mt-5 mb-3">Track History</h2>

        <div className="ticket-history-list">
          <div className="ticket-item">
            <div>
              <div className="ticket-header">
                <h3>Login Issue - Cannot Access Account</h3>
                <span className="ticket-status technical-issue">Technical Issue</span>
                {/* <span className="ticket-priority medium">Medium</span> */}
              </div>
              <p className="ticket-description">
                I'm unable to log in to my account. Getting error message "Invalid credentials" even
                with correct password.
              </p>
              <div className="ticket-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> Jan 15, 2024, 09:30 AM
                </span>
                <span>
                  <Clock size={12} /> Updated Jan 15, 2024, 10:15
                </span>
                <span>
                  <User size={12} /> Assigned to john.doe@company.com
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <CircleAlert size={18} color="#EA5D22" />
              <Trash2 onClick={() => setShowPopup(true)} size={18} color="#BF3847" />
            </div>
          </div>

          {/* Ticket 2 */}
          <div className="ticket-item">
            <div>
              <div className="ticket-header">
                <h3>Feature Request - Dark Mode</h3>
                <span className="ticket-status feature-request">Feature Request</span>
                {/* <span className="ticket-priority high">High</span> */}
              </div>
              <p className="ticket-description">
                Please add dark mode option to the application for better user experience during
                night usage.
              </p>
              <div className="ticket-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> Jan 15, 2024, 09:30 AM
                </span>
                <span>
                  <Clock size={12} /> Updated Jan 15, 2024, 10:15
                </span>
                <span>
                  <User size={12} /> Assigned to john.doe@company.com
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Clock size={18} color="#ECBA1F" />
              <Trash2 onClick={() => setShowPopup(true)} size={18} color="#BF3847" />
            </div>
          </div>

          {/* Ticket 3 */}
          <div className="ticket-item">
            <div>
              <div className="ticket-header">
                <h3>Billing Question - Invoice Discrepancy</h3>
                <span className="ticket-status technical-issue-2">Technical Issue</span>
                {/* <span className="ticket-priority medium">Medium</span> */}
              </div>
              <p className="ticket-description">
                There's a discrepancy in my last invoice. Charged for premium features I didn't use.
              </p>
              <div className="ticket-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> Jan 15, 2024, 09:30 AM
                </span>
                <span>
                  <Clock size={12} /> Updated Jan 15, 2024, 10:15
                </span>
                <span>
                  <User size={12} /> Assigned to john.doe@company.com
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <CircleCheckBig size={18} color="#25C560" />
              <Trash2 onClick={() => setShowPopup(true)} size={18} color="#BF3847" />
            </div>
          </div>
        </div>
      </div>

      {showPopup && <DeletePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default TicketHistory;

export const DeletePopup = ({ onClose }) => {
  const [cancelling, setCancelling] = useState(false);

  return (
    <div className="confirm-logout-overlay" onClick={onClose}>
      <div
        className="confirm-logout-popup modern-confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="request-refund-close" onClick={onClose}>
          <X />
        </button>
        <div className="cancel-modal-icon-wrap">
          <img src={CancelPlan} alt="image" />
        </div>
        <h4 className="cancel-modal-title">Delete Ticket</h4>
        <p className="cancel-modal-message">
          Are you sure you want to delete this ticket?
          <br />
          This action cannot be undo.
        </p>
        <div className="cancel-modal-footer">
          <button className="keep-plan-button" onClick={onClose}>
            Cancel
          </button>
          <button className="cancel-button">
            {cancelling ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
