// src/pages/Forecast.tsx
import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import DateRangePicker from "../components/DateRangePicker";
import { Range } from "react-date-range";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

const Forecast: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState("temperature");

  // Range picker state
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-03-10"),
      key: "selection",
    },
  ]);

  const startDate = range[0].startDate;
  const endDate = range[0].endDate;

  const rawData = JSON.parse(localStorage.getItem("sensorData") || "[]") as SensorRow[];

  const filteredData = rawData.filter((row) => {
    const date = new Date(row.timestamp);
    return (!startDate || !isBefore(date, startDate)) && (!endDate || !isAfter(date, endDate));
  });

  const chartOptions = [
    { id: "temperature", title: "📈 Trend Forecast - Temperature", desc: "Shows predicted temperature changes. Spikes or drops may indicate overheating or cooling issues." },
    { id: "vibration", title: "📊 Trend Forecast - Vibration", desc: "Tracks vibration patterns over time. Abnormal spikes may signal imbalance or wear." },
    { id: "pressure", title: "🧪 Trend Forecast - Pressure", desc: "Monitors pressure trends. Sudden changes might indicate blockages or leaks." },
    { id: "comparative", title: "📊 Comparative Trends", desc: "Visual comparison of all three metrics to analyze cross-impact over time." },
    { id: "heatmap", title: "🔥 Anomaly Heatmap", desc: "Highlights when and where abnormal readings were detected across metrics." },
  ];

  const getChartData = () => {
    switch (selectedChart) {
      case "temperature":
        return [
          {
            id: "Temperature - Actual",
            data: filteredData.map((row) => ({
              x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
              y: row.temperature,
            })),
          },
          {
            id: "Temperature - Forecast",
            data: filteredData.map((row) => ({
              x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
              y: row.temperature - 1.5,
            })),
          },
        ];
      case "vibration":
        return [
          {
            id: "Vibration - Actual",
            data: filteredData.map((row) => ({
              x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
              y: row.vibration,
            })),
          },
          {
            id: "Vibration - Forecast",
            data: filteredData.map((row) => ({
              x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
              y: row.vibration + 0.005,
            })),
          },
        ];
      case "pressure":
        return [
          {
            id: "Pressure - Actual",
            data: filteredData.map((row) => ({
              x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
              y: row.pressure,
            })),
          },
          {
            id: "Pressure - Forecast",
            data: filteredData.map((row) => ({
              x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
              y: row.pressure - 1,
            })),
          },
        ];
      case "comparative":
        return [
          {
            id: "Temperature",
            data: filteredData.map((row) => ({
              x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
              y: row.temperature,
            })),
          },
          {
            id: "Vibration",
            data: filteredData.map((row) => ({
              x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
              y: row.vibration,
            })),
          },
          {
            id: "Pressure",
            data: filteredData.map((row) => ({
              x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
              y: row.pressure,
            })),
          },
        ];
      default:
        return [];
    }
  };

  const handleExport = () => {
    alert("📦 Download feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 animate-fadeIn">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-6">
        📊 Forecast Dashboard
      </h1>

      {/* Date Picker + Export */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full max-w-md">
          <DateRangePicker range={range} setRange={setRange} />
        </div>
        <button
          onClick={handleExport}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
        >
          ⬇️ Download Chart
        </button>
      </div>

      {/* Chart Selector */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {chartOptions.map((chart) => (
          <div
            key={chart.id}
            onClick={() => setSelectedChart(chart.id)}
            className={`cursor-pointer transition-transform rounded-xl p-4 shadow-md backdrop-blur-md border ${
              selectedChart === chart.id
                ? "bg-white/80 border-purple-600 shadow-lg scale-105"
                : "bg-white/60 hover:shadow-lg"
            }`}
          >
            <h2 className="font-semibold text-purple-800 mb-1">{chart.title}</h2>
            <p className="text-gray-700 text-sm">{chart.desc}</p>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="w-full h-[500px] max-w-7xl mx-auto bg-white p-4 rounded-xl shadow-lg">
        {getChartData().length > 0 ? (
          <ResponsiveLine
            data={getChartData()}
            margin={{ top: 50, right: 110, bottom: 60, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
            axisBottom={{
              tickRotation: -35,
              legend: "Time",
              legendOffset: 40,
              legendPosition: "middle",
            }}
            axisLeft={{
              legend:
                selectedChart === "vibration"
                  ? "Vibration (g)"
                  : selectedChart === "pressure"
                  ? "Pressure (hPa)"
                  : "Value",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={8}
            pointBorderWidth={2}
            useMesh={true}
            legends={[
              {
                anchor: "top-left",
                direction: "row",
                translateY: -40,
                itemWidth: 150,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: "circle",
              },
            ]}
          />
        ) : (
          <p className="text-center text-gray-600">No data in selected date range.</p>
        )}
      </div>
    </div>
  );
};

export default Forecast;
