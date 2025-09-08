import React from "react";
import "./mobileImage.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import mobile from "../../../assets/images/mobile.png";
const Image3D = () => {
  return (
    <div className="container mobile3D mb-40">
      <h3 className="mb-40">
        Experience the magic of 2D to 3D conversion in this section
      </h3>
      <LazyLoadImage
        src={mobile}
        alt="PROMPT TO 3D"
        className=" img-fluid"
        effect="blur"
      />
    </div>
  );
};

export default Image3D;
