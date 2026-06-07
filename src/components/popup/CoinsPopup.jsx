import React from 'react';
import './CoinsPopup.css';
import { RxCross2 } from 'react-icons/rx';
import { MdApi } from 'react-icons/md';
import '../../pages/ApiSdk.css';

/*
import axios from 'axios';
import UpgradeCoin from '../../assets/images/UpgradeCoin.svg';
import TotalCoin from '../../assets/images/TotalCoins.svg';
import { baseURL } from '../../config';
import { FiCheck } from 'react-icons/fi';
*/

const CoinsPopup = ({ onClose, coins, onCoinsUpdate }) => {
  /*
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

      const errorMessage = error.response?.data?.message || '';
      const isEmailError =
        errorMessage.includes('htmlspecialchars') ||
        errorMessage.includes('Illuminate\\Mail\\Message') ||
        errorMessage.includes('custom_notification.blade.php');

      if (isEmailError) {
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
        const errorMsg =
          error.response?.data?.message || 'Failed to transfer coins. Please try again.';
        setMessage({ text: errorMsg, type: 'error' });
      }
    } finally {
      setTransferLoading(false);
    }
  };
  */

  return (
    <section>
      <div className="shared-coins-overlay" onClick={onClose}>
        <div className="shared-coins-content position-relative" onClick={(e) => e.stopPropagation()}>
          <RxCross2 onClick={onClose} className="coins-popup-cross-btn" style={{ fontSize: '12px' }} />
          <div className="api-sdk-container" style={{ minHeight: 'auto', padding: '60px 40px' }}>
            <div className="api-sdk-card" style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}>
              <MdApi className="api-sdk-icon" />
              <h2 className="api-sdk-title">Coming Soon</h2>
              <div className="api-sdk-desc">
                Coins features are launching soon. Stay tuned!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoinsPopup;

