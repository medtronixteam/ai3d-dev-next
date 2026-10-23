import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./CustomNavbar.css";
import logo from "../../images/logo.png";

const CustomNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="custom-navbar">
      <div className="custom-navbar-container">
        <div className="custom-navbar-top">
          <div className="custom-logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="beta-box mx-3">
            <button className="button" data-text="Awesome">
              <span className="actual-text">&nbsp;beta&nbsp;</span>
              <span aria-hidden="true" className="hover-text">
                &nbsp;beta&nbsp;
              </span>
            </button>
          </div>
        </div>

        {/* Hamburger Menu */}
        <div
          className={`custom-hamburger-menu ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <nav
          className={`custom-nav-links ${menuOpen ? "custom-nav-active" : ""}`}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#sample">3D Samples</a>
            </li>
            <li>
              <a href="#team">Leadership</a>
            </li>
            <li>
              <a href="https://dev-backend.ai3dscanning.com/" target="_blank">Join Us</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default CustomNavbar;