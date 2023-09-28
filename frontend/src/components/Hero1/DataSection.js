import React from 'react';
import './DataSection.css';
import pego from "./Images/Pego.png"
// import ax from "./images/ax.jpeg"
// import bt from "./images/bt.jpeg"
const BoxComponent = () => {
  return (
    <div className="box-container">
      <div className="box">
        <img src={pego} alt="Image 1" className="box-image" />
        <div className="box-text">Empower researchers to publish their work in a decentralized and transparent manner in FileCoin Network</div>
      </div>
      <div className="box">
        <img src={pego} alt="Image 2" className="box-image" />
        <div className="box-text">Facilitate collaboration and knowledge sharing among researchers through crosschain networks because of AXELAR</div>
      </div>
      <div className="box">
        <img src={pego} alt="Image 3" className="box-image" />
        <div className="box-text">Provides secure and encrypted data storage for research publications and associated data and enable verifiability and transparency of research outputs.</div>
      </div>
    </div>
  );
};

export default BoxComponent;