// src/pages/Dashboard.tsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link to="/upload">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">⬆️</div>
            <h2 className="text-xl font-semibold">Upload Data</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">CSV Format</p>
          </div>
        </Link>

        <Link to="/anomalies">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">🚨</div>
            <h2 className="text-xl font-semibold">Anomalies</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">3 detected</p>
          </div>
        </Link>

        <Link to="/forecast">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">📈</div>
            <h2 className="text-xl font-semibold">Forecast</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">View trends</p>
          </div>
        </Link>

        <Link to="/reports">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">📥</div>
            <h2 className="text-xl font-semibold">Download Report</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get summary CSV</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
