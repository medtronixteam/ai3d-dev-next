import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already given consent
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        // Just hide for now, don't save to localStorage
        // so it shows again on next refresh
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-wrapper">
            <div className="cookie-consent-container">
                <div className="cookie-content">
                    <div className="cookie-icon">
                        🍪
                    </div>
                    <div className="cookie-text">
                        <h3>Cookies & Privacy</h3>
                        <p>
                            By continuing to use this website, you agree <strong>Ai 3d scanning</strong> can store cookies on your device and disclose information in accordance with our <Link to="/cookie-policy" className="cookie-link">Cookie Policy</Link>. 
                            By exiting this window, default cookies will be accepted. To reject cookies, select an option from below.
                        </p>
                    </div>
                </div>
                <div className="cookie-actions">
                    <button className="cookie-btn decline" onClick={handleDecline}>
                        Decline
                    </button>
                    <button className="cookie-btn accept" onClick={handleAccept}>
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
