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
  const [monthlyStarterPrice, setMonthlyStarterPrice] = useState(29);
  const [monthlyProPrice, setMonthlyProPrice] = useState(99);
  const [yearlyStarterPrice, setYearlyStarterPrice] = useState(290);
  const [yearlyProPrice, setYearlyProPrice] = useState(990);
  const { token, activeTeam } = useAuth();
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

  // Handler for plan buttons -> subscribe and redirect URL
  const handlePlanClick = async (planInfo, e) => {
    if (e) e.preventDefault();
    if (activeTeam) return; // Disable subscription actions in team mode
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
      <div className="subscription-modal-overlay" onClick={onClose}>
        <div className="subscription-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button className="subscription-modal-close" onClick={onClose}>
            <FiX />
          </button>

          {/* Modal Header */}
          <div
            className="subscription-modal-header"
            // style={{
            //   backgroundImage: `url(${videoGif})`,
            //   backgroundSize: 'cover',
            //   backgroundPosition: 'center',
            //   backgroundRepeat: 'no-repeat',

            //   padding: '60px',
            //   margin: '-40px -40px 30px -40px',
            //   position: 'relative',
            // }}
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

          {/* Monthly Plans (Freemium removed): Starter, Pro (Popular), Enterprise */}
          {billingPeriod === 'monthly' && (
            <div className="subscription-modal-cards monthly-plan">
              <div className="subscription-modal-card">
                <div className="card-header">
                  <span className="title mb-0">Starter</span>
                  <div className="price-section">
                    <div className="mb-0 mx-4">
                      <span className="price">{`$${monthlyStarterPrice}`}</span>
                      <sub className="sub-class">/Month</sub>
                    </div>
                    <p className="para-text mt-0 mb-0 mx-4">Unlock more powerful design tools.</p>
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
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify you 2 days before your trial ends.
                </p>
                <button className="plan-button" disabled={!!activeTeam || subscribingPlan === `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Starter' }, e)}>
                  {subscribingPlan === `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Choose Starter'}
                </button>
              </div>

              <div className="subscription-modal-card popular-card">
                <div className="popular-tag">Popular</div>
                <div className="card-header">
                  <span className="title mb-0">Pro Plan</span>
                  <div className="price-section">
                    <div className="mb-0 mx-4 mt-0 para-text">
                      <span className="price">{`$${monthlyProPrice}`}</span>
                      <sub className="sub-class">/Month</sub>
                    </div>
                    <p className="para-text mt-0 mb-0 mx-4">Unlock more powerful design tools.</p>
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
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify you 2 days before your trial ends.
                </p>
                <button className="plan-button" disabled={!!activeTeam || subscribingPlan === `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Pro' }, e)}>
                  {subscribingPlan === `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Choose Pro'}
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
                  At the end of 14 days, you can choose a plan that fits your needs. We'll notify you 2 days before your trial ends.
                </p>
                <button className="plan-button" disabled={!!activeTeam || subscribingPlan === `Enterprise-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Enterprise' }, e)}>
                  {subscribingPlan === `Enterprise-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Contact Sales'}
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
                      <span className="price">{`$${yearlyStarterPrice}`}</span>
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
                <button className="plan-button" disabled={!!activeTeam || subscribingPlan === `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Starter' }, e)}>
                  {subscribingPlan === `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Choose Starter'}
                </button>
              </div>

              <div className="subscription-modal-card popular-card">
                <div className="popular-tag">Popular</div>
                <div className="card-header">
                  <span className="title mb-0">Pro Plan</span>
                  <div className="price-section">
                    <div className="mb-0 mx-4">
                      <span className="price">{`$${yearlyProPrice}`}</span>
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
                <button className="plan-button" disabled={!!activeTeam || subscribingPlan === `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Pro' }, e)}>
                  {subscribingPlan === `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}` ? 'Processing…' : 'Choose Pro'}
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
                <button className="plan-button" disabled={!!activeTeam || subscribingPlan === `Enterprise-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`} onClick={(e) => handlePlanClick({ name: 'Enterprise' }, e)}>
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

export default SubscriptionModal;
