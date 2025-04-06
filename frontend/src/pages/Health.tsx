// src/pages/Health.tsx
import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import HealthScoreCard from "../components/HealthScoreCard";
import { calculateHealthScore } from "../utils/healthScore";
import { AnomalyInsight } from "../utils/types";

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
          description: "Overheating detected. Consider cooling inspection.",
        });
      }

      if (row.vibration > 0.07) {
        insights.push({
          time,
          metric: "Vibration",
          severity: "Medium",
          description: "Unusual vibration. Possible imbalance or wear.",
        });
      }

      if (row.pressure > 1015) {
        insights.push({
          time,
          metric: "Pressure",
          severity: "Medium",
          description: "Pressure exceeds expected limits. Check for blockages.",
        });
      }
    }

    return insights;
  }, [rawData]);

  const score = useMemo(() => calculateHealthScore(memoizedInsights), [memoizedInsights]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      <div className="relative z-10 h-full w-full overflow-y-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-purple-800 text-center mb-6">🏥 System Health Overview</h1>

        <div className="flex justify-center mb-10">
          <HealthScoreCard score={score} />
        </div>

        <div className="text-center">
          <button
            className="px-6 py-2 rounded-full font-medium bg-black text-purple-300 hover:bg-purple-700 hover:text-white transition"
            onClick={() => navigate("/dashboard")}
          >
            🔙 Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Health;
