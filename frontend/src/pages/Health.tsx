// src/pages/Health.tsx
import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import HealthScoreCard from "../components/HealthScoreCard";
import { calculateHealthScore } from "../utils/healthScore";
import { AnomalyInsight } from "../utils/types";
import { motion } from "framer-motion";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

const Health: React.FC = () => {
  const navigate = useNavigate();
  const rawData = JSON.parse(localStorage.getItem("sensorData") || "[]") as SensorRow[];

  const memoizedInsights = useMemo(() => {
    const insights: AnomalyInsight[] = [];

    for (const row of rawData) {
      const time = format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm");

      if (row.temperature > 80) {
        insights.push({
          time,
          metric: "Temperature",
          severity: "High",
          description: "Overheating detected. Consider cooling inspection."
        });
      }

      if (row.vibration > 0.07) {
        insights.push({
          time,
          metric: "Vibration",
          severity: "Medium",
          description: "Unusual vibration. Possible imbalance or wear."
        });
      }

      if (row.pressure > 1015) {
        insights.push({
          time,
          metric: "Pressure",
          severity: "Medium",
          description: "Pressure exceeds expected limits. Check for blockages."
        });
      }
    }

    return insights;
  }, [rawData]);

  const score = useMemo(() => calculateHealthScore(memoizedInsights), [memoizedInsights]);

  const highAnomalies = memoizedInsights.filter(i => i.severity === "High").length;
  const mediumAnomalies = memoizedInsights.filter(i => i.severity === "Medium").length;
  const totalAnomalies = memoizedInsights.length;

  const mostAffectedMetric = useMemo(() => {
    const counts: Record<string, number> = {};
    memoizedInsights.forEach((i) => {
      counts[i.metric] = (counts[i.metric] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  }, [memoizedInsights]);

  const interpretation = score >= 80 ? "✅ Healthy" : score >= 50 ? "⚠️ Needs Monitoring" : "🔴 Critical - Immediate Attention";

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🏥 System Health Overview</h1>
          <p className="text-gray-600">
            See a quick glance of overall system health with key anomaly metrics.
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center space-y-8"
        >
          <HealthScoreCard score={score} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-bold text-purple-700">🔺 High Severity</h2>
              <p className="text-gray-700 text-xl mt-2">{highAnomalies}</p>
            </div>
            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-bold text-yellow-600">⚠️ Medium Severity</h2>
              <p className="text-gray-700 text-xl mt-2">{mediumAnomalies}</p>
            </div>
            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-bold text-blue-600">📈 Total Anomalies</h2>
              <p className="text-gray-700 text-xl mt-2">{totalAnomalies}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <div className="bg-white shadow border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-pink-600">🔥 Most Affected Metric</h2>
              <p className="text-gray-700 mt-2">{mostAffectedMetric}</p>
            </div>
            <div className="bg-white shadow border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-red-600">🧠 Health Interpretation</h2>
              <p className="text-gray-700 mt-2">{interpretation}</p>
            </div>
            <div className="bg-white shadow border border-gray-200 rounded-xl p-6 md:col-span-2">
              <h2 className="text-xl font-semibold text-green-600">🛠️ Suggested Actions</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                <li>Inspect cooling system components</li>
                <li>Monitor vibration sensors weekly</li>
                <li>Schedule full system check if pressure alerts persist</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Health;
