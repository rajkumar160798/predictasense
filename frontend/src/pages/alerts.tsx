import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { AnomalyInsight } from "../utils/types";
import { computeAnomalyImpact, getImpactScorePerMetric } from "../utils/impactForecast";
import { prioritizeAlerts } from "../utils/alertPrioritization";
import { clusterAnomalies } from "../utils/anomalyClustering";
import { get2DClusterData } from "../utils/pcaUtils";
import AlertPriorityTable from "../components/AlertPriorityTable";
import ClusterPCAPlot from "../components/ClusterPCAPlot";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import { motion } from "framer-motion";

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

  // const handlePDFExport = async () => {
  //   const input = document.getElementById("alerts-export-section");
  //   if (!input) return;
  //   const canvas = await html2canvas(input);
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF();
  //   pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  //   pdf.save("alerts_report.pdf");
  // };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🚨 Smart Alerts</h1>
          <p className="text-gray-600">Click a section below to explore insights and download reports.</p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: "priority", label: "🚨 Alert Prioritization" },
            { id: "clustering", label: "🧬 Anomaly Clustering" },
            { id: "pca", label: "📉 PCA Visualization" }
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
          id="alerts-export-section"
          className="space-y-6"
        >
          {activeSection === "priority" && (
            <div className="bg-white p-4 text-black rounded-xl shadow-lg max-h-[80vh] overflow-y-auto">
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
                      <td className="py-1 text-black">{row.timestamp}</td>
                      <td className="py-1 text-black">{row.temperature}</td>
                      <td className="py-1 text-black">{row.pressure}</td>
                      <td className="py-1 text-black">{row.vibration}</td>
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
        </motion.div>
      </div>
    </div>
  );
};

export default Alerts;