import React from "react";
import "./Banner.css";
import { BsApple } from "react-icons/bs";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import BannerIMG from "../../../assets/images/BannerIMG.png";

const Banner = () => {
  return (
    <>
      <section className="banner mb-40">
        <div className="container">
          <div className="row d-flex align-items-center">
            <div className="col-12 col-md-7">
              <div className="left-banner-box">
                <h1>
                  3D Scanning Powered by
                  <span className="pink-clr"> AI </span>
                </h1>
                <button>
                  <IoLogoGooglePlaystore
                    style={{ marginRight: 10, fontSize: 25 }}
                  />
                  Play Store
                </button>
                <button>
                  <BsApple style={{ marginRight: 10, fontSize: 25 }} />
                  App Store
                </button>
              </div>
            </div>
            <div className="col-12 col-md-5">
              <img
                src={BannerIMG}
                className="img-fluid"
                id="banner-img"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
