import React from 'react';
import './DataSection.css';
import pego from "./Images/Pego.png"
import DAO from "./Images/DAO.png"
import PPOS from "./Images/PPOS.png"
// import ax from "./images/ax.jpeg"
// import bt from "./images/bt.jpeg"
const BoxComponent = () => {
  return (
    <div className="box-container">
      <div className="box">
        <img src={pego} alt="Image 1" className="box-image" />
        <h2>PEGO</h2>
        <div className="box-text">
        Supports decentralized applications with high-autonomy,
        scalability, and sustainability.
        A high-performance solution for Web3 development.
        </div>
      </div>
      <div className="box">
        <img src={DAO} alt="Image 2" className="box-image" />
        <h3>Community-proposed Proposals</h3>
        <div className="box-text">Provides flexibility to adjust network parameters through community-proposed proposals.</div>
      </div>
      <div className="box">
        <img src={PPOS} alt="Image 3" className="box-image" />
        <h2>PPOS</h2>
        <div className="box-text">
        Enables sustainable ecosystem and uses a fair and secure governance model.
          </div>
      </div>
    </div>
  );
};

export default BoxComponent;