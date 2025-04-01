// src/pages/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import backgroundImage from "../assets/machine-background.jpg"; // Add the provided image to your assets folder

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        animation: "gradientFade 90s infinite alternate",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center space-y-4">
        <img src={logo} alt="logo" className="w-20 h-20 rounded-full shadow-lg" />
        <h1 className="text-5xl font-bold text-white">PredictAsense</h1>
        <p className="text-lg text-white max-w-xl">
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
