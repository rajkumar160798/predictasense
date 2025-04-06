import React, { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import AnomalyInsightsSection from "../components/AnomalyInsightsSection";
import AnomalyFrequencyTable from "../components/AnomalyFrequencyTable";
import { AnomalyInsight } from "../utils/types";
import { calculateAnomalyFrequency } from "../utils/anomalyFrequency";
import { useNavigate } from "react-router-dom";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

const Anomalies: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>("insights");

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

  const heatmapData = useMemo(() => {
    const hourlyBuckets: { [hour: string]: { Temperature: number; Vibration: number; Pressure: number } } = {};
    rawData.forEach((row) => {
      const hourKey = format(parseISO(row.timestamp), "MMM d, HH:00");
      if (!hourlyBuckets[hourKey]) {
        hourlyBuckets[hourKey] = { Temperature: 0, Vibration: 0, Pressure: 0 };
      }
      if (row.temperature > 80) hourlyBuckets[hourKey].Temperature = 1;
      if (row.vibration > 0.07) hourlyBuckets[hourKey].Vibration = 1;
      if (row.pressure > 1015) hourlyBuckets[hourKey].Pressure = 1;
    });
    return Object.entries(hourlyBuckets).map(([hour, metrics]) => ({
      id: hour,
      data: Object.entries(metrics).map(([key, value]) => ({ x: key, y: value })),
    }));
  }, [rawData]);

  const anomalyFrequencies = useMemo(() => calculateAnomalyFrequency(insights), [insights]);

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      {/* Scrollable Content */}
      <div className="relative z-10 h-full w-full overflow-y-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-purple-800 text-center mb-4">
          📊 Anomaly Analysis
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Click a section to view or hide insights.
        </p>

        {/* Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "insights"
                ? "bg-purple-700 text-white"
                : "bg-black text-purple-300"
            }`}
            onClick={() =>
              setActiveSection(activeSection === "insights" ? null : "insights")
            }
          >
            🔍 Anomaly Insights
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "heatmap"
                ? "bg-purple-700 text-white"
                : "bg-black text-purple-300"
            }`}
            onClick={() =>
              setActiveSection(activeSection === "heatmap" ? null : "heatmap")
            }
          >
            🔥 Heatmap
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "frequency"
                ? "bg-purple-700 text-white"
                : "bg-black text-purple-300"
            }`}
            onClick={() =>
              setActiveSection(activeSection === "frequency" ? null : "frequency")
            }
          >
            📋 Frequency Table
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "frequency"
                ? "bg-purple-700 text-white"
                : "bg-black text-purple-300"
            }`}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>


        {/* Insights Section */}
        <div className="w-full px-2">
          {activeSection === "insights" && (
            <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                🔍 Anomaly Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md text-left"
                  >
                    <p className="text-gray-600 text-sm">{insight.time}</p>
                    <h3 className="text-lg font-bold text-purple-800">
                      {insight.metric} - {insight.severity}
                    </h3>
                    <p className="text-gray-700">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Heatmap Section */}
          {activeSection === "heatmap" && (
            <div className="p-4 bg-white rounded-xl shadow-lg h-[80vh] w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                🔥 Anomaly Heatmap
              </h2>
              <div className="w-full h-full">
                <ResponsiveHeatMap
                  data={heatmapData}
                  margin={{ top: 40, right: 60, bottom: 80, left: 80 }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -30,
                    legend: "Metric",
                    legendOffset: 36,
                    legendPosition: "middle",
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Time",
                    legendOffset: -60,
                    legendPosition: "middle",
                  }}
                  labelTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                  borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
                  colors={{ type: "sequential", scheme: "reds" }}
                  animate={true}
                />
              </div>
            </div>
          )}

          {/* Frequency Table Section */}
          {activeSection === "frequency" && (
            <div className="p-4 bg-white rounded-xl shadow-lg max-h-[80vh] overflow-y-auto w-full">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                📋 Frequency Table
              </h2>
              <AnomalyFrequencyTable frequencies={anomalyFrequencies} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anomalies;
