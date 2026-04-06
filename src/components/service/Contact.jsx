import React, { useState } from 'react';
import Fb from '../../assets/icon/Fb.svg'
import Tk from '../../assets/icon/Tk.svg'

const Contact = () => {
  const [agreed, setAgreed] = useState(false);
  const [form, setForm]     = useState({
    name: '', email: '', service: '', message: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission
  };

  return (
    <section className="ctc-section">
      <div className="ctc-card">

        {/* ── LEFT ─────────────────────────────────────────── */}
        <div className="ctc-left">

          <h2 className="ctc-title">
            Let's Build{' '}
            <span className="ctc-arch-wrap">
              <svg className="ctc-arch" viewBox="0 0 80 28" fill="none">
                <path d="M4 24 C20 4, 60 4, 76 24"
                  stroke="#de3996" strokeWidth="3.5"
                  fill="none" strokeLinecap="round"/>
              </svg>
              Something
            </span>
            {' '}Amazing
          </h2>

          <p className="ctc-subtitle">
            Fill out the form and our team will get back to you within 24
            hours. Whether it's a quick question or a major project — we're
            here to help.
          </p>

          {/* contact items */}
          <div className="ctc-info-list">

            <div className="ctc-info-item">
              <span className="ctc-info-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect width="16" height="16" rx="3" fill="#ffedf7"/>
                  <path d="M2 4.5l6 4.5 6-4.5M2 4.5h12v8H2V4.5z"
                    stroke="#de3996" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              </span>
              <div>
                <p className="ctc-info-label">Email US</p>
                <p className="ctc-info-value">ai3dscanningsolu@gmail.com</p>
              </div>
            </div>

            <div className="ctc-info-item">
              <span className="ctc-info-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect width="16" height="16" rx="3" fill="#ffedf7"/>
                  <path d="M5.5 2h-2A1.5 1.5 0 002 3.5C2 10.4 5.6 14 12.5 14A1.5 1.5 0 0014 12.5v-2l-2.5-1-1 1.5C9 10.5 5.5 7 5 5.5L6.5 4.5 5.5 2z"
                    stroke="#de3996" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              </span>
              <div>
                <p className="ctc-info-label">Call Us</p>
                <p className="ctc-info-value">+44 753586 2444</p>
              </div>
            </div>

            <div className="ctc-info-item">
              <span className="ctc-info-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect width="16" height="16" rx="3" fill="#ffedf7"/>
                  <rect x="2" y="3" width="12" height="10" rx="1.5"
                    stroke="#de3996" strokeWidth="1.2"/>
                  <path d="M5 7h6M5 9.5h4" stroke="#de3996" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
              <div>
                <p className="ctc-info-label">Book a Demo</p>
                <p className="ctc-info-value">Schedule meeting</p>
              </div>
            </div>
          </div>

          {/* social */}
          <div className="ctc-social-wrap">
            <span className="ctc-social-label">Follow us</span>
            <div className="ctc-social-icons">

              {/* Facebook */}
              <a href="#" className="ctc-social-btn" aria-label="Facebook">
                <img src={Fb} alt="fb" width="19" height="19" />
              </a>

              {/* TikTok */}
              <a href="#" className="ctc-social-btn" aria-label="TikTok">
                <img src={Tk} alt="fb" width="19" height="19" />
              </a>

              {/* Instagram */}
              <a href="#" className="ctc-social-btn" aria-label="Instagram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#de3996" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="#de3996" stroke="none"/>
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* ── RIGHT — FORM ─────────────────────────────────── */}
        <div className="ctc-right">
          <form className="ctc-form" onSubmit={handleSubmit}>

            {/* row 1 */}
            <div className="ctc-form-row">
              <div className="ctc-field">
                <label className="ctc-label">NAME</label>
                <input
                  className="ctc-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jonnie"
                />
              </div>
              <div className="ctc-field">
                <label className="ctc-label">EMAIL ADDRESS</label>
                <input
                  className="ctc-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jonnie@gmail.com"
                />
              </div>
            </div>

            {/* services dropdown */}
            <div className="ctc-field ctc-field-full">
              <label className="ctc-label">Services Interested In</label>
              <select
                className="ctc-select"
                name="service"
                value={form.service}
                onChange={handleChange}
              >
                <option value="">Select a services...</option>
                <option>AI Development</option>
                <option>Flutter Apps</option>
                <option>Web Development</option>
                <option>Desktop App Development</option>
                <option>3D Scanning</option>
                <option>Creative Media</option>
                <option>Bus. Dev. & Consulting</option>
              </select>
            </div>

            {/* message */}
            <div className="ctc-field ctc-field-full">
              <label className="ctc-label">MESSAGE</label>
              <textarea
                className="ctc-textarea"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your project..."
                rows={5}
              />
            </div>

            {/* checkbox */}
            <div className="ctc-checkbox-wrap">
              <label className="ctc-checkbox-label">
                <input
                  type="checkbox"
                  className="ctc-checkbox-input"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
                <span className="ctc-checkbox-box">
                  {agreed && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 4-5"
                        stroke="#fff" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                I agree to the Terms and Condition
              </label>
            </div>

            {/* submit */}
            <button type="submit" className="ctc-submit">
              Send Message
            </button>

          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;