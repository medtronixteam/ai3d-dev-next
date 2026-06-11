import React from 'react';
import './CustomLoader.css';


const CustomLoader = () => (
  <>
    <style>{`
      .loader-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100px;
      }
      .loader {
        display: inline-block;
        line-height: 86px;
        position: relative;
        padding: 0 48px;
        font-size: 3rem;
        font-family: "Lateef", monospace;
        color: #DE3996 !important;
        overflow: visible;
      }
      .loader::before,
      .loader::after {
        content: "";
        display: block;
        width: 15px;
        height: 15px;
        background: currentColor;
        position: absolute;
        animation: load 0.7s infinite alternate ease-in-out;
        top: 0;
      }
      .loader::after {
        top: auto;
        bottom: 0;
      }
      @keyframes load {
        0% {
          left: 0;
          height: 43px;
          width: 15px;
          transform: translateX(0);
        }
        50% {
          height: 10px;
          width: 40px;
        }
        100% {
          left: 100%;
          height: 43px;
          width: 15px;
          transform: translateX(-100%);
        }
      }
    `}</style>
    <div className="loader-wrapper">
      <span className="loader">3Dio</span>
    </div>
  </>
);

export default CustomLoader;