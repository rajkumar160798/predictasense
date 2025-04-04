// src/pages/LiveMonitor.tsx
import React from "react";
import useLiveAnomalies from "../hooks/useLiveAnomalies";
import Sidebar from "../components/Sidebar";
import backgroundImage from "../assets/machine-background.jpg";
import { useNavigate } from "react-router-dom";

const LiveMonitor: React.FC = () => {
  const anomalies = useLiveAnomalies();
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen w-full overflow-y-auto"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-95 z-0" />

      {/* Main Content */}
      <div className="relative z-10 px-10 py-8 text-center text-white">
        <h1 className="text-5xl font-bold mb-6">📡 Live Monitoring Dashboard</h1>
        <p className="text-xl  font-extrabold mb-4">
          Monitor real-time sensor data and anomalies.
        </p>
        <p className="text-lg mb-8 font-bold text-white">
          This dashboard provides real-time insights into sensor data and
          anomalies detected in your system. It helps you to monitor the health
          of your system and take proactive measures to prevent failures.
        </p>
        {/* Live Anomaly Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {anomalies.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl text-left shadow p-4 border-l-4 border-red-500 animate__animated animate__pulse text-gray-800"
            >
              <p><strong>🕒 Timestamp:</strong> {a.timestamp}</p>
              <p><strong>🌡️ Temp:</strong> {a.temperature}°C</p>
              <p><strong>🧪 Pressure:</strong> {a.pressure} hPa</p>
              <p><strong>🎯 Vibration:</strong> {a.vibration}</p>
              <p><strong>🚨 Severity:</strong> {a.severity}</p>
              <p><strong>📊 Confidence:</strong> {a.confidence}</p>
            </div>
          ))}
        </div>

              {/* Back to Upload Page Button */}
      <div className="relative z-10 w-full flex justify-center py-4">
        <button
          onClick={() => navigate("/forecast")} // Navigate to the Upload page
          className="bg-white text-purple-700 px-6 py-3 rounded-full text-lg shadow-md hover:bg-purple-100 hover:shadow-lg transition !bg-white"
        >
          🔙 Back to Forecast
        </button>
      </div> 
      </div>
    </div>
  );
};

export default LiveMonitor;
