import React, { useState, useEffect } from "react";
import "./B2B.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaCalendarAlt } from "react-icons/fa";
import Constrution from "../../../assets/images/Constrution.png";
import Gaming from "../../../assets/images/Gaming.png";
import Ecommerce from "../../../assets/images/E_Comerce.png";
import Health from "../../../assets/images/helthcare.png";
import loadingGif from '../../../assets/images/loading.gif';
import { Link } from "react-router-dom";

const B2B = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [value, setValue] = useState({
    name: "",
    email: "",
    companyName: "",
    country: "",
    industry: "",
  });
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const handleScheduleMeeting = () => {
    const meetingLink = "https://calendly.com/arslan-medtronix/30min";
    window.open(meetingLink, "_blank");
  };
  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!value.name.trim()) {
      formErrors.name = "Full name is required";
    }

    if (!value.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(value.email)) {
      formErrors.email = "Email is invalid";
    }

    if (!value.companyName.trim()) {
      formErrors.companyName = "Company Name is required";
    }

    if (!value.country.trim()) {
      formErrors.country = "Country is required";
    }

    if (!value.industry.trim()) {
      formErrors.industry = "Industry is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", value.name);
    formData.append("email", value.email);
    formData.append("company_name", value.companyName);
    formData.append("country", value.country);
    formData.append("industry", value.industry);

    fetch("https://medtronix.world/api/v1/waitlist", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setApiSuccess(true);
          setApiMessage("Successfully submitted!");
          setValue({
            name: "",
            email: "",
            companyName: "",
            country: "",
            industry: "",
          });
        } else {
          setApiSuccess(false);
          setApiMessage(data.message || "An error occurred.");
        }
      })
      .catch((error) => {
        setApiSuccess(false);
        setApiMessage("Something went wrong. Please try again.");
      });
  };

  useEffect(() => {
    const modalClosed = sessionStorage.getItem("modalClosed");
    if (!modalClosed) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("modalClosed", "true");
  };

  const handleGoToWaitlist = () => {
    setShowWaitlist(true);
  };

  return (
    <div className="B2B mb-40">
      <div className="container B2B-text-box">
        <section className="b2b-section mb-40" id="b2b-section">
          <div className="container b-clint">
            <div className="text-box text-center">
              <h5 className="pink-clr">Our Services for Businesses</h5>
              <h2>
                <b>Business to Business</b>
              </h2>
              <p>
                Our AI 3D Scanning Solution for B2B integrates seamlessly via
                API for web, mobile, and desktop platforms. Designed for
                e-commerce, gaming, construction rendering, and virtual try-on
                companies, our solution enhances user experiences with advanced
                3D capabilities. Available through a flexible licensing model to
                meet your business needs.
              </p>
            </div>
            <div className="row text-center">
              <div className="col-12 col-md-6 col-lg-2 mb-2"></div>
              <div className="col-12 col-md-6 col-lg-4 mb-2">
                <div className="card-box">
                  <LazyLoadImage
                    src={Gaming}
                    alt="IMAGE TO 3D"
                    className="card-image"
                    effect="blur"
                    style={{ width: 90, border: "none", borderRadius: "0px" }}
                    placeholderSrc={loadingGif}
                  />
                  <h5>Gaming</h5>
                  <p>
                    Elevate gaming with AI-powered 3D scanning, creating
                    lifelike assets, dynamic worlds, and detailed characters to
                    captivate players.
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-4 mb-2">
                <div className="card-box">
                  <LazyLoadImage
                    src={Constrution}
                    alt="IMAGE TO 3D"
                    className="card-image"
                    effect="blur"
                    style={{ width: 90, border: "none", borderRadius: "0px" }}
                    placeholderSrc={loadingGif}
                  />
                  <h5>Construction Rendering</h5>
                  <p>
                    Transform architectural visualization with scalable 3D
                    models, helping construction firms streamline planning and
                    enhance client presentations.
                  </p>
                </div>
              </div>
            </div>
            <div className="row text-center">
              <div className="col-12 col-md-6 col-lg-2 mb-2"></div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card-box">
                  <LazyLoadImage
                    src={Health}
                    alt="IMAGE TO 3D"
                    className="card-image"
                    effect="blur"
                    style={{ width: 90, border: "none", borderRadius: "0px" }}
                    placeholderSrc={loadingGif}
                  />
                  <h5>Healthcare</h5>
                  <p>
                    Transform healthcare with advanced 3D scanning for
                    prosthetics, surgical planning, and patient-specific
                    modeling, enabling personalized care.
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card-box" id="card-box">
                  <LazyLoadImage
                    src={Ecommerce}
                    alt="IMAGE TO 3D"
                    className="card-image"
                    effect="blur"
                    style={{ width: 90, border: "none", borderRadius: "0px" }}
                    placeholderSrc={loadingGif}
                  />
                  <h5>E-commerce</h5>
                  <p>
                    Boost online sales with lifelike 3D displays and virtual
                    try-ons, enhancing engagement, reducing returns, and
                    increasing satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={handleClosePopup}>
              &times;
            </button>

            {!showWaitlist ? (
              <div className="popup-message">
                {/* <div class="timeline">
                  <h3 id="roadmap">Our Roadmap</h3>
                  <div class="outer">
                    <div class="card">
                      <div class="info">
                        <h3 class="title">Initial Development </h3>
                        <p>
                          We are developing AI program and infrastructure of
                          App, Modules.
                        </p>
                      </div>
                    </div>
                    <div class="card">
                      <div class="info">
                        <h3 class="title">Development Mode Release</h3>
                        <p>
                          This release will be for internal developers and
                          testers.{" "}
                        </p>
                      </div>
                    </div>
                    <div class="card">
                      <div class="info">
                        <h3 class="title">Beta Release</h3>
                        <p>
                          Beta Release will be for our B2B and B2C Waitlist
                          clients.
                        </p>
                      </div>
                    </div>
                    <div class="card">
                      <div class="info">
                        <h3 class="title">Public Release</h3>
                        <p>
                          For general clients and organizations a full 100%
                          release will happen.
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="schedule-meeting">
                  <h2>Schedule Your Meeting</h2>
                  <p>
                    Click the button below to schedule a meeting with us at your
                    convenience. We look forward to connecting with you!
                  </p>
                  <button onClick={handleScheduleMeeting}>
                    <FaCalendarAlt style={{ marginRight: '8px' }} />
                    Schedule a Meeting
                  </button>
                </div>
              </div>
            ) : (
              <div className="container  ">
                <form className="waitlist-form" onSubmit={handleSubmit}>
                  <div className="descr">
                    <h3>Wait List</h3>
                  </div>
                  <span className="descr-text">
                    Join the waitlist for our cutting-edge AI 3D scanning
                    service and be among the first to experience the future of
                    digital scanning.
                  </span>
                  {apiMessage && (
                    <div
                      className={`waitlist-api-message ${
                        apiSuccess
                          ? "waitlist-error-message"
                          : "waitlist-success-message"
                      }`}>
                      {apiMessage}
                    </div>
                  )}
                  <div className="waitlist-input-wrapper">
                    <div className="waitlist-input">
                      <input
                        placeholder="Enter your name"
                        required
                        autoComplete="off"
                        type="text"
                        name="name"
                        value={value.name}
                        onChange={handleChange}
                      />
                      {/* <label htmlFor="name">Full Name</label> */}
                      {errors.name && (
                        <p className="error-text">{errors.name}</p>
                      )}
                    </div>
                    <div className="waitlist-input">
                      <input
                        placeholder="Enter your email address"
                        required
                        autoComplete="off"
                        name="email"
                        type="text"
                        value={value.email}
                        onChange={handleChange}
                      />
                      {/* <label htmlFor="email">E-mail Address</label> */}
                      {errors.email && (
                        <p className="error-text">{errors.email}</p>
                      )}
                    </div>
                    <div className="waitlist-input">
                      <input
                        placeholder="Enter your company name"
                        required
                        autoComplete="off"
                        name="companyName"
                        type="text"
                        value={value.companyName}
                        onChange={handleChange}
                      />
                      {/* <label htmlFor="companyName">Company Name</label> */}
                      {errors.companyName && (
                        <p className="error-text">{errors.companyName}</p>
                      )}
                    </div>
                    <div className="waitlist-input">
                      <input
                        placeholder="Enter your country name"
                        required
                        autoComplete="off"
                        name="country"
                        type="text"
                        value={value.country}
                        onChange={handleChange}
                      />
                      {errors.country && (
                        <p className="error-text">{errors.country}</p>
                      )}
                    </div>
                    <div className="waitlist-input">
                      <select
                        name="industry"
                        value={value.industry}
                        onChange={handleChange}>
                        <option value="" disabled>
                          Select Industry
                        </option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="Construction">Construction</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Gaming">Gaming</option>
                        <option value="VR">VR</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.industry && (
                        <p className="error-text">{errors.industry}</p>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="waitlist-button">
                    Submit →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default B2B;
