import React from 'react';

const SkeletonListLoader = () => {
  return (
    <>
      <style>{`
        .rp-list-skeleton {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 10px 0;
        }

        .rp-list-skeleton-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #fafafa; /* light mode bg */
          border-radius: 10px;
          padding: 10px 12px;
          border: 1px solid #eee;
        }

        .rp-list-skeleton-img {
          width: 90px;
          height: 70px;
          background: #eaeaea;
          border-radius: 8px;
          animation: skel-pulse 1.4s infinite ease-in-out;
          flex-shrink: 0;
        }

        .rp-list-skeleton-details {
          flex: 1;
        }

        .rp-skel-line {
          height: 12px;
          background: #e4e4e4;
          border-radius: 6px;
          margin-bottom: 8px;
          animation: skel-pulse 1.4s infinite ease-in-out;
        }

        .rp-skel-line.short {
          width: 40%;
        }

        .rp-skel-line.long {
          width: 70%;
        }

        @keyframes skel-pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        /* Dark Mode */
        [data-theme='dark'] .rp-list-skeleton-item {
          background: #1c1c22;
          border: 1px solid #333;
        }

        [data-theme='dark'] .rp-list-skeleton-img {
          background: #2a2a30;
        }

        [data-theme='dark'] .rp-skel-line {
          background: #333;
        }
      `}</style>

      <div className="rp-list-skeleton">
        {[...Array(6)].map((_, i) => (
          <div className="rp-list-skeleton-item" key={i}>
            <div className="rp-list-skeleton-img"></div>

            <div className="rp-list-skeleton-details">
              <div className="rp-skel-line short"></div>
              <div className="rp-skel-line long"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SkeletonListLoader;
