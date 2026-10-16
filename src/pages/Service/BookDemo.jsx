'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../../config';
import '../LandingPage.css';
import './ServicePage.css';
import Fb from '../../assets/icon/Fb.svg';
import Tk from '../../assets/icon/Tk.svg';
import Ln from '../../assets/service/LN.svg';
import elipse from '../../pages/images/heading_ellipse.png';
import './bookDemo.css';
import './bookDemoMotion.css';
import { Mail, Phone } from 'lucide-react';
import logo from '../../pages/images/logo.png';
import world from '../../pages/images/worl.png';
import line from '../../pages/images/line.png';
import dot from '../../pages/images/do.png';
import arrow from '../../pages/images/arri.png';
import { FaChevronDown, FaArrowUp } from 'react-icons/fa';
import WaitlistModal from '../../components/popup/WaitlistModal';
import JoinPlatformCta from '../../components/landing/JoinPlatformCta';
import FooterLangCurrency from '../../components/footer/FooterLangCurrency';
import DemoBg from '../../assets/service/DemoBg.svg'

const STATS = [
  { label: 'No Commitment' },
  { label: 'Quick Response' },
  { label: 'Senior Engineers' },
  { label: 'NDA Available' },
];

const DOT_CONFIG = [
  { top: '8%', left: '3%', size: 4, delay: 0, duration: 5.2, color: '#de3996' },
  { top: '14%', left: '11%', size: 3, delay: 0.8, duration: 6.1, color: '#de3996' },
  { top: '6%', left: '22%', size: 5, delay: 1.4, duration: 4.8, color: '#a052b5' },
  { top: '20%', left: '7%', size: 3, delay: 2.1, duration: 7.0, color: '#ff85ca' },
  { top: '28%', left: '17%', size: 4, delay: 0.3, duration: 5.5, color: '#de3996' },
  { top: '10%', left: '33%', size: 3, delay: 1.7, duration: 6.3, color: '#a052b5' },
  { top: '35%', left: '4%', size: 5, delay: 0.6, duration: 4.9, color: '#de3996' },
  { top: '42%', left: '14%', size: 3, delay: 2.5, duration: 5.8, color: '#ff85ca' },
  { top: '18%', left: '42%', size: 4, delay: 1.1, duration: 6.7, color: '#de3996' },
  { top: '50%', left: '6%', size: 3, delay: 0.4, duration: 5.1, color: '#a052b5' },
  { top: '58%', left: '18%', size: 4, delay: 1.9, duration: 4.6, color: '#de3996' },
  { top: '8%', left: '55%', size: 3, delay: 0.7, duration: 6.5, color: '#ff85ca' },
  { top: '24%', left: '63%', size: 5, delay: 1.3, duration: 5.4, color: '#de3996' },
  { top: '12%', left: '72%', size: 3, delay: 2.2, duration: 7.1, color: '#a052b5' },
  { top: '6%', left: '82%', size: 3, delay: 1.6, duration: 6.2, color: '#ff85ca' },
  { top: '20%', left: '88%', size: 5, delay: 0.2, duration: 4.7, color: '#de3996' },
  { top: '45%', left: '90%', size: 4, delay: 1.2, duration: 6.8, color: '#de3996' },
  { top: '15%', left: '95%', size: 4, delay: 2.4, duration: 5.0, color: '#de3996' },
];

