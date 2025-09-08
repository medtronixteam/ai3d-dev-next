import React from "react";
import "./Footer.css";
import { IoCall, IoMailSharp } from "react-icons/io5";
import { AiFillLinkedin } from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-6 ">
            <div className="footer-text-box mb-3">
              <h1 className="pink-clr">
                <b>Subscribe to updates</b>{" "}
              </h1>
              <p>
                Join our newsletter to stay informed about new features and
                product updates.
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-6 subscribe-section">
            <div className="input-group">
              <input
                type="email"
                className="input"
                id="Email"
                name="Email"
                placeholder="contact@ai3dscanning.com"
                autoComplete="off"
              />
              <input
                className="button--submit"
                value="Subscribe"
                type="submit"
              />
            </div>
          </div>
        </div>
        <div className="contact-box mt-5 mb-4">
          <ul>
            <h6> Contact </h6>

            <li>
              <span>
                <IoCall style={{ marginRight: "4px" }} />
                <a href="tel:+12088076899">+12088076899</a>
              </span>
            </li>
            <li>
              <span>
                <IoMailSharp style={{ marginRight: "8px" }} />
                <a href="mailto:contact@ai3dscanning.com">
                  contact@ai3dscanning.com
                </a>
              </span>
            </li>
            <li>
              <span>
                <AiFillLinkedin
                  style={{
                    fontSize: "17px",
                    marginRight: "8px",
                  }}
                />

                <a href="https://www.linkedin.com/company/ai-3d-scanning-solutions-pvt-limited">
                  AI 3D Scanning Solutions
                </a>
              </span>
            </li>
          </ul>
        </div>
        <hr />
        <div className="copy-right mb-3">
          <p>
            Copyright © Powered by  AI 3D Scanning Solutions Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
