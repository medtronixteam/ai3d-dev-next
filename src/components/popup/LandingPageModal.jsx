import React, { useState, useEffect } from 'react';
import { FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import vectoImage from '../../assets/images/Vector.svg';
import videoGif from '../../assets/images/video.gif';
import LoginPopup from './LoginPopup';
import './LandingPageModal.css';

const LandingPageModal = ({ open, onClose, onRequireLogin }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [monthlyStarterPrice, setMonthlyStarterPrice] = useState(29);
  const [monthlyProPrice, setMonthlyProPrice] = useState(99);
  const [yearlyStarterPrice, setYearlyStarterPrice] = useState(290);
  const [yearlyProPrice, setYearlyProPrice] = useState(990);
  const { token } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [subscribingPlan, setSubscribingPlan] = useState(null);

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
  const handlePlanClick = async (planInfo, e) => {
    if (e) e.preventDefault();
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    try {
      const period = billingPeriod === 'yearly' ? 'annually' : 'monthly';
      const payload = { name: planInfo?.name, period };
      setSubscribingPlan(`${planInfo?.name}-${period}`);
      const res = await axios.post(`${baseURL}/plan/subscribe`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const redirectUrl = res?.data?.url || res?.data?.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      try {
        window.location.href = '/platform/subscription/card';
      } catch (_) {}
    } finally {
      setSubscribingPlan(null);
    }
  };

  useEffect(() => {
    // Fetch all plans and set Starter/Pro prices for monthly and annually
    axios
      .get(`${baseURL}/plans`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const data = res?.data || {};
        const monthly = Array.isArray(data?.monthly)
          ? data?.monthly
          : Array.isArray(data?.plans?.monthly)
            ? data?.plans?.monthly
            : [];
        const annually = Array.isArray(data?.annually)
          ? data?.annually
          : Array.isArray(data?.plans?.annually)
            ? data?.plans?.annually
            : Array.isArray(data?.yearly)
              ? data?.yearly
              : Array.isArray(data?.plans?.yearly)
                ? data?.plans?.yearly
                : [];

        const getPrice = (arr, planName, fallback) => {
          const found = arr.find((p) => (p?.name || '').toLowerCase().includes(planName));
          const price = found?.price ?? found?.amount ?? found?.unit_amount;
          return Number(price) || fallback;
        };

        setMonthlyStarterPrice(getPrice(monthly, 'starter', 29));
        setMonthlyProPrice(getPrice(monthly, 'pro', 99));
        setYearlyStarterPrice(getPrice(annually, 'starter', 290));
        setYearlyProPrice(getPrice(annually, 'pro', 990));
      })
      .catch(() => {
        // keep defaults
      });
  }, [token]);

  if (!open) return null;

  return (
    <>
      <div className="sublanding-modal-overlay" onClick={onClose}>
        <div className="sublanding-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button className="sublanding-modal-close" onClick={onClose}>
            <FiX />
          </button>

          {/* Modal Header */}
          <div
            className="sublanding-modal-header"
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
          <div className="sublanding-modal-toggle-container">
            <div className="sublanding-plan-toggle">
              <div
                className={`sublanding-toggle-option ${billingPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </div>
              <div
                className={`sublanding-toggle-option ${billingPeriod === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingPeriod('yearly')}
              >
                Yearly
              </div>
              <div className="sublanding-discount-label">
                Save from 20% <span>with yearly</span>
              </div>
            </div>
          </div>

          {/* Monthly Plans */}
          {billingPeriod === 'monthly' && (
            <div className="sublanding-modal-cards monthly-plan">
              <div className="sublanding-modal-card">
                <div className="sublanding-card-header">
                  <span className="sublanding-title mb-0">Starter</span>
                  <div className="sublanding-price-section">
                    <div className="mx-4 mb-0 sublanding-para-text">
                      <span className="sublanding-price">{`$${monthlyStarterPrice}`}</span>
                      <sub className="sublanding-sub-class">/Month</sub>
                    </div>
                    <p className="mx-4 mt-0 mb-0 sublanding-para-text">
                      Unlock more powerful design tools.
                    </p>
                  </div>
                </div>
                <div className="sublanding-divider-container mt-0">
                  <div className="sublanding-divider" />
                </div>
                <div className="sublanding-features">
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
                <p className="sublanding-card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button className="sublanding-plan-button" disabled={subscribingPlan === `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Starter' }, e)}>
                  {subscribingPlan === `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Choose Starter'}
                </button>
              </div>

              <div className="sublanding-modal-card sublanding-popular-card">
                <div className="sublanding-popular-tag">Popular</div>
                <div className="sublanding-card-header">
                  <span className="sublanding-title mb-0">Pro Plan</span>
                  <div className="sublanding-price-section">
                    <div className="mb-0 mx-4">
                      <span className="sublanding-price">{`$${monthlyProPrice}`}</span>
                      <sub className="sublanding-sub-class">/Month</sub>
                    </div>
                    <p className="sublanding-para-text mt-0 mb-0 mx-4">
                      Unlock more powerful design tools.
                    </p>
                  </div>
                </div>
                <div className="sublanding-divider-container mt-0">
                  <div className="sublanding-divider" />
                </div>
                <div className="sublanding-features">
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
                <p className="sublanding-card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button className="sublanding-plan-button" disabled={subscribingPlan === `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Pro' }, e)}>
                  {subscribingPlan === `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Choose Pro'}
                </button>
              </div>

              <div className="sublanding-modal-card">
                <div className="sublanding-card-header">
                  <span className="sublanding-title mb-0">Enterprise Plan</span>
                  <div className="sublanding-price-section">
                    <div className="mb-0 mx-4 mt-0 sublanding-para-text">
                      <span className="sublanding-price">Custom</span>
                      <sub className="sublanding-sub-class">billing</sub>
                    </div>
                    {/* <p className="sublanding-para-text mt-0 mb-0 mx-4">
                      $990/Year <br />
                      Unlock more powerful design tools.
                    </p> */}
                  </div>
                </div>
                <div className="sublanding-divider-container mt-0">
                  <div className="sublanding-divider" />
                </div>
                <div className="sublanding-features">
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
                <p className="sublanding-card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button className="sublanding-plan-button" disabled={subscribingPlan === `Enterprise-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Enterprise' }, e)}>
                  {subscribingPlan === `Enterprise-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Contact Sales'}
                </button>
              </div>
            </div>
          )}

          {/* Yearly Plans */}
          {billingPeriod === 'yearly' && (
            <div className="sublanding-modal-cards sublanding-yearly-plan">
              <div className="sublanding-modal-card">
                <div className="sublanding-card-header">
                  <span className="sublanding-title mb-0">Starter Plan</span>
                  <div className="sublanding-price-section">
                    <div className="mb-0 mx-4 sublanding-para-text">
                      <span className="sublanding-price">{`$${yearlyStarterPrice}`}</span>
                      <sub className="sublanding-sub-class">/Year</sub>
                    </div>
                    <p className="mx-4 mt-0 mb-0 sublanding-para-text">Basic conversions</p>
                  </div>
                </div>
                <div className="sublanding-divider-container mt-0">
                  <div className="sublanding-divider" />
                </div>
                <div className="sublanding-features">
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
                <p className="sublanding-card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button className="sublanding-plan-button" disabled={subscribingPlan === `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Starter' }, e)}>
                  {subscribingPlan === `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Choose Starter'}
                </button>
              </div>

              <div className="sublanding-modal-card">
                <div className="popular-tag">Popular</div>
                <div className="sublanding-card-header">
                  <span className="sublanding-title mb-0">Pro Plan</span>
                  <div className="sublanding-price-section">
                    <div className="mb-0 mx-4">
                      <span className="sublanding-price">{`$${yearlyProPrice}`}</span>
                      <sub className="sublanding-sub-class">/Year</sub>
                    </div>
                    <p className="mx-4 mt-0 mb-0 sublanding-para-text">
                      Unlock more powerful design tools.
                    </p>
                  </div>
                </div>
                <div className="sublanding-divider-container mt-0">
                  <div className="sublanding-divider" />
                </div>
                <div className="sublanding-features">
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
                <p className="sublanding-card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button className="sublanding-plan-button" disabled={subscribingPlan === `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Pro' }, e)}>
                  {subscribingPlan === `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Choose Pro'}
                </button>
              </div>

              <div className="sublanding-modal-card">
                <div className="sublanding-card-header">
                  <span className="sublanding-title mb-0">Enterprise Plan</span>
                  <div className="sublanding-price-section">
                    <div className="mx-4" style={{ marginBottom: '31px' }}>
                      <span className="sublanding-price">Custom</span>
                      <sub className="sublanding-sub-class">billing</sub>
                    </div>
                    {/* <p>
                                      Contact us for enterprise pricing
                                      <br />
                                      Unlock all features.
                                    </p> */}
                  </div>
                </div>
                <div className="sublanding-divider-container mt-2">
                  <div className="sublanding-divider" />
                </div>
                <div className="sublanding-features">
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
                <p className="sublanding-card-footer">
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify
                  you 2 days before your trial ends.
                </p>
                <button className="sublanding-plan-button" disabled={subscribingPlan === `Enterprise-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Enterprise' }, e)}>
                  {subscribingPlan === `Enterprise-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Contact Sales'}
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

export default LandingPageModal;
