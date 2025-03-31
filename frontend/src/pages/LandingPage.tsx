// src/pages/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-purple-100 flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Wave SVG */}
      <svg
        className="absolute top-0 left-0 w-full h-64"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#7E65E2"
          d="M0,160L40,176C80,192,160,224,240,218.7C320,213,400,171,480,144C560,117,640,107,720,133.3C800,160,880,224,960,240C1040,256,1120,224,1200,186.7C1280,149,1360,107,1400,85.3L1440,64L1440,0L0,0Z"
        />
      </svg>

      <div className="z-10 flex flex-col items-center space-y-4">
        <img src={logo} alt="logo" className="w-20 h-20 rounded-full shadow-lg" />
        <h1 className="text-5xl font-bold text-purple-900">PredictAsense</h1>
        <p className="text-lg text-purple-700 max-w-xl">
          Smart AI-powered predictive maintenance tool that forecasts trends and detects anomalies from your sensor data.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-8 py-3 rounded-full text-lg shadow-md hover:scale-105 transition-transform"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
