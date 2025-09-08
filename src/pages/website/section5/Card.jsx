import React, { useEffect, useRef } from "react";
import "./Card.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import card2 from "../../../assets/images/Card2.png";
import card3 from "../../../assets/images/Card3.png";
import card4 from "../../../assets/images/monster.png";
import loadingGif from '../../../assets/images/loading.gif';

const Card = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => {
        console.log(
          "Autoplay was prevented by the browser. Muted autoplay should work.",
          error
        );
      });
    }
  }, []);

  return (
    <div className="section-5 mb-40" id="sample">
      <div className="container text-center">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Sample</h3>
                <p className="card-text">
                  With top quality and high performance
                </p>
                <LazyLoadImage
                  src={card2}
                  alt="PROMPT TO 3D"
                  className="img-fluid"
                  effect="blur"
                  placeholderSrc={loadingGif}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Sample</h3>
                <p className="card-text">
                  With top quality and high performance
                </p>
                <LazyLoadImage
                  src={card3}
                  alt="PROMPT TO 3D"
                  className="img-fluid"
                  effect="blur"
                  placeholderSrc={loadingGif}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Sample</h3>
                <p className="card-text">
                  With top quality and high performance
                </p>
                <LazyLoadImage
                  src={card4}
                  id="card4"
                  alt="PROMPT TO 3D"
                  className="img-fluid"
                  effect="blur"
                  placeholderSrc={loadingGif}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
    </div>
  );
};

export default Card;
