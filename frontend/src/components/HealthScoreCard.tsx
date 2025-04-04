// src/components/HealthScoreCard.tsx
import React from "react";

interface Props {
  score: number;
}

const getColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-400";
  return "bg-red-500";
};

const HealthScoreCard: React.FC<Props> = ({ score }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md text-center">
      <h2 className="text-xl font-semibold text-purple-700 mb-2">🏥 System Health Score</h2>
      <div className={`text-black text-5xl font-bold p-6 rounded-full w-36 h-36 mx-auto flex items-center justify-center ${getColor(score)}`}>
        {score}
      </div>
      <p className="mt-2 text-gray-600">Based on recent anomaly trends</p>
    </div>
  );
};

export default HealthScoreCard;
// This component displays a health score card.
// It takes a score as a prop and displays it in a circular badge.
// The color of the badge changes based on the score value:
// - Green for scores 80 and above
// - Yellow for scores between 50 and 79
// - Red for scores below 50