const STEPS = [
  {
    num: '01',
    title: 'We Review Your Request',
    desc: 'Our team reviews your project details within 24 hours',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M15 2H3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1z"
          stroke="#de3996"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M6 6h6M6 9h6M6 12h4" stroke="#de3996" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Schedule a Call',
    desc: 'We send you a calendar link to pick a time that works for you',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="13" rx="2" stroke="#de3996" strokeWidth="1.3" />
        <path d="M6 2v2M12 2v2M2 7h14" stroke="#de3996" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="9" cy="11" r="1.5" fill="#de3996" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Live Demo & Strategy',
    desc: '90 min call where we show a concept and discuss your roadmap',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="10" rx="1.5" stroke="#de3996" strokeWidth="1.3" />
        <path d="M6 16h6M9 13v3" stroke="#de3996" strokeWidth="1.3" strokeLinecap="round" />
        <path
          d="M7 7l2 2 3-3"
          stroke="#de3996"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Custom Proposal',
    desc: 'You receive a detailed proposal with timeline and pricing',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 2l1.8 3.6 4 .6-2.9 2.8.7 4L9 11l-3.6 1.9.7-4L3.2 6.2l4-.6L9 2z"
          stroke="#de3996"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const BookDemo = ({ scrollContainerRef }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name) {
      toast.warning("name field is required.");
      return;
    }

    if (!form.email) {
      toast.warning("email field is required.");
      return;
    }

    if (!agreed) {
      toast.warning("Please agree to the terms to proceed.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        company: form.company,
        services: form.service,
        description: form.message
      };

      const response = await axios.post(`${baseURL}/booking`, payload);
      
      toast.success(response.data.message || "Demo booked successfully! We'll contact you soon.");
      
      // Reset form
      setForm({
        name: '',
        email: '',
        company: '',
        service: '',
        message: '',
      });
      setAgreed(false);

    } catch (error) {
      console.error("Booking error:", error);
      const rawMsg = error.response?.data?.message;
      const friendlyMsg = (rawMsg && !rawMsg.toLowerCase().includes("server error"))
        ? rawMsg
        : "We're experiencing a minor technical hiccup. Please try again in a moment!";
      toast.error(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const container = landingRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 30);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const { pathname, hash, key } = useLocation();

  const landingRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (hash === '') {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
      }, 0);
    }
  }, [pathname, hash, key]);

  useEffect(() => {
    const section = landingRef.current;
    if (!section) return;
    const handleScroll = () => setShowScrollTop(section.scrollTop > 300);
    section.addEventListener('scroll', handleScroll, { passive: true });
    return () => section.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    landingRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={landingRef} className="landing-page-section ai_3d_landing">
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            className="scroll-to-top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 9999,
              cursor: 'pointer',
              backgroundColor: '#de3996',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(222, 57, 150, 0.4)',
              border: '2px solid white',
            }}
          >
            <FaArrowUp color="white" size={20} />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bd-hero-wrap">
        <div className="bd-bg">
          <div className="bd-bg-gradient" />
          {DOT_CONFIG.map((dot, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                top: dot.top,
                left: dot.left,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                borderRadius: '50%',
                background: dot.color,
                animation: `${i % 3 === 0 ? 'bd-dot-twinkle' : 'bd-dot-float'} ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          ))}
        </div>

        {/* ── Navbar ── */}
        <div className="ai_3d_landing" style={{ position: 'relative', zIndex: 10 }}>
          <main className="container py-sm-4 pt-4">
            <header
              className={`a3d-header container-fluid mb-4 a3d-fade-in ${isScrolled ? 'a3d-header-scrolled' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <Link to="/" className="a3d-header-logo-link">
                  <img src={logo} alt="Logo" className="a3d-header-logo" />
                </Link>
                <button
                  className="navbar-toggler d-lg-none border-0"
                  type="button"
                  onClick={() => setIsOpen(true)}
                >
                  <i className="fas fa-bars" />
                </button>
                <nav className="d-none d-lg-flex gap-lg-3 gap-xl-4">
                  <Link
                    to="/"
                    className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  >
                    Home
                  </Link>
                  <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-nav-link">
                    Schedule Meeting
                  </Link>
                  <a href="/#3d-Sample" className="a3d-nav-link">
                    3D Samples
                  </a>
                  <a href="/#Leadership" className="a3d-nav-link">
                    Leadership
                  </a>
                  {/* <a
                    href="/referral"
                    className={`a3d-nav-link ${location.pathname === '/referral' ? 'active' : ''}`}
                  >
                    Referral
                  </a> */}
                </nav>
                <div className="d-none d-lg-flex gap-2 align-items-center">
                  <Link to="/book-demo">
                    <button className="a3d-book-demo-btn">Book a Demo</button>
                  </Link>
                  <JoinPlatformCta onWaitlistOpen={() => setIsWaitlistOpen(true)} />
                </div>
              </div>
            </header>
            <div className="a3d-header-offset" />
          </main>

          {/* Mobile Sidebar */}
          <div className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2">
              <Link to="/" className="a3d-header-logo-link">
                <img src={logo} alt="Logo" className="a3d-header-logo" />
              </Link>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <nav className="d-flex flex-column gap-2 px-3 pb-3">
              <Link to="/" className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
              <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-nav-link">
                 Schedule Meeting
              </Link>
              <a href="#3d-Sample" className="a3d-nav-link">
                3D Samples
              </a>
              <a href="#Leadership" className="a3d-nav-link">
                Leadership
              </a>
              {/* <a
                href="/referral"
                className={`a3d-nav-link ${location.pathname === '/referral' ? 'active' : ''}`}
              >
                Referral
              </a> */}
              <div className="d-flex flex-column gap-2">
                <Link to="/book-demo">
                  <button className="a3d-book-demo-btn">Book a Demo</button>
                </Link>
                <JoinPlatformCta
                  onWaitlistOpen={() => setIsWaitlistOpen(true)}
                  onAfterClick={() => setIsOpen(false)}
                />
              </div>
            </nav>
          </div>
          {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
        </div>

        {/* ── Hero section  ── */}
        <div className="bd-hero-content">
          <h1 className="bd-hero-title">Book Your {' '}
         <span className="ctc-arch-wrap">
            <img src={elipse} alt="elipse" className="book-arch"  />
              Free
          </span>
         {' '} Demo</h1>
          <p className="bd-hero-subtitle">
            Tell us about your project and we'll show you exactly how we can build it with a live
            prototype concept, timeline, and cost estimate.
          </p>
          <div className="bd-stats-row">
            {STATS.map((stat, i) => (
              <div className="bd-stat-item" key={i}>
                <span className="bd-stat-label">
                  {stat.label}
                  <span className="bd-stat-sep ms-1">✦</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Card ── */}
      <section className="bd-card-section">

       <img src={DemoBg} alt="" className="bd-demo-bg" aria-hidden="true" />

       
        <div className="bd-card">
          {/* Top Info Bar */}
          <div className="bd-top-bar">
            <div className="bd-top-contacts">
              <div className="bd-contact-chip">
                <span className="bd-contact-icon">
                  <Mail size={14} color="#de3996" />
                </span>
                <div className="d-flex flex-column">
                  <span className="bd-contact-label">Email</span>
                  <Link 
                  to="https://mail.google.com/mail/?view=cm&fs=1&to=contact@ai3dscanning.com"
                  target="_blank" className="bd-contact-value">contact@ai3dscanning.com</Link>
                </div>
              </div>
            </div>

            <div style={{ width: '1px', height: '22px', background: '#0000001A' }} />

            <div className="bd-contact-chip">
              <span className="bd-contact-icon">
                <Phone size={14} color="#de3996" />
              </span>
              <div className="d-flex flex-column">
                <span className="bd-contact-label">Phone</span>
                <span className="bd-contact-value">+923443228863 , +12088076899</span>
              </div>
            </div>

            <div style={{ width: '1px', height: '22px', background: '#0000001A' }} />

            <div className="bd-top-social">
              <span className="bd-social-label">Follow us</span>
              <a href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr" target="_blank" className="bd-social-btn" aria-label="Facebook">
                <img src={Fb} alt="fb" width="18" height="18" />
              </a>
              {/* <a href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/?" target="_blank" className="bd-social-btn" aria-label="Linkedin">
                <img src={Tk} alt="tk" width="15" height="15" />
              </a> */}
              <a href="https://www.instagram.com/ai3d_scanning_solutions?igshid=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr" target="_blank" className="bd-social-btn" aria-label="Instagram">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#de3996"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#de3996" stroke="none" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/?" target="_blank" className="bd-social-btn" aria-label="Instagram">
                <img src={Ln} alt="tk" width="18" height="18" />
              </a>
            </div>
          </div>

          {/* Body: Left + Right */}
          <div className="bd-body">
            {/* ── LEFT ── */}
            <div className="bd-left">
              <h2 className="bd-left-title">
                Let's Build, Launch, Scale{' '}
                <span className="bd-left-title-accent">
                  <span className="bd-arch-wrap">
                    <img src={elipse} alt="" className="bd-arch" />
                    Something
                  </span>{' '}
                  Amazing
                </span>
              </h2>

              <p className="bd-left-subtitle">
                Book a free consultation with our team to discover how we can help you launch
                faster, scale better, and build high-performing digital solutions.
              </p>

              <p className="bd-steps-heading">What Happens Next?</p>

              <div className="bd-steps">
                {STEPS.map((step) => (
                  <div className="bd-step" key={step.num}>
                    <div className="bd-step-icon">{step.num}</div>
                    <div className="bd-step-text">
                      <p className="bd-step-title">{step.title}</p>
                      <p className="bd-step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* ── RIGHT — FORM ── */}
            <div className="bd-right">
              <form className="bd-form" onSubmit={handleSubmit}>
                {/* Row 1: Name + Email */}
                <div className="bd-form-row">
                  <div className="bd-field">
                    <label className="bd-label">NAME</label>
                    <input
                      className="bd-input"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jonnie"
                    />
                  </div>
                  <div className="bd-field">
                    <label className="bd-label">EMAIL ADDRESS</label>
                    <input
                      className="bd-input"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jonnie@gmail.com"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="bd-field">
                  <label className="bd-label">COMPANY</label>
                  <input
                    className="bd-input"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                  />
                </div>

                {/* Service dropdown */}
                <div className="bd-field">
                  <label className="bd-label">What service are you looking for?</label>
                  <select
                    className="bd-select"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                  >
                    <option value="">Select a service...</option>
                    <option>AI Development</option>
                    <option>Flutter Apps</option>
                    <option>Web Development</option>
                    <option>Desktop App Development</option>
                    <option>3D Scanning</option>
                    <option>Creative Media</option>
                    <option>Bus. Dev. &amp; Consulting</option>
                  </select>
                </div>

                {/* Project Description */}
                <div className="bd-field">
                  <label className="bd-label">PROJECT DESCRIPTION</label>
                  <textarea
                    className="bd-textarea"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your project idea, goals, or any specific requirements..."
                    rows={4}
                  />
                </div>

                {/* Checkbox */}
                <div className="bd-checkbox-wrap">
                  <label className="bd-checkbox-label">
                    <input
                      type="checkbox"
                      className="bd-checkbox-input"
                      checked={agreed}
                      onChange={() => setAgreed(!agreed)}
                    />
                    <span className="bd-checkbox-box">
                      {agreed && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M2 5l2.5 2.5 4-5"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    By submitting this form, you agree to be contacted by our team regarding your
                    project inquiry.
                  </label>
                </div>

                {/* Submit */}
                <button type="submit" className="bd-submit" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  {loading ? "Sending..." : "Speak with an expert"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="aithreed">
        <footer className="footer">
          <div className="container">
            <div className="row">
              {/* Left Column */}

              <div className="col-lg-4 col-md-6 col-12">
                <div className="logo">
                  <img src={logo} alt="Logo" />
                </div>

                <p className="desc">
                  AI 3D Scanning Solutions transforms photos, videos, and real-world objects into
                  high-precision 3D models instantly and without expensive hardware. Our platform
                  offers creation, editing, and a vast 3D content library, all powered by cutting
                  edge AI. From individuals to enterprises, we make 3D accessible, scalable, and
                  secure.
                </p>

                <div className="alldiv">
                  <div className="btn-wrapper">
                    <Link to="/contributor/program">
                      <button className="btn btn-custom Sell">Sell your 3D Models</button>
                    </Link>
                  </div>

                    <FooterLangCurrency />
                </div>
              </div>

              {/* Quick Links */}

              <div className="col-lg-2 col-md-4 col-6 txcenter top">
                <h6>Quick Links</h6>

                <div className="relative">
                  <img width="61px" src={line} alt="Line" />

                  <img src={dot} alt="Dot" className="posotion" />
                </div>
                <ul className="mt-1">
                  {['Home', 'Services', 'Pricing', 'Student'].map((item) => (
                    <li key={item}>
                      <a
                        href={
                          item === 'Pricing'
                            ? '/3dio/subscription'
                            : item === 'Services'
                              ? '/service'
                              : item === 'Student'
                                ? '/student-program'
                                : '/'
                        }
                      >
                        <img
                          className="iconsize me-1"
                          src={arrow}
                          alt="Arrow"
                          style={{ verticalAlign: 'middle' }}
                        />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}

              <div className="col-lg-2 col-md-4 col-6 top">
                <h6>Support</h6>

                <div className="relative">
                  <img width="61px" src={line} alt="Line" />

                  <img src={dot} alt="Dot" className="posotion" />
                </div>

                <ul className="mt-1">
                  {['Help Center', 'FAQ'].map((item) => (
                    <li key={item}>
                      <a href={item === 'FAQ' ? '/#FAQs' : '/#help'}>
                        <img
                          className="iconsize me-1"
                          src={arrow}
                          alt="Arrow"
                          style={{ verticalAlign: 'middle' }}
                        />

                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Follow */}

              <div className="col-lg-2 col-md-4 col-6 bottom padd">
                <h6>Follow</h6>

                <div className="relative">
                  <img width="61px" src={line} alt="Line" />

                  <img src={dot} alt="Dot" className="posotion" />
                </div>

                <ul className="mt-1">
                  {[
                    {
                      name: 'LinkedIn',
                      url: 'https://www.linkedin.com/company/ai3d-scanning-solutions-inc/?',
                    },
                    {
                      name: 'Instagram',
                      url: 'https://www.instagram.com/ai3d_scanning_solutions?igshid=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr',
                    },
                    {
                      name: 'Threads',
                      url: 'https://www.threads.net/@ai3d_scanning_solutions',
                    },
                    {
                      name: 'Facebook',
                      url: 'https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr',
                    },
                  ].map((item) => (
                    <li key={item.name}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <img
                          className="iconsize me-1"
                          src={arrow}
                          alt="Arrow"
                          style={{ verticalAlign: 'middle' }}
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}

              <div className="col-lg-2 col-md-4 col-6 bottom p-0 contact mt-md-0 mt-4">
                <h6>Get In Touch</h6>

                <div className="relative">
                  <img width="61px" src={line} alt="Line" />

                  <img src={dot} alt="Dot" className="posotion" />
                </div>

                <div className="contact">
                  <ul className="mt-lg-2 mt-0">
                    <li>
                      <span className="colorc">Email: </span>
                      <br />
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@ai3dscanning.com"
                        target="_blank"
                        className="mt-1"
                        rel="noopener noreferrer"
                      >
                        contact@ai3dscanning.com
                      </a>
                    </li>

                    <li>
                      <a href="#">
                        <span className="colorc">Phone: </span>
                        <br />
                        <br />
                        +923443228863 , +12088076899
                      </a>
                    </li>

                    <li>
                      <a href="#" className=" my-0">
                        <span className="colorc">Address: </span> <br />
                        <br /> 3765 W Dublin Dr, Eagle, Idaho 83616, USA
                      </a>
                      <a href="#" className="mt-1">
                        H 167/B, Gol Chakar, Sahiwal, Pakistan 57000
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="social-icons d-md-block d-none ">
                  <a
                    href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                    target="_blank"
                  >
                    <i className="bx bxl-facebook" />
                  </a>

                  <a href="https://x.com/ai3dscanning" target="_blank">
                    <i className="bx bxl-twitter" />
                  </a>

                  <a
                    href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                    target="_blank"
                  >
                    <i className="bx bxl-linkedin" />
                  </a>

                  <a
                    href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                    target="_blank"
                  >
                    <i className="bx bxl-instagram" />
                  </a>
                </div>
              </div>

              {/* Mobile Social Icons */}
              <div className="social-icons  d-md-none d-block d-flex justify-content-center mt-3">
                <a
                  href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                  target="_blank"
                >
                  <i className="bx bxl-facebook" />
                </a>

                <a href="https://x.com/ai3dscanning" target="_blank">
                  <i className="bx bxl-twitter" />
                </a>

                <a
                  href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                  target="_blank"
                >
                  <i className="bx bxl-linkedin" />
                </a>

                <a
                  href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                  target="_blank"
                >
                  <i className="bx bxl-instagram" />
                </a>
              </div>
            </div>

            <hr />

            <p className="copyright">Copyright © Powered by AI 3D Scanning Solutions Inc.</p>
          </div>
        </footer>
      </div>
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
};

export default BookDemo;
