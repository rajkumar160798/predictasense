// src/pages/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-[#7E65E2] to-[#00356B] text-white">
      <div className="flex items-center space-x-4 mb-6">
        <img src={logo} alt="logo" className="w-12 h-12" />
        <h1 className="text-4xl font-semibold tracking-wide">PredictAsense</h1>
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-white text-[#00356B] px-6 py-3 rounded-full font-bold hover:bg-blue-100"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
