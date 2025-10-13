import React from 'react';
import { MdApi } from 'react-icons/md';
import './Account.css';

const ComingSoonCard = () => (
  <div className="account-coming-soon-container Team-section-card">
    <div className="account-coming-soon-card">
      <MdApi className="account-coming-soon-icon" />
      <h2 className="account-coming-soon-title">Coming Soon</h2>
      <div className="account-coming-soon-desc">This features are launching soon. Stay tuned!</div>
    </div>
  </div>
);

export default ComingSoonCard;
