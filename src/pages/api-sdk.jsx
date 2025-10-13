import React, { useEffect } from 'react';
import { MdApi } from 'react-icons/md';
import './ApiSdk.css';

const ApiSdkComingSoon = () => {
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    const style = document.createElement('style');
    style.id = 'hide-scrollbar-style';
    style.innerHTML = `
      html, body { 
        scrollbar-width: none !important;
        -ms-overflow-style: none !important; 
      }
      html::-webkit-scrollbar, 
      body::-webkit-scrollbar { 
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;
    
    const existingStyle = document.getElementById('hide-scrollbar-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
  
    return () => {
      const styleToRemove = document.getElementById('hide-scrollbar-style');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [])

  return (
    <div className="api-sdk-container">
    <div className="api-sdk-card">
      <MdApi className="api-sdk-icon" />
      <h2 className="api-sdk-title">Coming Soon</h2>
      <div className="api-sdk-desc">
        API & SDK features are launching soon. Stay tuned!
      </div>
    </div>
  </div>
  )
}

export default ApiSdkComingSoon; 