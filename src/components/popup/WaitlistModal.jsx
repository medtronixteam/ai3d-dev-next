import React from 'react';
import './WaitlistModal.css';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../pages/images/logo.png';
import headingEllipse from '../../pages/images/heading_ellipse.png';
import astronautImg from '../../pages/images/astronaut.png';


const WaitlistModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="WM_overlay" onClick={onClose}>
                <div className="WM_modal_wrapper" onClick={(e) => e.stopPropagation()}>
                    {/* Back Button positioned on corner */}
                    <button className="WM_back_btn" onClick={onClose}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="WM_modal_container" 
                    >
                        {/* Left Section */}

                    <div className="WM_left_panel">
                        <img src={logo} alt="Logo" className="WM_logo" />
                        
                        <div className="WM_title_wrap">
                            <h1 className="WM_main_title">
                                Join the <span className="WM_accent_span">Waiting<img src={headingEllipse} alt="" className="WM_title_arc" /></span> List Get Early Access
                            </h1>

                        </div>



                        <p className="WM_desc">
                            Be among the <span className="WM_pink_text">first to experience</span> AI3D. Reserve your spot on the waitlist and <span className="WM_pink_text">unlock</span> exclusive <span className="WM_pink_text">benefits</span> when we <span className="WM_pink_text">launch</span>.
                        </p>

                        <div className="WM_benefits_list">
                            <div className="WM_benefit_item">
                                <div className="WM_check_icon"><i className="fa-solid fa-check"></i></div>
                                Early access to all new features
                            </div>
                            <div className="WM_benefit_item">
                                <div className="WM_check_icon"><i className="fa-solid fa-check"></i></div>
                                Free 3D Credits on launch
                            </div>
                            <div className="WM_benefit_item">
                                <div className="WM_check_icon"><i className="fa-solid fa-check"></i></div>
                                Priority access before public launch
                            </div>
                            <div className="WM_benefit_item">
                                <div className="WM_check_icon"><i className="fa-solid fa-check"></i></div>
                                Api Beta Access
                            </div>
                        </div>

                        <p className="WM_footer_note">
                            No Spam. Unsubscribe Anytime. We Respect your Privacy.
                        </p>
                    </div>

                    {/* Right Section */}
                    <div className="WM_right_panel">
                        <div className="WM_form_card">
                            <div className="WM_form_header">
                                <h2 className="WM_form_title">Reserve Your Spot</h2>
                                <p className="WM_form_subtitle">Fill in the form to join the waitlist.</p>
                            </div>


                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="WM_input_row">
                                    <div className="WM_input_group">
                                        <label className="WM_input_label">Name</label>
                                        <input type="text" placeholder="John" className="WM_input" />
                                    </div>
                                    <div className="WM_input_group">
                                        <label className="WM_input_label">Email Address</label>
                                        <input type="email" placeholder="john@gmail.com" className="WM_input" />
                                    </div>
                                </div>

                                <div className="WM_input_group" style={{ marginBottom: 20 }}>
                                    <label className="WM_input_label">Where did you hear about us?</label>
                                    <input type="text" placeholder="Enter here..." className="WM_input" />
                                </div>

                                <div className="WM_input_group" style={{ marginBottom: 20 }}>
                                    <label className="WM_input_label">What will you use 3dio for?</label>
                                    <textarea placeholder="Add placement text..." className="WM_input WM_textarea"></textarea>
                                </div>

                                <label className="WM_checkbox_row">
                                    <input type="checkbox" required />
                                    <span>I agree to the Terms and Condition</span>
                                </label>

                                <button type="submit" className="WM_submit_btn">
                                    Join Waitlist <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>

    );
};

export default WaitlistModal;
