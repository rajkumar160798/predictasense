import React, { useState, useMemo } from "react";
import RootCauseTable from "../components/RootCauseTable";
import RootCauseConfidenceTable from "../components/RootCauseConfidenceTable";
import { RootCauseEntry, SeverityLevel } from "../utils/types";
import { useNavigate } from "react-router-dom";
import { generateRootCauses } from "../utils/rootCauseEngine";
import { AnomalyInsight } from "../utils/types";
import { scoreRootCauses } from "../utils/rootCauseConfidence";
import { format, parseISO } from "date-fns";
import TrendEvolutionTabs from "../components/TrendEvolutionTabs";
import AnomalyTimeline from "../components/AnomalyTimeline";
import { motion } from "framer-motion";

const RootCauses: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>("table");

  const rawData = JSON.parse(localStorage.getItem("sensorData") || "[]");

  const anomalyInsights: AnomalyInsight[] = useMemo(() => {
    const result: AnomalyInsight[] = [];
    for (const row of rawData) {
      const time = format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm");
      if (row.temperature > 80) {
        result.push({ time, metric: "Temperature", severity: "High", description: "Overheating detected. Consider cooling inspection." });
      }
      if (row.vibration > 0.07) {
        result.push({ time, metric: "Vibration", severity: "Medium", description: "Unusual vibration. Possible imbalance or wear." });
      }
      if (row.pressure > 1015) {
        result.push({ time, metric: "Pressure", severity: "Medium", description: "Pressure exceeds expected limits. Check for blockages." });
      }
    }
    return result;
  }, [rawData]);

  const rootCauses: RootCauseEntry[] = useMemo(() =>
    generateRootCauses(anomalyInsights).map((cause) => ({
      ...cause,
      time: anomalyInsights.find((insight) => insight.metric === cause.metric)?.time || "Unknown",
      severity: cause.severity as SeverityLevel, // Ensure severity matches the expected type
      timestamp: typeof cause.timestamp === "string" ? cause.timestamp : "Unknown",
      rootCause: cause.rootCause // Ensure timestamp is always a string
    })),
    [anomalyInsights]
  );

  const navigate = useNavigate();
  const scoredRootCauses = useMemo(() => scoreRootCauses(rootCauses), [rootCauses]);

  const sectionMap: Record<string, string> = {
    table: "📊 Root Cause Table",
    confidence: "📈 Root Confidence Score",
    trend: "📆 Trend Evolution",
    timeline: "📍 Anomaly Timeline"
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center relative">
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute left-0 top-0 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 border border-gray-200 shadow-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🧠 Root Cause Analysis</h1>
          <p className="text-gray-600">
            Explore underlying causes and confidence behind your anomaly alerts.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.keys(sectionMap).map((key) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-medium transition text-sm border border-gray-200 shadow-md hover:shadow-lg hover:text-white ${activeSection === key ? 'bg-purple-700 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveSection(activeSection === key ? null : key)}
            >
              {sectionMap[key]}
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full px-2"
        >
          {activeSection === "table" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">📊 Root Cause Table</h2>
              <RootCauseTable causes={rootCauses} />
            </div>
          )}

          {activeSection === "confidence" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">📈 Root Cause Confidence Scores</h2>
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
        </motion.div>
      </div>
    </div>
  );
};

export default RootCauses;
