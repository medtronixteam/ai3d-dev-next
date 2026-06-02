// GetStartedPage.jsx
import React from 'react';
import '../LandingPage.css';
import './GetStartedPage.css';
import { Link } from 'react-router-dom';
import elipse from '../images/heading_ellipse.png';
import QuickUpload from '../images/QuickUpload.svg';
import MarketPlace from '../images/MarketPlace.svg';
import TopPerformance from '../images/TopPerformance.svg';
import TopCatagories from '../images/TopCatagories.svg';
import Asset from '../images/Asset.svg';
import EarningOverview from '../images/EarningOverview.svg';
import EditMetadata from '../images/EditMetadata.svg';
import { ArrowRight } from 'lucide-react';
import world from '../images/worl.png';
import line from '../images/line.png';
import dot from '../images/do.png';
import logo from '../images/logo.png';
import { FaChevronDown } from 'react-icons/fa';
import arrow from '../images/arri.png';

const GetStartedPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="get-started-contanier pt-5">
        <div className="container text-center position-relative">
          {/* Heading with Ellipse */}
          <div className="d-flex flex-column align-items-center" style={{ marginTop: '5rem' }}>
            <img src={elipse} alt="Ellipse" className="ellipse-img-flat" />
            <h1 className="fw-bold text-dark" style={{ fontSize: '2.5rem' }}>
              Smarter tools. Faster uploads. <br /> Bigger earnings.
            </h1>
          </div>

          <p className="get-started-p-tag">
            <span style={{ color: '#DE3996' }}>Explore our smart tools</span> designed to simplify
            uploading, managing, and <br /> selling your 3D assets, so you can focus on creating.
          </p>

          <Link
            to="#"
            className="btn btn-primary mt-4 px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
            style={{
              backgroundColor: '#ec4899',
              borderColor: '#ec4899',
              fontWeight: 400,
            }}
          >
            Get Started for Free{' '}
            <span
              style={{
                background: 'rgba(243, 243, 243, 0.1)',
                borderRadius: '50%',
                padding: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="features-title position-relative">
              <img src={elipse} alt="Ellipse" className="ellipse-img-features" />
              Our Features
            </h2>
            <p className="features-subtext">
              Discover powerful features designed to save you time, increase your visibility, and
              maximize your earnings as a 3D creator. From AI-powered tagging and real-time
              analytics to automated quality checks and performance insights, we’ve built everything
              you need to thrive in the 3D marketplace.
            </p>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <h3 className="features-btn-text mb-3">Quick Upload Button</h3>
              <p className="features-btn-subtext">
                The Quick Upload feature allows you to instantly add 3D models, assets, and files to
                the platform with a single click. This streamlined functionality eliminates complex
                navigation, saving valuable time during project workflows. Simply drag and drop or
                select files directly, enabling faster content integration and improved productivity
                for your design and development teams.
              </p>
            </div>
            <div className="col-md-6 mb-4 mb-md-0 mt-4 mt-lg-0">
              <img src={QuickUpload} alt="Quick Upload Screenshot" width="100%" />
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <img src={MarketPlace} alt="Quick Upload Screenshot" width="100%" />
            </div>
            <div className="col-md-6">
              <h3 className="features-btn-text mb-3">Marketplace trends</h3>
              <p className="features-btn-subtext">
                Our Market Trends feature provides real-time analytics comparing performance metrics
                across different industry categories. This visual dashboard enables you to identify
                high-performing sectors, track adoption rates, and make data-driven decisions for
                resource allocation. Monitor percentage-based growth patterns to quickly spot
                emerging opportunities and optimize your platform strategy based on concrete market
                insights.
              </p>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <h3 className="features-btn-text mb-3">Top Performance Grid</h3>
              <p className="features-btn-subtext">
                The Top Performing Assets Grid displays your most successful 3D models and content
                based on engagement metrics and usage statistics. This curated view helps you
                quickly identify trending assets, understand user preferences, and replicate
                successful design patterns. Access your best-performing content instantly to
                optimize project outcomes and make informed decisions about future asset
                development.
              </p>
            </div>
            <div className="col-md-6 mb-4 mb-md-0 mt-4 mt-lg-0">
              <img src={TopPerformance} alt="Quick Upload Screenshot" width="100%" />
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <img src={Asset} alt="Quick Upload Screenshot" width="100%" />
            </div>
            <div className="col-md-6">
              <h3 className="features-btn-text mb-3">Asset Submission Dashboard</h3>
              <p className="features-btn-subtext">
                Track your 3D asset uploads through every stage of the review process with complete
                visibility. View essential metadata including category, file format, size, tags, and
                upload ID in one centralized location. Monitor submission status from initial upload
                through quality review to final marketplace listing, ensuring transparency and
                efficient content management throughout the approval workflow.
              </p>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <h3 className="features-btn-text mb-3">Top performing categories</h3>
              <p className="features-btn-subtext">
                The Top Performing Categories feature provides analytics on which asset
                classifications generate the highest engagement and usage rates. This insight helps
                you identify trending content types, allocate resources effectively, and focus
                development efforts on high-demand areas. Leverage category performance data to
                optimize your content strategy and align asset creation with user needs and market
                demands.
              </p>
            </div>
            <div className="col-md-6 mb-4 mb-md-0 mt-4 mt-lg-0">
              <img src={TopCatagories} alt="Quick Upload Screenshot" width="100%" />
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <img src={EarningOverview} alt="Quick Upload Screenshot" width="100%" />
            </div>
            <div className="col-md-6">
              <h3 className="features-btn-text mb-3">Earning Overview</h3>
              <p className="features-btn-subtext">
                The Earning Overview displays revenue data in an intuitive bar chart format with
                both monthly and yearly views for comprehensive financial tracking. This
                dual-perspective visualization enables you to monitor short-term income trends while
                analyzing long-term growth patterns and performance cycles. Switch seamlessly
                between timeframes to compare earnings across periods, identify seasonal variations,
                and make informed strategic decisions based on clear, accessible financial data.
              </p>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <h3 className="features-btn-text mb-3">Edit Metadata</h3>
              <p className="features-btn-subtext">
                The Edit Metadata feature enables you to modify essential asset information
                including title, description, tags, and category assignments. This functionality
                ensures accurate content organization, improves searchability across your asset
                library, and maintains consistent documentation standards. Update metadata
                seamlessly to enhance discoverability
              </p>
            </div>
            <div className="col-md-6 mb-4 mb-md-0 mt-4 mt-lg-0">
              <img src={EditMetadata} alt="Quick Upload Screenshot" width="100%" />
            </div>
          </div>
        </div>

        <div className="aithreed">
          <footer className="footer">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="logo">
                    <img width="120px" src={logo} alt="Logo" />
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
                      <button className="btn btn-custom Sell">Sell your 3D Models</button>
                    </div>

                    <div className="dropdown btn-wrapper d-lg-none d-md-none d-sm-none d-block">
                      <button
                        className="btn english"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img src={world} alt="World" style={{ width: 18, marginRight: 6 }} />
                        English
                        <FaChevronDown size={12} className="ms-2" />
                      </button>

                      <ul className="dropdown-menu menuo usd-tittle" data-bs-popper="static">
                        <li>
                          <a className="dropdown-item black" href="#">
                            English
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="dropdown btn-wrapper d-lg-none d-md-none d-sm-none d-block">
                      <button
                        className="btn usd"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        $USD
                        <FaChevronDown size={12} className="ms-2" />
                      </button>

                      <ul className="dropdown-menu menu usd-tittle" data-bs-popper="static">
                        <li>
                          <a className="dropdown-item black" href="#">
                            $USD
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="d-flex gap-2 none">
                      <div className="dropdown btn-wrapper none">
                        <button
                          className="btn english"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img src={world} alt="World" style={{ width: 18, marginRight: 6 }} />
                          English
                          <FaChevronDown size={12} className="ms-2" />
                        </button>

                        <ul className="dropdown-menu menuo usd-tittle" data-bs-popper="static">
                          <li>
                            <a className="dropdown-item black" href="#">
                              English
                            </a>
                          </li>
                        </ul>
                      </div>

                      <div className="dropdown btn-wrapper none">
                        <button
                          className="btn usd"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          $USD
                          <FaChevronDown size={12} className="ms-2" />
                        </button>

                        <ul className="dropdown-menu menu usd-tittle" data-bs-popper="static">
                          <li>
                            <a className="black" href="#">
                              $USD
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

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
                              ? '/platform/subscription'
                              : item === 'Services'
                                ? '/services'
                                : '#'
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

                <div className="col-lg-2 col-md-4 col-6 top">
                  <h6>Support</h6>

                  <div className="relative">
                    <img width="61px" src={line} alt="Line" />

                    <img src={dot} alt="Dot" className="posotion" />
                  </div>

                  <ul className="mt-1">
                    {['Help Center', 'FAQ'].map((item) => (
                      <li key={item}>
                        <a href={item === 'FAQ' ? '#FAQs' : '/#help'}>
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
                        <a href="tel:4055550218">
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
      </section>
    </>
  );
};

export default GetStartedPage;
