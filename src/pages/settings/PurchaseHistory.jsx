import React from 'react';
import { MdApi } from 'react-icons/md';
import '../ApiSdk.css';
import './PurchaseHistory.css';

/*
const dummyPurchases = [
  { id: 1, date: '2025-07-01', plan: 'Premiumss', amount: 29.99, status: 'Paid', method: 'Credit Card' },
  { id: 2, date: '2025-06-01', plan: 'Premium', amount: 29.99, status: 'Paid', method: 'Credit Card' },
  { id: 3, date: '2025-05-01', plan: 'Premium', amount: 29.99, status: 'Paid', method: 'Credit Card' },
  { id: 4, date: '2025-04-01', plan: 'Premium', amount: 29.99, status: 'Failed', method: 'Credit Card' },
];
*/

const PurchaseHistory = () => {
  return (
    <div className="api-sdk-container">
      <div className="api-sdk-card">
        <MdApi className="api-sdk-icon" />
        <h2 className="api-sdk-title">Coming Soon</h2>
        <div className="api-sdk-desc">
          Purchase History features are launching soon. Stay tuned!
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory; 