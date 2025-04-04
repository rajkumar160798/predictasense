// src/pages/Forecast.tsx
import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { Range } from "react-date-range";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import DateRangePicker from "../components/DateRangePicker";
import ForecastPDFGenerator from "../components/ForecastPDFGenerator";
import AnomalyInsightsSection from "../components/AnomalyInsightsSection";
import backgroundImage from "../assets/machine-background.jpg";
import { computeAnomalyImpact, getImpactScorePerMetric } from "../utils/impactForecast";
import AnomalyImpactForecast from "../components/AnomalyImpactForecast";
import { getSuggestedActions } from "../utils/suggestedActions";
import SuggestedActions from "../components/SuggestedActions";
import { AnomalyInsight } from "../utils/types";
import { useMemo } from "react";
import { calculateAnomalyFrequency } from "../utils/anomalyFrequency";
import AnomalyFrequencyTable from "../components/AnomalyFrequencyTable"; 
import RootCauseTable from "../components/RootCauseTable"; 
import { calculateHealthScore } from "../utils/healthScore";
import HealthScoreCard from "../components/HealthScoreCard";
import { getForecastFromAPI } from "../api/forecastService";
import { clusterAnomalies } from "../utils/anomalyClustering";
import { prioritizeAlerts } from "../utils/alertPrioritization";
import AlertPriorityTable from "../components/AlertPriorityTable";
import ClusterPCAPlot from "../components/ClusterPCAPlot";
import { get2DClusterData } from "../utils/pcaUtils";
import TrendEvolutionTabs from "../components/TrendEvolutionTabs";
import { scoreRootCauses } from "../utils/rootCauseConfidence";
import RootCauseConfidenceTable from "../components/RootCauseConfidenceTable";
import AnomalyTimeline from "../components/AnomalyTimeline";
import Sidebar from "../components/Sidebar";
import CommentsPanel from "../components/CommentsPanel";
// import LiveMonitor from "../pages/LiveMonitor"; 

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
  const [selectedChart, setSelectedChart] = useState("temperature");
  // const [setShowInsights] = useState(false);
  const navigate = useNavigate(); 

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
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleAutoMLForecast = async () => {
    if (forecastData.length > 0) return; // already fetched
    setLoading(true); // Set loading to true
    try {
      const data = await getForecastFromAPI("2024-03-10 00:00:00", 7);
      console.log("📥 Fetched Forecast Data:", data);
      setForecastData(data);
    } catch (error) {
      console.error("Forecast API error:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

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
          description:
            "Unusual vibration. Possible imbalance or component wear.",
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
    {
      id: "temperature",
      title: "📈 Trend Forecast - Temperature",
      desc: "Shows predicted temperature changes. Spikes or drops may indicate overheating or cooling issues.",
    },
    {
      id: "vibration",
      title: "📊 Trend Forecast - Vibration",
      desc: "Tracks vibration patterns over time. Abnormal spikes may signal imbalance or wear.",
    },
    {
      id: "pressure",
      title: "🧪 Trend Forecast - Pressure",
      desc: "Monitors pressure trends. Sudden changes might indicate blockages or leaks.",
    },
    {
      id: "comparative",
      title: "📊 Comparative Trends",
      desc: "Visual comparison of all three metrics to analyze cross-impact over time.",
    },
    {
      id: "heatmap",
      title: "🔥 Anomaly Heatmap",
      desc: "Highlights when and where abnormal readings were detected across metrics.",
    },
    {
      id: "anomalyInsights",
      title: "🔍 Anomaly Insights",
      desc: "Detailed insights into detected anomalies, including severity and potential causes.",
    },
    {
      id: "anomalyImpact",
      title: "🧠 Anomaly Impact Forecast",
      desc: "Predicts the impact & risk of detected anomalies to prioritize maintenance.",
    },
    {
      id: "suggestedActions",
      title: "🛠️ Suggested Actions",
      desc: "Recommendations based on detected anomalies.",
    },
    {
      id: "anomalyFrequency",
      title: "📋 Anomaly Frequency Summary",
      desc: "How often each anomaly type occurred with severity.",
    },
    {
      id: "rootCause",
      title: "🔎 Root Cause Engine (RCE)",
      desc: "Identifies potential root causes based on detected anomalies.",
    },
    {
      id: "healthScore",
      title: "🏥 Health Score",
      desc: "Overall system health based on anomaly severity and frequency.",
    },
    {
      id: "autoMLForecast",
      title: "🤖 AutoML Forecast",
      desc: "Predictive model forecast for the next 7 days.",
    },
    {
      id: "anomalyClusters",
      title: "🧬 Anomaly Clustering",
      desc: "Groups anomalies into clusters based on behavior.",
    },
    { id: "alertPriority", 
      title: "🚨 Smart Alert Prioritization", 
      desc: "Ranks alerts based on severity, frequency, and impact." 
    },
    {
      id: "clusterVisualization",
      title: "📉 Cluster Visualization (PCA)",
      desc: "2D plot of anomaly clusters using PCA for interpretation.",
    },
    {
      id: "trendEvolution",
      title: "📆 Trend Evolution Charts",
      desc: "Track weekly trends in sensor metrics.",
    },
    {
      id: "showRootConfidence",
      title: "📊 Root Cause Confidence Scoring",
      desc: "Confidence scores for root causes based on detected anomalies.",
    },
    {
      id: "anomalyTimeline",
      title: "📍 Interactive Anomaly Timeline",
      desc: "Timeline view of all anomalies across metrics with severity filters.",
    },
    {
      id: "comments",
      title: "💬 Anomaly Comments",
      desc: "Collaborate on anomalies with feedback threads."
    },
    {
      id: "liveMonitor",
      title: "📡 Live Monitoring Dashboard",
      desc: "Shows real-time sensor anomalies with metric status.",
    }
    
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
      case "autoMLForecast":
        console.log("📊 Rendering AutoML chart with data:", forecastData);
        return forecastData.length > 0
          ? [
              {
                id: "Sensor (Recent)",
                data: rawData.slice(-10).map((row) => ({
                  x: format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm"),
                  y: row.temperature, // Assuming temperature for comparison
                })),
              },
              {
                id: "Prophet Prediction",
                data: forecastData.map((f) => ({
                  x: format(parseISO(f.ds), "yyyy-MM-dd HH:mm"),
                  y: f.yhat,
                  failure_risk: f.failure_risk, // Include failure_risk in data points
                })),
              },
            ]
          : []; // Return an empty array if no data is available
      default:
        return [];
    }
  };

  // Heatmap data generator using the "series" format
  const getAnomalyHeatmapData = () => {
    const hourlyBuckets: {
      [hour: string]: {
        Temperature: number;
        Vibration: number;
        Pressure: number;
      };
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
  // const impactEntries = computeAnomalyImpact(filteredData);
  const impacts = computeAnomalyImpact(filteredData); // For component
  const impactScores = getImpactScorePerMetric(impacts); 
  console.log("Impact Scores:", impactScores); // Debugging log
  const memoizedInsights = useMemo(() => {
    const insights = generateAnomalyInsights(filteredData);
    console.log("Generated Anomaly Insights:", insights); // Debugging log
    return insights;
  }, [filteredData]);

  const anomalyFrequencies = useMemo(() => {
    const frequencies = calculateAnomalyFrequency(memoizedInsights);
    console.log("Generated Anomaly Frequencies:", frequencies); // Debugging log
    return frequencies || []; // Ensure frequencies is always an array
  }, [memoizedInsights]);

  const rootCauses = useMemo(() => {
    const causes = generateRootCauses(memoizedInsights);
    console.log("Generated Root Causes:", causes); // Debugging log
    return causes || []; // Ensure causes is always an array
  }, [memoizedInsights]);

  const suggestedActions = useMemo(() => {
    const actions = getSuggestedActions(memoizedInsights);
    console.log("Generated Suggested Actions:", actions); // Debugging log
    return actions || []; // Ensure actions is always an array
  }, [memoizedInsights]);
  
  const scoredRootCauses = useMemo(() => {
    return scoreRootCauses(rootCauses);
  }, [rootCauses]);
  const healthScore = useMemo(
    () => calculateHealthScore(memoizedInsights),
    [memoizedInsights]
  );
  console.log("Calculated Health Score:", healthScore); // Debugging log

  const clusteredAnomalies = useMemo(() => {
    try {
      const anomalyTimestamps = new Set(memoizedInsights.map((i) => i.time));
  
      const anomalies = filteredData.filter((row) => {
        const formattedTime = format(
          parseISO(row.timestamp),
          "yyyy-MM-dd HH:mm"
        );
        return anomalyTimestamps.has(formattedTime);
      });
  
      const clustered = clusterAnomalies(anomalies);
      // const ForecastPage = () => {
      //   const anomalies = useAnomaliesListener();
      
      //   return (
      //     <div>
      //       <h2 className="text-2xl font-bold mb-4">📊 Live Anomalies</h2>
      //       <ul>
      //         {anomalies.map((item) => (
      //           <li key={item.id} className="mb-2">
      //             <strong>{item.severity}</strong> at {item.timestamp} — Temp: {item.temperature}°C | Vib: {item.vibration} | Pressure: {item.pressure}
      //           </li>
      //         ))}
      //       </ul>
      //     </div>
      //   );
      // };
  
      const enriched = clustered.map((item, idx) => ({
        ...item,
        timestamp: anomalies[idx].timestamp, // ✅ attach timestamp from original data
      }));
  
      console.log("✅ Clustered Anomalies (with timestamp):", enriched);
      return enriched;
    } catch (err) {
      console.error("❌ Clustering error:", err);
      return [];
    }
  }, [filteredData, memoizedInsights]);

  return (
    <div
      className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", 
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
          {/*Sidebar */}
           <Sidebar />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      {/* Content */}
      <div className="z-10 w-full px-4 py-8 overflow-y-auto" style={{ maxHeight: "100vh" }}>
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
              onClick={() => {
                // if (chart.id === "liveMonitor") {
                //   navigate("/live-monitor"); // ✅ Navigate to Live Monitor route
                //   return;
                // }
                setSelectedChart(chart.id);
                // setShowInsights(chart.id === "anomalyInsights");
                if (chart.id === "liveMonitor") {
                  navigate("/live-monitor"); // Navigate to Live Monitor page
                } 
                if (chart.id === "autoMLForecast") {
                  // Scroll to chart display section
                  const chartSection = document.getElementById(
                    "chart-display-section"
                  );
                  chartSection?.scrollIntoView({ behavior: "smooth" });
                  handleAutoMLForecast(); // auto-fetch data when clicked
                }
              }}
              className={`cursor-pointer transition-transform rounded-xl p-4 shadow-md border ${
                selectedChart === chart.id
                  ? "bg-white border-purple-600 shadow-lg scale-105"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <h2 className="font-semibold text-purple-800 mb-1">
                {chart.title}
              </h2>
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
        ) : selectedChart === "anomalyInsights" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              🔍 Anomaly Insights
            </h2>
            <AnomalyInsightsSection anomalies={memoizedInsights} />
            <CommentsPanel anomalyId="4CITKCNtYKWuFaPEdJpI" /> {/* Replace with dynamic ID later */}
          </div>
        ) : selectedChart === "suggestedActions" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              🛠️ Suggested Actions
            </h2>
            {suggestedActions.length > 0 ? (
              <SuggestedActions actions={suggestedActions} />
            ) : (
              <p className="text-center text-gray-600">
                No suggested actions available.
              </p>
            )}
          </div>
        ) : selectedChart === "alertPriority" ? (
          <div className="bg-white p-4 rounded-xl shadow-lg max-h-[400px] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">🚨 Smart Alert Prioritization</h2>
            <AlertPriorityTable alerts={prioritizeAlerts(memoizedInsights, impactScores)} />
          </div>
        ) :selectedChart === "anomalyFrequency" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              📋 Anomaly Frequency Summary
            </h2>
            {anomalyFrequencies.length > 0 ? (
              <AnomalyFrequencyTable frequencies={anomalyFrequencies} />
            ) : (
              <p className="text-center text-gray-600">
                No anomaly frequency data available.
              </p>
            )}
          </div>
        ) : selectedChart === "rootCause" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              🔎 Root Cause Engine (RCE)
            </h2>
            {rootCauses.length > 0 ? (
              <RootCauseTable causes={rootCauses} />
            ) : (
              <p className="text-center text-gray-600">
                No root cause data available.
              </p>
            )}
          </div>
        ) : selectedChart === "healthScore" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Health Score
            </h2>
            <HealthScoreCard score={healthScore} />
            {healthScore < 50 && (
              <p className="text-red-500 mt-2">
                ⚠️ Low health score detected! Immediate attention required.
              </p>
            )}
          </div>
        ) : selectedChart === "clusterVisualization" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              🧬 Cluster Visualization (PCA)
            </h2>
            <ClusterPCAPlot
              points={get2DClusterData(clusteredAnomalies).map((point) => ({
                ...point,
                cluster: point.cluster.toString(), // Convert cluster to string
              }))}
            />
          </div>
        ) : selectedChart === "comments" ? (
          <div className="mt-10 bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              💬 Comments Panel
            </h2>
            {/* Provide a static docId for now, later make it dynamic */}
            <CommentsPanel anomalyId="sampleDocIdHere" />
          </div>
        
      ):selectedChart === "healthScore" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Health Score
            </h2>
            <HealthScoreCard score={healthScore} />
            {healthScore < 50 && (
              <p className="text-red-500 mt-2">
                ⚠️ Low health score detected! Immediate attention required.
              </p>
            )}
          </div>
        ) : selectedChart === "showRootConfidence" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">
              📊 Root Cause Confidence Scoring
            </h3>
            <RootCauseConfidenceTable entries={scoredRootCauses} />
          </div>
        ) : selectedChart === "anomalyTimeline" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <AnomalyTimeline insights={memoizedInsights} />
          </div>
        ) : selectedChart === "trendEvolution" ? (
          <div className="mt-10 max-h-[400px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">📆 Weekly Trend Evolution</h2>
            <TrendEvolutionTabs data={filteredData} />
          </div>
        ) : selectedChart === "anomalyClusters" ? (
          <div className="bg-white p-4 rounded-xl shadow-lg max-h-[400px] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              🧬 Anomaly Clustering (KMeans)
            </h2>
            {clusteredAnomalies.length > 0 ? (
              <table className="w-full text-left">
                <caption className="text-gray-600 mb-2">
                  Anomalies clustered into groups based on behavior.
                </caption>
                <thead>
                  <tr className="bg-purple-200 text-purple-900">
                    <th className="py-2 text-gray-800">Timestamp</th>
                    <th className="py-2 text-gray-800">Temp</th>
                    <th className="py-2 text-gray-800">Pressure</th>
                    <th className="py-2 text-gray-800">Vibration</th>
                    <th className="py-2 text-gray-800">Cluster</th>
                  </tr>
                </thead>
                <tbody>
                  {clusteredAnomalies.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-1 text-gray-800">{row.timestamp}</td>
                      <td className="py-1 text-gray-800">{row.temperature}</td>
                      <td className="py-1 text-gray-800">{row.pressure}</td>
                      <td className="py-1 text-gray-800">{row.vibration}</td>
                      <td
                        className={`py-1 font-bold ${
                          row.cluster === 0
                            ? "text-blue-600"
                            : row.cluster === 1
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        #{row.cluster}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">
                No clustered anomalies found.
              </p>
            )}
          </div>
        ) : (
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
                <p className="text-center text-gray-600">
                  No anomaly data found.
                </p>
              )
            ) : getChartData().length > 0 ? (
              <>
                <ResponsiveLine
                  data={getChartData()}
                  margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                  }}
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
                  pointColor={(d: any) => (d.data.failure_risk ? "red" : d.color)}
                  tooltip={({ point }) => {
                    const dataPoint = point.data as {
                      xFormatted: string | number;
                      yFormatted: string | number;
                      failure_risk?: boolean;
                    };
                    return (
                      <div
                        style={{
                          background: "white",
                          padding: 8,
                          border: "1px solid red",
                          borderRadius: 4,
                        }}
                      >
                        <strong>{dataPoint.xFormatted}</strong>
                        <br />
                        Value: {dataPoint.yFormatted}
                        <br />
                        {dataPoint.failure_risk && (
                          <span style={{ color: "red" }}>
                            ⚠️ High Failure Risk
                          </span>
                        )}
                      </div>
                    );
                  }}
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
                {/* Risk Summary Panel */}
                {selectedChart === "autoMLForecast" &&
                  forecastData.filter((f) => f.failure_risk).length > 0 && (
                    <div className="bg-red-100 mt-4 p-4 rounded shadow text-left">
                      <h3 className="text-red-600 font-semibold mb-2">
                        ⚠️ Failure Risks Detected
                      </h3>
                      <p className="text-sm mb-2">
                        <strong>Total Risk Points:</strong>{" "}
                        {forecastData.filter((f) => f.failure_risk).length}
                      </p>
                      <ul className="text-sm list-disc pl-5">
                        {forecastData
                          .filter((f) => f.failure_risk)
                          .map((r, i) => (
                            <li key={i}>
                              <strong>{r.ds}</strong> → yhat:{" "}
                              {r.yhat.toFixed(2)}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
              </>
            ) : (
              <p className="text-center text-gray-600">
                No data available for this chart.
              </p>
            )}
          </div>
        )}
        {/* Loading State and Fallback */}
        {loading && (
          <p className="text-center text-gray-600">🔄 Generating forecast...</p>
        )}
        {!loading &&
          selectedChart === "autoMLForecast" &&
          forecastData.length === 0 && (
            <p className="text-center text-gray-600">
              No forecast data available. Try refreshing. 🔄
            </p>
          )}
      </div>

      {/* Hidden charts for PDF export */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div id="chart-temperature" style={{ width: 800, height: 500 }}>
          <ResponsiveLine
            data={[
              {
                id: "Actual",
                data: filteredData.map((row) => ({
                  x: row.timestamp,
                  y: row.temperature,
                })),
              },
              {
                id: "Forecast",
                data: filteredData.map((row) => ({
                  x: row.timestamp,
                  y: row.temperature - 1.5,
                })),
              },
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
              {
                id: "Actual",
                data: filteredData.map((row) => ({
                  x: row.timestamp,
                  y: row.vibration,
                })),
              },
              {
                id: "Forecast",
                data: filteredData.map((row) => ({
                  x: row.timestamp,
                  y: row.vibration + 0.005,
                })),
              },
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
              {
                id: "Actual",
                data: filteredData.map((row) => ({
                  x: row.timestamp,
                  y: row.pressure,
                })),
              },
              {
                id: "Forecast",
                data: filteredData.map((row) => ({
                  x: row.timestamp,
                  y: row.pressure - 1,
                })),
              },
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
              {
                id: "Temperature",
                data: filteredData.map((row) => ({
                  x: row.timestamp,
                  y: row.temperature,
                })),
              },
              {
                id: "Vibration",
                data: filteredData.map((row) => ({
                  x: row.timestamp,
                  y: row.vibration,
                })),
              },
              {
                id: "Pressure",
                data: filteredData.map((row) => ({
                  x: row.timestamp,
                  y: row.pressure,
                })),
              },
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
      {/* Back to Upload Page Button */}
      <div className="relative z-10 w-full flex justify-center py-4">
        <button
          onClick={() => navigate("/upload")} // Navigate to the Upload page
          className="bg-white text-purple-700 px-6 py-3 rounded-full text-lg shadow-md hover:bg-purple-100 hover:shadow-lg transition !bg-white"
        >
          🔙 Back to Upload Page
        </button>
      </div>      
    </div>
  );
};

export default Forecast;

function generateRootCauses(memoizedInsights: AnomalyInsight[]) {
  const rootCauses = memoizedInsights.map((insight) => {
    switch (insight.metric) {
      case "Temperature":
        return {
          metric: "Temperature",
          rootCause:
            "Overheating due to insufficient cooling or high ambient temperature.",
          severity: insight.severity,
          time: insight.time,
          timestamp: insight.time, // Assuming time is used as timestamp
        };
      case "Vibration":
        return {
          metric: "Vibration",
          rootCause: "Possible imbalance, misalignment, or component wear.",
          severity: insight.severity,
          time: insight.time,
          timestamp: insight.time, // Assuming time is used as timestamp
        };
      case "Pressure":
        return {
          metric: "Pressure",
          rootCause: "Potential blockages, leaks, or faulty pressure sensors.",
          severity: insight.severity,
          time: insight.time,
          timestamp: insight.time, // Assuming time is used as timestamp
        };
      default:
        return {
          metric: insight.metric,
          rootCause: "Unknown cause.",
          severity: insight.severity,
          time: insight.time,
          timestamp: insight.time, // Assuming time is used as timestamp
        };
    }
  });

  return rootCauses;
}
