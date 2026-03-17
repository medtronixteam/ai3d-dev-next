import React from 'react';

const SubscriptionLoader = ({ count = 2 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: i === 0 ? '#0D0A18' : '#2A1038',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            {/* LEFT SIDE */}
            <div style={{ minWidth: '250px', flex: 1 }}>
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}
              >
                <div
                  className="skeleton"
                  style={{ width: '110px', height: '18px', borderRadius: '6px' }}
                ></div>
                <div
                  className="skeleton"
                  style={{ width: '80px', height: '18px', borderRadius: '12px' }}
                ></div>
              </div>
              {['Started', 'Status', 'Plan Type'].map((_, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}
                >
                  <div
                    className="skeleton"
                    style={{ width: '90px', height: '14px', borderRadius: '4px' }}
                  ></div>
                  <div
                    className="skeleton"
                    style={{
                      width: idx === 1 ? '150px' : '130px',
                      height: '14px',
                      borderRadius: '4px',
                    }}
                  ></div>
                </div>
              ))}
            </div>

            <div
              style={{
                minWidth: '140px',
                background: i === 0 ? '#120E22' : '#3B1A48',
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <div
                className="skeleton"
                style={{ width: '70px', height: '18px', margin: '0 auto 6px', borderRadius: '6px' }}
              ></div>
              <div
                className="skeleton"
                style={{ width: '110px', height: '8px', margin: '0 auto', borderRadius: '4px' }}
              ></div>
            </div>
          </div>
        </div>
      ))}

      {/* SHIMMER EFFECT */}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          .skeleton {
            background: linear-gradient(90deg, #342F47 0%, #4A4561 50%, #342F47 100%);
            background-size: 1000px 100%;
            animation: shimmer 1.6s infinite;
          }
        `}
      </style>
    </>
  );
};

export default SubscriptionLoader;
