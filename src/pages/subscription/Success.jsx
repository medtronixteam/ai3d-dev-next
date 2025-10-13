import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const SubscriptionSuccess = () => {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const status = (params.get('status') || 'success').toLowerCase();
  const message = params.get('message');

  const isSuccess = status === 'success' || status === 'succeeded' || status === 'ok';

  return (
    <div style={{ minHeight: '100vh',  }} className="d-flex align-items-center justify-content-center p-4">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(230, 51, 154, 0.35); }
          70% { box-shadow: 0 0 0 14px rgba(230, 51, 154, 0); }
          100% { box-shadow: 0 0 0 0 rgba(230, 51, 154, 0); }
        }
        .success-card {
          max-width: 640px;
          width: 100%;
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 10px 30px rgba(230,51,154,0.08), 0 6px 16px rgba(0,0,0,0.06);
          animation: fadeUp 480ms ease-out both;
        }
        .hero-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: radial-gradient(100% 100% at 50% 0%, #fff0f6 0%, #fff7fb 100%);
          color: ${isSuccess ? '#e6339a' : '#dc2626'};
          animation: popIn 520ms cubic-bezier(.2,.9,.2,1) both, pulseRing 2.2s ease-out 600ms infinite;
        }
        .title {
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .cta-primary {
          background: linear-gradient(90deg, #e6339a 0%, #ff7ac1 100%);
          color: #fff;
          border: none;
          padding: 12px 18px;
          border-radius: 10px;
          box-shadow: 0 8px 18px rgba(230,51,154,0.25);
          transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
        }
        .cta-primary:hover { transform: translateY(-1px); filter: brightness(1.03); box-shadow: 0 12px 22px rgba(230,51,154,0.28); }
      `}</style>
      <div className="success-card text-center">
        <div style={{ padding: '40px 32px 10px' }}>
          {isSuccess ? (
            <div>
              <div className="hero-icon" style={{ marginBottom: 18 }}>
                <FiCheckCircle size={64} />
              </div>
              <h2 className="title" style={{ marginBottom: 10 }}>Payment successful</h2>
              <p style={{ color: '#6b7280', marginBottom: 0 }}>
                {message || 'Your subscription is now active. A confirmation email has been sent.'}
              </p>
            </div>
          ) : (
            <div>
              <div className="hero-icon" style={{ marginBottom: 18, background: '#fff1f2', color: '#dc2626' }}>
                <FiXCircle size={64} />
              </div>
              <h2 className="title" style={{ marginBottom: 10 }}>Payment failed</h2>
              <p style={{ color: '#6b7280', marginBottom: 0 }}>
                {message || 'We could not complete your payment. Please try again or use another method.'}
              </p>
            </div>
          )}
        </div>
        <div className="d-flex gap-2 justify-content-center" style={{ padding: '22px 28px 34px' }}>
          <Link to="/platform" className="btn cta-primary">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;


