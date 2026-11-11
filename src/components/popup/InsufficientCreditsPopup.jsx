import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import UpgradeCoin from '../../assets/images/UpgradeCoin.svg';
import './InsufficientCreditsPopup.css';

const PLANS = [
  { name: 'Starter', detail: 'For personal projects' },
  { name: 'Premium', detail: 'For higher volume' },
];

const InsufficientCreditsPopup = ({ balance = 0, needed = null, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const balanceLabel = Number(balance).toLocaleString();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openPlans = () => {
    onClose?.();
    navigate('/3dio/subscription');
  };

  if (!mounted) return null;

  const content = (
    <div className="credits-popup-overlay" onClick={onClose}>
      <div className="credits-popup" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="credits-popup-close" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>
        <div className="credits-popup-icon">
          <img src={UpgradeCoin} alt="" />
        </div>
        <h2>Not enough credits</h2>
        <p className="credits-popup-balance">
          Your current balance is <strong>{balanceLabel}</strong> {Number(balance) === 1 ? 'coin' : 'coins'}.
        </p>
        {Number.isFinite(needed) && (
          <p className="credits-popup-need">This generation needs {needed.toLocaleString()} coins.</p>
        )}
        <p className="credits-popup-plans-label">You can buy 2 plans</p>
        <div className="credits-popup-plans">
          {PLANS.map((plan) => (
            <button key={plan.name} type="button" className="credits-popup-plan" onClick={openPlans}>
              <span>{plan.name}</span>
              <small>{plan.detail}</small>
            </button>
          ))}
        </div>
        <button type="button" className="credits-popup-cta" onClick={openPlans}>
          View plans
        </button>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};

export default InsufficientCreditsPopup;
