// components/AnomalyImpactForecast.tsx
import React from "react";

interface ImpactEntry {
  time: string;
  metric: string;
  impact: string;
  riskScore: number;
}

interface Props {
  impacts: ImpactEntry[];
}

const AnomalyImpactForecast: React.FC<Props> = ({ impacts }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">
        🧠 Anomaly Impact Forecast
      </h2>
      {impacts.map((entry, idx) => (
        <div
          key={idx}
          className="mb-4 p-4 border-l-4"
          style={{
            borderColor:
              entry.riskScore >= 80
                ? "red"
                : entry.riskScore >= 60
                ? "orange"
                : "gray",
            background:
              entry.riskScore >= 80
                ? "#ffe5e5"
                : entry.riskScore >= 60
                ? "#fff3cd"
                : "#f5f5f5",
          }}
        >
          <div className="text-sm text-gray-600">{entry.time}</div>
          <div className="font-bold text-black">
            {entry.metric} - Risk Score: {entry.riskScore}
          </div>
          <div className="text-gray-700">{entry.impact}</div>
        </div>
      ))}
    </div>
  );
};

export default AnomalyImpactForecast;
