import React from 'react';
import './PurchaseHistory.css';

const dummyPurchases = [
  { id: 1, date: '2025-07-01', plan: 'Premiumss', amount: 29.99, status: 'Paid', method: 'Credit Card' },
  { id: 2, date: '2025-06-01', plan: 'Premium', amount: 29.99, status: 'Paid', method: 'Credit Card' },
  { id: 3, date: '2025-05-01', plan: 'Premium', amount: 29.99, status: 'Paid', method: 'Credit Card' },
  { id: 4, date: '2025-04-01', plan: 'Premium', amount: 29.99, status: 'Failed', method: 'Credit Card' },
];

const PurchaseHistory = () => {
  return (
    <div className="purchase-history-container">
      <h2 className="text-center">No Purchase History</h2>
      
    </div>
  );
};

export default PurchaseHistory; 