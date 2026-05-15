import React from 'react';
import './PhoneMockup.css';

const PhoneMockup = ({ children }) => {
  return (
    <div className="phone-container">
      <div className="phone-titanium-frame">
        <div className="phone-screen">
          <div className="phone-dynamic-island"></div>
          <div className="phone-content">
            {children}
          </div>
        </div>
      </div>
      <div className="phone-reflection"></div>
    </div>
  );
};

export default PhoneMockup;
