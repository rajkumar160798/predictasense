// src/pages/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/machine-background.jpg";
import 'animate.css';

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
      <div className="z-10 flex flex-col items-center space-y-8">
        {/* Title */}
        <h1
          className="title-glow font-extrabold tracking-wide flex flex-wrap justify-center leading-none text-white animate-fadeIn animate__animated "
          style={{
            fontSize: "8vw",
            lineHeight: 1.1,
            fontFamily: "Inter, sans-serif",
            textShadow: "4px 4px 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span className="text-white mr-3">predict</span>
          <span
            className="text-transparent"
            style={{
              WebkitTextStroke: "0.15vw white",
              fontFamily: "serif",
            }}
          >
            Asesnse
          </span>
          <span
            className="text-white text-[1.5vw] font-extrabold ml-2"
            style={{ position: "relative", top: "1.0vw" }}
          >
            ™
          </span>
        </h1>
        {/* Tagline */}
        <h2 className="text-2xl md:text-3xl text-purple-100 font-medium max-w-3xl text-center">
            Smart AI-powered predictive maintenance that forecasts<br />
            trends and detects anomalies from your sensor data.
        </h2>

        {/* Designer Credit - Bigger */}
        <h3 className="text-xl md:text-2xl font-medium text-white mt-2 animate-fadeIn">
          Designed by{" "}
          <span className="font-semibold text-purple-200">
            Raj Kumar Myakala
          </span>
        </h3>

        {/* CTA */}
        <button
          onClick={() => navigate("/upload")}
          className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-20 py-8 rounded-full text-xl shadow-md hover:scale-105 transition-transform"
        >
          🚀 Get Started
        </button>
      </div>

      {/* Background Filter Layer */}
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
