// src/components/AnomalyInsightsSection.tsx
import React from "react";

interface Anomaly {
  time: string;
  metric: string;
  severity: "Low" | "Medium" | "High";
  description: string;
}

interface Props {
  anomalies: Anomaly[];
}

const AnomalyInsightsSection: React.FC<Props> = ({ anomalies }) => {
  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-purple-800 mb-4">Anomaly Insights</h2>
      {anomalies.length === 0 ? (
        <p className="text-gray-600">No anomalies detected for this range.</p>
      ) : (
        <div className="grid gap-4">
          {anomalies.map((a, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded ${
                a.severity === "High"
                  ? "border-red-600 bg-red-50"
                  : a.severity === "Medium"
                  ? "border-yellow-600 bg-yellow-50"
                  : "border-green-600 bg-green-50"
              }`}
            >
              <p className="text-sm text-gray-500">{a.time}</p>
              <p className="font-semibold">
                {a.metric} - <span className="text-sm text-gray-700">{a.severity}</span>
              </p>
              <p className="text-gray-800 text-sm">{a.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnomalyInsightsSection;
