// src/pages/Upload.tsx
import React, { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

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

const Upload: React.FC = () => {
  const [data, setData] = useState<SensorRow[]>([]);
  const navigate = useNavigate();

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
        localStorage.setItem("sensorData", JSON.stringify(parsed));

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

        localStorage.setItem("nivoData", JSON.stringify(transformed));
      },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-800 mb-4">Upload Sensor Data</h1>

      <div className="bg-purple-50 border border-purple-300 rounded-lg p-4 mb-4 shadow">
        <p className="text-gray-700 mb-2">
          📄 Upload a <strong>.csv</strong> file with the following headers:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li><strong>timestamp</strong> (e.g., 2024-01-01T00:00:00Z)</li>
          <li><strong>temperature</strong> (in °C)</li>
          <li><strong>vibration</strong> (in g-force)</li>
          <li><strong>pressure</strong> (in hPa)</li>
        </ul>
      </div>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="p-2 border border-purple-300 rounded w-full max-w-md"
      />

      {data.length > 0 && (
        <div className="mt-6">
          <p className="text-green-600 mb-4">✅ File uploaded successfully.</p>
          <button
            onClick={() => navigate("/forecast")}
            className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition"
          >
            Continue to Forecast →
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
