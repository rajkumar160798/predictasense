import React, { useState } from "react";
import Papa from "papaparse";
import { format, parseISO, isWithinInterval } from "date-fns";
import { Line } from "react-chartjs-2";
import { Range } from "react-date-range"; // Importing Range for date range selection
import DateRangePicker from "../components/DateRangePicker"; // Importing DateRangePicker for date selection
import { addDays } from "date-fns";  // Importing addDays for date manipulation
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import TrendForecastChart from "../components/TrendForecastChart";
import AnomalyHeatmap from "../components/AnomalyHeatmap";
import ComparativeLineChart from "../components/ComparativeLineChart";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Legend, Tooltip);

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

interface AnomalyHeatmapData {
  [timestampHour: string]: {
    temperature: number;
    vibration: number;
    pressure: number;
  };
}

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"about" | "upload">("about");
  const [data, setData] = useState<SensorRow[]>([]);
  const [anomalies, setAnomalies] = useState<SensorRow[]>([]);
  const [nivoData, setNivoData] = useState<
    { hour: string; Temperature: number; Vibration: number; Pressure: number }[]
  >([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["temperature", "vibration"]);
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),                     // today
      endDate: addDays(new Date(), 365),           // +7 days
      key: "selection",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  
  console.log("Selected date range:", range[0].startDate, range[0].endDate);

  const getFilteredData = (): SensorRow[] => {
    const start = range[0].startDate;
    const end = range[0].endDate;
    if (!start || !end) return data;
    return data.filter((row) => {
      const ts = parseISO(row.timestamp);
      return isWithinInterval(ts, { start, end });
    });
  };

  
  const filteredData = getFilteredData();
  console.log("Filtered data count:", filteredData.length); 

  console.log("Filtered data:", filteredData); 
  console.log("Anomalies detected:", anomalies); 
  console.log("Nivo data:", nivoData); 
  console.log("Selected metrics:", selectedMetrics); 

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

        const heatmapData: AnomalyHeatmapData = {};
        parsed.forEach((row) => {
          const hour = format(parseISO(row.timestamp), "MM-dd HH:00");
          if (!heatmapData[hour]) {
            heatmapData[hour] = { temperature: 0, vibration: 0, pressure: 0 };
          }
          if (row.temperature > 80) heatmapData[hour].temperature = 1;
          if (row.vibration > 0.07) heatmapData[hour].vibration = 1;
          if (row.pressure > 1015) heatmapData[hour].pressure = 1;
        });

        const transformed = Object.entries(heatmapData).map(([hour, counts]) => ({
          hour,
          Temperature: counts.temperature,
          Vibration: counts.vibration,
          Pressure: counts.pressure,
        }));
        setNivoData(transformed);
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
    labels: filteredData.map((row) => row.timestamp),
    datasets: [
      {
        label: "Temperature",
        data: filteredData.map((row) => row.temperature),
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.2)",
        tension: 0.3,
      },
      {
        label: "Vibration",
        data: filteredData.map((row) => row.vibration),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
        tension: 0.3,
      },
      {
        label: "Pressure",
        data: filteredData.map((row) => row.pressure),
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
        <aside className="w-64 bg-gray-900 text-white p-4 sticky top-0 h-screen hidden lg:block">
          <nav className="flex flex-col space-y-4 text-sm">
            <a href="#overview" className="hover:text-blue-400">Overview</a>
            <a href="#upload" className="hover:text-blue-400">Upload</a>
            <a href="#graphs" className="hover:text-blue-400">Graphs</a>
            <a href="#anomalies" className="hover:text-blue-400">Anomalies</a>
            <a href="#about" className="hover:text-blue-400">About</a>
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 space-y-10 overflow-y-auto scroll-smooth max-w-full lg:max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Welcome to PredictAsense</h2>
            <button
               onClick={() => setDarkMode(!darkMode)}
              className="flex items-center px-4 py-2 rounded transition bg-gray-200 dark:bg-gray-700 text-sm shadow hover:scale-105"
              > 
              {darkMode ? "☀️ Switch to Light" : "🌙 Switch to Dark"}
              </button>
          </div>

          {currentPage === "about" && (
            <section id="about">
              <h3 className="text-2xl font-semibold mb-2">About</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                PredictAsense helps you monitor sensor data and detect anomalies using rule-based
                logic and visual feedback. Easily upload CSV files and download reports for further
                analysis.
              </p>
              <button
                onClick={() => setCurrentPage("upload")}
                className="bg-blue-600 text-blue-500 px-4 py-2 rounded hover:bg-blue-700"
              >
                Start Uploading
              </button>
            </section>
          )}

          {currentPage === "upload" && (
            <>
              <section id="date-range">
                <h3 className="text-2xl font-semibold mb-4">📅 Filter by Date Range</h3>
                <DateRangePicker range={range} setRange={setRange} />
              </section>

              <section id="upload">
                <h3 className="text-2xl font-semibold mb-4">Upload Sensor Data (CSV)</h3>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded w-full max-w-md"
                />
              <button
                onClick={() => {
                setData([]);
                setAnomalies([]);
                setNivoData([]);
                setSelectedMetrics(["temperature", "vibration"]);
                setRange([
               {
               startDate: new Date(),
               endDate: addDays(new Date(), 365),
               key: "selection",
               },
               ]);
                }}
              className="mt-4 bg-red-500 text-blue px-4 py-2 rounded hover:bg-red-600">
               🔄 Reset Dashboard
                </button>

                {/* <button
                  onClick={() => {
                  setData([]);
                  setAnomalies([]);
                  setNivoData([]);
                  setSearchTerm('');
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4">
                  Reset Dashboard
                </button> */}
              </section>

              {filteredData.length > 0 && (
                <section id="graphs">
                  <h3 className="text-2xl font-semibold mb-4">Sensor Graphs</h3>
                  <Line
                    data={{
                      labels: filteredData.map((row) => row.timestamp),
                      datasets: [
                        {
                          label: "Temperature",
                          data: filteredData.map((row) => row.temperature),
                          borderColor: "orange",
                          backgroundColor: "rgba(255,165,0,0.2)",
                          tension: 0.3,
                        },
                        {
                          label: "Vibration",
                          data: filteredData.map((row) => row.vibration),
                          borderColor: "green",
                          backgroundColor: "rgba(0,128,0,0.2)",
                          tension: 0.3,
                        },
                        {
                          label: "Pressure",
                          data: filteredData.map((row) => row.pressure),
                          borderColor: "blue",
                          backgroundColor: "rgba(0,0,255,0.2)",
                          tension: 0.3,
                        },
                      ],
                    }}
                  />
                </section>
              )}
            </>
          )}
          <div className="lg:hidden">
            <button
             onClick={() => alert("Mobile menu coming soon!")}
            className="text-sm bg-gray-700 px-2 py-1 rounded text-white"
              >
            ☰ Menu
            </button>
          </div>

          {filteredData.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">📈 Forecast Trends</h2>
              <TrendForecastChart data={filteredData} metric="temperature" />
              <TrendForecastChart data={filteredData} metric="vibration" />
              <TrendForecastChart data={filteredData} metric="pressure" />
            </section>
          )}

          {filteredData.length === 0 && data.length > 0 && (
              <div className="text-yellow-500 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300 p-2 rounded">
               ⚠️ No data available for the selected date range. Try adjusting your date range above.
              </div>
          )}
          {filteredData.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">📊 Compare Sensor Trends</h2>
              <select
                multiple
                className="w-full md:w-1/2 p-2 border border-gray-300 rounded dark:border-gray-600"
                value={selectedMetrics}
                onChange={(e) =>
                  setSelectedMetrics(Array.from(e.target.selectedOptions, (opt) => opt.value))
                }
              >
                <option value="temperature">Temperature</option>
                <option value="vibration">Vibration</option>
                <option value="pressure">Pressure</option>
              </select>
              <ComparativeLineChart data={filteredData} selectedMetrics={selectedMetrics} />
            </section>
          )}

          {nivoData.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-4">🔥 Anomaly Heatmap</h3>
              <AnomalyHeatmap data={nivoData} />
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
