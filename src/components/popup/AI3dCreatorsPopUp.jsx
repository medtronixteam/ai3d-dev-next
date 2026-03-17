import { ArrowLeft, Check, Clock, Cloud, Crown, UploadCloud } from 'lucide-react';
import './AI3dCreatorsPopUp.css';
import React, { useRef, useState } from 'react';
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
import axios from 'axios';
import { baseURL } from '../../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AI3dCreatorsPopUp = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState('initial');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    creator_type: '',
    interested_in: [], 
    experienced_level: '', 
    content_type: [],
    goals: [],
    language: '',
    category: '',
    model_name: '',
    model_file: null,
    description: '',
    country: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, model_file: file }));
    }
  };

  // Handle multi-select buttons
  const toggleArrayField = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field];
      const isSelected = currentArray.includes(value);
      return {
        ...prev,
        [field]: isSelected
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const toggleSingleSelectArray = (field, value) => {
  setFormData((prev) => {
    const currentArray = prev[field];
    if (currentArray.includes(value)) {
      return { ...prev, [field]: [] }; // deselect
    } else {
      return { ...prev, [field]: [value] }; // select only this
    }
  });
};


  // Handle single select buttons
  const handleButtonSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('Please fill in all required fields');
      setTimeout(() => setError(''), 4000);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setTimeout(() => setError(''), 4000);
      return;
    }

    if (!formData.model_file) {
      setError('Please upload a 3D model sample');
      setTimeout(() => setError(''), 4000);
      return;
    }

    const data = new FormData();
    
    // Append all form fields
    for (let key in formData) {
      if (Array.isArray(formData[key])) {
        // Handle arrays - send each value separately
        formData[key].forEach((val) => data.append(`${key}[]`, val));
      } else if (formData[key]) {
        // Fix backend typo: 'description' -> 'decription'
        if (key === 'description') {
          data.append('decription', formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      }
    }

    try {
      const response = await axios.post(
        `${baseURL}/contributor/register`,
        data,
        { 
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
        }
      );

      console.log('✅ Registration successful:', response.data);
      
      // Move to review step (don't show toast)
      setCurrentStep('review');
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Handle different error types
      if (error.response) {
        const errorMessage = error.response.data?.message 
          || error.response.data?.error 
          || 'Submission failed. Please try again.';
        
        setError(errorMessage);
        setTimeout(() => setError(''), 4000);
        
        console.error('Error details:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
        setTimeout(() => setError(''), 4000);
      } else {
        setError('An unexpected error occurred. Please try again.');
        setTimeout(() => setError(''), 4000);
      }
    }
  };

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

   const goToDashboard = () => {
    onClose();
    navigate('/');
  };
  
  return (
    <section>
      {currentStep === 'initial' && (
        <div className="my-team-overlay" onClick={onClose}>
          <div className="ai3d-creator-account-popup" onClick={(e) => e.stopPropagation()}>
            <div className="row">
              <div
                className="col-md-5 order-2 order-lg-1"
                style={{ padding: isMobile ? '15px 30px 15px 30px' : '15px 0 15px 30px' }}
              >
                <h2 className="creator-popup-h2">Welcome to AI3D Creators</h2>
                <p className="creator-popup-p-tag">
                  Showcase your talent on AI3D Contributors by uploading high quality 3D models.
                  Reach global buyers from sectors such as VR, Healthcare, Gaming, and more.
                </p>
                <span className="creator-popup-span-tag">Perfect for:</span>
                <div className="d-flex gap-2 align-align-items-start">
                  <Crown size={22} />
                  <span className="creator-popup-span">
                    Perfect for 3D visionaries shaping the future of digital experiences.
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
        <section className="my-team-overlay" onClick={onClose}>
          <div className="ai3d-creator-account-popup" onClick={(e) => e.stopPropagation()}>
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
                  <div 
                    className={`various-industry-section ${formData.interested_in.includes('VR Creator') ? 'active' : ''}`}
                    onClick={() => toggleSingleSelectArray('interested_in', 'VR Creator')}
                    style={{ cursor: 'pointer' }}
                  >
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
                  <div 
                    className={`various-industry-section ${formData.interested_in.includes('Game Artist') ? 'active' : ''}`}
                    onClick={() => toggleSingleSelectArray('interested_in', 'Game Artist')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <span className="various-industry-section-img">
                        <img src={GameStudio} alt="" width="20px" height="20px" />
                      </span>
                      <h2>Game Artist</h2>
                    </div>
                    <p>I create detailed 3D models, props, and characters for gaming projects.</p>
                  </div>
                  <div 
                    className={`various-industry-section ${formData.interested_in.includes('Product Designer') ? 'active' : ''}`}
                    onClick={() => toggleSingleSelectArray('interested_in', 'Product Designer')}
                    style={{ cursor: 'pointer' }}
                  >
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
                  <div 
                     className={`various-industry-section ${formData.interested_in.includes('Healthcare Specialist') ? 'active' : ''}`}
                      onClick={() => toggleSingleSelectArray('interested_in', 'Healthcare Specialist')}
                      style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <span className="various-industry-section-img">
                        <img src={Protection} alt="" width="20px" height="20px" />
                      </span>
                      <h2>Healthcare Specialist</h2>
                    </div>
                    <p>
                      I create accurate 3D visuals for medical training, anatomy, and
                      healthcare simulations.
                    </p>
                  </div>
                </div>
               <button
                className="a3d-creator-btn"
                disabled={!formData.interested_in}
                style={{
                  cursor: formData.interested_in ? 'pointer' : 'not-allowed',
                  opacity: formData.interested_in ? 1 : 0.8,
                }}
                onClick={() => handleNext('category')}
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

      {currentStep === 'category' && (
        <section className="my-team-overlay" onClick={onClose}>
          <div className="ai3d-creator-account-popup" onClick={(e) => e.stopPropagation()}>
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
                  {['E-commerce', 'VR Environment', 'Healthcare Models', 'Construction Assets', 'Gaming Props & Characters', 'Retail Displays & Products'].map((cat) => (
                    <button 
                      key={cat}
                      className={`category-btn ${formData.category === cat ? 'active' : ''}`}
                      onClick={() => handleButtonSelect('category', cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  className="a3d-creator-btn"
                  style={{
                    marginTop: '4rem',
                    cursor: formData.category.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: formData.category.length === 0 ? 0.8 : 1, 
                  }}
                  onClick={() => handleNext('experience')}
                  disabled={formData.category.length === 0} 
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
        <section className="my-team-overlay" onClick={onClose}>
          <div className="ai3d-creator-account-popup" onClick={(e) => e.stopPropagation()}>
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
                  That's awesome!
                  <span className="creator-gradient-text ms-1">
                    How would you describe your experience level?
                  </span>
                </h2>
                <p className="creator-popup-p-tag">Choose your skill level in 3D Modeling.</p>

                <div className="category-buttons">
                  {['beginner', 'intermediate', 'advanced', 'Studio / Agency'].map((level) => (
                    <button 
                      key={level}
                      className={`category-btn ${formData.experienced_level === level.toLowerCase() ? 'active' : ''}`}
                      onClick={() => handleButtonSelect('experienced_level', level.toLowerCase())}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>

                <button
                  className="a3d-experience-btn"
                  style={{
                    marginTop: '5rem',
                    cursor: !formData.experienced_level ? 'not-allowed' : 'pointer',
                    opacity: !formData.experienced_level ? 0.8 : 1,
                  }}
                  disabled={!formData.experienced_level} 
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
        <section className="my-team-overlay" onClick={onClose}>
          <div className="ai3d-creator-account-popup" onClick={(e) => e.stopPropagation()}>
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
                  {['Realistic 3D Models', 'Low poly Models', '3D Scans', 'Animated Models', 'Game ready Models', 'Industrial Models'].map((type) => (
                    <button 
                      key={type}
                      className={`category-btn ${formData.content_type.includes(type) ? 'active' : ''}`}
                      onClick={() => toggleArrayField('content_type', type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <button
                className="a3d-experience-btn"
                style={{
                  marginTop: '5rem',
                  cursor: formData.content_type.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: formData.content_type.length === 0 ? 0.8 : 1,
                }}
                disabled={formData.content_type.length === 0}
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
        <section className="my-team-overlay" onClick={onClose}>
          <div className="ai3d-creator-account-popup" onClick={(e) => e.stopPropagation()}>
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
                  {['Earn from my 3D models', 'Collaborate with creators', 'Get exposure in the 3D community', 'Improve my 3D skills', 'Support industry innovation', 'Grow my portfolio'].map((goal) => (
                    <button 
                      key={goal}
                      className={`category-btn ${formData.goals.includes(goal) ? 'active' : ''}`}
                      onClick={() => toggleArrayField('goals', goal)}
                    >
                      {goal}
                    </button>
                  ))}
                </div>

                <button
                  className="a3d-creator-btn"
                  style={{
                    marginTop: '5rem',
                    cursor: formData.goals.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: formData.goals.length === 0 ? 0.8 : 1,
                  }}
                  disabled={formData.goals.length === 0} 
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
        <section className="my-team-overlay" onClick={onClose}>
          <div className="ai3d-creator-form-popup" onClick={(e) => e.stopPropagation()}>
            <img src={ArrowBack} className="create-back-btn" onClick={handleBack} />
            <h2 className="creator-popup-h2 mt-4">
              You are almost there.
              <span className="creator-gradient-text ms-1">
                Share <br /> your model sample
              </span>
            </h2>
            <p className="creator-popup-p-tag">
              Upload your best 3D models for review. Our team will evaluate them within 2-3 business
              days.
            </p>

            <form className="ai3d-forms mt-4" onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    color: '#dc3545',
                    marginBottom: 14,
                    fontWeight: 500,
                    padding: '10px',
                    fontSize: '12px',
                    background: '#f8d7da',
                    borderRadius: '8px',
                  }}
                >
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">
                  First Name 
                  {/* <span style={{ color: 'red' }}>*</span> */}
                </label>
                <input 
                  type="text" 
                  className="forms-control" 
                  placeholder="Enter your first name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange} 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Last Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="forms-control" 
                  placeholder="Enter your last name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Email <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="email" 
                  className="forms-control" 
                  placeholder="123@gmail.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  How did you learn about the AI3D Contributor program?
                </label>
                <select 
                  className="form-select"
                  name="creator_type"
                  value={formData.creator_type}
                  onChange={handleChange}
                >
                  <option value="">Select an option</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Friend/Colleague">Friend/Colleague</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Language Proficiency</label>
                <select 
                  className="form-select"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="">Select an option</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Country of residence</label>
                <select 
                  className="form-select"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select country</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Upload 3D model sample <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".obj,.fbx,.glb,.gltf,.zip"
                  style={{ display: 'none' }}
                />
                <div className="upload-boxx" onClick={() => fileInputRef.current?.click()}>
                  <span style={{ background: '#DE399612', borderRadius: '50%', padding: '5px' }}>
                    <UploadCloud color="#DE3996" />
                  </span>
                  <p>{formData.model_file ? formData.model_file.name : 'Drag & drop your files here'}</p>
                  <small style={{ color: '#919191', margin: 0, fontWeight: '500' }}>
                    Supported formats: OBJ, FBX, GLB, GLTF, ZIP
                  </small>
                  <button type="button" className="a3d-choose-btn mt-2">
                    Choose File
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Model Name</label>
                <input 
                  type="text" 
                  className="forms-control" 
                  placeholder="Enter model name"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleChange} 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select 
                  className="form-select" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Character">Character</option>
                  <option value="Vehicle">Vehicle</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="forms-control"
                  rows="3"
                  maxLength={300}
                  placeholder="Tell us more about your model experience"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                <div className="text-end">
                  <small style={{ color: '#7D7D7D', fontSize: '11px' }}>
                    {formData.description.length}/300
                  </small>
                </div>
              </div>

              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" id="termsCheck" required />
                <label className="form-check-label" htmlFor="termsCheck">
                  By entering your information, you agree to AI3D acknowledge our
                  <a href="#" style={{ color: '#DE3996' }}>
                    {' '}Terms of Use, Contributor Agreement
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
              >
                Submit
              </button>
            </form>
          </div>
        </section>
      )}

      {/* {currentStep === 'residenceForm' && (
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
      )} */}

      {currentStep === 'review' && (
        <section className="my-team-overlay" onClick={onClose}>
          <div className="ai3d-creator-account-popup" onClick={(e) => e.stopPropagation()}>
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
        <section className="my-team-overlay" onClick={onClose}>
          <div className="ai3d-creator-account-popup" onClick={(e) => e.stopPropagation()}>
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
                  <button className="a3d-choose-btn mt-3" onClick={goToDashboard}>Enter Dashboard</button>
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
