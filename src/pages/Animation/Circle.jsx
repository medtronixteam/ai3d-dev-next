import React from 'react';
import './circle.css';
import circle1 from '../../assets/images/circle.svg';
import whiteCircle from '../../assets/images/whiteCircle.svg';
import PinkCircle from '../../assets/images/PinkCircle.svg';
import ArrowTop from '../../assets/images/arrowpink1.svg';
import ArrowBottom from '../../assets/images/arrowrightpink1.svg';
import TopEllipse from '../../assets/images/topEllipse.svg';
import BottomEllipse from '../../assets/images/bottomEllipse.svg';
import ArrowLeft from '../../assets/images/ArrowLeft.svg';
import ArrowRight from '../../assets/images/ArrowRight.svg';
import UniqueIcon from '../../assets/images/UniqueIcon.svg';
import UniqueIcon2 from '../../assets/images/UniqueIcon2.svg';
import UniqueIcon3 from '../../assets/images/UniqueIcon3.svg';
import UniqueIcon4 from '../../assets/images/UniqueIcon4.svg';
import EllipseIcon from '../../assets/images/EllipseIcon.svg';

const Circle = () => {
  return (
    <div className="service-circle-wrapper">
      <img src={circle1} alt="Main Circle" className="service-circle-main" />
      <img src={whiteCircle} alt="White Circle" className="service-circle-white" />
      <img src={TopEllipse} alt="Top Ellipse" className="service-circle-ellipse-top" />
      <img src={BottomEllipse} alt="Bottom Ellipse" className="service-circle-ellipse-bottom" />

      <div className="service-circle-group">
        <img src={PinkCircle} alt="Pink Circle 1" className="service-circle-pink1" />
        <div className="service-circle-img img-diagonal-left">
          <img src={EllipseIcon} alt="Ellipse" className="ellipse-icon" />
          <img src={UniqueIcon2} alt="Center Icon" className="center-icon" />
        </div>
        <div className="service-circle-img img-diagonal-right">
          <img src={EllipseIcon} alt="Ellipse" className="ellipse-icon" />
          <img src={UniqueIcon} alt="Center Icon" className="center-icon" />
        </div>

        <div className="service-circle-arrow-wrapper">
          <img src={ArrowLeft} alt="Arrow Top" className="service-circle-arrow-left" />
          <img src={ArrowRight} alt="Arrow Bottom" className="service-circle-arrow-right" />
        </div>
      </div>

      <div className="service-circle-group">
        <img src={PinkCircle} alt="Pink Circle 2" className="service-circle-pink2" />
        <div className="service-circle-img2 img-diagonal-left2">
          <img src={EllipseIcon} alt="Ellipse" className="ellipse-icon" />
          <img src={UniqueIcon3} alt="Center Icon" className="center-icon2" />
        </div>
        <div className="service-circle-img2 img-diagonal-right2">
          <img src={EllipseIcon} alt="Ellipse" className="ellipse-icon" />
          <img src={UniqueIcon4} alt="Center Icon" className="center-icon3" />
        </div>

        <div className="service-circle-arrow-wrapper">
          <img src={ArrowTop} alt="Arrow Top" className="service-circle-arrow-top" />
          <img src={ArrowBottom} alt="Arrow Bottom" className="service-circle-arrow-bottom" />
        </div>
      </div>
    </div>
  );
};

export default Circle;
