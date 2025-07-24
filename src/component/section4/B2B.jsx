import React, { useState, useEffect } from "react";
import "./B2B.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaCalendarAlt } from "react-icons/fa";
import Constrution from "../../Assets/Constrution.png";
import Gaming from "../../Assets/Gaming.png";
import Ecommerce from "../../Assets/E_Comerce.png";
import Health from "../../Assets/helthcare.png";
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
    sessionStorage.removeItem("modalClosed");

    const modalClosed = sessionStorage.getItem("modalClosed");
    if (!modalClosed) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("popupShown", "true");
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
     
    </div>
  );
};

export default B2B;
