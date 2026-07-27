import React, { useEffect } from "react";
import Slider from "react-slick";
import "./LogoSlider.css";
import logo1 from "../../../assets/images/logo1.png";
import logo3 from "../../../assets/images/logo3.png";
import logo4 from "../../../assets/images/logo4.png";
import logo5 from "../../../assets/images/logo5.png";
import logo6 from "../../../assets/images/logo10.png";
import logo7 from "../../../assets/images/logo7.png";
import vera from "../../../assets/images/vira.png";

const logos = [logo4, logo1, logo3, logo5, logo6, logo7, vera];

const LogoSlider = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.1 }
    );

    const lazyImages = document.querySelectorAll(".lazy-logo");
    lazyImages.forEach((image) => observer.observe(image));

    return () => {
      lazyImages.forEach((image) => observer.unobserve(image));
    };
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0",
        },
      },
    ],
  };

  return (
    <div className="logo-slider-container">
      <Slider {...settings}>
        {logos.map((logo, index) => (
          <div key={index} className="logo-slide">
            <img
              data-src={logo}
              src="https://via.placeholder.com/150"
              alt={`Logo ${index}`}
              className="lazy-logo logo"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default LogoSlider;
