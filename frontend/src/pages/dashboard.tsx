// src/pages/Dashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import ForecastPDFGenerator from "../components/ForecastPDFGenerator";

const cards = [
  {
    title: "Forecast",
    description: "View predicted trends & failure risks.",
    link: "/forecast",
    emoji: "📈",
    bg: "rgba(128, 90, 213, 0.15)", // light purple
  },
  {
    title: "Anomalies",
    description: "See detected issues from sensor data.",
    link: "/anomalies",
    emoji: "🚨",
    bg: "rgba(239, 68, 68, 0.15)", // light red
  },
  {
    title: "Root Causes",
    description: "Analyze possible failure reasons.",
    link: "/root-causes",
    emoji: "🔎",
    bg: "rgba(253, 224, 71, 0.2)", // light yellow
  },
  {
    title: "Suggested Actions",
    description: "Get repair suggestions for anomalies.",
    link: "/actions",
    emoji: "🛠️",
    bg: "rgba(96, 165, 250, 0.15)", // light blue
  },
  {
    title: "Smart Alerts",
    description: "Get alerts for anomalies.",
    link: "/alerts",
    emoji: "🚨",
    bg: "rgba(185, 186, 150, 0.15)", // light blue
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-6 md:px-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-800 mb-2">
          👋 Welcome to ProvansIQ Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          You can explore predictions, anomalies, reports, and suggestions from
          your data.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card) => (
          <Link to={card.link} key={card.title}>
            <div
              className="rounded-xl p-6 shadow hover:shadow-lg transition-transform duration-200 hover:scale-105 border border-gray-200"
              style={{ backgroundColor: card.bg }}
            >
              <div className="text-4xl mb-3">{card.emoji}</div>
              <h2 className="text-xl font-semibold text-gray-800">
                {card.title}
              </h2>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          </Link>
        ))}

        {/* Generate Report Card */}
        <div
          className="rounded-xl p-10 shadow hover:shadow-lg transition-transform duration-200 hover:scale-105 border border-gray-200"
          style={{ backgroundColor: "rgba(74, 222, 128, 0.15)" }} // light green
        >
          {/* PDF Generator Button */}
          <ForecastPDFGenerator />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
