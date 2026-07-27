import React, { useEffect, useState } from 'react';
import './NotifyMeEmailModal.css';

const NotifyMeEmailModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email.trim());
  };

  return (
    <div className="notify-me-overlay" onClick={onClose} role="presentation">
      <div
        className="notify-me-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notify-me-title"
      >
        <button type="button" className="notify-me-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>

        <h3 id="notify-me-title" className="notify-me-title">
          Get launch updates
        </h3>
        <p className="notify-me-desc">Enter your email and we&apos;ll notify you when it&apos;s ready.</p>

        <form onSubmit={handleSubmit}>
          <label className="notify-me-label" htmlFor="notify-me-email">
            Email address
          </label>
          <input
            id="notify-me-email"
            type="email"
            className="notify-me-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            disabled={loading}
          />

          <button type="submit" className="notify-me-submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Notify Me'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotifyMeEmailModal;
