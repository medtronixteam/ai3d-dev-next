import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../Service.css';
import '../LandingPage.css';
import './ServicePage.css';
import HeroSection from '../../components/service/HeroSection';
import Work from '../../components/service/Work';
import WorkTogether from '../../components/service/WorkTogether';
import Projects from '../../components/service/Projects';
import Contact from '../../components/service/Contact';
import logo from '../../pages/images/logo.png';
import world from '../../pages/images/worl.png';
import line from '../../pages/images/line.png';
import dot from '../../pages/images/do.png';
import arrow from '../../pages/images/arri.png';
import { FaChevronDown, FaArrowUp } from 'react-icons/fa';
import FooterLangCurrency from '../../components/footer/FooterLangCurrency';

const ServicePage = () => {
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

      <HeroSection scrollContainerRef={landingRef} />

      <Work />

      <WorkTogether />

      <Projects />

      <Contact />

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
                  {['Home', 'Services', 'Pricing'].map((item) => (
                    <li key={item}>
                      <a
                        href={
                          item === 'Pricing'
                            ? '/3dio/subscription'
                            : item === 'Services'
                              ? '/services'
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
    </div>
  );
};

export default ServicePage;
