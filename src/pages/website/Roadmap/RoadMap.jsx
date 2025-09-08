import React, { useState, useEffect } from "react";
import "./RoadMap.css";

const RoadMap = () => {
  // const [showPopup, setShowPopup] = useState(false);
  const [value, setValue] = useState({
    name: "",
    // number: "",
    email: "",
    companyName: "",
    country: "",
    industry: "",
  });

  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  // const handleNumberChange = (e) => {
  //   const newValue = e.target.value.replace(/[^0-9+]/g, "");
  //   if (newValue.match(/^\+?[0-9]*$/)) {
  //     setValue({ ...value, number: newValue });
  //   }
  // };

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
    // formData.append("number", value.number);
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
            // number: "",
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
        setApiMessage("Error submitting the form.");
        console.error("Error submitting the form:", error);
      });
  };

  // useEffect(() => {
  //   sessionStorage.removeItem("modalClosed");

  //   const modalClosed = sessionStorage.getItem("modalClosed");
  //   if (!modalClosed) {
  //     setShowPopup(true);
  //   }
  // }, []);

  // const handleClosePopup = () => {
  //   setShowPopup(false);
  //   sessionStorage.setItem("popupShown", "true");
  // };

  return (
    <>
      <div className="container mb-40" id="contact">
        <div className="row align-items-center">
          <div className="col-md-12 ">
            <div className="tl-header">
              <h1 style={{ textAlign: "center" }}>Our Roadmap</h1>
            </div>
            <div className="tl-item">
              <div className="tl-circle"></div>
            </div>
            <div className="tl-item">
              <div className="tl-circle"></div>
              {/* new change */}
            </div>
            <div className="tl-item tl-year-wrap">
              <span className="tl-year-back"></span>
              <span className="tl-year">2025</span>
            </div>
            <div className="tl-item">
              <span className="tl-date">Stage 1</span>
              <div className="tl-event">
                <h2 className="tl-color">Initial Development</h2>
                <h6>
                  We are developing AI program and infrastructure of App,
                  Modules.
                </h6>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-date">Stage 2</span>
              <div className="tl-event">
                <h2 className="tl-color">Development Mode Release</h2>
                <h6>
                  This release will be for internal developers and testers.
                </h6>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-date">Stage 3</span>
              <div className="tl-event">
                <h2 className="tl-color">Beta Release</h2>
                <h6>
                  Beta Release will be for our B2B and B2C Waitlist clients.
                </h6>
              </div>
            </div>
            <div className="tl-item">
              <span className="tl-date">Stage 4</span>
              <div className="tl-event">
                <h2 className="tl-color">Public Release</h2>
                <h6>
                  For general clients and organizations a full 100% release will
                  happen.
                </h6>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-end"></div>
            </div>
          </div>
          {/* <div className="col-12 col-md-6">
            <div className="container waitlist-container">
              <form className="form" onSubmit={handleSubmit}>
                <div className="descr">Wait List</div>
                <span className="descr-text">
                  Join the waitlist for our cutting-edge AI 3D scanning service
                  and be among the first to experience the future of digital
                  scanning.
                </span>
                {apiMessage && (
                  <div
                    className={`api-message ${
                      apiSuccess ? "success-message" : "error-message"
                    }`}>
                    {apiMessage}
                  </div>
                )}
                <div className="wl-input">
                  <input
                    required
                    autoComplete="off"
                    type="text"
                    name="name"
                    value={value.name}
                    onChange={handleChange}
                  />
                  <label htmlFor="name">Full Name</label>
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>
                <div className="wl-input">
                  <input
                    required
                    autoComplete="off"
                    name="email"
                    type="text"
                    value={value.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">E-mail Address</label>
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div className="wl-input">
                  <input
                    required
                    autoComplete="off"
                    name="companyName"
                    type="text"
                    value={value.companyName}
                    onChange={handleChange}
                  />
                  <label htmlFor="companyName">Company Name</label>
                  {errors.companyName && (
                    <p className="error-text">{errors.companyName}</p>
                  )}
                </div>
                <div className="wl-input">
                  <input
                    required
                    autoComplete="off"
                    name="country"
                    type="text"
                    value={value.country}
                    onChange={handleChange}
                  />
                  <label htmlFor="country">Country Name</label>
                  {errors.country && (
                    <p className="error-text">{errors.country}</p>
                  )}
                </div>
                <div className="wl-input">
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
                <button type="submit">Submit →</button>
              </form>
            </div>
          </div> */}
        </div>
      </div>
      <div className="float-end"></div>
    </>
  );
};

export default RoadMap;
