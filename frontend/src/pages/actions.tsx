// src/pages/Actions.tsx
import React, { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { AnomalyInsight } from "../utils/types";
import { getSuggestedActions } from "../utils/suggestedActions";
import { computeAnomalyImpact } from "../utils/impactForecast";
import AnomalyImpactForecast from "../components/AnomalyImpactForecast";
import SuggestedActions from "../components/SuggestedActions";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

const Actions: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>("actions");
  const rawData = JSON.parse(localStorage.getItem("sensorData") || "[]") as SensorRow[];
  const navigate = useNavigate();

  const insights = useMemo(() => {
    const result: AnomalyInsight[] = [];
    for (const row of rawData) {
      const time = format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm");
      if (row.temperature > 80) {
        result.push({
          time,
          metric: "Temperature",
          severity: "High",
          description: "Overheating detected. Consider cooling inspection.",
        });
      }
      if (row.vibration > 0.07) {
        result.push({
          time,
          metric: "Vibration",
          severity: "Medium",
          description: "Unusual vibration. Possible imbalance or wear.",
        });
      }
      if (row.pressure > 1015) {
        result.push({
          time,
          metric: "Pressure",
          severity: "Medium",
          description: "Pressure exceeds expected limits. Check for blockages.",
        });
      }
    }
    return result;
  }, [rawData]);

  const actions = useMemo(() => getSuggestedActions(insights), [insights]);
  const impacts = useMemo(() => computeAnomalyImpact(rawData), [rawData]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>
      <div className="relative z-10 h-full w-full overflow-y-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-purple-800 text-center mb-4">
          🛠️ Suggested Actions
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Click a section to view actions or impact insights.
        </p>

        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "actions" ? "bg-purple-700 text-white" : "bg-black text-purple-300"
            }`}
            onClick={() => setActiveSection(activeSection === "actions" ? null : "actions")}
          >
            🛠️ Suggested Actions
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "impact" ? "bg-purple-700 text-white" : "bg-black text-purple-300"
            }`}
            onClick={() => setActiveSection(activeSection === "impact" ? null : "impact")}
          >
            🧠 Anomaly Impact Forecast
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "dashboard" ? "bg-purple-700 text-white" : "bg-black text-purple-300"
            }`}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>

        <div className="w-full px-2">
          {activeSection === "actions" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                🛠️ Suggested Actions
              </h2>
              {actions.length > 0 ? (
                <SuggestedActions actions={actions} />
              ) : (
                <p className="text-gray-600 text-center">No suggested actions available.</p>
              )}
            </div>
          )}

          {activeSection === "impact" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                🧠 Anomaly Impact Forecast
              </h2>
              <AnomalyImpactForecast impacts={impacts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Actions;