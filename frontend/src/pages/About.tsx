// src/pages/Settings.tsx
import React from "react";
import Sidebar from "../components/Sidebar";
import backgroundImage from "../assets/machine-background.jpg";

const About: React.FC = () => {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="z-10 bg-white bg-opacity-90 text-purple-800 p-10 max-w-4xl rounded-xl shadow-lg">
        <h1 className="text-7xl font-extrabold mb-8">About PredictAsense</h1>

        <p className="text-xl mb-6">
          <strong>PredictAsense™</strong> is a smart AI-powered predictive maintenance platform designed to analyze sensor data, forecast equipment failures, and recommend preventive actions. It helps industries save costs, prevent downtime, and operate more efficiently using data-driven insights.
        </p>

        <p className="text-lg mb-6">
          Developed by <strong>Raj Kumar Myakala</strong>, this tool combines cutting-edge data science techniques with a beautiful, intuitive dashboard for visualizing trends, anomalies, and actionable insights.
        </p>

        <p className="text-lg mb-6">PredictAsense stands apart from other tools by offering features like:</p>

        <ul className="list-disc text-left text-lg pl-6 mb-6">
          <li>📈 Real-time forecasting of temperature, pressure, and vibration</li>
          <li>🧠 AI-based anomaly detection with root cause analysis</li>
          <li>🚨 Smart alert prioritization to act before failures occur</li>
          <li>🤖 AutoML Forecasting & PDF reporting for business intelligence</li>
          <li>🔥 Interactive heatmaps and cluster visualizations</li>
        </ul>

        <p className="text-lg mb-6">
          Whether you're managing a manufacturing floor or optimizing a mechanical system, <strong>PredictAsense</strong> empowers you to make proactive decisions using intelligent insights.
        </p>

        <p className="text-lg font-medium">
          🎯 <strong>Mission:</strong> Bring accessible predictive maintenance to everyone, powered by open-source and innovation.
        </p>
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

export default About;
