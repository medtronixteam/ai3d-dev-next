import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './CoinsPopup.css';
import UpgradeCoin from '../../assets/images/UpgradeCoin.svg';
import TotalCoin from '../../assets/images/TotalCoins.svg';
import { baseURL } from '../../config';
import { FiCheck } from 'react-icons/fi';

const CoinsPopup = ({ onClose, coins, onCoinsUpdate }) => {
  const amounts = [50, 100, 150, 200, 250, 300, 350, 'Custom'];
  const [activeAmount, setActiveAmount] = useState(null);
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchPerformed, setSearchPerformed] = useState(false);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!email) {
      setUsers([]);
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleEmailSearch(email);
      setSearchPerformed(true);
    }, 3000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [email]);

  function getInitials(name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  // 🔹 Email search function
  const handleEmailSearch = async (value) => {
    if (!value) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${baseURL}/referral/search/email`, {
        email: value.toLowerCase().trim(),
      });

      const usersList = response.data?.data || response.data || [];
      setUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      console.error('Error searching email:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Transfer Coins
  const handleTransferCoins = async () => {
    if (!selectedEmail) {
      setMessage({ text: 'Please select an email first!', type: 'error' });
      return;
    }

    let amountToSend = activeAmount === 'Custom' ? customAmount : activeAmount;
    if (!amountToSend || isNaN(amountToSend)) {
      setMessage({ text: 'Please select or enter a valid coin amount!', type: 'error' });
      return;
    }

    const parsedCoins = coins;
    const amountNum = Number(amountToSend);

    if (amountNum > parsedCoins) {
      setMessage({ text: 'Insufficient coins. Please enter a lower amount!', type: 'error' });
      return;
    }

    try {
      setTransferLoading(true);
      setMessage({ text: '', type: '' });

      const response = await axios.post(`${baseURL}/referral/transfer/coins`, {
        email: selectedEmail,
        coins: amountNum,
      });

      const isSuccess = response.status === 200 || response.status === 201;

      if (isSuccess) {
        // Show success message
        setMessage({ text: 'Coins transferred successfully!', type: 'success' });

        if (onCoinsUpdate) {
          const amountNum = Number(amountToSend);
          onCoinsUpdate(amountNum);
        }

        setTimeout(() => {
          setSelectedEmail(null);
          setActiveAmount(null);
          setCustomAmount('');
          setEmail('');
          setUsers([]);
          setMessage({ text: '', type: '' });
        }, 1500);
      }
    } catch (error) {
      console.error('Coin transfer failed:', error);

      // Check if error is related to email notification (backend issue)
      const errorMessage = error.response?.data?.message || '';
      const isEmailError =
        errorMessage.includes('htmlspecialchars') ||
        errorMessage.includes('Illuminate\\Mail\\Message') ||
        errorMessage.includes('custom_notification.blade.php');

      if (isEmailError) {
        // Coins were transferred but email notification failed
        setMessage({
          text: 'Coins transferred successfully!!',
          type: 'success',
        });

        if (onCoinsUpdate) {
          const amountNum = Number(amountToSend);
          onCoinsUpdate(amountNum);
        }

        setTimeout(() => {
          setSelectedEmail(null);
          setActiveAmount(null);
          setCustomAmount('');
          setEmail('');
          setUsers([]);
          setMessage({ text: '', type: '' });
        }, 2000);
      } else {
        // Actual transfer failure
        const errorMsg =
          error.response?.data?.message || 'Failed to transfer coins. Please try again.';
        setMessage({ text: errorMsg, type: 'error' });
      }
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <section>
      <div className="shared-coins-overlay" onClick={onClose}>
        <div className="shared-coins-content" onClick={(e) => e.stopPropagation()}>
          <div className="shared-coins-header">
            <h1>Share Coins</h1>
            <p>Send coins to friends & family</p>
          </div>

          <div className="total-coins-img-container">
            <img src={TotalCoin} alt="image" />
            <div className="total-coins-text">
              <h2>{coins.toLocaleString()}</h2>
              <p>Available Coins</p>
            </div>
          </div>

          <div className="shared-coins-sub-header">
            <h3>Quick Amount</h3>

            <div className="quick-amount-select">
              {amounts.map((amt, idx) => (
                <span
                  key={idx}
                  className={activeAmount === amt ? 'active' : ''}
                  onClick={() => setActiveAmount(amt)}
                >
                  {amt}
                </span>
              ))}
            </div>

            {activeAmount === 'Custom' && (
              <div className="d-flex flex-column mt-4">
                <label htmlFor="amount" className="enter-amount-label">
                  Enter Amount
                </label>
                <div className="coin-input-container">
                  <img src={UpgradeCoin} alt="coin" className="coin-icon" />
                  <input
                    type="number"
                    placeholder="Enter Coins to Send"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                </div>
              </div>
            )}

            {message.text && (
              <p
                className="mt-3"
                style={{
                  color: message.type === 'success' ? '#2bc155' : '#e74c3c',
                  fontWeight: '600',
                  margin: '0',
                  fontSize: '14px',
                }}
              >
                {message.text}
              </p>
            )}

            {/* 🔹 Email Search */}
            <div className="d-flex flex-column mt-2">
              <label htmlFor="email" className="enter-amount-label">
                Send to
              </label>
              <input
                type="text"
                placeholder="Enter email address"
                className="email-input-container"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSearchPerformed(false);
                  setUsers([]);
                }}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSearch(email);
                    setSearchPerformed(true);
                  }
                }}
              />
            </div>

            {/* 🔹 Email Suggestions */}
            <div className="share-coin-user-list mt-2">
              {loading && <p>Searching...</p>}

              {!loading &&
                users.length > 0 &&
                users.map((user, index) => (
                  <div
                    key={index}
                    className={`share-coin-user-item ${selectedEmail === user.email ? 'selected' : ''}`}
                    onClick={() =>
                      setSelectedEmail(selectedEmail === user.email ? null : user.email)
                    }
                  >
                    <div className="share-coin-avatar">{getInitials(user.name)}</div>
                    <div className="share-coin-user-info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>

                    {selectedEmail === user.email && (
                      <div className="selected-share-coin-icon">
                        <FiCheck
                          size={15}
                          color="#fff"
                          className="d-flex align-items-center justify-content-center"
                        />
                      </div>
                    )}
                  </div>
                ))}

              {!loading && searchPerformed && email && users.length === 0 && (
                <p>No results found</p>
              )}
            </div>

            <div className="d-flex align-items-center justify-content-center mb-4 mt-2">
              <button
                className="share-coin-send-email-btn"
                onClick={handleTransferCoins}
                disabled={transferLoading}
              >
                {transferLoading ? 'Sending...' : 'Send Coins'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoinsPopup;
