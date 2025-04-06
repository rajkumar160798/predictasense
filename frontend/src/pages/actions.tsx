import React, { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { AnomalyInsight } from "../utils/types";
import { getSuggestedActions } from "../utils/suggestedActions";
import { computeAnomalyImpact } from "../utils/impactForecast";
import AnomalyImpactForecast from "../components/AnomalyImpactForecast";
import SuggestedActions from "../components/SuggestedActions";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center relative">
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute left-0 top-0 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 border border-gray-200 shadow-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🛠️ Suggested Actions</h1>
          <p className="text-gray-600">Click a section to view actions or impact insights</p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: "actions", label: "🛠️ Suggested Actions" },
            { id: "impact", label: "🧠 Anomaly Impact Forecast" }
          ].map(({ id, label }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-medium transition text-sm border border-gray-200 shadow-md hover:shadow-lg hover:text-white ${activeSection === id ? 'bg-purple-700 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveSection(activeSection === id ? null : id)}
            >
              {label}
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full px-2"
        >
          {activeSection === "actions" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">🛠️ Suggested Actions</h2>
              {actions.length > 0 ? (
                <SuggestedActions actions={actions} />
              ) : (
                <p className="text-gray-600 text-center">No suggested actions available.</p>
              )}
            </div>
          )}

          {activeSection === "impact" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">🧠 Anomaly Impact Forecast</h2>
              <AnomalyImpactForecast impacts={impacts} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Actions;