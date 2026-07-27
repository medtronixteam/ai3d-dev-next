import React from 'react';

const SkeletonLoader = ({ isDark = false, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            background: isDark ? '#110E20' : '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 0 8px rgba(0,0,0,0.25)',
            padding: '20px',
            marginTop: index === 0 ? '1.5rem' : '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Top Row: Plan info + Coins */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            {/* Left: Plan Name & Status */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div className="skeleton" style={{ width: '100px', height: '24px', borderRadius: '6px' }}></div>
                <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '12px' }}></div>
              </div>
              {/* Info Rows */}
              {['Started', 'Status', 'Renewal Date'].map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: '80px', height: '16px', borderRadius: '4px' }}></div>
                  <div className="skeleton" style={{ width: i === 1 ? '120px' : '100px', height: '16px', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>

            {/* Right: Coins Payment */}
            <div style={{ minWidth: '120px', textAlign: 'center', padding: '12px', borderRadius: '8px', background: isDark ? '#0f0b1e' : '#F9F9F9' }}>
              <div className="skeleton" style={{ width: '60px', height: '28px', margin: '0 auto 8px', borderRadius: '6px' }}></div>
              <div className="skeleton" style={{ width: '80px', height: '14px', margin: '0 auto', borderRadius: '4px' }}></div>
            </div>
          </div>

          {/* Billing Details Row */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {['Billing Cycle', 'Next Billing Date', 'Billing Amount', 'Edit Payment', 'Auto Renewal'].map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: i === 3 ? '120px' : '80px' }}>
                <div className="skeleton" style={{ width: i === 3 ? '100px' : '80px', height: '14px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: i === 1 ? '100px' : '60px', height: '16px', borderRadius: '4px' }}></div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '8px' }}></div>
            <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }}></div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .skeleton {
          background: ${isDark
            ? 'linear-gradient(90deg, #1a1530 0%, #2a2640 50%, #1a1530 100%)'
            : 'linear-gradient(90deg, #E5E7EB 0%, #D1D5DB 50%, #E5E7EB 100%)'};
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        @media (max-width: 768px) {
          .skeleton { 
            animation: shimmer 1.5s infinite; 
          }
        }
      `}</style>
    </>
  );
};

export default SkeletonLoader;