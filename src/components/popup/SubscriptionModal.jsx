import React, { useState, useEffect } from 'react';
import { FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import vectoImage from '../../assets/images/Vector.svg';
import videoGif from '../../assets/images/video.gif';
import LoginPopup from './LoginPopup';
import './SubscriptionModal.css';

const SubscriptionModal = ({ open, onClose }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [monthlyPlan, setMonthlyPlan] = useState({
    name: 'Starter',
    price: '29',
    duration: 'Month',
  });
  const [yearlyPlan, setYearlyPlan] = useState({ name: 'Starter', price: '290', duration: 'Year' });
  const { token } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => {
    if (showLoginModal) {
      setLoginModalVisible(true);
    }
  }, [showLoginModal]);

  const handleCloseLoginModal = () => {
    setLoginModalVisible(false);
    setTimeout(() => setShowLoginModal(false), 250);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Refresh the token state to reflect the new login
    // The useAuth hook should automatically update the token
    // Don't close the subscription modal, let user continue with plan selection
  };

  // Handler for plan buttons
  const handlePlanClick = (planInfo, e) => {
    if (e) e.preventDefault();
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    // Save selected plan info to localStorage
    localStorage.setItem('selectedPlan', JSON.stringify(planInfo));
    // Navigate to card payment page
    window.location.href = '/platform/subscription/card';
  };

  useEffect(() => {
    // Fetch plans
    axios
      .get(`${baseURL}/plan/monthly`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const data = res.data || {};
        setMonthlyPlan({
          name: data.name || 'Starter',
          price: data.price || '29',
          duration: data.duration || 'Month',
        });
      })
      .catch(() => {
        setMonthlyPlan({ name: 'Starter', price: '29', duration: 'Month' });
      });
    axios
      .get(`${baseURL}/plan/yearly`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const data = res.data || {};
        setYearlyPlan({
          name: data.name || 'Starter',
          price: data.price || '290',
          duration: data.duration || 'Year',
        });
      })
      .catch(() => {
        setYearlyPlan({ name: 'Starter', price: '290', duration: 'Year' });
      });
  }, [token]);

  if (!open) return null;

  return (
    <>
      <div className="subscription-modal-overlay" onClick={onClose}>
        <div className="subscription-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button className="subscription-modal-close" onClick={onClose}>
            <FiX />
          </button>

          {/* Modal Header */}
          <div
            className="subscription-modal-header"
            style={{
              backgroundImage: `url(${videoGif})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',

              padding: '60px',
              margin: '-40px -40px 30px -40px',
              position: 'relative',
            }}
          >
            <h2>
              Choose <span>Your </span>Plan
            </h2>
            <p>Flexible Plans to Power Your 3D Needs</p>
          </div>

          {/* Plan Toggle */}
          <div className="subscription-modal-toggle-container">
            <div className="plan-toggle">
              <div
                className={`toggle-option ${billingPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </div>
              <div
                className={`toggle-option ${billingPeriod === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingPeriod('yearly')}
              >
                Yearly
              </div>
              <div className="discount-label">
                Save from 10% <span>with yearly</span>
              </div>
            </div>
          </div>

          {/* Monthly Plans */}
          {billingPeriod === 'monthly' && (
            <div className="subscription-modal-cards monthly-plan">
              <div className="subscription-modal-card">
                <div className="card-header">
                  <span className="title mb-0">Freemium</span>
                  <div className="price-section">
                    <div className="mx-4 mb-0 para-text">
                      <span className="price">Free</span>
                      <sub className="sub-class">/14 days</sub>
                    </div>
                    <p className="mx-4 mt-0 mb-0 para-text">
                      Experience 3D All Power, No card required. Cancel any time
                    </p>
                  </div>
                </div>
                <div className="divider-container mt-0">
                  <div className="divider" />
                </div>
                <div className="features">
                  <h2>Features you'll get:</h2>
                  <ul>
                    <li>
                      <img src={vectoImage} alt="" />
                      Instance 2D to 3D conversion
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Real-time preview &amp; exports
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Access to all tools &amp; APIs
                    </li>
                  </ul>
                </div>
                <p className="card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button
                  className="plan-button"
                  onClick={(e) =>
                    handlePlanClick({ name: 'Freemium', price: 0, duration: '14 days' }, e)
                  }
                >
                  Start Free Trial
                </button>
              </div>

              <div className="subscription-modal-card popular-card">
                <div className="popular-tag">Popular</div>
                <div className="card-header">
                  <span className="title mb-0">Starter</span>
                  <div className="price-section">
                    <div className="mb-0 mx-4">
                      <span className="price">$29</span>
                      <sub className="sub-class">/Month</sub>
                    </div>
                    <p className="para-text mt-0 mb-0 mx-4">
                      $290/Year <br />
                      Unlock more powerful design tools.
                    </p>
                  </div>
                </div>
                <div className="divider-container mt-0">
                  <div className="divider" />
                </div>
                <div className="features">
                  <h2>Features you'll get:</h2>
                  <ul>
                    <li>
                      <img src={vectoImage} alt="" />
                      Instance 2D to 3D conversion
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Real-time preview &amp; exports
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Access to all tools &amp; APIs
                    </li>
                  </ul>
                </div>
                <p className="card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button
                  className="plan-button"
                  onClick={(e) =>
                    handlePlanClick({ name: 'Starter', price: 29, duration: 'Month' }, e)
                  }
                >
                  Choose Starter
                </button>
              </div>

              <div className="subscription-modal-card">
                <div className="card-header">
                  <span className="title mb-0">Pro Plan</span>
                  <div className="price-section">
                    <div className="mb-0 mx-4 mt-0 para-text">
                      <span className="price">$99</span>
                      <sub className="sub-class">/Month</sub>
                    </div>
                    <p className="para-text mt-0 mb-0 mx-4">
                      $990/Year <br />
                      Unlock more powerful design tools.
                    </p>
                  </div>
                </div>
                <div className="divider-container mt-0">
                  <div className="divider" />
                </div>
                <div className="features">
                  <h2>Features you'll get:</h2>
                  <ul>
                    <li>
                      <img src={vectoImage} alt="" />
                      Instance 2D to 3D conversion
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Real-time preview &amp; exports
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Access to all tools &amp; APIs
                    </li>
                  </ul>
                </div>
                <p className="card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button
                  className="plan-button"
                  onClick={(e) =>
                    handlePlanClick({ name: 'Pro Plan', price: 99, duration: 'Month' }, e)
                  }
                >
                  Choose Pro
                </button>
              </div>
            </div>
          )}

          {/* Yearly Plans */}
          {billingPeriod === 'yearly' && (
            <div className="subscription-modal-cards yearly-plan">
              <div className="subscription-modal-card">
                <div className="card-header">
                  <span className="title mb-0">Starter Plan</span>
                  <div className="price-section">
                    <div className="mb-0 mx-4 para-text">
                      <span className="price">$290</span>
                      <sub className="sub-class">/Year</sub>
                    </div>
                    <p className="mx-4 mt-0 mb-0 para-text">Basic conversions</p>
                  </div>
                </div>
                <div className="divider-container mt-0">
                  <div className="divider" />
                </div>
                <div className="features">
                  <h2>Features you'll get:</h2>
                  <ul>
                    <li>
                      <img src={vectoImage} alt="" />
                      Instance 2D to 3D conversion
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Real-time preview &amp; exports
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Access to all tools &amp; APIs
                    </li>
                  </ul>
                </div>
                <p className="card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button
                  className="plan-button"
                  onClick={(e) =>
                    handlePlanClick({ name: 'Starter', price: 290, duration: 'Year' }, e)
                  }
                >
                  Choose Starter
                </button>
              </div>

              <div className="subscription-modal-card">
                <div className="card-header">
                  <span className="title mb-0">Pro Plan</span>
                  <div className="price-section">
                    <div className="mb-0 mx-4">
                      <span className="price">$990</span>
                      <sub className="sub-class">/Year</sub>
                    </div>
                    <p className="mx-4 mt-0 mb-0 para-text">Unlock more powerful design tools.</p>
                  </div>
                </div>
                <div className="divider-container mt-0">
                  <div className="divider" />
                </div>
                <div className="features">
                  <h2>Features you'll get:</h2>
                  <ul>
                    <li>
                      <img src={vectoImage} alt="" />
                      Instance 2D to 3D conversion
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Real-time preview &amp; exports
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Access to all tools &amp; APIs
                    </li>
                  </ul>
                </div>
                <p className="card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button
                  className="plan-button"
                  onClick={(e) =>
                    handlePlanClick({ name: 'Pro Plan', price: 990, duration: 'Year' }, e)
                  }
                >
                  Choose Pro
                </button>
              </div>

              <div className="subscription-modal-card">
                <div className="card-header">
                  <span className="title mb-0">Enterprise Plan</span>
                  <div className="price-section">
                    <div className='mx-4' style={{ marginBottom: '31px' }}>
                      <span className="price">Custom</span>
                      <sub className="sub-class">billing</sub>
                    </div>
                    {/* <p>
                                      Contact us for enterprise pricing
                                      <br />
                                      Unlock all features.
                                    </p> */}
                  </div>
                </div>
                <div className="divider-container mt-2">
                  <div className="divider" />
                </div>
                <div className="features">
                  <h2>Features you'll get:</h2>
                  <ul>
                    <li>
                      <img src={vectoImage} alt="" />
                      Instance 2D to 3D conversion
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Real-time preview &amp; exports
                    </li>
                    <li>
                      <img src={vectoImage} alt="" />
                      Access to all tools &amp; APIs
                    </li>
                  </ul>
                </div>
                <p className="card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button
                  className="plan-button"
                  onClick={(e) =>
                    handlePlanClick({ name: 'Enterprise', price: 0, duration: 'Year' }, e)
                  }
                >
                  Contact Sales
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <LoginPopup onClose={handleCloseLoginModal} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default SubscriptionModal;
