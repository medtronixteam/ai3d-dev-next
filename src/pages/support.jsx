import React from 'react';
import { MdApi } from 'react-icons/md';

import './ApiSdk.css';

export default function Support() {
  return (
    <div className="api-sdk-container">
      <div className="api-sdk-card">
         <MdApi className="api-sdk-icon" />
        <h2 className="api-sdk-title">Coming Soon</h2>
        <div className="api-sdk-desc">
          Support features are launching soon. Stay tuned!
        </div>
      </div>
    </div>
  );
} 