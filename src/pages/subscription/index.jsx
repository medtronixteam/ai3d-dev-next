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
import Construction from '../../assets/images/construction.jpeg';

const Subscription = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const navigate = useNavigate();
  const [monthlyStarterPrice, setMonthlyStarterPrice] = useState(29);
  const [monthlyProPrice, setMonthlyProPrice] = useState(99);
  const [yearlyStarterPrice, setYearlyStarterPrice] = useState(290);
  const [yearlyProPrice, setYearlyProPrice] = useState(990);
  const { token, activeTeam } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [subscribingPlan, setSubscribingPlan] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (showLoginModal) {
      setLoginModalVisible(true);
    }
  }, [showLoginModal]);

  const handleCloseLoginModal = () => {
    setLoginModalVisible(false);
    setTimeout(() => setShowLoginModal(false), 250);
  };

  const handlePlanClick = async (planInfo, e) => {
    if (e) e.preventDefault();
    if (activeTeam) return;
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    try {
      const period = billingPeriod === 'yearly' ? 'annually' : 'monthly';
      const payload = {
        name: planInfo?.name,
        period,
      };
      setSubscribingPlan(`${planInfo?.name}-${period}`);
      const res = await axios.post(`${baseURL}/plan/subscribe`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const redirectUrl = res?.data?.url || res?.data?.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      // Fallback: keep previous behavior only if subscribe fails
      try {
        window.open('/platform/subscription/card', '_blank');
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
        // Expected flexible shapes:
        // { monthly: [{name:'Starter', price:29},{name:'Pro', price:99}], annually: [...] }
        // or { plans: { monthly: [...], annually: [...] } }
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
              Save from 20% <span style={{ color: '#000000' }}>with yearly</span>
            </div>
          </div>
          {billingPeriod === 'monthly' && (
            <div className="pricing-cards monthly-plan">
              {/* Monthly cards: Starter, Pro (Popular), Enterprise at third */}
              <div className="pricing-card">
                <div className="card-header">
                  <span className="title">Starter</span>
                  <div className="price-section">
                    <div>
                      <span className="price">{`$${monthlyStarterPrice}`}</span>
                      <sub className="sub-class">/Month</sub>
                    </div>
                    <div>
                      <span
                        className="year-price"
                        style={{ fontSize: '16px' }}
                      >{`$${yearlyStarterPrice}`}</span>
                      <sub className="year-sub-class" style={{ fontSize: '16px' }}>
                        /Year
                      </sub>
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
                {/* <button
                  className="plan-button"
                  disabled={
                    !!activeTeam ||
                    subscribingPlan ===
                      `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                  }
                  onClick={(e) => handlePlanClick({ name: 'Starter' }, e)}
                >
                  {subscribingPlan ===
                  `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                    ? 'Processing…'
                    : 'Choose Starter'}
                </button> */}
                <button className="plan-button" onClick={handleButtonClick}>
                  Choose Starter
                </button>
              </div>
              <div className="popular-card">
                <div className="popular-tag">Popular</div>
                <div className="pricing-card">
                  <div className="card-header">
                    <span className="title">Pro Plan</span>
                    <div className="price-section">
                      <div>
                        <span className="price">{`$${monthlyProPrice}`}</span>
                        <sub className="sub-class">/Month</sub>
                      </div>
                      <div>
                        <span
                          className="year-price"
                          style={{ fontSize: '16px' }}
                        >$990</span>
                        <sub className="year-sub-class" style={{ fontSize: '16px' }}>
                          /Year
                        </sub>
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
                  {/* <button
                    className="plan-button"
                    disabled={
                      !!activeTeam ||
                      subscribingPlan ===
                        `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                    }
                    onClick={(e) => handlePlanClick({ name: 'Pro' }, e)}
                  >
                    {subscribingPlan ===
                    `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                      ? 'Processing…'
                      : 'Choose Pro'}
                  </button> */}
                  <button className="plan-button" onClick={handleButtonClick}>
                  Choose Pro
                </button>
                </div>
              </div>
              <div className="pricing-card">
                <div className="card-header">
                  <span className="title">Enterprise Plan</span>
                  <div className="price-section">
                    <div style={{ marginBottom: '31px' }}>
                      <span className="price">Custom</span>
                      <sub className="sub-class">billing</sub>
                    </div>
                  </div>
                </div>
                <div className="divider-container mt-lg-4">
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
                {/* <button
                  className="plan-button"
                  disabled={!!activeTeam}
                  onClick={(e) => handlePlanClick({ name: 'Enterprise' }, e)}
                >
                  Contact Sales
                </button> */}
                <button className="plan-button" onClick={handleButtonClick}>
                  Contact Sales
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
                      <span className="price">{`$${yearlyStarterPrice}`}</span>
                      <sub className="sub-class">/Year</sub>
                    </div>
                    <div>
                      <span
                        className="month-price"
                        style={{ fontSize: '16px' }}
                      >$29</span>
                      <sub className="month-sub-class" style={{ fontSize: '16px' }}>
                        /Month
                      </sub>
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
                {/* <button
                  className="plan-button"
                  disabled={
                    !!activeTeam ||
                    subscribingPlan ===
                      `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                  }
                  onClick={(e) => handlePlanClick({ name: 'Starter' }, e)}
                >
                  {subscribingPlan ===
                  `Starter-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                    ? 'Processing…'
                    : 'Choose Starter'}
                </button> */}
                <button className="plan-button" onClick={handleButtonClick}>
                  Choose Starter
                </button>
              </div>
              <div className="popular-card">
                <div className="popular-tag">Popular</div>
                <div className="pricing-card">
                  <div className="card-header">
                    <span className="title">Pro Plan</span>
                    <div className="price-section">
                      <div>
                        <span className="price">{`$${yearlyProPrice}`}</span>
                        <sub className="sub-class">/Year</sub>
                      </div>
                      <div>
                        <span
                          className="month-price"
                          style={{ fontSize: '16px' }}
                        >{`$${monthlyProPrice}`}</span>
                        <sub className="month-sub-class" style={{ fontSize: '16px' }}>
                          /Month
                        </sub>
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
                  {/* <button
                    className="plan-button"
                    disabled={
                      !!activeTeam ||
                      subscribingPlan ===
                        `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                    }
                    onClick={(e) => handlePlanClick({ name: 'Pro' }, e)}
                  >
                    {subscribingPlan ===
                    `Pro-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                      ? 'Processing…'
                      : 'Choose Pro'}
                  </button> */}
                  <button className="plan-button" onClick={handleButtonClick}>
                  Choose Pro
                </button>
                </div>
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
                <div className="divider-container mt-lg-4">
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
                {/* <button
                  className="plan-button"
                  disabled={
                    !!activeTeam ||
                    subscribingPlan ===
                      `Enterprise-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                  }
                  onClick={(e) => handlePlanClick({ name: 'Enterprise' }, e)}
                >
                  {subscribingPlan ===
                  `Enterprise-${billingPeriod === 'yearly' ? 'annually' : 'monthly'}`
                    ? 'Processing…'
                    : 'Contact Sales'}
                </button> */}
                <button className="plan-button" onClick={handleButtonClick}>
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
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button onClick={closePopup} className="close-popup-btn">
              <FiX size={20} />
            </button>
            <img src={Construction} alt="image" width={150} height={150} />
            <h3>Under Development</h3>
            <p className='text-center'>Our team is currently working on this feature</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscription;
