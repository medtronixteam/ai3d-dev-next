import React, { useEffect, useState } from 'react';
import './WaitlistModal.css';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import logo from '../../pages/images/logo.png';
import {
  EarlyAccessTitle,
  EarlyAccessDescriptions,
} from '../early-access/EarlyAccessPromoContent';
import '../early-access/EarlyAccessPromo.css';


const WaitlistModal = ({ isOpen, onClose }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState({ type : '', text: ''})

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        hear_about: '',
        use_for: ''
    });

     useEffect(() => {
        if (isOpen) {
            setMessage({ type: '', text: '' });
            setSuccess(false);
            setFormData({ name: '', email: '', hear_about: '', use_for: '' });
        }
    }, [isOpen]);
    
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            toast.error("Please fill in your name and email.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/waiting/list`, formData, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                setMessage({ type: 'success', text: response.data.message || 'Successfully signed up for early access!' });
                // Clear form
                setFormData({ name: '', email: '', hear_about: '', use_for: '' });
                // Automatically close after 3 seconds
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 3000);
            }
        } catch (error) {
            console.error("Waitlist error:", error);
            const rawMsg = error.response?.data?.message;
            const friendlyMsg = (rawMsg && !rawMsg.toLowerCase().includes("server error"))
                ? rawMsg
                : "We're experiencing a minor technical hiccup. Please try again in a moment!";
            setMessage({ type: 'error', text: friendlyMsg });
        } finally {
            setLoading(false);
        }
    };

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
                                <EarlyAccessTitle as="h1" className="WM_main_title ea-title" />
                            </div>

                            <EarlyAccessDescriptions
                              className="WM_desc ea-desc"
                              secondaryClassName="WM_desc WM_desc_secondary ea-desc ea-desc-secondary"
                            />

                            <p className="WM_footer_note">
                                No Spam. Unsubscribe Anytime. We Respect your Privacy.
                            </p>
                        </div>

                        {/* Right Section */}
                        <div className="WM_right_panel">
                            <div className="WM_form_card">
                                {message.text && (
                                    <div style={{
                                        padding: '10px 14px',
                                        borderRadius: 8,
                                        marginBottom: 12,
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fff0f0',
                                        color: message.type === 'success' ? '#16a34a' : '#dc2626',
                                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                                    }}>
                                        {message.text}
                                    </div>
                                )}


                                {/* {success ? (
                                    <div className="WM_success_state">
                                        <div className="WM_check_icon_large"><i className="fa-solid fa-circle-check"></i></div>
                                        <h3>You're on the list!</h3>
                                        <p>We'll notify you as soon as you have access.</p>
                                        <button className="WM_submit_btn" onClick={onClose} style={{ marginTop: 20 }}>Close</button>
                                    </div>
                                ) : ( */}
                                    <form onSubmit={handleSubmit}>
                                        <div className="WM_input_row">
                                            <div className="WM_input_group">
                                                <label className="WM_input_label">Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="John"
                                                    className="WM_input"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="WM_input_group">
                                                <label className="WM_input_label">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="john@gmail.com"
                                                    className="WM_input"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="WM_input_group" style={{ marginBottom: 20 }}>
                                            <label className="WM_input_label">Where did you hear about us?</label>
                                            <input
                                                type="text"
                                                name="hear_about"
                                                placeholder="Enter here..."
                                                className="WM_input"
                                                value={formData.hear_about}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="WM_input_group" style={{ marginBottom: 20 }}>
                                            <label className="WM_input_label">What will you use 3dio for?</label>
                                            <textarea
                                                name="use_for"
                                                placeholder="Add placement text..."
                                                className="WM_input WM_textarea"
                                                value={formData.use_for}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>

                                        {/* <label className="WM_checkbox_row">
                                            <input type="checkbox" required />
                                            <span>I agree to the
                                            <Link to='/terms-conditions'>Terms and Condition</Link></span>
                                        </label> */}

                                        <button type="submit" className="WM_submit_btn" disabled={loading}>
                                            {loading ? "Signing up..." : "Sign Up Now"} <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </form>
                                {/* )} */}

                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>

    );
};

export default WaitlistModal;
