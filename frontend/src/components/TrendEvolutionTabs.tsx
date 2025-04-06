// src/components/TrendEvolutionTabs.tsx
import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { computeWeeklyTrends } from "../utils/trendEvolution";

interface Props {
  data: SensorRow[];
}

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

const TrendEvolutionTabs: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<"temperature" | "vibration" | "pressure">("temperature");

  const getChartData = () => {
    const weeklyData = computeWeeklyTrends(data, activeTab);
    return [
      {
        id: `${activeTab} trend`,
        data: weeklyData.map((d) => ({ x: d.week, y: d.value })),
      },
    ];
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex justify-center text-black gap-4 mb-4 bg-white p-4 rounded-xl shadow-lg">
        {["temperature", "vibration", "pressure"].map((metric) => (
          <button
            key={metric}
            onClick={() => setActiveTab(metric as any)}
            className={`px-5 py-2 rounded-full border font-semibold transition duration-200
        ${
          activeTab === metric
            ? "bg-purple-100 text-purple-800 border-purple-700 shadow-md !bg-white"
            : "bg-white text-purple-600 border-gray-300 hover:bg-purple-50 hover:border-purple-600 !bg-white"
        }`}
          >
            {metric === "temperature" && "🌡️ Temperature"}
            {metric === "vibration" && "🎛️ Vibration"}
            {metric === "pressure" && "🧪 Pressure"}
          </button>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="h-[400px] bg-white  text-black p-4 rounded-xl shadow-lg !bg-whte">
        <ResponsiveLine
          data={getChartData()}
          margin={{ top: 50, right: 60, bottom: 100, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          axisBottom={{
            tickRotation: -30,
            legend: "Week",
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            legend: `${
              activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
            } Value`,
            legendPosition: "middle",
            legendOffset: -50,
          }}
          pointSize={8}
          colors={{ scheme: "set2" }}
          useMesh
        />
      </div>
    </div>
  );
};

export default TrendEvolutionTabs;
