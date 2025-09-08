import React from 'react';
import './CustomLoader.css';

const CustomLoader = () => (
  <div className="loader">
    {/* <p className="heading">Loading</p> */}
    <div className="loading">
      <div className="load"></div>
      <div className="load"></div>
      <div className="load"></div>
      <div className="load"></div>
    </div>
  </div>
);

export default CustomLoader; 