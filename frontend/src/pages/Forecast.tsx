// src/pages/Forecast.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveLine } from "@nivo/line";
import { format, parseISO } from "date-fns";
import backgroundImage from "../assets/machine-background.jpg";
import DateRangePicker from "../components/DateRangePicker";
import { getForecastFromAPI } from "../api/forecastService";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

interface ForecastPoint {
  ds: string;
  yhat: number;
  failure_risk: boolean;
}

const Forecast: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChart, setSelectedChart] = useState("temperature");
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);
  const [range, setRange] = useState<any[]>([
    {
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-03-10"),
      key: "selection",
    },
  ]);

  const rawData = JSON.parse(localStorage.getItem("sensorData") || "[]") as SensorRow[];

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const data = await getForecastFromAPI("2024-03-10 00:00:00", 7);
        setForecastData(data);
      } catch (error) {
        console.error("Failed to fetch forecast:", error);
      }
    };
    fetchForecast();
  }, []);

  const chartOptions = [
    { id: "temperature", title: "Trend Forecast - Temperature" },
    { id: "vibration", title: "Trend Forecast - Vibration" },
    { id: "pressure", title: "Trend Forecast - Pressure" },
    { id: "comparative", title: "Comparative Trends" },
    { id: "autoMLForecast", title: "AutoML Forecast" },
  ];

  const getChartData = () => {
    const formatData = (metric: keyof SensorRow, offset = 0) =>
      rawData.map((row) => ({
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
      case "autoMLForecast":
        return forecastData.length > 0
          ? [
              {
                id: "Sensor (Recent)",
                data: rawData.slice(-10).map((row) => ({
                  x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
                  y: row.temperature,
                })),
              },
              {
                id: "Prophet Prediction",
                data: forecastData.map((f) => ({
                  x: format(parseISO(f.ds), "yyyy-MM-dd HH:mm"),
                  y: f.yhat,
                  failure_risk: f.failure_risk,
                })),
              },
            ]
          : [];
      default:
        return [];
    }
  };

  return (
    <div
      className="relative h-screen text-black w-full flex flex-col justify-center items-center text-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      <div className="z-10 w-full px-4 py-8 overflow-y-auto" style={{ maxHeight: "100vh" }}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="flex-1 text-4xl font-bold text-white text-center">Forecast Dashboard</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-purple-700 px-4 py-2 rounded-full shadow hover:bg-purple-100"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* DateRangePicker styled as a button */}
          <div
            className={`px-6 py-2 rounded-xl font-medium transition text-sm ${
              selectedChart === "dateRange"
                ? "bg-purple-700 text-white"
                : "bg-white text-purple-300"
            }`}
          >
            <DateRangePicker range={range} setRange={setRange} />
          </div>

          {/* Graph selection buttons */}
          {chartOptions.map((chart) => (
            <button
              key={chart.id}
              className={`px-6 py-2 rounded-full font-medium transition text-sm ${
                selectedChart === chart.id
                  ? "bg-purple-700 text-white"
                  : "bg-black text-purple-300"
              }`}
              onClick={() => setSelectedChart(chart.id)}
            >
              {chart.title}
            </button>

          )
          )
          }
        </div>

        <div className="w-full h-[500px] bg-white p-4 rounded-xl shadow-lg">
          {getChartData().length > 0 ? (
            <ResponsiveLine
              data={getChartData()}
              margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
              axisBottom={{
                tickRotation: -35,
                legend: "Time",
                legendOffset: 40,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Value",
                legendOffset: -40,
                legendPosition: "middle",
              }}
              colors={{ scheme: "category10" }}
              pointSize={8}
              pointBorderWidth={2}
              pointColor={(d: any) => (d.data.failure_risk ? "red" : d.color)}
              tooltip={({ point }) => {
                const dataPoint = point.data as any;
                return (
                  <div style={{ background: "white", padding: 8, border: "1px solid red", borderRadius: 4 }}>
                    <strong>{dataPoint.xFormatted}</strong>
                    <br />Value: {dataPoint.yFormatted}
                    <br />{dataPoint.failure_risk && <span style={{ color: "red" }}>⚠️ High Failure Risk</span>}
                  </div>
                );
              }}
              useMesh={true}
              legends={[{
                anchor: "top-left",
                direction: "row",
                translateY: -40,
                itemWidth: 150,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: "circle",
              }]}
            />
          ) : (
            <p className="text-center text-gray-600">No data available for this chart.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Forecast;
