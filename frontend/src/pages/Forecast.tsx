import React, { useEffect, useState } from "react";
import { Range } from "react-date-range";
import { parseISO, isWithinInterval, addDays } from "date-fns";
import DateRangePicker from "../components/DateRangePicker";
import TrendForecastChart from "../components/TrendForecastChart";
import ComparativeLineChart from "../components/ComparativeLineChart";
import AnomalyHeatmap from "../components/AnomalyHeatmap";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

interface NivoRow {
  hour: string;
  Temperature: number;
  Vibration: number;
  Pressure: number;
}

const Forecast: React.FC = () => {
  const [rawData, setRawData] = useState<SensorRow[]>([]);
  const [filteredData, setFilteredData] = useState<SensorRow[]>([]);
  const [nivoData, setNivoData] = useState<NivoRow[]>([]);
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [selectedChart, setSelectedChart] = useState<string>("");

  // Load data from localStorage on mount
  useEffect(() => {
    const sensor = localStorage.getItem("sensorData");
    const nivo = localStorage.getItem("nivoData");

    if (sensor) {
      setRawData(JSON.parse(sensor));
    }

    if (nivo) {
      setNivoData(JSON.parse(nivo));
    }
  }, []);

  // Filter sensor data by selected date range
  useEffect(() => {
    const start = range[0].startDate;
    const end = range[0].endDate;
    if (!start || !end) return;

    const filtered = rawData.filter((row) => {
      const ts = parseISO(row.timestamp);
      return isWithinInterval(ts, { start, end });
    });

    setFilteredData(filtered);
  }, [range, rawData]);

  const chartOptions = [
    { label: "📈 Trend Forecast - Temperature", value: "temperature" },
    { label: "🎚️ Trend Forecast - Vibration", value: "vibration" },
    { label: "📉 Trend Forecast - Pressure", value: "pressure" },
    { label: "🔥 Anomaly Heatmap", value: "heatmap" },
    { label: "📊 Comparative Trends", value: "compare" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-4">📊 Forecast Dashboard</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
        <h2 className="text-xl font-semibold mb-2">📅 Select Date Range</h2>
        <DateRangePicker range={range} setRange={setRange} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">📊 Choose a Chart</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {chartOptions.map((opt) => (
            <button
              key={opt.value}
              className={`p-4 rounded shadow text-left border hover:bg-blue-100 dark:hover:bg-blue-800 transition ${
                selectedChart === opt.value
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-black dark:text-white"
              }`}
              onClick={() => setSelectedChart(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length === 0 && (
        <div className="text-yellow-500 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300 p-2 rounded">
          ⚠️ No data found in selected date range.
        </div>
      )}

      {selectedChart === "temperature" && (
        <TrendForecastChart data={filteredData} metric="temperature" />
      )}
      {selectedChart === "vibration" && (
        <TrendForecastChart data={filteredData} metric="vibration" />
      )}
      {selectedChart === "pressure" && (
        <TrendForecastChart data={filteredData} metric="pressure" />
      )}
      {selectedChart === "compare" && (
        <ComparativeLineChart
          data={filteredData}
          selectedMetrics={["temperature", "vibration", "pressure"]}
        />
      )}
      {selectedChart === "heatmap" && nivoData.length > 0 && (
        <AnomalyHeatmap
          data={nivoData.map(({ hour, ...metrics }) => ({
            hour,
            ...metrics,
          }))}
        />
      )}
    </div>
  );
};

export default Forecast;
