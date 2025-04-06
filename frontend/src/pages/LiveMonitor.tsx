// src/pages/LiveMonitor.tsx
import React from "react";
import useLiveAnomalies from "../hooks/useLiveAnomalies";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const LiveMonitor: React.FC = () => {
  const anomalies = useLiveAnomalies();
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen w-full overflow-y-auto"
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-white opacity-95 z-0" />

      {/* Main Content */}
      {/* div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg"> */}
      <div className="relative z-10 px-10 py-8 text-center text-white rounded-xl shadow-lg">
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
          onClick={() => navigate("/dashboard")}
          className="bg-white text-purple-700 px-6 py-3 rounded-full text-lg shadow-md hover:bg-purple-100 hover:shadow-lg transition !bg-white"
        >
          ← Back to Dashboard
        </button>
      </div> 
      </div>
    </div>
  );
};

export default LiveMonitor;
