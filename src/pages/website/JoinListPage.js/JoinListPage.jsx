import React, { useState } from "react";
import "./JoinListPage.css";
import Header from "../Header/Navbar";

const JoinListPage = () => {
  const [showPlans, setShowPlans] = useState(false); // To toggle between sections
  const [showForm, setShowForm] = useState(false); // To show the form
  const [selectedPlan, setSelectedPlan] = useState(null); // To store the selected plan
  const [formSubmitted, setFormSubmitted] = useState(false); // To show confirmation message
  const [pricingType, setPricingType] = useState("subscription"); // To toggle between Subscription and API & SDK Pricing

  // Function to handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  // Function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to submit the form data
    setFormSubmitted(true);
  };

  return (
    <>
      <Header />
      <div className="join-list-page">
        {/* Show the initial section if showPlans is false */}
        {!showPlans && (
          <div className="initial-section card">
            <h1>Next-Gen AI 3D Scanning</h1>
            <p className="subtitle">
              Pre-order now and be among the first to experience AI-powered
              precision scanning.
            </p>
            <button
              className="cta-button"
            
            >
              Get Early Access
            </button>
          </div>
        )}

        {/* Show the plans section if showPlans is true */}
        {showPlans && !showForm && (
          <>
            {/* Toggle Button for Subscription and API & SDK Pricing */}
            <div className="pricing-toggle">
              <button
                className={`toggle-button ${pricingType === "subscription" ? "active" : ""}`}
                onClick={() => setPricingType("subscription")}  
              >
                Subscription Pricing
              </button>
              <button
                className={`toggle-button ${pricingType === "api" ? "active" : ""}`}
                onClick={() => setPricingType("api")}
              >
                API & SDK Pricing
              </button>
            </div>

            {/* Subscription Pricing Section */}
            {pricingType === "subscription" && (
              <>
                <h1>Unlock Exclusive Benefits</h1>
                <p className="subtitle">
                  Choose a plan that suits your needs and take your experience to the
                  next level!
                </p>
                <div className="plans">
                  {/* Basic Plan */}
                  <div className="plan popular">
                    <div className="popular-badge">Most Popular</div>
                    <h2>Basic Plan</h2>
                    <p className="price">
                      $49<span>/month</span>
                    </p>
                    <p className="annual-price">$490/year (2 months free)</p>
                    <ul className="features">
                      <li>✔️ 20 scans per month</li>
                      <li>✔️ Watermarked scans</li>
                      <li>✔️ Standard support</li>
                      <li>✔️ For freelancers and small businesses</li>
                    </ul>
                    <button
                      className="cta-button"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="plan">
                    <h2>Pro Plan</h2>
                    <p className="price">
                      $99<span>/month</span>
                    </p>
                    <p className="annual-price">$990/year (2 months free)</p>
                    <ul className="features">
                      <li>✔️ 100 scans per month</li>
                      <li>✔️ High-resolution scans</li>
                      <li>✔️ API access</li>
                      <li>✔️ AR preview for e-commerce</li>
                      <li>✔️ For professionals and e-commerce sellers</li>
                    </ul>
                    <button
                      className="cta-button"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* Business Plan */}
                  <div className="plan">
                    <h2>Business Plan</h2>
                    <p className="price">
                      $249<span>/month</span>
                    </p>
                    <p className="annual-price">$2,490/year (2 months free)</p>
                    <ul className="features">
                      <li>✔️ Unlimited scans</li>
                      <li>✔️ Cloud storage included</li>
                      <li>✔️ Commercial use license</li>
                      <li>✔️ Priority support</li>
                      <li>✔️ For mid-sized companies and gaming studios</li>
                    </ul>
                    <button
                      className="cta-button"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* API & SDK Pricing Section */}
            {pricingType === "api" && (
              <>
                <h1>API & SDK Pricing</h1>
                <p className="subtitle">
                  Choose a plan that suits your development needs and integrate
                  our powerful 3D scanning technology into your applications.
                </p>
                <div className="plans">
                  {/* Starter API Plan */}
                  <div className="plan">
                    <h2>Starter API</h2>
                    <p className="price">
                      $0.10<span>/Per scan</span>
                    </p>
                    <ul className="features">
                      <li>✔️ Low-resolution, watermarked preview</li>
                      <li>✔️ Up to 10 models per month</li>
                      <li>✔️ For small projects and testing</li>
                    </ul>
                    <button
                      className="cta-button"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* Standard API Plan */}
                  <div className="plan">
                   
                    <h2>Standard API</h2>
                    <p className="price">
                      $0.50<span>/Per scan</span>
                    </p>
                    <ul className="features">
                      <li>✔️ High-resolution models</li>
                      <li>✔️ Customizable export formats (OBJ, FBX, STL, GLTF, USDZ)</li>
                      <li>✔️ For professional developers</li>
                    </ul>
                    <button
                      className="cta-button"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* Advanced API Plan */}
                  <div className="plan popular">
                  <div className="popular-badge">Most Popular</div>
                    <h2>Advanced API</h2>
                    <p className="price">
                      $1.50<span>/Per scan</span>
                    </p>
                    <ul className="features">
                      <li>✔️ Higher accuracy models</li>
                      <li>✔️ Priority processing</li>
                      <li>✔️ AR preview</li>
                      <li>✔️ For advanced applications</li>
                    </ul>
                    <button
                      className="cta-button"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* Enterprise API Plan */}
                  <div className="plan">
                    <h2>Enterprise API</h2>
                    <p className="price">
                      Custom<span> <br/>(Starts at $100K/year)</span>
                    </p>
                    <ul className="features">
                      <li>✔️ Unlimited scans</li>
                      <li>✔️ Dedicated server instances</li>
                      <li>✔️ On-premise deployment</li>
                      <li>✔️ Compliance certifications (HIPAA, GDPR, ISO)</li>
                      <li>✔️ For large corporations</li>
                    </ul>
                    <button
                      className="cta-button"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Back button to go back to the initial section */}
            <div className="back-button-div">
              <button
                className="back-button"
                onClick={() => setShowPlans(false)}
              >
                Back
              </button>
            </div>
          </>
        )}

        {/* Form Section */}
        {/* {showForm && !formSubmitted && (
          <div className="form-section card">
            <h2>Enter Your Details for {selectedPlan}</h2>
            <form onSubmit={handleFormSubmit}>
              <input type="email" placeholder="Email Address" required />
              <input type="tel" placeholder="Phone Number" required />
              <input type="text" placeholder="Country" required />
              <input type="text" placeholder="City" required />
              <input type="text" placeholder="Postal Code" required />
              <button type="submit" className="cta-button">
                Submit
              </button>
            </form>
            <button
              className="back-button"
              onClick={() => setShowForm(false)}
            >
              Back
            </button>
          </div>
        )} */}

        {/* Confirmation Section */}
        {/* {formSubmitted && (
          <div className="confirmation-section card">
            <h2>Thank You for Choosing {selectedPlan}!</h2>
            <p>
              Your request has been successfully submitted. Our team will contact
              you shortly with further details.
            </p>
            <p>
              Stay tuned for exciting updates and exclusive offers on our Next-Gen
              AI 3D Scanning technology.
            </p>
            <button
              className="back-button"
              onClick={() => {
                setShowPlans(false);
                setShowForm(false);
                setFormSubmitted(false);
              }}
            >
              Back to Home
            </button>
          </div>
        )} */}
      </div>
    </>
  );
};

export default JoinListPage;  