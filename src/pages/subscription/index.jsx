import React, { useState, useEffect } from 'react';
// import './Subscription.css'
import './plan.css';
import { useNavigate } from 'react-router-dom';
import CardPayment from './CardPayment';
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import vectoImage from '../../assets/images/Vector.svg';
import videoGif from '../../assets/images/video.gif';
import { FiPower, FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import LoginPopup from '../../components/popup/LoginPopup';
import side2 from '../../assets/images/side2.svg';

const Subscription = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const navigate = useNavigate();
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

  // Handler for plan buttons
  const handlePlanClick = (planInfo, e) => {
    if (e) e.preventDefault();
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    // Save selected plan info to localStorage
    localStorage.setItem('selectedPlan', JSON.stringify(planInfo));
    window.open('/platform/subscription/card', '_blank');
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

  return (
    <>
      {/* =================== Hero Section ============= */}
      <section
        className="subscription-hero-section p-5"
        style={{
          backgroundImage: `url(${videoGif})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',

          height: '200px',
          minHeight: 'unset',
          maxHeight: '220px',
          overflow: 'hidden',

          overflowX: 'hidden',
        }}
      >
        <div className="container">
          <div className="row justify-content-center align-items-center text-center">
            <div className="col-md-6 text-center">
              <h2 id="subscription-hero-title">
                Choose <span>Your </span>Plan
              </h2>
              <p id="subscription-hero-subtitle">Flexible Plans to Power Your 3D Needs</p>
            </div>
          </div>
        </div>
      </section>
      {/* =================== Hero Section End ============= */}

      {/* <div className="">
  <h6><span>Save from 10%</span>with yearly</h6>
  </div> */}
      {/* Monthly Plans Section */}
      <div className="pricing-section" style={{ overflowX: 'hidden' }}>
        <div className="pricing-container" style={{ position: 'relative' }}>
          {/* Floating icon for toggling plans with smooth animation */}
          <div
            className={`plan-toggle-float-btn-anim${billingPeriod === 'monthly' ? ' right' : ' left'}`}
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            title={billingPeriod === 'monthly' ? 'Switch to Yearly' : 'Switch to Monthly'}
            style={{ zIndex: 10 }}
          >
            {billingPeriod === 'monthly' ? <FiArrowRight size={24} /> : <FiArrowLeft size={24} />}
          </div>
          <style>{`
            .plan-toggle-float-btn-anim {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              background: #e6339a;
              color: #fff;
              border: none;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px #e6339a33;
              cursor: pointer;
              transition: left 0.35s cubic-bezier(.4,1.7,.6,1), right 0.35s cubic-bezier(.4,1.7,.6,1);
              padding: 0;
            }
            .plan-toggle-float-btn-anim.right {
              right: -16px;
              left: auto;
            }
            .plan-toggle-float-btn-anim.left {
              left: -16px;
              right: auto;
            }
          `}</style>
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
              Save from 10% <span style={{ color: '#000000' }}>with yearly</span>
            </div>
          </div>
          {billingPeriod === 'monthly' && (
            <div className="pricing-cards monthly-plan">
              {/* Monthly plan cards here (same as before) */}
              <div className="pricing-card">
                <div className="card-header">
                  <span className="title">Freemium</span>
                  <div className="price-section">
                    <div>
                      <span className="price">Free</span>
                      <sub className="sub-class">/14 days</sub>
                    </div>
                    <p>Experience 3D All Power, No card required. Cancel any time</p>
                  </div>
                </div>
                <div className="divider-container">
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
              <div className="popular-card">
                <div className="popular-tag">Popular</div>
                <div className="pricing-card">
                  <div className="card-header">
                    <span className="title">Starter</span>
                    <div className="price-section">
                      <div>
                        <span className="price">$29</span>
                        <sub className="sub-class">/Month</sub>
                      </div>
                      <p>
                        $290/Year <br />
                        Unlock more powerful design tools.
                      </p>
                    </div>
                  </div>
                  <div className="divider-container">
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
              </div>
              <div className="pricing-card">
                <div className="card-header">
                  <span className="title">Pro Plan</span>
                  <div className="price-section">
                    <div>
                      <span className="price">$99</span>
                      <sub className="sub-class">/Month</sub>
                    </div>
                    <p>
                      $990/Year <br />
                      Unlock more powerful design tools.
                    </p>
                  </div>
                </div>
                <div className="divider-container">
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
          {billingPeriod === 'yearly' && (
            <div className="pricing-cards yearly-plan">
              {/* Yearly plan cards here (copy or adjust as needed) */}
              <div className="pricing-card">
                <div className="card-header">
                  <span className="title">Starter Plan</span>
                  <div className="price-section">
                    <div>
                      <span className="price">$290</span>
                      <sub className="sub-class">/Year</sub>
                    </div>
                    <p>Basic conversions</p>
                  </div>
                </div>
                <div className="divider-container">
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
              <div className="pricing-card">
                <div className="card-header">
                  <span className="title">Pro Plan</span>
                  <div className="price-section">
                    <div>
                      <span className="price">$990</span>
                      <sub className="sub-class">/Year</sub>
                    </div>
                    <p>Unlock more powerful design tools.</p>
                  </div>
                </div>
                <div className="divider-container">
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
              <div className="pricing-card">
                <div className="card-header">
                  <span className="title">Enterprise Plan</span>
                  <div className="price-section">
                    <div style={{ marginBottom: '31px' }}>
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
                <div className="divider-container">
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
              {/* Optionally add Enterprise card here if you have one */}
            </div>
          )}
        </div>
      </div>
      {/* Login Required Modal */}
      {showLoginModal && <LoginPopup onClose={() => setShowLoginModal(false)} />}
    </>
  );
};

export default Subscription;
