import React from 'react';
import DataSection from "./DataSection";
import './Hero1.css';
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div>
    <div className="hero">
      <div className="hero-left">
        <h1 className="hero-title">Unlocking🔓 the Infinite Frontiers:</h1>
        <h2 className="hero-subtitle">PEGO Network-Powered PegoBrain</h2>
        <h3 className="hero-subtitle">Where Research🔬 Takes Flight🚀</h3>
      </div>
      <div className="hero-right">
        <div className="hero-buttons">
          <Link to="/publish"><button className="hero-button">Publish a Research</button></Link>
          <Link to="/publications"><button className="hero-button">Review a Research</button></Link>
        </div>
      </div>
    </div>
    <DataSection />
    </div>
  );
};

export default Hero;