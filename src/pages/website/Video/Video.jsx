import React, { useEffect, useRef } from "react";
import modalAI from "../../../assets/images/3dModal2.mp4";
const Video = () => {
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
    <div>
      <div className="container-fluid">
        <div
          className="video-container"
          style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <video
            ref={videoRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              lazyLoad: "true",
            }}
            autoPlay
            loop
            muted
            controls>
            <source src={modalAI} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default Video;
