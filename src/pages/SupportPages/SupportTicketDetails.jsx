import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './SupportTicketDetails.css';
import { ArrowLeft, Calendar, CircleAlert, Mail, MessageSquare, Send, Tag, User } from 'lucide-react';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';

const SupportTicketDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  // Check theme
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

  // Fetch ticket details by ID
  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/support/ticket/${id}`);
        console.log('Ticket details response:', response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setTicket(response.data[0]); // <-- fix here
        } else {
          setTicket(null);
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const response = await axios.put(`${baseURL}/support/ticket/${id}`, {
        message: newComment.trim(),
      });
      console.log('Comment response:', response.data);

      setTicket((prev) => ({
        ...prev,
        comments: [
          ...prev.comments,
          {
            text: newComment.trim(),
            author: 'You',
            created_at: new Date().toISOString(),
          },
        ],
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading ticket details...</div>;
  if (!ticket) return <div className="error">Ticket not found.</div>;

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

        <div className="ticket-header mt-4">
          <button className="ticket-back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back to ticket
          </button>
          <div className="d-flex flex-column gap-2">
            <h1 className="ticket-title">{ticket.subject}</h1>
            <div className="ticket-tags">
              <span className="tag technical">{ticket.category}</span>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            {/* Left Column */}
            <div className="col-md-7 px-0 px-lg-2">
              <div className="ticket-section mt-3 mt-lg-0">
                <h3>Description:</h3>
                <p>{ticket.description}</p>
              </div>

              <div className="ticket-section ticket-comments-section">
                <h3>
                  <MessageSquare size={20} /> Comments ({ticket.comments?.length || 0})
                </h3>

                {ticket.comments?.map((comment, index) => (
                  <div key={index} className="ticket-comment">
                    <div className="ticket-comment-header">
                      <span className="ticket-comment-author">
                        <User size={16} /> {comment.from || 'User'}
                      </span>
                       {/* {user?.email || 'User@company.com'} */}
                      <span className="ticket-comment-date">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="ticket-comment-text">{comment.message || comment.text}</p>
                  </div>
                ))}

                <div className="ticket-add-comment">
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submitting}
                  />
                  <button
                    className="ticket-add-comment-button"
                    onClick={handleAddComment}
                    disabled={submitting}
                  >
                    <Send size={16} /> {submitting ? 'Adding...' : 'Add comment'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-5 px-0 px-lg-2">
              <div className="ticket-section ticket-info">
                <h3>Ticket Information</h3>
                <div className="ticket-info-item mt-3">
                  <span className="ticket-icon">
                    <Tag size={16} color={isDarkMode ? '#dadada' : '#666'} />
                  </span>
                  <span className="ticket-label">Category:</span>
                  <span className="ticket-value">{ticket.category}</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-icon">
                    <User size={16} color={isDarkMode ? '#dadada' : '#666'} />
                  </span>
                  <span className="ticket-label">Submitted by:</span>
                  <span className="ticket-value">{user?.email || 'User@company.com'}</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-icon">
                    <Calendar size={16} color={isDarkMode ? '#dadada' : '#666'} />
                  </span>
                  <span className="ticket-label">Created:</span>
                  <span className="ticket-value">
                    {new Date(ticket.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-icon">
                    <Calendar size={16} color={isDarkMode ? '#dadada' : '#666'} />
                  </span>
                  <span className="ticket-label">Updated:</span>
                  <span className="ticket-value">
                    {new Date(ticket.updated_at).toLocaleString()}
                  </span>
                </div>
                {/* <div className="ticket-info-item">
                  <span className="ticket-icon"><User size={16} color={isDarkMode ? '#dadada' : '#666'} /></span>
                  <span className="ticket-label">Assigned to:</span>
                  <span className="ticket-value">{ticket.assigned_to || 'Unassigned'}</span>
                </div> */}
              </div>

              <div className="ticket-section ticket-urgent-help">
                <h3>
                  <CircleAlert size={18} color="#165EFC" /> Need Urgent Help?
                </h3>
                <p>For critical issues, contact IT directly at ext.2345 or emergency hotline.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketDetails;
