'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiCpu, FiLayers, FiGlobe, FiZap, FiShield, FiBox } from 'react-icons/fi';
import { FaArrowUp } from 'react-icons/fa';
import logo from './images/logo.png';
import elipse from './images/heading_ellipse.png';
import google from './images/google-startups.png';
import googleCloud from './images/google-cloud.png';
import nvidia from './images/nvdia.png';
import PITB from './images/PITB.png';
import reginalPlan from './images/regional-plan.png';
import consulting from './images/consulting.png';
import line from './images/line.png';
import dot from './images/do.png';
import arrow from './images/arri.png';
import FooterLangCurrency from '../components/footer/FooterLangCurrency';
import JoinPlatformCta from '../components/landing/JoinPlatformCta';
import WaitlistModal from '../components/popup/WaitlistModal';
import LeadershipSection from './LeadershipSection';
import './LandingPage.css';
import './AboutUs.css';

const AboutUs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const landingRef = useRef(null);

  useEffect(() => {
    const section = landingRef.current;
    if (!section) return;

    const handleScroll = () => {
      const scrollTop =
        section.scrollTop ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setIsScrolled(scrollTop > 30);
      setShowScrollTop(scrollTop > 300);
    };

    section.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    return () => {
      section.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (landingRef.current) {
      landingRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const corePillars = [
    {
      icon: <FiZap className="about-pillar-icon" />,
      title: 'Instant AI Reconstruction',
      desc: 'Transforms 2D photos, videos, and text into watertight 3D models in approximately 30 seconds using proprietary neural reconstruction.',
    },
    {
      icon: <FiCpu className="about-pillar-icon" />,
      title: 'Sub-Millimeter Precision',
      desc: 'Achieves dense point clouds, clean quad meshes, and studio-grade PBR texture synthesis ready for immediate production use.',
    },
    {
      icon: <FiGlobe className="about-pillar-icon" />,
      title: 'Cloud & Cross-Platform',
      desc: 'Seamlessly works across Web, iOS, and Android with synchronized cloud storage and instant WebGL/WebXR browser preview.',
    },
    {
      icon: <FiBox className="about-pillar-icon" />,
      title: 'Universal Export Pipeline',
      desc: 'One-click export to GLB, USDZ, OBJ, FBX, and STL with developer-friendly REST APIs for Unreal Engine, Unity, and Blender.',
    },
    {
      icon: <FiLayers className="about-pillar-icon" />,
      title: 'Spatial & Digital Twins',
      desc: 'Scales from individual products to complete architectural spaces, indoor scans, and persistent interactive 3D worlds.',
    },
    {
      icon: <FiShield className="about-pillar-icon" />,
      title: 'Enterprise-Grade Security',
      desc: 'Bank-grade encryption, role-based workspace management, and privacy compliance for proprietary enterprise assets.',
    },
  ];

  const trustedPrograms = [
    { src: google, alt: 'Google for Startups', label: 'Program', style: { width: 130 } },
    { src: googleCloud, alt: 'Google Cloud', label: 'Program', style: { width: 130 } },
    { src: nvidia, alt: 'NVIDIA Inception', label: 'Program', style: { width: 130 } },
    { src: PITB, alt: 'PITB', label: 'Program', style: { width: 37 } },
    { src: reginalPlan, alt: 'Regional Plan9', label: 'Pilot', style: { width: 66 } },
    { src: consulting, alt: 'Hiller Consulting', label: 'Advisor', style: { width: 76 } },
  ];

  const stats = [
    { value: '~30s', label: 'Average Generation Time' },
    { value: '< 1mm', label: 'Geometric Accuracy' },
    { value: '5+', label: 'Industry Formats (GLB, USDZ...)' },
    { value: '100%', label: 'Cloud GPU Accelerated' },
  ];

  return (
    <>
      <div className="landing-page-section ai_3d_landing about-us-page-wrapper" ref={landingRef}>
        {/* ========================= Header & Hero Wrapped in Pink Main Head ======================= */}
        <div className="main_head" style={{ backgroundColor: '#FFEDF7' }}>
          <main className="container py-4">
            <header
              className={`a3d-header container-fluid mb-4 a3d-fade-in ${
                isScrolled ? 'a3d-header-scrolled' : ''
              }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <Link to="/" className="a3d-header-logo-link">
                  <img src={logo} alt="3DIO Logo" className="a3d-header-logo" />
                </Link>

                {/* Menu Button for Mobile */}
                <button
                  className="navbar-toggler d-lg-none border-0"
                  type="button"
                  onClick={() => setIsOpen(true)}
                  aria-label="Open navigation menu"
                  aria-expanded={isOpen}
                  aria-controls="mobile-sidebar-nav"
                >
                  <i className="fas fa-bars" aria-hidden="true" />
                </button>

                {/* Desktop Nav - Identical to Home Page */}
                <nav className="d-none d-lg-flex gap-lg-3 gap-xl-4">
                  <Link
                    to="/"
                    className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  >
                    Home
                  </Link>

                  <Link to="https://calendly.com/arslan-medtronix/30min" target="_blank" rel="noopener noreferrer" className="a3d-nav-link">
                    Schedule Meeting
                  </Link>

                  <Link
                    to="/3dio/api-sdk"
                    className={`a3d-nav-link ${location.pathname === '/3dio/api-sdk' ? 'active' : ''}`}
                  >
                    API &amp; Pricing
                  </Link>

                  <a href="/#3d-Sample" className="a3d-nav-link">
                    3D Samples
                  </a>

                  <a href="/#Leadership" className="a3d-nav-link">
                    Leadership
                  </a>
                </nav>

                <div className="d-none d-lg-flex gap-2 align-items-center">
                  <Link to="/book-demo" className="a3d-book-demo-btn">
                    Book a Demo
                  </Link>
                  <JoinPlatformCta onWaitlistOpen={() => setIsWaitlistOpen(true)} />
                </div>
              </div>
            </header>

            {/* Spacer to prevent content overlap */}
            <div className="a3d-header-offset"></div>

            {/* Mobile Sidebar */}
            <div className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
              <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2">
                <Link to="/" className="a3d-header-logo-link">
                  <img src={logo} alt="3DIO Logo" className="a3d-header-logo" />
                </Link>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              <nav id="mobile-sidebar-nav" className="d-flex flex-column gap-2 px-3 pb-3">
                <Link to="/" className="a3d-nav-link" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
                <Link to="https://calendly.com/arslan-medtronix/30min" target="_blank" rel="noopener noreferrer" className="a3d-nav-link">
                  Schedule Meeting
                </Link>
                <Link to="/3dio/api-sdk" className="a3d-nav-link" onClick={() => setIsOpen(false)}>
                  API &amp; Pricing
                </Link>
                <a href="/#3d-Sample" className="a3d-nav-link" onClick={() => setIsOpen(false)}>
                  3D Samples
                </a>
                <a href="/#Leadership" className="a3d-nav-link" onClick={() => setIsOpen(false)}>
                  Leadership
                </a>
                <div className="d-flex flex-column gap-2 mt-2">
                  <Link to="/book-demo" className="a3d-book-demo-btn text-center" onClick={() => setIsOpen(false)}>
                    Book a Demo
                  </Link>
                  <JoinPlatformCta
                    onWaitlistOpen={() => setIsWaitlistOpen(true)}
                    onAfterClick={() => setIsOpen(false)}
                  />
                </div>
              </nav>
            </div>

            {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
          </main>

          {/* ========================= Hero Section ======================= */}
          <section className="about-hero-section">
            <div className="container text-center pb-3">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="about-badge mb-3 d-inline-block">About 3DIO</span>
                <h1 className="about-hero-title">
                  Pioneering the Next Era of{' '}
                  <span className="perfect-heading">
                    3D{' '}
                    <span className="wr-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                      Cr
                      <img
                        src={elipse}
                        alt="Ellipse"
                        className="about-ellipse-img"
                      />
                      ea
                    </span>
                    tion
                  </span>
                </h1>
                <p className="about-hero-subtitle mx-auto">
                  Building the &quot;Canva of 3D&quot; — an AI-native spatial computing platform that
                  turns images, videos, and text into production-ready 3D assets in seconds.
                </p>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                className="about-stats-grid row g-3 mt-4 justify-content-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {stats.map((stat, idx) => (
                  <div className="col-6 col-md-3" key={idx}>
                    <div className="about-stat-card">
                      <h3 className="about-stat-value">{stat.value}</h3>
                      <p className="about-stat-label mb-0">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        </div>

        {/* ========================= Mission & Vision Section ======================= */}
        <section className="about-mission-section py-5">
          <div className="container">
            <div className="row align-items-center g-5">
              <motion.div
                className="col-lg-6"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <span className="about-section-tag">Our Mission &amp; Vision</span>
                <h2 className="about-section-title">
                  Democratizing 3D Creation for Creators &amp; Enterprises Everywhere
                </h2>
                <p className="about-text-muted mt-3">
                  Historically, creating high-fidelity 3D models required expensive photogrammetry rigs,
                  cumbersome LiDAR scanners, and days of painstaking manual 3D modeling. This created a
                  major bottleneck for industries eager to adopt spatial computing, AR/VR, and real-time 3D.
                </p>
                <p className="about-text-muted">
                  <strong>AI 3D Scanning Solutions Inc.</strong> was founded to remove this barrier completely.
                  By harnessing advanced neural radiance fields, Gaussian splatting, and cutting-edge vision-language
                  models, our platform (3DIO) enables anyone to capture, reconstruct, and edit digital assets in
                  less than a minute right from their browser or mobile device.
                </p>
                <div className="about-checklist mt-4">
                  {[
                    'No expensive hardware or complex software required',
                    'Studio-grade geometry, clean quad topology, and PBR textures',
                    'Automated enterprise pipeline and scalable developer REST APIs',
                  ].map((text, idx) => (
                    <motion.div
                      key={idx}
                      className={`checklist-item d-flex align-items-center gap-2 ${idx < 2 ? 'mb-2' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + idx * 0.15 }}
                    >
                      <FiCheckCircle className="check-icon" />
                      <span>{text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="col-lg-6"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <div className="about-story-card">
                  <div className="story-card-inner">
                    <h4 className="story-card-title">What Makes 3DIO Different?</h4>
                    <ul className="story-list mt-3">
                      {[
                        {
                          title: 'Multimodal Simplicity:',
                          desc: 'Turn text, single photos, videos, or full room scans into interactive 3D assets effortlessly.',
                        },
                        {
                          title: 'Speed Without Compromise:',
                          desc: 'Deliver studio-quality assets in approximately 30 seconds instead of hours or days.',
                        },
                        {
                          title: 'Built-in Web Studio:',
                          desc: 'Inspect, relight, tweak textures, and decimate polygon count directly inside the browser.',
                        },
                        {
                          title: 'Pipeline-Ready Exports:',
                          desc: 'Direct export to GLB, USDZ, OBJ, FBX, and STL for Unreal, Unity, Blender, and WebXR.',
                        },
                      ].map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.15 + idx * 0.1 }}
                        >
                          <strong>{item.title}</strong> {item.desc}
                        </motion.li>
                      ))}
                    </ul>
                    <motion.div
                      className="story-card-badge mt-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <span>⚡ AI Infrastructure Layer for 3D Digitization</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================= Core Technology Pillars ======================= */}
        <section className="about-pillars-section py-5 bg-light-section">
          <div className="container">
            <motion.div
              className="text-center max-w-700 mx-auto mb-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <span className="about-section-tag">Core Technology</span>
              <h2 className="about-section-title">Engineered for Quality, Speed &amp; Scale</h2>
              <p className="about-text-muted">
                Discover the foundational pillars powering the 3DIO AI reconstruction engine.
              </p>
            </motion.div>

            <div className="row g-4">
              {corePillars.map((pillar, idx) => (
                <div className="col-md-6 col-lg-4" key={idx}>
                  <motion.div
                    className="about-pillar-card h-100"
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5, delay: (idx % 3) * 0.12 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  >
                    <div className="about-pillar-icon-wrap mb-3">{pillar.icon}</div>
                    <h4 className="about-pillar-title">{pillar.title}</h4>
                    <p className="about-pillar-desc mb-0">{pillar.desc}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================= Global Programs & Backing ======================= */}
        <section className="about-partners-section py-5">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <span className="about-section-tag">Backed By Global Programs</span>
              <h2 className="about-section-title mb-4">Supported by Industry Leaders</h2>
            </motion.div>
            <div className="about-partners-grid d-flex flex-wrap justify-content-center align-items-center gap-3 mt-4">
              {trustedPrograms.map((program, idx) => (
                <motion.div
                  className="about-partner-item"
                  key={idx}
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <img src={program.src} alt={program.alt} style={program.style} className="about-partner-img" />
                  <span className="about-partner-label">{program.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================= Leadership & Footer Wrapped in aithreed ======================= */}
        <div className="aithreed">
          <section className="cards pt" id="Leadership">
            <div className="container-fluid">
              <motion.div
                className="row mt-4 justify-content-center marb"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-lg-4 mb-md-3 mb-0">
                  <h2 className="mb-2" style={{ color: 'rgba(222, 57, 150, 1)' }}>
                    Our Leadership
                  </h2>
                  <p className="text-muted text d-lg-block">Meet Our C-Level Executive Team &amp; Advisors</p>
                </div>
              </motion.div>
              <LeadershipSection />
            </div>
          </section>

          {/* ========================= CTA Section ======================= */}
          <section className="about-cta-section py-5 text-center text-white">
            <div className="container">
              <motion.div
                className="about-cta-box mx-auto p-4 p-md-5"
                initial={{ opacity: 0, scale: 0.93, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <h2 className="about-cta-title">Ready to Experience the Future of 3D?</h2>
                <p className="about-cta-desc mx-auto mt-3">
                  Start turning your 2D images, videos, and text into production-ready 3D models today.
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                  <Link to="/3dio/new/scan" className="btn about-btn-primary">
                    Start Creating Free <FiArrowRight className="ms-1" />
                  </Link>
                  <Link to="/service" className="btn about-btn-outline">
                    Explore Enterprise Services
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ========================= Standard 5-Column Footer Matching Home Page ======================= */}
          <footer className="footer">
            <motion.div
              className="container"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6 }}
            >
              <div className="row">
                {/* Left Column */}
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="logo">
                    <img src={logo} alt="AI 3D Scanning Logo" />
                  </div>
                  <p className="desc">
                    AI 3D Scanning Solutions transforms photos, videos, and real-world objects into
                    high-precision 3D models instantly and without expensive hardware. Our platform
                    offers creation, editing, and a vast 3D content library, all powered by cutting
                    edge AI. From individuals to enterprises, we make 3D accessible, scalable, and secure.
                  </p>
                  <div className="alldiv">
                    <div className="btn-wrapper">
                      <Link to="/contributor/program" className="btn btn-custom Sell">
                        Sell your 3D Models
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
                    {[
                      { name: 'Home', url: '/' },
                      { name: 'About Us', url: '/about-us' },
                      { name: 'Services', url: '/service' },
                      { name: 'Pricing', url: '/3dio/subscription' },
                      { name: 'Student', url: '/student-program' },
                    ].map((item) => (
                      <li key={item.name}>
                        <Link to={item.url}>
                          <img
                            className="iconsize me-1"
                            src={arrow}
                            alt="Arrow"
                            style={{ verticalAlign: 'middle', marginTop: '-3px' }}
                          />
                          {item.name}
                        </Link>
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
                    {[
                      { name: 'Help Center', url: '/3dio/support' },
                      { name: 'FAQ', url: '/#FAQs' },
                    ].map((item) => (
                      <li key={item.name}>
                        <a href={item.url}>
                          <img
                            className="iconsize me-1"
                            src={arrow}
                            alt="Arrow"
                            style={{ verticalAlign: 'middle', marginTop: '-3px' }}
                          />
                          {item.name}
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
                            style={{ verticalAlign: 'middle', marginTop: '-2px' }}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact / Get In Touch */}
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
                        <a href="mailto:contact@ai3dscanning.com" className="mt-1">
                          contact@ai3dscanning.com
                        </a>
                      </li>
                      <li>
                        <a href="tel:+923443228863">
                          <span className="colorc">Phone: </span>
                          <br />
                          <br />
                          +923443228863 , +12088076899
                        </a>
                      </li>
                      <li>
                        <address className="my-0">
                          <span className="colorc">Address: </span> <br />
                          <br />
                          <a
                            href="https://maps.google.com/?q=3765+W+Dublin+Dr,+Eagle,+Idaho+83616,+USA"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            3765 W Dublin Dr, Eagle, Idaho 83616, USA
                          </a>
                        </address>
                        <a
                          href="https://maps.google.com/?q=H+167/B,+Gol+Chakar,+Sahiwal,+Pakistan+57000"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1"
                        >
                          H 167/B, Gol Chakar, Sahiwal, Pakistan 57000
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="social-icons d-md-block d-none">
                    <a
                      href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                    >
                      <i className="bx bxl-facebook" aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/ai3dscanning"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on X"
                    >
                      <i className="bx bxl-twitter" aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on LinkedIn"
                    >
                      <i className="bx bxl-linkedin" aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                    >
                      <i className="bx bxl-instagram" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                {/* Mobile Social Icons */}
                <div className="social-icons d-md-none d-block d-flex justify-content-center mt-3">
                  <a
                    href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook"
                  >
                    <i className="bx bxl-facebook" aria-hidden="true" />
                  </a>
                  <a
                    href="https://x.com/ai3dscanning"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on X"
                  >
                    <i className="bx bxl-twitter" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on LinkedIn"
                  >
                    <i className="bx bxl-linkedin" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                  >
                    <i className="bx bxl-instagram" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <hr />

              <p className="copyright">Copyright © Powered by AI 3D Scanning Solutions Inc.</p>
            </motion.div>
          </footer>
        </div>

        {/* Scroll To Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              type="button"
              className="scroll-to-top"
              aria-label="Scroll to top"
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
              <FaArrowUp color="white" size={20} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>

        {isWaitlistOpen && <WaitlistModal onClose={() => setIsWaitlistOpen(false)} />}
      </div>
    </>
  );
};

export default AboutUs;
