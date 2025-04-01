// src/pages/Forecast.tsx
import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { Range } from "react-date-range";
import DateRangePicker from "../components/DateRangePicker";
import ForecastPDFGenerator from "../components/ForecastPDFGenerator";
import AnomalyInsightsSection from "../components/AnomalyInsightsSection";
import backgroundImage from "../assets/machine-background.jpg";
import { computeAnomalyImpact } from "../utils/impactForecast";
import AnomalyImpactForecast from "../components/AnomalyImpactForecast";
import { getSuggestedActions } from "../utils/suggestedActions";
import SuggestedActions from "../components/SuggestedActions";
import { AnomalyInsight } from "../utils/types";
import { useMemo } from "react";
interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

const Forecast: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState("temperature");
  const [showInsights, setShowInsights] = useState(false);

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

  const generateAnomalyInsights = (data: SensorRow[]): AnomalyInsight[] => {
    const insights: AnomalyInsight[] = [];
  
    for (const row of data) {
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
          description: "Unusual vibration. Possible imbalance or component wear.",
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
  };

  const chartOptions = [
    { id: "temperature", title: "📈 Trend Forecast - Temperature", desc: "Shows predicted temperature changes. Spikes or drops may indicate overheating or cooling issues." },
    { id: "vibration", title: "📊 Trend Forecast - Vibration", desc: "Tracks vibration patterns over time. Abnormal spikes may signal imbalance or wear." },
    { id: "pressure", title: "🧪 Trend Forecast - Pressure", desc: "Monitors pressure trends. Sudden changes might indicate blockages or leaks." },
    { id: "comparative", title: "📊 Comparative Trends", desc: "Visual comparison of all three metrics to analyze cross-impact over time." },
    { id: "heatmap", title: "🔥 Anomaly Heatmap", desc: "Highlights when and where abnormal readings were detected across metrics." },
    { id: "anomalyInsights", title: "🔍 Anomaly Insights", desc: "Detailed insights into detected anomalies, including severity and potential causes." },
    { id: "anomalyImpact", title: "🧠 Anomaly Impact Forecast", desc: "Predicts the impact & risk of detected anomalies to prioritize maintenance." }, 
    { id: "suggestedActions", title: "🛠️ Suggested Actions", desc: "Recommendations based on detected anomalies." },
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
  const impacts = computeAnomalyImpact(filteredData);
  
  const memoizedInsights = useMemo(() => {
    const insights = generateAnomalyInsights(filteredData);
    console.log("Generated Anomaly Insights:", insights); // Debugging log
    return insights;
  }, [filteredData]);

  const suggestedActions = useMemo(() => {
    const actions = getSuggestedActions(memoizedInsights);
    console.log("Generated Suggested Actions:", actions); // Debugging log
    return actions || []; // Ensure actions is always an array
  }, [memoizedInsights]);


  return (
    <div
      className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      {/* Content */}
      <div className="z-10 w-full px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-6">
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
              onClick={() => {setSelectedChart(chart.id);
                setShowInsights(chart.id === "anomalyInsights");
              }}
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

        {/* Chart Display or Anomaly Insights */}
        {selectedChart === "anomalyImpact" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              📊 Anomaly Impact Forecast
            </h2>
            <AnomalyImpactForecast impacts={impacts} />
          </div>
        ) : selectedChart !== "anomalyInsights" && selectedChart !== "suggestedActions" ? (
          <div className="w-full h-[500px] bg-white p-4 rounded-xl shadow-lg">
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
              getChartData().length > 0 ? (
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
                <p className="text-center text-gray-600">No data available for this chart.</p>
              )
            )}
          </div>
        ) : selectedChart === "anomalyInsights" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              🔍 Anomaly Insights
            </h2>
            <AnomalyInsightsSection anomalies={memoizedInsights} />
          </div>
        ) : (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              🛠️ Suggested Actions
            </h2>
            {suggestedActions.length > 0 ? (
              <SuggestedActions actions={suggestedActions} />
            ) : (
              <p className="text-center text-gray-600">No suggested actions available.</p>
            )}
          </div>
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


      {/* Background image filter */}
      <img
        src={backgroundImage}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        style={{ filter: "brightness(0.4)" }}
      />
    </div>
  );
};

export default Forecast;
