import TrendForecastChart from '../components/TrendForecastChart';
import React, { useState } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Legend, Tooltip);

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}


const Dashboard: React.FC = () => {
  const [data, setData] = useState<SensorRow[]>([]);
  const [anomalies, setAnomalies] = useState<SensorRow[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed: SensorRow[] = result.data.map((row: any) => ({
          timestamp: row.timestamp,
          temperature: parseFloat(row.temperature),
          vibration: parseFloat(row.vibration),
          pressure: parseFloat(row.pressure),
        }));

        setData(parsed);
        const detected = parsed.filter((r) => r.temperature > 80);
        setAnomalies(detected);
      },
    });
  };

  const downloadAnomalies = () => {
    const csv = [
      ["timestamp", "temperature", "vibration", "pressure"],
      ...anomalies.map((a) => [a.timestamp, a.temperature, a.vibration, a.pressure]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anomalies_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = {
    labels: data.map((row) => row.timestamp),
    datasets: [
      {
        label: "Temperature",
        data: data.map((row) => row.temperature),
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.2)",
        tension: 0.3,
      },
      {
        label: "Vibration",
        data: data.map((row) => row.vibration),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
        tension: 0.3,
      },
      {
        label: "Pressure",
        data: data.map((row) => row.pressure),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-4 sticky top-0 h-screen hidden md:block">
          <h1 className="text-2xl font-extrabold mb-8">PredictAsense</h1>
          <nav className="flex flex-col space-y-4 text-sm">
            <a href="#overview" className="hover:text-blue-400">Overview</a>
            <a href="#upload" className="hover:text-blue-400">Upload</a>
            <a href="#graphs" className="hover:text-blue-400">Graphs</a>
            <a href="#anomalies" className="hover:text-blue-400">Anomalies</a>
            <a href="#about" className="hover:text-blue-400">About</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto scroll-smooth">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Welcome to PredictAsense</h2>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 text-sm rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <section id="overview">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your predictive maintenance dashboard.
            </p>
          </section>
          <section id="forecast" className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">📈 Forecast Trends</h2>
              <TrendForecastChart data={data} metric="temperature" />
          </section>

          <section id="upload">
            <h3 className="text-2xl font-semibold mb-4">Upload Sensor Data (CSV)</h3>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded w-full max-w-md"
            />
          </section>

          {data.length > 0 && (
            <section id="graphs">
              <h3 className="text-2xl font-semibold mb-4">Sensor Graphs</h3>
              <div className="overflow-x-auto">
                <Line data={chartData} />
              </div>
            </section>
          )}

          {anomalies.length > 0 && (
            <section id="anomalies">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-red-600">🚨 {anomalies.length} Anomalies Detected</h3>
                <button
                  onClick={downloadAnomalies}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download Report
                </button>
              </div>
              <div className="bg-red-100 dark:bg-red-200 text-black border border-red-400 p-4 mt-2 rounded text-sm">
                <ul className="space-y-1">
                  {anomalies.map((a, i) => (
                    <li key={i}>
                      [{a.timestamp}] Temp: {a.temperature}°C | Vib: {a.vibration} | Pressure: {a.pressure}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
          {data.length > 0 && (
             <section className="mt-10">
               <TrendForecastChart data={data} metric="temperature" />
               <TrendForecastChart data={data} metric="vibration" />
               <TrendForecastChart data={data} metric="pressure" />
            </section>
          )}

          <section id="about">
            <h3 className="text-2xl font-semibold mb-2">About</h3>
            <p className="text-gray-700 dark:text-gray-300">
              PredictAsense helps you monitor sensor data and detect anomalies using rule-based logic and visual feedback.
              Easily upload CSV files and download reports for further analysis.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;