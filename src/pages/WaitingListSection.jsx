import React, { useState, useEffect } from 'react';
import './WaitingListSection.css';
import { motion } from 'framer-motion';

// Import images from assets
import headingEllipse from './images/heading_ellipse.png';
import buttonIcon from '../assets/images/buttonIcon.png';
import WishListBg from '../assets/images/WishListBg.png';
import WaitlistModal from '../components/popup/WaitlistModal';




const WaitingListSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Countdown logic: Set target to April 30, 2026
    const targetDate = new Date('2026-04-30T00:00:00');


    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = targetDate - now;

        let timeLeft = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                min: Math.floor((difference / 1000 / 60) % 60),
                sec: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatNumber = (num) => (num < 10 ? `0${num}` : num);

    return (
        <section className="WL_wrapper">
            <div className="WL_inner_container">
                <div className="WL_card_main" style={{ backgroundImage: `url(${WishListBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {/* Wavy Background Elements */}
                    <div className="WL_wave_overlay"></div>
                    <div className="WL_wave_bg">
                        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#fcecef" fillOpacity="0.5" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,96C672,75,768,85,864,117.3C960,149,1056,203,1152,202.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>

                    <div className="WL_content_body">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="WL_main_title"
                        >
                            Join the <span className="WL_accent_span">Waiting<img src={headingEllipse} alt="" className="WL_title_arc" /></span> List Get Early Access
                        </motion.h2>



                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="WL_main_desc"
                        >
                            Be the <span className="WL_text_pink">first to experience</span> our revolutionary <span className="WL_text_pink">3D model creation</span> platform. Early members get exclusive benefits and priority access.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="WL_social_proof"
                        >
                            <div className="WL_avatar_group">
                                <img src="https://i.pravatar.cc/150?u=1" alt="User 1" className="WL_user_img" />
                                <img src="https://i.pravatar.cc/150?u=2" alt="User 2" className="WL_user_img" />
                                <img src="https://i.pravatar.cc/150?u=4" alt="User 3" className="WL_user_img" />
                                <div className="WL_avatar_more">500+</div>
                            </div>

                            <p className="WL_counter_text">
                                <span className="WL_count_num">500+</span> people already on the waiting list
                            </p>
                        </motion.div>

                        <div className="WL_countdown_section">
                            <div className="WL_timer_wrap">
                                <div className="WL_time_unit">
                                    <div className="WL_time_box">{formatNumber(timeLeft.days)}</div>
                                    <span className="WL_time_label">DAYS</span>
                                </div>
                                <div className="WL_time_dots">:</div>
                                <div className="WL_time_unit">
                                    <div className="WL_time_box">{formatNumber(timeLeft.hours)}</div>
                                    <span className="WL_time_label">HOURS</span>
                                </div>
                                <div className="WL_time_dots">:</div>
                                <div className="WL_time_unit">
                                    <div className="WL_time_box">{formatNumber(timeLeft.min)}</div>
                                    <span className="WL_time_label">MIN</span>
                                </div>
                                <div className="WL_time_dots">:</div>
                                <div className="WL_time_unit">
                                    <div className="WL_time_box">{formatNumber(timeLeft.sec)}</div>
                                    <span className="WL_time_label">SEC</span>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(222, 57, 150, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            className="WL_submit_btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Join Waitlist <img src={buttonIcon} className="WL_btn_arrow_img" alt="" />
                        </motion.button>

                    </div>
                </div>
            </div>

            <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>

    );
};

export default WaitingListSection;
