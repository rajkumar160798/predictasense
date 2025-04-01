// src/pages/Forecast.tsx
import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { Range } from "react-date-range";
import DateRangePicker from "../components/DateRangePicker";
import ForecastPDFGenerator from "../components/ForecastPDFGenerator";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

const Forecast: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState("temperature");

  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-03-10"),
      key: "selection",
    },
  ]);

  const startDate = range[0].startDate;
  const endDate = range[0].endDate;

  const rawData = JSON.parse(
    localStorage.getItem("sensorData") || "[]"
  ) as SensorRow[];

  const filteredData = rawData.filter((row) => {
    const date = new Date(row.timestamp);
    return (
      (!startDate || !isBefore(date, startDate)) &&
      (!endDate || !isAfter(date, endDate))
    );
  });

  const chartOptions = [
    { id: "temperature", title: "📈 Trend Forecast - Temperature", desc: "Shows predicted temperature changes. Spikes or drops may indicate overheating or cooling issues." },
    { id: "vibration", title: "📊 Trend Forecast - Vibration", desc: "Tracks vibration patterns over time. Abnormal spikes may signal imbalance or wear." },
    { id: "pressure", title: "🧪 Trend Forecast - Pressure", desc: "Monitors pressure trends. Sudden changes might indicate blockages or leaks." },
    { id: "comparative", title: "📊 Comparative Trends", desc: "Visual comparison of all three metrics to analyze cross-impact over time." },
    { id: "heatmap", title: "🔥 Anomaly Heatmap", desc: "Highlights when and where abnormal readings were detected across metrics." },
  ];

  // Line chart data generator
  const getChartData = () => {
    const formatData = (metric: keyof SensorRow, offset = 0) =>
      filteredData.map((row) => ({
        x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
        y: typeof row[metric] === "number" ? row[metric] + offset : offset,
      }));

    switch (selectedChart) {
      case "temperature":
        return [
          { id: "Actual", data: formatData("temperature") },
          { id: "Forecast", data: formatData("temperature", -1.5) },
        ];
      case "vibration":
        return [
          { id: "Actual", data: formatData("vibration") },
          { id: "Forecast", data: formatData("vibration", 0.005) },
        ];
      case "pressure":
        return [
          { id: "Actual", data: formatData("pressure") },
          { id: "Forecast", data: formatData("pressure", -1) },
        ];
      case "comparative":
        return [
          { id: "Temperature", data: formatData("temperature") },
          { id: "Vibration", data: formatData("vibration") },
          { id: "Pressure", data: formatData("pressure") },
        ];
      default:
        return [];
    }
  };

  // Heatmap data generator using the "series" format
  const getAnomalyHeatmapData = () => {
    const hourlyBuckets: {
      [hour: string]: { Temperature: number; Vibration: number; Pressure: number };
    } = {};

    filteredData.forEach((row) => {
      const hourKey = format(parseISO(row.timestamp), "MMM d, HH:00");

      if (!hourlyBuckets[hourKey]) {
        hourlyBuckets[hourKey] = { Temperature: 0, Vibration: 0, Pressure: 0 };
      }

      if (row.temperature > 80) hourlyBuckets[hourKey].Temperature = 1;
      if (row.vibration > 0.07) hourlyBuckets[hourKey].Vibration = 1;
      if (row.pressure > 1015) hourlyBuckets[hourKey].Pressure = 1;
    });

    // Convert to series format: each row has an id and a data array
    return Object.entries(hourlyBuckets).map(([hour, metrics]) => ({
      id: hour,
      data: Object.entries(metrics).map(([key, value]) => ({
        x: key,
        y: value,
      })),
    }));
  };

  const heatmapData = getAnomalyHeatmapData();



  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-6">
        📊 Forecast Dashboard
      </h1>

      {/* Date Picker + Export */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full max-w-md">
          <DateRangePicker range={range} setRange={setRange} />
        </div>
        <ForecastPDFGenerator />
      </div>

      {/* Chart Selector */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {chartOptions.map((chart) => (
          <div
            key={chart.id}
            onClick={() => setSelectedChart(chart.id)}
            className={`cursor-pointer transition-transform rounded-xl p-4 shadow-md border ${
              selectedChart === chart.id
                ? "bg-white border-purple-600 shadow-lg scale-105"
                : "bg-white hover:shadow-lg"
            }`}
          >
            <h2 className="font-semibold text-purple-800 mb-1">{chart.title}</h2>
            <p className="text-gray-700 text-sm">{chart.desc}</p>
          </div>
        ))}
      </div>

      {/* Chart Display */}
      <div className="w-full h-[500px] max-w-7xl mx-auto bg-white p-4 rounded-xl shadow-lg">
        {selectedChart === "heatmap" ? (
          heatmapData.length > 0 ? (
            <ResponsiveHeatMap
              data={heatmapData}
              margin={{ top: 60, right: 60, bottom: 60, left: 80 }}
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
                legendPosition: "middle",
                legendOffset: -72,
              }}
              // Removed invalid property 'cellOpacity'
              borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
              labelTextColor={{ from: "color", modifiers: [["darker", 2]] }}
              colors={{ type: "sequential", scheme: "reds" }}
              animate={true}
              motionConfig="gentle"
            />
          ) : (
            <p className="text-center text-gray-600">No anomaly data found.</p>
          )
        ) : (
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
        )}
      </div>

      {/* Hidden charts for PDF export */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", opacity: 0, pointerEvents: "none" }}>
        <div id="chart-temperature" style={{ width: 800, height: 500 }}>
          <ResponsiveLine
            data={[
              { id: "Actual", data: filteredData.map((row) => ({ x: row.timestamp, y: row.temperature })) },
              { id: "Forecast", data: filteredData.map((row) => ({ x: row.timestamp, y: row.temperature - 1.5 })) },
            ]}
            xScale={{ type: "point" }}
            yScale={{ type: "linear" }}
            axisBottom={null}
            axisLeft={null}
          />
        </div>

        <div id="chart-vibration" style={{ width: 800, height: 500 }}>
          <ResponsiveLine
            data={[
              { id: "Actual", data: filteredData.map((row) => ({ x: row.timestamp, y: row.vibration })) },
              { id: "Forecast", data: filteredData.map((row) => ({ x: row.timestamp, y: row.vibration + 0.005 })) },
            ]}
            xScale={{ type: "point" }}
            yScale={{ type: "linear" }}
            axisBottom={null}
            axisLeft={null}
          />
        </div>

        <div id="chart-pressure" style={{ width: 800, height: 500 }}>
          <ResponsiveLine
            data={[
              { id: "Actual", data: filteredData.map((row) => ({ x: row.timestamp, y: row.pressure })) },
              { id: "Forecast", data: filteredData.map((row) => ({ x: row.timestamp, y: row.pressure - 1 })) },
            ]}
            xScale={{ type: "point" }}
            yScale={{ type: "linear" }}
            axisBottom={null}
            axisLeft={null}
          />
        </div>

        <div id="chart-comparative" style={{ width: 800, height: 500 }}>
          <ResponsiveLine
            data={[
              { id: "Temperature", data: filteredData.map((row) => ({ x: row.timestamp, y: row.temperature })) },
              { id: "Vibration", data: filteredData.map((row) => ({ x: row.timestamp, y: row.vibration })) },
              { id: "Pressure", data: filteredData.map((row) => ({ x: row.timestamp, y: row.pressure })) },
            ]}
            xScale={{ type: "point" }}
            yScale={{ type: "linear" }}
            axisBottom={null}
            axisLeft={null}
          />
        </div>

        <div id="chart-heatmap" style={{ width: 1000, height: 400 }}>
          <ResponsiveHeatMap
            data={heatmapData}
            margin={{ top: 60, right: 60, bottom: 60, left: 80 }}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={null}
            colors={{ type: "sequential", scheme: "reds" }}
            animate={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Forecast;
