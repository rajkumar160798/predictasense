// src/pages/Alerts.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { AnomalyInsight } from "../utils/types";
import { calculateAnomalyFrequency } from "../utils/anomalyFrequency";
import { computeAnomalyImpact, getImpactScorePerMetric } from "../utils/impactForecast";
import { prioritizeAlerts } from "../utils/alertPrioritization";
import { clusterAnomalies } from "../utils/anomalyClustering";
import { get2DClusterData } from "../utils/pcaUtils";
import AlertPriorityTable from "../components/AlertPriorityTable";
import ClusterPCAPlot from "../components/ClusterPCAPlot";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

const Alerts: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>("priority");
  const navigate = useNavigate();
  const rawData = JSON.parse(localStorage.getItem("sensorData") || "[]") as SensorRow[];

  const insights = useMemo(() => {
    const result: AnomalyInsight[] = [];
    for (const row of rawData) {
      const time = format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm");
      if (row.temperature > 80) {
        result.push({ time, metric: "Temperature", severity: "High", description: "Overheating." });
      }
      if (row.vibration > 0.07) {
        result.push({ time, metric: "Vibration", severity: "Medium", description: "Unusual vibration." });
      }
      if (row.pressure > 1015) {
        result.push({ time, metric: "Pressure", severity: "Medium", description: "Pressure too high." });
      }
    }
    return result;
  }, [rawData]);

  const impacts = useMemo(() => computeAnomalyImpact(rawData), [rawData]);
  const impactScores = useMemo(() => getImpactScorePerMetric(impacts), [impacts]);
  const prioritizedAlerts = useMemo(() => prioritizeAlerts(insights, impactScores), [insights, impactScores]);

  const clusteredAnomalies = useMemo(() => {
    const anomalyTimestamps = new Set(insights.map((i) => i.time));
    const anomalies = rawData.filter((row) => {
      const formatted = format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm");
      return anomalyTimestamps.has(formatted);
    });
    return clusterAnomalies(anomalies).map((item, idx) => ({ ...item, timestamp: anomalies[idx].timestamp }));
  }, [rawData, insights]);

  const clusterPlotData = useMemo(() => get2DClusterData(clusteredAnomalies).map(p => ({ ...p, cluster: p.cluster.toString() })), [clusteredAnomalies]);

  const handlePDFExport = async () => {
    const input = document.getElementById("alerts-export-section");
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("alerts_report.pdf");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>
      <div className="relative z-10 h-full w-full overflow-y-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-purple-800 text-center mb-4">🚨 Smart Alerts</h1>
        <p className="text-center text-gray-600 mb-6">Click a section below to explore insights and download reports.</p>

        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <button className={`px-6 py-2 rounded-full font-medium transition ${activeSection === "priority" ? "bg-purple-700 text-white" : "bg-black text-purple-300"}`} onClick={() => setActiveSection(activeSection === "priority" ? null : "priority")}>🚨 Alert Prioritization</button>
          <button className={`px-6 py-2 rounded-full font-medium transition ${activeSection === "clustering" ? "bg-purple-700 text-white" : "bg-black text-purple-300"}`} onClick={() => setActiveSection(activeSection === "clustering" ? null : "clustering")}>🧬 Anomaly Clustering</button>
          <button className={`px-6 py-2 rounded-full font-medium transition ${activeSection === "pca" ? "bg-purple-700 text-white" : "bg-black text-purple-300"}`} onClick={() => setActiveSection(activeSection === "pca" ? null : "pca")}>📉 PCA Visualization</button>
          <button className="px-6 py-2 rounded-full font-medium bg-black text-purple-300" onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>

        <div id="alerts-export-section" className="space-y-6">
          {activeSection === "priority" && (
            <div className="bg-white p-4 text-black rounded-xl  text-grey shadow-lg max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">🚨 Smart Alert Prioritization</h2>
              <AlertPriorityTable alerts={prioritizedAlerts} />
            </div>
          )}

          {activeSection === "clustering" && (
            <div className="bg-white p-4 rounded-xl shadow-lg max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">🧬 Anomaly Clustering (KMeans)</h2>
              <table className="w-full text-left">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="py-2 text-blue-500">Timestamp</th>
                    <th className="py-2 text-blue-500">Temperature</th>
                    <th className="py-2 text-blue-500">Pressure</th>
                    <th className="py-2 text-blue-500">Vibration</th>
                    <th className="py-2 text-blue-500">Cluster</th>
                  </tr>
                </thead>
                <tbody>
                  {clusteredAnomalies.map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-1  text-black">{row.timestamp}</td>
                      <td className="py-1  text-black">{row.temperature}</td>
                      <td className="py-1 text-black">{row.pressure}</td>
                      <td className="py-1 text-black   ">{row.vibration}</td>
                      <td className="py-1 font-bold text-purple-600">#{row.cluster}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === "pca" && (
            <div className="bg-white p-4 rounded-xl shadow-lg max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">📉 PCA Cluster Visualization</h2>
              <ClusterPCAPlot points={clusterPlotData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
