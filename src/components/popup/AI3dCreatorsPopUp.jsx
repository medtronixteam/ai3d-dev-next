import { ArrowLeft, Check, Clock, Cloud, Crown, UploadCloud } from 'lucide-react';
import './AI3dCreatorsPopUp.css';
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Creator from '../../pages/images/Creator.png';
import Describe from '../../pages/images/Describe.svg';
import VRCreator from '../../pages/images/VRCreator.svg';
import ProductDesigner from '../../pages/images/ProductDesigner.svg';
import GameStudio from '../../pages/images/GameStudio.svg';
import Protection from '../../pages/images/Protection.svg';
import ArrowBack from '../../pages/images/ArrowBack.svg';
import ExperienceLevel from '../../pages/images/ExperienceLevel.svg';
import Logo from '../../assets/images/Logo.png';

const AI3dCreatorsPopUp = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState('initial');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = (nextStep) => {
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    const steps = [
      'initial',
      'describe',
      'category',
      'experience',
      'content',
      'goals',
      'form',
      'residenceForm',
      'review',
      'welcome',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleClose = () => {
    if (currentStep === 'initial') {
      onClose();
    } else {
      handleBack();
    }
  };

  return (
    <section>
      {currentStep === 'initial' && (
        <div className="my-team-overlay">
          <div className="ai3d-creator-account-popup">
            <div className="row">
              <div
                className="col-md-5 order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <h2 className="creator-popup-h2">Welcome to AI3D Creators</h2>
                <p className="creator-popup-p-tag">
                  Showcase your talent on AI3D Contributors by uploading high quality 3D models.
                  Reach global buyers from sectors such as VR, Healthcare, Gaming, and more.
                </p>
                <span className="creator-popup-span-tag">Perfect for:</span>
                <div className="d-flex gap-2 align-align-items-start">
                  <Crown size={22} />
                  <span className="creator-popup-span">
                    Perfect for 3D visionaries shaping the future of digital experiences.
                  </span>
                </div>
                <span className="creator-popup-span-tag">Why Join</span>
                <div className="d-flex gap-2 align-items-center mt-1">
                  <Check size={18} color="#DE3996" />
                  <span className="creator-popup-p">Work on your own schedule</span>
                </div>
                <div className="d-flex gap-2 align-items-center mt-1">
                  <Check size={18} color="#DE3996" />
                  <span className="creator-popup-p">Earn from your creative work</span>
                </div>
                <div className="d-flex gap-2 align-items-center mt-1">
                  <Check size={18} color="#DE3996" />
                  <span className="creator-popup-p">Gain global exposure</span>
                </div>

                <div className="d-flex gap-2 align-items-center mt-2">
                  <Clock size={16} />
                  <span className="creator-popup-p">This should take a few minutes</span>
                </div>

                <button className="a3d-creator-btn" onClick={() => handleNext('describe')}>
                  Apply
                </button>
              </div>
              <div className="col-md-7 order-1 order-lg-2 position-relative">
                <FiX onClick={onClose} size={22} className="create-account-popup-img" />
                <img
                  src={Creator}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '12px',
                    borderBottomRightRadius: isMobile ? '0px' : '12px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'describe' && (
        <section className="my-team-overlay">
          <div className="ai3d-creator-account-popup">
            <div className="row">
              <div
                className="col-md-6 position-relative order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <img
                  src={ArrowBack}
                  className="create-back-btn d-none d-lg-block"
                  onClick={handleBack}
                />
                <div className="various-industry-container mt-3">
                  <h2 className="creator-popup-h2">
                    Hi! To get you started,
                    <span className="creator-gradient-text">
                      tell <br /> us which best describes you?
                    </span>
                  </h2>
                  <p className="creator-popup-p-tag">
                    We welcome all kinds of 3D creators contributing to various industries.
                  </p>
                  <div className="various-industry-section">
                    <div className="d-flex gap-2 align-items-center">
                      <span className="various-industry-section-img">
                        <img src={VRCreator} alt="" width="20px" height="20px" />
                      </span>
                      <h2>VR Creator</h2>
                    </div>
                    <p>
                      I design immersive 3D environments and assets for virtual and augmented
                      reality experiences.
                    </p>
                  </div>
                  <div className="various-industry-section">
                    <div className="d-flex gap-2 align-items-center">
                      <span className="various-industry-section-img">
                        <img src={GameStudio} alt="" width="20px" height="20px" />
                      </span>
                      <h2>Game Artist</h2>
                    </div>
                    <p>I create detailed 3D models, props, and characters for gaming projects.</p>
                  </div>
                  <div className="various-industry-section">
                    <div className="d-flex gap-2 align-items-center">
                      <span className="various-industry-section-img">
                        <img src={ProductDesigner} alt="" width="20px" height="20px" />
                      </span>
                      <h2>Product Designer</h2>
                    </div>
                    <p>
                      I develop realistic 3D models for retail, manufacturing, and product
                      visualization.
                    </p>
                  </div>
                  <div className="various-industry-section">
                    <div className="d-flex gap-2 align-items-center">
                      <span className="various-industry-section-img">
                        <img src={Protection} alt="" width="20px" height="20px" />
                      </span>
                      <h2>Healthcare Specialist</h2>
                    </div>
                    <p>
                      I create accurate 3D visuals for medical training, anatomy, and
                      healthcare simulations.
                    </p>
                  </div>
                </div>
                <button className="a3d-creator-btn" onClick={() => handleNext('category')}>
                  Continue
                </button>
              </div>

              <div className="col-md-6 position-relative order-1 order-lg-2">
                <FiX onClick={handleClose} size={22} className="create-account-popup-img" />
                <img
                  src={Describe}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '12px',
                    borderBottomRightRadius: isMobile ? '0px' : '12px',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {currentStep === 'category' && (
        <section className="my-team-overlay">
          <div className="ai3d-creator-account-popup">
            <div className="row">
              <div
                className="col-md-6 position-relative order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <img
                  src={ArrowBack}
                  className="create-back-btn d-none d-lg-block"
                  onClick={handleBack}
                />
                <h2 className="creator-popup-h2 mt-4">
                  Welcome Contributor! <br />
                  <span className="creator-gradient-text">What do you love in 3D Models?</span>
                </h2>
                <p className="creator-popup-p-tag">Select your main 3D model category</p>

                <div className="category-buttons">
                  <button className="category-btn active">E-commerce</button>
                  <button className="category-btn">VR Environment</button>
                  <button className="category-btn">Healthcare Models</button>
                  <button className="category-btn">Construction Assets</button>
                  <button className="category-btn">Gaming Props & Characters</button>
                  <button className="category-btn">Retail Displays & Products</button>
                </div>

                <button
                  className="a3d-creator-btn"
                  style={{ marginTop: '4rem' }}
                  onClick={() => handleNext('experience')}
                >
                  Continue
                </button>
              </div>

              <div className="col-md-6 position-relative order-1 order-lg-2">
                <FiX onClick={handleClose} size={22} className="create-account-popup-img" />
                <img
                  src={Describe}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '12px',
                    borderBottomRightRadius: isMobile ? '0px' : '12px',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {currentStep === 'experience' && (
        <section className="my-team-overlay">
          <div className="ai3d-creator-account-popup">
            <div className="row">
              <div
                className="col-md-6 position-relative order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <img
                  src={ArrowBack}
                  className="create-back-btn d-none d-lg-block"
                  onClick={handleBack}
                />
                <h2 className="creator-popup-h2 mt-4">
                  That’s awesome!
                  <span className="creator-gradient-text ms-1">
                    How would you describe your experience level?
                  </span>
                </h2>
                <p className="creator-popup-p-tag">Choose your skill level in 3D Modeling.</p>

                <div className="category-buttons">
                  <button className="category-btn active">Beginner</button>
                  <button className="category-btn">Intermediate</button>
                  <button className="category-btn">Professional</button>
                  <button className="category-btn">Studio / Agency</button>
                </div>

                <button
                  className="a3d-experience-btn"
                  style={{ marginTop: '5rem' }}
                  onClick={() => handleNext('content')}
                >
                  Continue
                </button>
              </div>

              <div className="col-md-6 position-relative order-1 order-lg-2 py-3 py-lg-0">
                <FiX onClick={handleClose} size={22} className="create-account-popup-img" />
                <img
                  src={ExperienceLevel}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '12px',
                    borderBottomRightRadius: isMobile ? '0px' : '12px',
                    background: '#FFC6D54F',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {currentStep === 'content' && (
        <section className="my-team-overlay">
          <div className="ai3d-creator-account-popup">
            <div className="row">
              <div
                className="col-md-6 position-relative order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <img
                  src={ArrowBack}
                  className="create-back-btn d-none d-lg-block"
                  onClick={handleBack}
                />
                <h2 className="creator-popup-h2 mt-4">
                  What type of
                  <span className="creator-gradient-text ms-1">
                    content do you create most often?
                  </span>
                </h2>
                <p className="creator-popup-p-tag">Select all that apply.</p>

                <div className="category-buttons">
                  <button className="category-btn active">Realistic 3D Models</button>
                  <button className="category-btn">Low poly Models</button>
                  <button className="category-btn">3D Scans</button>
                  <button className="category-btn">Animated Models</button>
                  <button className="category-btn">Game ready Models</button>
                  <button className="category-btn">Industrial Models</button>
                </div>

                <button
                  className="a3d-experience-btn"
                  style={{ marginTop: '5rem' }}
                  onClick={() => handleNext('goals')}
                >
                  Continue
                </button>
              </div>

              <div className="col-md-6 position-relative order-1 order-lg-2 py-3 py-lg-0">
                <FiX onClick={handleClose} size={22} className="create-account-popup-img" />
                <img
                  src={ExperienceLevel}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '12px',
                    borderBottomRightRadius: isMobile ? '0px' : '12px',
                    background: '#FFC6D54F',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {currentStep === 'goals' && (
        <section className="my-team-overlay">
          <div className="ai3d-creator-account-popup">
            <div className="row">
              <div
                className="col-md-6 position-relative order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <img
                  src={ArrowBack}
                  className="create-back-btn d-none d-lg-block"
                  onClick={handleBack}
                />
                <h2 className="creator-popup-h2 mt-4">
                  What are your
                  <span className="creator-gradient-text ms-1">goals as a contributor?</span>
                </h2>
                <p className="creator-popup-p-tag">What motivates you to join AI3D?</p>

                <div className="category-buttons">
                  <button className="category-btn active">Earn from my 3D models</button>
                  <button className="category-btn">Collaborate with creators</button>
                  <button className="category-btn">Get exposure in the 3D community</button>
                  <button className="category-btn">Improve my 3D skills</button>
                  <button className="category-btn">Support industry innovation</button>
                  <button className="category-btn">Grow my portfolio</button>
                </div>

                <button
                  className="a3d-creator-btn"
                  style={{ marginTop: '5rem' }}
                  onClick={() => handleNext('form')}
                >
                  Continue
                </button>
              </div>

              <div className="col-md-6 position-relative order-1 order-lg-2">
                <FiX onClick={handleClose} size={22} className="create-account-popup-img" />
                <img
                  src={Describe}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '12px',
                    borderBottomRightRadius: isMobile ? '0px' : '12px',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {currentStep === 'form' && (
        <section className="my-team-overlay">
          <div className="ai3d-creator-form-popup">
            <img src={ArrowBack} className="create-back-btn" onClick={handleBack} />
            <h2 className="creator-popup-h2 mt-4">
              You are almost there.
              <span className="creator-gradient-text ms-1">
                Share <br /> your model sample
              </span>
            </h2>
            <p className="creator-popup-p-tag">
              Upload your best 3D models for review. Our team will evaluate them within 2-3 business
              days.What motivates you to join AI3D?
            </p>

            <form className="ai3d-form mt-4">
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" placeholder="Enter your first name" />
              </div>

              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" placeholder="Enter your last name" />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="text" className="form-control" placeholder="123@gmail.com" />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  How did you learn about the AI3D Contributor program?
                </label>
                <select className="form-select">
                  <option>Select an option</option>
                  <option>Social Media</option>
                  <option>Friend/Colleague</option>
                  <option>Website</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Language Proficiency</label>
                <select className="form-select">
                  <option>Select an option</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Country of residence</label>
                <select className="form-select" onClick={() => handleNext('residenceForm')}>
                  {/* <option>Pakistan</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>India</option>
                  <option>Other</option> */}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Upload 3D model sample</label>
                <div className="upload-box">
                  <span style={{ background: '#DE399612', borderRadius: '50%', padding: '5px' }}>
                    <UploadCloud color="#DE3996" />
                  </span>
                  <p>Drag & drop your files here</p>
                  <small style={{ color: '#919191', margin: 0, fontWeight: '500' }}>
                    Supported formats: JPG, PNG, SVG, PSD, EPS
                  </small>
                  <button type="button" className="a3d-choose-btn mt-2">
                    Choose File
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Model Name</label>
                <input type="text" className="form-control" placeholder="Enter model name" />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-select">
                  <option>Select category</option>
                  <option>Architecture</option>
                  <option>Product Design</option>
                  <option>Character</option>
                  <option>Vehicle</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  maxLength={300}
                  placeholder="Tell us more about your model experience"
                ></textarea>
                <div className="text-end">
                  <small style={{ color: '#7D7D7D', fontSize: '11px' }}>0/300</small>
                </div>
              </div>

              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" id="termsCheck" />
                <label className="form-check-label" htmlFor="termsCheck">
                  By entering your information, you agree to AI3D acknowledge our
                  <a href="#" style={{ color: '#DE3996' }}>
                    Terms of Use, Contributor Agreement
                  </a>{' '}
                  and{' '}
                  <a href="#" style={{ color: '#DE3996' }}>
                    Privacy Policy
                  </a>
                  , which explains how we handle personal information and how to exercise privacy
                  rights.
                </label>
              </div>

              <button
                type="submit"
                className="a3d-creator-btn"
                onClick={() => handleNext('review')}
              >
                Submit
              </button>
            </form>
          </div>
        </section>
      )}

      {currentStep === 'residenceForm' && (
        <section className="my-team-overlay">
          <div className="ai3d-creator-account-popup">
            <div className="row">
              <div
                className="col-md-6 position-relative order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <img
                  src={ArrowBack}
                  className="create-back-btn d-none d-lg-block"
                  onClick={handleBack}
                />
                <div className="various-industry-container mt-4">
                  <h2 className="creator-popup-h2">
                    You are almost there.
                    <span className="creator-gradient-text ms-1">
                      Share <br /> your model sample
                    </span>
                  </h2>
                  <p className="creator-popup-p-tag">
                    Upload your best 3D models for review. Our team will evaluate them within 2-3
                    business days.What motivates you to join AI3D?
                  </p>

                  <form className="ai3d-form mt-4">
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Country of residence</label>
                      <select className="form-select">
                        <option>Pakistan</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>India</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        How did you learn about the AI3D Contributor program?
                      </label>
                      {/* <select className="form-select">
                  <option>Select an option</option>
                  <option>Social Media</option>
                  <option>Friend/Colleague</option>
                  <option>Website</option>
                  <option>Other</option>
                </select> */}
                    </div>

                    <button
                      type="submit"
                      className="a3d-creator-btn"
                      onClick={() => handleNext('form')}
                    >
                      Continue
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-md-6 position-relative order-1 order-lg-2">
                <FiX onClick={handleClose} size={22} className="create-account-popup-img" />
                <img
                  src={Describe}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '12px',
                    borderBottomRightRadius: isMobile ? '0px' : '12px',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {currentStep === 'review' && (
        <section className="my-team-overlay">
          <div className="ai3d-creator-account-popup">
            <div className="row">
              <div
                className="col-md-6 position-relative order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <img
                  src={ArrowBack}
                  className="create-back-btn d-none d-lg-block"
                  onClick={handleBack}
                />
                <h2 className="creator-popup-h2 mt-4">
                  Sit tight, we’re reviewing your application
                </h2>
                <p className="creator-popup-p-tag mt-2">
                  We’re excited about your interest in joining AI3D Contributors! Our team is
                  currently reviewing your profile and portfolio.
                </p>

                <span className="creator-popup-span-tag">What happens next</span>
                <div className="d-flex gap-2 mt-1">
                  <Check size={18} color="#DE3996" />
                  <span className="creator-popup-p">
                    We’ll notify you once your contributor application is approved.
                  </span>
                </div>
                <div className="d-flex gap-2 mt-1">
                  <Check size={18} color="#DE3996" />
                  <span className="creator-popup-p">
                    If accepted, you’ll go through a short onboarding guide to help you upload and
                    manage 3D models on AI3D.
                  </span>
                </div>
                <div className="d-flex gap-2 mt-1">
                  <Check size={18} color="#DE3996" />
                  <span className="creator-popup-p">
                    Start showcasing your 3D creations, gain visibility, and start earning!
                  </span>
                </div>

                <button
                  className="a3d-creator-btn"
                  style={{ marginTop: '5rem' }}
                  onClick={() => handleNext('welcome')}
                >
                  Return to AI3D home
                </button>
              </div>

              <div className="col-md-6 position-relative order-1 order-lg-2">
                <FiX onClick={handleClose} size={22} className="create-account-popup-img" />
                <img
                  src={Describe}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '12px',
                    borderBottomRightRadius: isMobile ? '0px' : '12px',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {currentStep === 'welcome' && (
        <section className="my-team-overlay">
          <div className="ai3d-creator-account-popup">
            <div className="row">
              <div
                className="col-md-6 position-relative d-flex justify-content-center align-items-center order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <img
                  src={ArrowBack}
                  className="create-back-btn d-none d-lg-block"
                  onClick={handleBack}
                />

                <div className="d-flex align-items-center flex-column">
                  <img src={Logo} alt="" width="150px" />
                  <h2 className="creator-popup-h2 mt-4 text-center">
                    Welcome to Your 3D Marketplace
                  </h2>
                  <p className="creator-popup-p-tag mt-2 text-center">
                    Manage your 3D assets, track performance, and grow your creative business with
                    our comprehensive seller dashboard.
                  </p>

                  <span className="creator-popup-span-tag">
                    Empowering 3D Artist to sell and grow
                  </span>
                  <button className="a3d-choose-btn mt-3">Enter Dashboard</button>
                </div>
              </div>

              <div className="col-md-6 position-relative order-1 order-lg-2">
                <FiX onClick={onClose} size={22} className="create-account-popup-img" />
                <img
                  src={Describe}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '12px',
                    borderBottomRightRadius: isMobile ? '0px' : '12px',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
};

export default AI3dCreatorsPopUp;
