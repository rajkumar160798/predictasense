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
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center space-y-6">
        <img src={logo} alt="logo" className="w-28 h-28 rounded-full shadow-lg" />
        <h1 className="text-6xl font-extrabold text-white">PredictAsense</h1>
        <p className="text-2xl text-white max-w-2xl">
          Smart AI-powered predictive maintenance tool that forecasts trends and detects anomalies from your sensor data.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-10 py-4 rounded-full text-xl shadow-md hover:scale-105 transition-transform"
        >
          Get Started
        </button>
      </div>

      {/* Background Image Layer */}
      <img
        src={backgroundImage}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        style={{ filter: "brightness(0.4)" }}
      />
    </div>
  );
};

export default LandingPage;
