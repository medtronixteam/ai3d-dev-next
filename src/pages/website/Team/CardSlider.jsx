import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CardSlider.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import Haseeb from "../../../assets/images/Haseeb2.png";
import Shehroz from "../../../assets/images/Shehroz2.png";
import Akash from "../../../assets/images/akash.png";
import hassnain from "../../../assets/images/ali hassnain.png";
import zeeshan from "../../../assets/images/zeeshan.png";
import Ibrahim from "../../../assets/images/Ibrahim.png";
import usman from "../../../assets/images/usman.png";
import ryan from "../../../assets/images/leardership/ryan.png";
import shewar from "../../../assets/images/shewar.png";
import hira from "../../../assets/images/Hira.png";
import junaid from "../../../assets/images/junaid.png";
import Ikram from "../../../assets/images/Ikram.png";
import ilyas from "../../../assets/images/Ilyas.png";
import samia from "../../../assets/images/samia.png";

const CardSlider = () => {
  const [showMore, setShowMore] = useState(false);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const cards = [
    {
      title: "Ali Akash",
      description: "AI Engineer",
      image: Akash,
    },
    {
      title: "Ali Hasnain",
      description: "AI Engineer",
      image: hassnain,
    },
    {
      title: "Rayan Babur",
      description: "Ai Research lead",
      image: ryan,
    },
    {
      title: "Ikram Elahi Hashmi",
      description: "AI Engineer",
      image: Ikram,
    },
    {
      title: "Hira Aziz",
      description: "Video Animator",
      image: hira,
    },
    {
      title: "Shehroz Shabbir",
      description: "Sr. Full Stack Developer",
      image: Shehroz,
    },
    {
      title: "M.Zeeshan",
      description: "Full Stack Developer",
      image: zeeshan,
    },
    {
      title: "Haseeb Ahmed",
      description: "MERN Stack Developer",
      image: Haseeb,
    },
    {
      title: "M Ibrahim",
      description: "Flutter developer",
      image: Ibrahim,
    },
    {
      title: "Usman Khalid",
      description: "DevOps Engineer",
      image: usman,
    },
    {
      title: "M.Shahwar",
      description: "Graphics Designer",
      image: shewar,
    },
    {
      title: "M Junaid Tayyab",
      description: "Strategic Growth Partner",
      image: junaid,
    },
    {
      title: "Samia Rasheed",
      description: "Social Media Manager",
      image: samia,
    },
    {
      title: "Ilyas Hussain",
      description: "AI Engineer",
      image: ilyas,
    },
  ];

  const mainMembers = cards.slice(0, 6);
  const remainingMembers = cards.slice(6);

  return (
    <div className="slider-container">
      {!showMore ? (
        <>
          <div className="team-grid">
            {mainMembers.map((card, index) => (
              <div className="card" key={index}>
                <LazyLoadImage
                  src={card.image}
                  alt={card.title}
                  className="card-image"
                  effect="blur"
                />
                <div className="card-content">
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="see-more-wrapper">
            <button className="see-more-btn" onClick={() => setShowMore(true)}>
              See More Team Members ({remainingMembers.length}+)
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="team-grid">
            {cards.map((card, index) => (
              <div className="card" key={index}>
                <LazyLoadImage
                  src={card.image}
                  alt={card.title}
                  className="card-image"
                  effect="blur"
                />
                <div className="card-content">
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="see-more-wrapper">
            <button className="see-more-btn" onClick={() => setShowMore(false)}>
              Show Less
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSlider;
