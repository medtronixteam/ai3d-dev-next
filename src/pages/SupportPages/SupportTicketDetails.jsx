import React, { useEffect, useState } from 'react';
import './SupportTicketDetails.css';
import { ArrowLeft, ArrowRight, Calendar, CircleAlert, MessageSquare, Send, Tag, User } from 'lucide-react';

const SupportTicketDetails = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <div style={{ background: isDarkMode
      ? "linear-gradient(90deg, #3E112C, #190F21)"
      : "linear-gradient(90deg, #FFEDF7, #F2F0FE)" }}>
      <div className="support-ticket-system-container">
        <h1 className="support-ticket-system-h1-tag">Support Tickets</h1>
        <p className="support-ticket-system-p-tag">Manage and track your support requests</p>

        <div className="ticket-header mt-4">
          <button className="ticket-back-button">
            <ArrowLeft size={16} /> Back to ticket
          </button>
          <div className="d-flex flex-column gap-2">
            <h1 className="ticket-title">Login Issue - Cannot Access Account</h1>
            <div className="ticket-tags">
              <span className="tag technical">Technical Issue</span>
              {/* <span className="tag medium">Medium</span> */}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-7 px-0 px-lg-2">
              <div className="ticket-section">
                <h3>Description:</h3>
                <p>
                  After the latest window update last night, I'm unable to login. I have tried
                  restarting multiple times but the issue persists. Error code: 0x000000765
                </p>
              </div>

              <div className="ticket-section ticket-comments-section">
                <h3><MessageSquare size={20} /> Comments (1)</h3>

                <div className="ticket-comment">
                  <div className="ticket-comment-header">
                    <span className="ticket-comment-author"><User size={16} /> john.doe@company.com</span>
                    <span className="ticket-comment-date">Jan 15, 2025, 09:30 AM</span>
                  </div>
                  <p className="ticket-comment-text">
                    Thanks for reporting this. I'll investigate the window update compatibility
                    issue. Can you please tell me the exact model of your computer?
                  </p>
                </div>

                <div className="ticket-add-comment">
                  <input type="text" placeholder="Add a comment..." />
                  <button className="ticket-add-comment-button"><Send size={16} /> Add comment</button>
                </div>
              </div>
            </div>

            {/* Right Column (col-md-7) */}
            <div className="col-md-5 px-0 px-lg-2">
              <div className="ticket-section ticket-info">
                <h3>Ticket Information</h3>
                <div className="ticket-info-item mt-3">
                  <span className="ticket-icon"><Tag size={16} color= {isDarkMode ? '#dadada' : '#666'} /></span>
                  <span className="ticket-label">Category:</span>
                  <span className="ticket-value">Technical Issue</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-icon"><User size={16} color={isDarkMode ? '#dadada' : '#666'} /></span>
                  <span className="ticket-label">Submitted by:</span>
                  <span className="ticket-value">User@company.com</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-icon"><Calendar size={16} color={isDarkMode ? '#dadada' : '#666'} /></span>
                  <span className="ticket-label">Created:</span>
                  <span className="ticket-value">Jan 15, 2025, 09:30 AM</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-icon"><Calendar size={16} color={isDarkMode ? '#dadada' : '#666'} /></span>
                  <span className="ticket-label">Updated:</span>
                  <span className="ticket-value">Jan 15, 2025, 10:30 AM</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-icon"><User size={16} color={isDarkMode ? '#dadada' : '#666'} /></span>
                  <span className="ticket-label">Assigned to:</span>
                  <span className="ticket-value">john.doe@company.com</span>
                </div>
              </div>

              <div className="ticket-section ticket-urgent-help">
                <h3><CircleAlert size={18} color='#165EFC' /> Need Urgent Help?</h3>
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
