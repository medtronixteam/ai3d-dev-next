import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../subscription/Subscription.css';
import logo from '../../assets/images/Logo.png';
import './CardPayment.css';
import {
  FiArrowLeft,
  FiCreditCard,
  FiCheckCircle,
  FiChevronDown,
  FiX,
  FiCalendar,
  FiLock,
} from 'react-icons/fi';

// Get selected plan from localStorage
let plan = {
  name: 'Premium',
  price: 29.99,
  duration: 'Month',
  tax: 0.0,
};
try {
  const stored = localStorage.getItem('selectedPlan');
  if (stored) {
    const parsed = JSON.parse(stored);
    plan = {
      ...plan,
      ...parsed,
      price:
        typeof parsed.price === 'number' ? parsed.price : parseFloat(parsed.price) || plan.price,
    };
  }
} catch {}
const total = plan.price + (plan.tax || 0);

const CardPayment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    if (window.opener && !window.opener.closed) {
      window.close();
      return;
    }
    navigate('/3dio/subscription');
  };

  const handleTouchStart = (e) => {
  e.preventDefault(); // Prevent default touch behavior
  handleBack();
};

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => setShowSuccess(false);

  const isStandalone = window.opener != null || window.name === 'card-payment';

  // Ensure dark mode is respected in this new tab/window too
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const onStorage = (e) => {
      if (e.key === 'theme') {
        document.documentElement.setAttribute('data-theme', e.newValue || 'light');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (showSuccess) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [showSuccess]);

  return (
    <div className={isStandalone ? 'card-payment-standalone' : ''}>
      <div className="container-fluid py-3 payment-container-card" style={{ position: 'relative' }}>
        {showSuccess && (
          <div className="payment-success-modal show">
            <div className="payment-success-modal-content">
              <button className="success-close-btn" onClick={handleCloseSuccess} aria-label="Close">
                <FiX />
              </button>
              <div className="success-icon-wrap">
                <FiCheckCircle size={64} color="#e6339a" />
              </div>
              <h2 className="success-title">Payment Successful!</h2>
              <p className="success-message">
                Thank you for your payment. Your subscription is now active.
              </p>
            </div>
          </div>
        )}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card py-4 px-md-5 px-4" style={{ position: 'relative' }}>
              <button
                onClick={handleBack}
                onTouchStart={handleTouchStart}
                aria-label="Go back"
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: document.documentElement.getAttribute("data-theme") === "dark" ? "2px solid #fff" : '2px solid #4D4C4C',
                  background: 'transparent',
                  color: document.documentElement.getAttribute("data-theme") === "dark" ? "#fff" : "#4D4C4C" ,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  // Mobile-specific fixes
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  // Better touch target
                  minWidth: '38px',
                  minHeight: '38px',
                  zIndex: 1000,
                }}
              >
                <FiArrowLeft size={28} />
              </button>
              <div className="row">
                <div className="col-12 col-md-6 summary-pane">
                  <div className="mb-4 d-flex align-items-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <img src={logo} alt="Logo" style={{ width: 130, marginTop: '5rem' }} />
                    </div>
                  </div>
                  <div>
                    <p className="mb-1">Subscribe to Premium</p>
                    <div className="amount">
                      ${plan.price.toFixed(2)}{' '}
                      <span className="text-muted" style={{ fontSize: 14 }}>
                        {plan.duration ? `/ ${plan.duration.toLowerCase()}` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex flex-column">
                        <span className="planName">{plan.name}</span>
                      <span className='billedName' style={{ fontSize : '12px'}}>Billed monthly</span>
                      </div>
                      <span>${plan.price.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <span className="planName">Tax</span>
                      <span>${plan.tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between font-weight-bold">
                      <span>Total due today</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                {/* Right: Form */}
                <div className="col-12 col-md-6">
                  <h5 className="mb-4 text-center font-weight-bold mt-4 mt-md-2 mt-lg-0">Pay with card</h5>
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group">
                      <label className="label-text">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label-text">Card information</label>
                      <div className="card-icons-group">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="1234 1234 1234 1234"
                          required
                        />
                        <div className="card-icons-inside brand-badges" aria-hidden="true">
                          {/* Simple inline badges to mimic PayPal/Visa/Mastercard */}
                          <span className="badge-pp" />
                          <span className="badge-visa" />
                          <span className="badge-mc" />
                        </div>
                      </div>
                      <div className="card-split-group mt-2">
                        <input
                          type="text"
                          className="form-control split-input"
                          placeholder="MM/YY"
                          required
                        />
                        <div className="split-divider" />
                        <input
                          type="text"
                          className="form-control split-input"
                          placeholder="CVC"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="label-text">Cardholder name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Full name on card"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label-text">Country or region</label>
                      <div className="select-wrapper">
                        <select className="form-control" required>
                          <option defaultValue>Pakistan</option>
                          <option>India</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                        </select>
                        <FiChevronDown className="select-chevron" />
                      </div>
                    </div>
                    <button
                      className="btn subscribe-btn btn-block"
                      type="submit"
                      style={{ background: '#e6339a', color: '#fff', fontWeight: 700 }}
                    >
                      Subscribe
                    </button>
                    <p className="mt-3 text-muted-small">
                      By confirming your subscription, you allow Eleven Labs Inc. to charge you for
                      future payments
                      <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;
