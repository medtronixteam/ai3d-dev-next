import React from 'react';
import './WaitingListSection.css';
import '../components/early-access/EarlyAccessPromo.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import paths from '../routes/paths';
import buttonIcon from '../assets/images/buttonIcon.png';
import WishListBg from '../assets/images/WishListBg.png';
import {
  EarlyAccessTitle,
  EarlyAccessDescriptions,
  EarlyAccessCountdown,
} from '../components/early-access/EarlyAccessPromoContent';

const WaitingListSection = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSignUp = () => {
    navigate(token ? paths.dashboard : paths.signup);
  };

  return (
    <section className="WL_wrapper">
      <div className="WL_inner_container">
        <div className="WL_card_main" style={{ backgroundImage: `url(${WishListBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="WL_wave_overlay"></div>
          <div className="WL_wave_bg">
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fcecef" fillOpacity="0.5" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,96C672,75,768,85,864,117.3C960,149,1056,203,1152,202.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="WL_content_body">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <EarlyAccessTitle className="WL_main_title ea-title" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <EarlyAccessDescriptions
                className="WL_main_desc ea-desc"
                secondaryClassName="WL_main_desc WL_main_desc_secondary ea-desc ea-desc-secondary"
              />
            </motion.div>

            <EarlyAccessCountdown className="WL_countdown_section ea-countdown" />

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(222, 57, 150, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="WL_submit_btn"
              onClick={handleSignUp}
            >
              Sign Up Now <img src={buttonIcon} className="WL_btn_arrow_img" alt="" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitingListSection;
