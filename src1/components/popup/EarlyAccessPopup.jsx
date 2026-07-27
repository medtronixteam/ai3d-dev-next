import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WishListBg from '../../assets/images/WishListBg.png';
import buttonIcon from '../../assets/images/buttonIcon.png';
import {
  EarlyAccessTitle,
  EarlyAccessDescriptions,
  EarlyAccessCountdown,
} from '../early-access/EarlyAccessPromoContent';
import './EarlyAccessPopup.css';

const EarlyAccessPopup = ({ isOpen, onClose, onSignUp }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="ea-popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="ea-popup-card"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={WishListBg} alt="" className="ea-popup-bg-img" fetchpriority="high" />
          <div className="ea-popup-surface" aria-hidden="true" />
          <div className="ea-popup-glow" aria-hidden="true" />

          <button type="button" className="ea-popup-close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>

          <div className="ea-popup-body">
            <EarlyAccessTitle as="h2" className="ea-title ea-popup-title" />
            <EarlyAccessDescriptions
              className="ea-desc ea-popup-desc"
              secondaryClassName="ea-desc ea-desc-secondary ea-popup-desc ea-popup-desc-secondary"
            />
            <EarlyAccessCountdown className="ea-countdown ea-popup-countdown" />

            <button type="button" className="ea-popup-btn" onClick={onSignUp}>
              Sign Up Now <img src={buttonIcon} className="ea-popup-btn-icon" alt="" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EarlyAccessPopup;
