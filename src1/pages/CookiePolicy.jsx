import React, { useEffect } from 'react';
import './CookiePolicy.css';

const CookiePolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        // Hide scrollbar while on this page
        document.body.classList.add('dashboard-active');
        return () => {
            document.body.classList.remove('dashboard-active');
        };
    }, []);

    return (
        <div className="policy-page-wrapper">
            <div className="policy-container">
                <header className="policy-header">
                    <h1>Cookie Policy</h1>
                    <p className="last-updated">Last updated May 7, 2026</p>
                </header>

                <section className="policy-section">
                    <p>
                        Please read this Cookie Policy carefully as it contains important information on who we are and how we use cookies on our websites.
                    </p>
                    <p>
                        This Cookie Policy details how <strong>AI 3D Scanning Solutions Inc.</strong> (“AI 3D Scanning”, “we”, or “us”) uses and categorizes cookies on our website and our portfolio of products, as well as how to manage your consent regarding their use.
                    </p>
                    <p>
                        This Cookie Policy should be read together with our Privacy Statement, which describes how and why we collect, store, use, and protect personal data.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>What are Cookies?</h2>
                    <p>
                        A cookie is a small text file that may be stored on your computer or mobile device when you visit our site or use our products. In cases where cookies are used, the respective site or product will send certain data to your browser and then store the data on your device, so that the site can access, store, or collect information from your device.
                    </p>
                    <p>
                        Browsers support cookies so that websites can perform certain functions, including remembering information about your visit to improve your experience, creating aggregated and anonymized usage statistics, fraud prevention, and information security purposes.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>Categories of Cookies</h2>
                    <p>
                        AI 3D Scanning categorizes the use of cookies into four main categories:
                    </p>
                    <div className="cookie-category-grid">
                        <div className="category-item">
                            <h3>Strictly Necessary</h3>
                            <p>These cookies are necessary for our website to function properly and securely, and cannot be switched off in our systems. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.</p>
                        </div>
                        <div className="category-item">
                            <h3>Performance Cookies</h3>
                            <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.</p>
                        </div>
                        <div className="category-item">
                            <h3>Functional Cookies</h3>
                            <p>These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.</p>
                        </div>
                        <div className="category-item">
                            <h3>Targeting Cookies</h3>
                            <p>These cookies are used to make advertising messages more relevant to you. They may be used to build a profile of your interests and show you relevant advertising on our site or on other sites.</p>
                        </div>
                    </div>
                </section>

                <section className="policy-section">
                    <h2>Our Use of Cookies</h2>
                    <ul>
                        <li><strong>General Browsing:</strong> We use cookies for technical features, like user accounts and implementing fixes or improvements.</li>
                        <li><strong>Tailored Experience:</strong> Enable behavior tailored to the activity or preferences of a visitor.</li>
                        <li><strong>Diagnostics:</strong> Help to diagnose and correct downtime, bugs, and errors in our code.</li>
                        <li><strong>Analytics:</strong> Compile usage activity to better tailor our products. We do NOT share personally identifiable raw data through cookies.</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>How to Contact Us</h2>
                    <p>
                        If you have any questions, comments, or concerns regarding this Cookie Policy, please contact us at: <a href="mailto:contact@ai3dscanning.com">contact@ai3dscanning.com</a>
                    </p>
                </section>

                <section className="policy-section">
                    <h2>Changes to this Cookie Policy</h2>
                    <p>
                        We may change this Cookie Policy from time to time. When we do, we will inform you by publishing it on our websites. Please check here periodically to make sure you have read and understand the current policy in effect.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CookiePolicy;
