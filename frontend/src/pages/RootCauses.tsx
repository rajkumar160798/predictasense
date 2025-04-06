// src/pages/RootCauses.tsx
import React, { useState, useMemo } from "react";
import RootCauseTable from "../components/RootCauseTable";
import RootCauseConfidenceTable from "../components/RootCauseConfidenceTable";
import { RootCauseEntry } from "../utils/types";
import { useNavigate } from "react-router-dom";
import { generateRootCauses } from "../utils/rootCauseEngine";
import { AnomalyInsight } from "../utils/types";
import { scoreRootCauses } from "../utils/rootCauseConfidence";
import { format, parseISO } from "date-fns";
import TrendEvolutionTabs from "../components/TrendEvolutionTabs";
import AnomalyTimeline from "../components/AnomalyTimeline";

const RootCauses: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>("table");

  const rawData = JSON.parse(localStorage.getItem("sensorData") || "[]");

  const anomalyInsights: AnomalyInsight[] = useMemo(() => {
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

  const rootCauses: RootCauseEntry[] = useMemo(
    () =>
      generateRootCauses(anomalyInsights).map((cause) => ({
        ...cause,
        time: anomalyInsights.find((insight) => insight.metric === cause.metric)?.time || "Unknown",
      })),
    [anomalyInsights]
  );

  const navigate = useNavigate();
  const scoredRootCauses = useMemo(() => scoreRootCauses(rootCauses), [rootCauses]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      {/* Scrollable Content */}
      <div className="relative z-10 h-full w-full overflow-y-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-purple-800 text-center mb-4">
          🧠 Root Cause Analysis
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Click a section to view or hide root cause insights.
        </p>

        {/* Toggle Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "table" ? "bg-purple-700 text-white" : "bg-black text-purple-300"
            }`}
            onClick={() => setActiveSection(activeSection === "table" ? null : "table")}
          >
            📊 Root Cause Table
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "confidence" ? "bg-purple-700 text-white" : "bg-black text-purple-300"
            }`}
            onClick={() => setActiveSection(activeSection === "confidence" ? null : "confidence")}
          >
            📈 Root Confidence Score
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "trend" ? "bg-purple-700 text-white" : "bg-black text-purple-300"
            }`}
            onClick={() => setActiveSection(activeSection === "trend" ? null : "trend")}
          >
            📆 Trend Evolution
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "timeline" ? "bg-purple-700 text-white" : "bg-black text-purple-300"
            }`}
            onClick={() => setActiveSection(activeSection === "timeline" ? null : "timeline")}
          >
            📍 Anomaly Timeline
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

        {/* Section Rendering */}
        <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
          {activeSection === "table" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">📊 Root Cause Table</h2>
              <RootCauseTable causes={rootCauses} />
            </div>
          )}

          {activeSection === "confidence" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                📈 Root Cause Confidence Scores
              </h2>
              <RootCauseConfidenceTable entries={scoredRootCauses} />
            </div>
          )}

          {activeSection === "trend" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">📆 Trend Evolution Charts</h2>
              <TrendEvolutionTabs data={rawData} />
            </div>
          )}

          {activeSection === "timeline" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">📍 Anomaly Timeline</h2>
              <AnomalyTimeline insights={anomalyInsights} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RootCauses;
