import React, { useEffect, useState } from 'react';
import './TicketHistory.css';
import {
  Calendar,
  ChevronDown,
  CircleAlert,
  CircleCheckBig,
  Clock,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import DeletePlan from '../images/DeletePlan.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../config';
import { SupportTicketPopup } from '../support';

const TicketHistory = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filter, setFilter] = useState('All Status');
  const [search, setSearch] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showFormPopup, setShowFormPopup] = useState(false);
  

  // ✅ Fetch tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/support/ticket`);
      setTickets(response.data.data || response.data);
      setFilteredTickets(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ✅ Theme detection
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

  useEffect(() => {
    let result = [...tickets];

    if (filter !== 'All Status') {
      result = result.filter((t) => t.status?.toLowerCase() === filter.toLowerCase());
    }

    if (search) {
      result = result.filter(
        (t) =>
          t.subject?.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTickets(result);
  }, [filter, search, tickets]);

  const handleDelete = async () => {
    if (!selectedTicket) return;
    try {
      await axios.delete(`${baseURL}/support/ticket/${selectedTicket.id}`);
      setTickets((prev) => prev.filter((t) => t.id !== selectedTicket.id));
      setShowPopup(false);
    } catch (error) {
      console.error('❌ Error deleting ticket:', error);
      alert('Failed to delete the ticket. Please try again.');
    }
  };

  const handleClick = (id) => {
    navigate(`/platform/support-ticket-detail/${id}`);
  };

  return (
    <div
      style={{
        background: isDarkMode
          ? 'linear-gradient(90deg, #3E112C, #190F21)'
          : 'linear-gradient(90deg, #FFEDF7, #F2F0FE)',
      }}
    >
      <div className="support-ticket-system-container">
        <h1 className="support-ticket-system-h1-tag">Support Tickets</h1>
        <p className="support-ticket-system-p-tag">Manage and track your support requests</p>

        <div className="ticket-actions-bar">
          <div className="ticket-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-and-new-ticket">
            <div className="custom-support-select">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option>All Status</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
              <ChevronDown className="select-icon" size={18} />
            </div>
            <button className="new-ticket-btn" onClick={() => setShowFormPopup(true)}>
              <Plus size={18} /> New Ticket
            </button>
          </div>
        </div>

        <h2 className="track-history-title mt-5 mb-3">Track History</h2>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading tickets...</p>
        ) : filteredTickets.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>No tickets found.</p>
        ) : (
         <div className="ticket-history-list">
            {filteredTickets.map((ticket) => (
              <div
                className="ticket-item"
                key={ticket.id}
                onClick={() => handleClick(ticket.id)}
                style={{ cursor: 'pointer' }}
              >
                  <div className="d-flex align-align-items-center justify-content-between" style={{width : '100%'}}>
                    <div className="ticket-header">
                    <h3>{ticket.subject}</h3>
                    <span
                      className={`ticket-status ${
                        ticket.category?.toLowerCase().includes('technical')
                          ? 'technical-issue'
                          : ticket.category?.toLowerCase().includes('feature')
                          ? 'feature-request'
                          : 'technical-issue-2'
                      }`}
                    >
                      {ticket.category || 'General'}
                    </span>
                  </div>

                  <div
                  className="d-flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {ticket.status?.toLowerCase() === 'open' ? (
                    <>
                      <Clock size={18} color="#ECBA1F" />
                      <Trash2
                        size={18}
                        color="#BF3847"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowPopup(true);
                        }}
                      />
                    </>
                  ) : ticket.status?.toLowerCase() === 'in progress' ? (
                    <CircleAlert size={18} color="#EA5D22" />
                  ) : (
                    <CircleCheckBig size={18} color="#25C560" />
                  )}
                </div>
                  </div>

                  <p className="ticket-description">{ticket.description}</p>

                  <div className="ticket-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />{' '}
                      {new Date(ticket.created_at).toLocaleString() || 'N/A'}
                    </span>
                    <span>
                      <Clock size={12} />{' '}
                      {ticket.updated_at ? new Date(ticket.updated_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>

            ))}
          </div>
        )}
      </div>

      {showPopup && (
        <DeletePopup
          onClose={() => setShowPopup(false)}
          onDelete={handleDelete}
          deleting={loading}
        />
      )}
      {showFormPopup && <SupportTicketPopup onClose={() => setShowFormPopup(false)} />}
    </div>
  );
};

export default TicketHistory;

export const DeletePopup = ({ onClose, onDelete, deleting }) => {
  return (
    <div className="confirm-logout-overlay" onClick={onClose}>
      <div
        className="confirm-logout-popup modern-confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="request-refund-close" onClick={onClose}>
          <X />
        </button>
        <div>
          <img src={DeletePlan} alt="delete" width="80px" height="80px" />
        </div>
        <h4 className="cancel-modal-title">Delete Ticket</h4>
        <p className="cancel-modal-message">
          Are you sure you want to delete this ticket?
          <br />
          This action cannot be undone.
        </p>
        <div className="cancel-modal-footer">
          <button className="keep-plan-button" onClick={onClose}>
            Cancel
          </button>
          <button className="cancel-button" onClick={onDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
