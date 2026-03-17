import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import vectoImage from '../../assets/images/Vector.svg';
import videoGif from '../../assets/images/video.gif';
import LoginPopup from './LoginPopup';
import './SubscriptionModal.css';
import '../../pages/subscription/new.css';

// Icons
import freemiumTopIcon from '../../assets/icon/freeIcon.png';
import starterTopIcon from '../../assets/icon/starterTopIcon.png';
import premiumTopIcon from '../../assets/icon/premiumTopIcon.png';
import enterpriseTopIcon from '../../assets/icon/enterpriseTopIcon.png';

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
  };

  const handlePlanClick = async (planName, e) => {
    if (e) e.preventDefault();

    if (planName === 'Enterprise') {
      window.open('https://ai3d.com/contact-sales', '_blank');
      return;
    }

    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (activeTeam) return;

    const period = billingPeriod === 'yearly' ? 'annually' : 'monthly';
    const key = `${planName}-${period}`;
    setSubscribingPlan(key);

    try {
      const payload = { name: planName, period };
      const res = await axios.post(`${baseURL}/plan/subscribe`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const redirectUrl = res?.data?.url || res?.data?.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      console.error('Subscription error:', err);
      // Optional fallback
    } finally {
      setSubscribingPlan(null);
    }
  };

  useEffect(() => {
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
        // Keep defaults
      });
  }, [token]);

  if (!open) return null;

  return (
    <>
      <div className="subscription-modal-overlay" onClick={onClose}>
        <div className="subscription-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="subscription-modal-close" onClick={onClose}>
            <FiX />
          </button>

          <div className="subscription-modal-header">
            <h2>
              Choose <span>Your </span>Plan
            </h2>
            <p>Flexible Plans to Power Your 3D Needs</p>
          </div>

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
                Save from 20% <span>with yearly</span>
              </div>
            </div>
          </div>

          {/* ============ NEW DESIGN START ============ */}
          {billingPeriod === 'monthly' && (
            <div
              className="new-Subscription-container d-flex align-items-center justify-content-center"
              style={{ minHeight: '100vh' }}
            >
              <div className="new-subscription container">
                <div className="row justify-content-center g-4 d-flex align-items-stretch">
                  {/* Freemium */}
                  <div className="col-md-4 d-flex align-items-center">
                    <div className="sub-card sub-card-small w-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="sub-top-icon">
                          <img src={freemiumTopIcon} alt="Freemium" />
                        </div>
                        <h2 className="sub-title">Freemium</h2>
                        <h3 className="sub-price">
                          Free <span>/14 days</span>
                        </h3>
                        <p className="sub-description">
                          Perfect for testing, personal projects and learning 3D creation with AI.
                        </p>
                        <div className="sub-divider"></div>
                        <h4 className="sub-section-title">Features you'll get:</h4>
                        <div className="sub-feature-list">
                          <li>
                            <img src={vectoImage} alt="" /> 50 AI scans (2D → 3D or prompt → 3D)
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Real-time preview and export
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to all base design tools and APIs
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Community access and learning hub
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Cloud storage (2GB limit), Email support
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to public 3D model library
                          </li>
                        </div>
                      </div>
                      <div>
                        <p className="sub-bestfor">
                          <b>Best for:</b> Individual creators, freelancers, and small-scale
                          designers who want to explore AI powered 3D creation.
                        </p>
                        <button
                          className="sub-btn"
                          onClick={(e) => handlePlanClick('Freemium', e)}
                          disabled={subscribingPlan === `Freemium-monthly`}
                        >
                          {subscribingPlan === `Freemium-monthly`
                            ? 'Processing…'
                            : 'Choose Freemium'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Starter */}
                  <div className="col-md-4 d-flex">
                    <div className="sub-card sub-card-center w-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="sub-top-icon">
                          <img src={starterTopIcon} alt="Starter" />
                        </div>
                        <h2 className="sub-title">Starter</h2>
                        <h3 className="sub-price">
                          ${monthlyStarterPrice} <span>/Month</span>
                        </h3>
                        <p className="sub-year">${yearlyStarterPrice}/Year</p>
                        <p className="sub-description">
                          Perfect for testing, personal projects and learning 3D creation with AI.
                        </p>
                        <div className="sub-divider"></div>
                        <h4 className="sub-section-title">Features you'll get:</h4>
                        <div className="sub-feature-list">
                          <li>
                            <img src={vectoImage} alt="" /> 50 AI scans (2D → 3D or prompt → 3D)
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Real-time preview and export
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to all base design tools and APIs
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Community access and learning hub
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Cloud storage (2GB limit), Email support
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to public 3D model library
                          </li>
                        </div>
                      </div>
                      <div>
                        <p className="sub-bestfor">
                          <b>Best for:</b> Individual creators, freelancers, and small-scale
                          designers who want to explore AI powered 3D creation.
                        </p>
                        <button
                          className="sub-btn"
                          disabled={!!activeTeam || subscribingPlan === `Starter-monthly`}
                          onClick={(e) => handlePlanClick('Starter', e)}
                        >
                          {subscribingPlan === `Starter-monthly` ? 'Processing…' : 'Choose Starter'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Premium */}
                  <div className="col-md-4 d-flex">
                    <div className="sub-card sub-card-premium w-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="sub-badge">Most Popular</div>
                        <div className="sub-top-icon">
                          <img src={premiumTopIcon} alt="Premium" />
                        </div>
                        <h2 className="sub-title">Premium</h2>
                        <h3 className="sub-price">
                          ${monthlyProPrice} <span>/Month</span>
                        </h3>
                        <p className="sub-year">${yearlyProPrice}/Year</p>
                        <p className="sub-description">
                          Built for creators who need speed, team collaboration, and higher
                          production volume.
                        </p>
                        <div className="sub-divider"></div>
                        <h4 className="sub-section-title">Features you'll get:</h4>
                        <div className="sub-feature-list">
                          <li>
                            <img src={vectoImage} alt="" /> Multi-user team access (up to 4 members)
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> 500 AI scans/month
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Priority processing & rendering queue
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to advanced editing tools
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Private 3D asset storage (up to 50GB)
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to Beta AI features & research
                            updates
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Dedicated workspace for teams
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Priority chat + email support
                          </li>
                        </div>
                      </div>
                      <div>
                        <p className="sub-bestfor">
                          <b>Best for:</b> Small teams, studios or early-stage startups
                          collaborating on 3D projects.
                        </p>
                        <button
                          className="sub-btn"
                          disabled={!!activeTeam || subscribingPlan === `Premium-monthly`}
                          onClick={(e) => handlePlanClick('Premium', e)}
                        >
                          {subscribingPlan === `Premium-monthly` ? 'Processing…' : 'Choose Premium'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {billingPeriod === 'yearly' && (
            <div
              className="new-Subscription-container d-flex align-items-center justify-content-center"
              style={{ minHeight: '100vh' }}
            >
              <div className="new-subscription container">
                <div className="row justify-content-center g-4 d-flex align-items-stretch">
                  {/* Starter */}
                  <div className="col-md-4 d-flex">
                    <div className="sub-card sub-card-center w-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="sub-top-icon">
                          <img src={starterTopIcon} alt="Starter" />
                        </div>
                        <h2 className="sub-title">Starter</h2>
                        <h3 className="sub-price">
                          ${yearlyStarterPrice} <span>/Year</span>
                        </h3>
                        <p className="sub-year">${monthlyStarterPrice}/Month</p>
                        <p className="sub-description">
                          Perfect for testing, personal projects and learning 3D creation with AI.
                        </p>
                        <div className="sub-divider"></div>
                        <h4 className="sub-section-title">Features you'll get:</h4>
                        <div className="sub-feature-list">
                          <li>
                            <img src={vectoImage} alt="" /> 50 AI scans (2D → 3D or prompt → 3D)
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Real-time preview and export
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to all base design tools and APIs
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Community access and learning hub
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Cloud storage (2GB limit), Email support
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to public 3D model library
                          </li>
                        </div>
                      </div>
                      <div>
                        <p className="sub-bestfor">
                          <b>Best for:</b> Individual creators, freelancers, and small-scale
                          designers who want to explore AI powered 3D creation.
                        </p>
                        <button
                          className="sub-btn"
                          disabled={!!activeTeam || subscribingPlan === `Starter-annually`}
                          onClick={(e) => handlePlanClick('Starter', e)}
                        >
                          {subscribingPlan === `Starter-annually`
                            ? 'Processing…'
                            : 'Choose Starter'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Premium */}
                  <div className="col-md-4 d-flex">
                    <div className="sub-card sub-card-premium w-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="sub-badge">Most Popular</div>
                        <div className="sub-top-icon">
                          <img src={premiumTopIcon} alt="Premium" />
                        </div>
                        <h2 className="sub-title">Premium</h2>
                        <h3 className="sub-price">
                          ${yearlyProPrice} <span>/Year</span>
                        </h3>
                        <p className="sub-year">${monthlyProPrice}/Month</p>
                        <p className="sub-description">
                          Built for creators who need speed, team collaboration, and higher
                          production volume.
                        </p>
                        <div className="sub-divider"></div>
                        <h4 className="sub-section-title">Features you'll get:</h4>
                        <div className="sub-feature-list">
                          <li>
                            <img src={vectoImage} alt="" /> Multi-user team access (up to 4 members)
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> 500 AI scans/month
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Priority processing & rendering queue
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to advanced editing tools
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Private 3D asset storage (up to 50GB)
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Access to Beta AI features & research
                            updates
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Dedicated workspace for teams
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Priority chat + email support
                          </li>
                        </div>
                      </div>
                      <div>
                        <p className="sub-bestfor">
                          <b>Best for:</b> Small teams, studios or early-stage startups
                          collaborating on 3D projects.
                        </p>
                        <button
                          className="sub-btn"
                          disabled={!!activeTeam || subscribingPlan === `Premium-annually`}
                          onClick={(e) => handlePlanClick('Premium', e)}
                        >
                          {subscribingPlan === `Premium-annually`
                            ? 'Processing…'
                            : 'Choose Premium'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Enterprise */}
                  <div className="col-md-4 d-flex">
                    <div className="sub-card sub-card-center w-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="sub-top-icon">
                          <img src={enterpriseTopIcon} alt="Enterprise" />
                        </div>
                        <h2 className="sub-title">Enterprise</h2>
                        <h3 className="sub-price">
                          Custom <span>Billing</span>
                        </h3>
                        <p className="sub-description mt-3">
                          Ideal for enterprises and platforms scaling 3D asset production,
                          integrating AI3D tech within their systems.
                        </p>
                        <div className="sub-divider"></div>
                        <h4 className="sub-section-title">Features you'll get:</h4>
                        <div className="sub-feature-list">
                          <li>
                            <img src={vectoImage} alt="" /> Unlimited AI scans and conversions
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Full API + SDK integration
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> White-label platform deployment
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Advanced analytics dashboard
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> On-premise or private cloud hosting
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Team & department-level user management
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Priority GPU access
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Legal & data compliance
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> Custom AI model training
                          </li>
                          <li>
                            <img src={vectoImage} alt="" /> 24/7 premium support
                          </li>
                        </div>
                      </div>
                      <div>
                        <p className="sub-bestfor">
                          <b>Best for:</b> Large enterprises, agencies, or marketplaces needing high
                          volume API integrations.
                        </p>
                        <button
                          className="sub-btn"
                          onClick={(e) => handlePlanClick('Enterprise', e)}
                        >
                          Contact Sales
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ============ NEW DESIGN END ============ */}
        </div>
      </div>

      {showLoginModal && (
        <LoginPopup onClose={handleCloseLoginModal} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default SubscriptionModal;
