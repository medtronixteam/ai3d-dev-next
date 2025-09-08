import React from "react";
import "./CardSection.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; 

import card1 from "../../../assets/images/o.png";
import card2 from "../../../assets/images/chair.png";
import card3 from "../../../assets/images/video3dpng.png";
import loadingGif from '../../../assets/images/loading.gif';

const CardSection = () => {
  return (
    <div className="CardSection mb-40 mt-3" id="services">
      <div className="container">
        <div className="row">
          <div className="col-md-4 card3D">
            <h2>IMAGE TO 3D</h2>
            <h3>Generate 3D models from images in seconds.</h3>
            <LazyLoadImage
              src={card2}
              alt="IMAGE TO 3D"
              className="card-image"
              effect="blur"
              placeholderSrc={loadingGif}
            />
          </div>
          <div className="col-md-4 card3D">
            <h2>VIDEO TO 3D</h2>
            <h3>Generate 3D models from video in seconds.</h3>
            <LazyLoadImage
              src={card3}
              alt="VIDEO TO 3D"
              className="card-image"
              effect="blur"
              placeholderSrc={loadingGif}
            />
          </div>
          <div className="col-md-4 card3D">
            <h2>PROMPT TO 3D</h2>
            <h3>Generate 3D models from text prompts in seconds.</h3>
            <LazyLoadImage
              src={card1}
              alt="PROMPT TO 3D"
              className="card-image"
              effect="blur"
              placeholderSrc={loadingGif}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSection;
