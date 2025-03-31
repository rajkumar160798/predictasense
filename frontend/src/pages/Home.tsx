import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Upload Sensor Data",
      description: "Upload CSV files and filter date range for analysis.",
      emoji: "📤",
      navigateTo: "/dashboard#upload",
    },
    {
      title: "Forecast Trends",
      description: "View line charts with predictions for each sensor.",
      emoji: "📈",
      navigateTo: "/dashboard#graphs",
    },
    {
      title: "Anomaly Heatmap",
      description: "Visualize anomalies over time and detect issues.",
      emoji: "🔥",
      navigateTo: "/dashboard#anomalies",
    },
    {
      title: "Download Reports",
      description: "Export CSV of detected anomalies and results.",
      emoji: "📄",
      navigateTo: "/dashboard#anomalies",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to PredictAsense</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.navigateTo)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 cursor-pointer transform hover:scale-105 transition-all"
          >
            <div className="text-4xl mb-2">{card.emoji}</div>
            <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
// This code is a React component that serves as the home page of a web application.
// It includes a welcome message and a grid of cards that link to different functionalities of the application.
// Each card has an emoji, title, description, and a click event that navigates to the respective section of the dashboard.