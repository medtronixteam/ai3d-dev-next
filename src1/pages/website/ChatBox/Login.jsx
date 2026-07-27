import React, { useState } from "react";
import "./Login.css";
import loginImg from "../../../assets/images/loginIMG.png";

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const domains = ["gmail.com", "yahoo.com", "outlook.com"];

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(value)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }

    // Show suggestions if there's no @ in the value
    if (!value.includes("@")) {
      setSuggestions(domains.map((domain) => `${value}@${domain}`));
    } else {
      setSuggestions([]);
    }
  };

  const handleLogin = () => {
    if (name && email && !emailError) {
      const userData = { name, email };
      localStorage.setItem("userData", JSON.stringify(userData)); // Save to localStorage
      onLogin(true, userData); // Send userData to parent
    } else {
      alert("Please enter both name and a valid email.");
    }
  };

  return (
    <div className="login-form">
      <h6>Talk With Our Experts</h6>
      <img src={loginImg} alt="" className="img-fluid login-img" />
      <h4 id="login-text">
        Enter Your{" "}
        <span className="pink-clr">
          <b>Name</b>
        </span>{" "}
        and{" "}
        <span className="pink-clr">
          <b>Email</b>
        </span>
      </h4>
      <div className="form-group mb-2">
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          className={`form-control ${emailError ? "is-invalid" : ""}`}
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter Your Email"
          list="email-suggestions"
        />
        {emailError && (
          <div className="invalid-feedback text-center">
            Please enter a valid email
          </div>
        )}
        <datalist id="email-suggestions">
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
      </div>

      <button onClick={handleLogin} className="btn btn-primary">
        Login
      </button>
    </div>
  );
};

export default Login;
