import React, { useEffect, useState } from 'react';
import './RequestRefundPopup.css';
import { FiX } from 'react-icons/fi';
import MasterCard from '../../assets/images/refund-card.svg';
import Coins from '../../assets/images/coins.svg';
import ReqSubmitted from '../../assets/images/handCurrency.png';
import UnderReview from '../../assets/images/underReviiew.png';
import Approved from '../../assets/images/approved.png';
import Processed from '../../assets/images/processed.png';

const RequestRefundPopup = ({ open, onClose }) => {
  const [showRefundCalPopup, setShowRefundCalPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTimeline, setShowTimeline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const steps = [
    {
      label: 'Request Submitted',
      active: true,
      icon: ReqSubmitted,
    },
    {
      label: 'Under Review',
      active: false,
      icon: UnderReview,
    },
    {
      label: 'Approved',
      active: false,
      icon: Approved,
    },
    {
      label: 'Processed',
      active: false,
      icon: Processed,
    },
  ];

  const handleProcessRefund = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowTimeline(true);
    }, 2000);
  };

  return (
    <section>
      <div className="request-refund-overlay" onClick={onClose}>
        <div className="request-refund-content" onClick={(e) => e.stopPropagation()}>
          <button className="request-refund-close" onClick={onClose}>
            <FiX />
          </button>

          <div className="request-refund-header">
            <h1>Refund Request</h1>
            <p>Process your subscription refund</p>
          </div>

          <div className="main-starter-plan-container">
            <div className="main-starter-plan">
              <div className="refund-cancel-plan-content">
                <div className="starter-plan">
                  <h2 className="refund-cancel-plan-h2">Starter Plan</h2>
                  <h2 className="starter-plan-refund-request-h2-tag">Cancelled</h2>
                </div>

                <div className="flex-plan">
                  <span
                    style={{
                      color: 'rgba(61, 61, 61, 1)',
                      fontWeight: 600,
                      fontSize: '14px',
                      minWidth: isMobile ? '130px' : '150px',
                    }}
                  >
                    Started Date:
                  </span>
                  <span
                    style={{
                      color: 'rgba(117, 117, 117, 1)',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                    }}
                  >
                    August 30,2025
                  </span>
                </div>
                <div className="flex-plan">
                  <span
                    style={{
                      color: 'rgba(61, 61, 61, 1)',
                      fontWeight: 600,
                      fontSize: '14px',
                      minWidth: isMobile ? '130px' : '150px',
                    }}
                  >
                    Cancellation Date:
                  </span>
                  <span
                    style={{
                      color: 'rgba(117, 117, 117, 1)',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                    }}
                  >
                    August 30,2025
                  </span>
                </div>
                <div className="flex-plan">
                  <span
                    style={{
                      color: 'rgba(61, 61, 61, 1)',
                      fontWeight: 600,
                      fontSize: '14px',
                      minWidth: isMobile ? '130px' : '150px',
                    }}
                  >
                    Payment Method:
                  </span>
                  <span
                    style={{
                      color: 'rgba(231, 76, 60, 1)',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                    }}
                  >
                    Mastercard - 6789
                  </span>
                </div>
                <div className="flex-plan">
                  <span
                    style={{
                      color: 'rgba(61, 61, 61, 1)',
                      fontWeight: 600,
                      fontSize: '14px',
                      minWidth: isMobile ? '130px' : '150px',
                    }}
                  >
                    Days Used:
                  </span>
                  <span
                    style={{
                      color: 'rgba(117, 117, 117, 1)',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                    }}
                  >
                    10 Days
                  </span>
                </div>
                <div className="flex-plan">
                  <span
                    style={{
                      color: 'rgba(61, 61, 61, 1)',
                      fontWeight: 600,
                      fontSize: '14px',
                      minWidth: isMobile ? '130px' : '150px',
                    }}
                  >
                    Days Unused:
                  </span>
                  <span
                    style={{
                      color: 'rgba(117, 117, 117, 1)',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 600,
                    }}
                  >
                    20 Days Remaining
                  </span>
                </div>
              </div>

              <div className="payment-type">
                <h1>$99</h1>
              </div>
            </div>

            <div className="starter-plans-buttons">
              <div className="cancel-plan-button" onClick={() => setShowRefundCalPopup(true)}>
                <span>Refund Calculation</span>
              </div>
            </div>
          </div>

          {/* refund timeline */}
          {loading && (
            <div className="refund-timeline-container">
              <h1>Refund Timeline</h1>
              <div className="timeline-loader"></div>
            </div>
          )}

          {!loading && showTimeline && (
            <div className="refund-timeline-container">
              <h1>Refund Timeline</h1>
              <div className="refund-timeline-header">
                {steps.map((step, index) => (
                  <div className="refund-timeline-content" key={index}>
                    <img src={step.icon} alt="image" width={50} height={50} />
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: isDarkMode ?  step.active ? 'rgba(222, 57, 150, 1)' : '#fff' : step.active ? 'rgba(222, 57, 150, 1)' : 'rgba(0, 0, 0, 1)',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="select-refund-method-container">
            <h1>Select Refund Method</h1>

            <div className="original-payment-method-container">
              <div className="payment-method-left">
                <img src={MasterCard} alt="image" width={40} height={40} />
                <div className="payment-method-text">
                  <h2
                    style={{
                      color: isDarkMode ? '#fff' : '#000',
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: '1.2',
                    }}
                  >
                    Original Payment Method
                  </h2>
                  <p
                    style={{
                      color: isDarkMode ? '#DADADA' : 'rgba(117, 117, 117, 1)',
                      fontSize: '14px',
                      fontWeight: 400,
                      margin: 0,
                      lineHeight: '1.3',
                      paddingTop: '2px',
                    }}
                  >
                    Master-1213...Same card used for payment
                  </p>
                </div>
              </div>
              <h2
                style={{
                  color: 'rgba(222, 57, 150, 1)',
                  fontSize: '18px',
                  fontWeight: 600,
                  textAlign: isMobile ? 'end' : 'start',
                }}
              >
                3-5 Business Days
              </h2>
            </div>

            <div className="original-payment-method-container mt-3">
              <div className="payment-method-left">
                <img src={Coins} alt="image" width={40} height={40} />
                <div className="payment-method-text">
                  <h2
                    style={{
                      color: isDarkMode ? '#fff' : '#000',
                      fontSize: '18px',
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: '1.2',
                    }}
                  >
                    Account Coin
                  </h2>
                  <p
                    style={{
                      color: isDarkMode ? '#DADADA' : 'rgba(117, 117, 117, 1)',
                      fontSize: '14px',
                      fontWeight: 400,
                      margin: 0,
                      lineHeight: '1.3',
                      paddingTop: '2px',
                    }}
                  >
                    Convert to coins at current exchange rate
                  </p>
                </div>
              </div>
              <h2
                style={{
                  color: 'rgba(222, 57, 150, 1)',
                  fontSize: '18px',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Instant Credit
              </h2>
            </div>
          </div>

          <div className="req-refund-buttons">
            <button className="btn-cancel-req">Cancel Request</button>
            <button className="btn-process-refund" onClick={handleProcessRefund}>
              {loading ? 'Processing...' : 'Process refund'}
            </button>
          </div>
        </div>
      </div>
      {showRefundCalPopup && (
        <RefundCalculationPopup
          open={showRefundCalPopup}
          onClose={() => setShowRefundCalPopup(false)}
        />
      )}
    </section>
  );
};

export default RequestRefundPopup;

export const RefundCalculationPopup = ({ open, onClose }) => {
  return (
    <section>
      <div className="request-refund-overlay" onClick={onClose}>
        <div className="request-refund-calculation-content" onClick={(e) => e.stopPropagation()}>
          {/* <button className="request-refund-close" onClick={onClose}>
                      <FiX />
                    </button> */}

          <div className="refund-calculation-content-header">
            <h2>Refund Calculation</h2>
            <div className="refund-calculation-content">
              <div className="d-flex justify-content-between mt-2">
                <span>Original Payment</span>
                <span>$99.00</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Days Used (10/30)</span>
                <span>-$33.00</span>
              </div>
              <div className="d-flex justify-content-between mt-2 mb-2">
                <span>Tax Adjustment</span>
                <span>+$2.00</span>
              </div>
            </div>
            <div className="d-flex justify-content-between ref-amount mt-2">
              <span>Refund Amount</span>
              <span>$64.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
