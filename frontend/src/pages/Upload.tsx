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

        // Generate nivoData (heatmap) for anomalies
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

        // ✅ Save anomaly heatmap data to localStorage
        localStorage.setItem("nivoData", JSON.stringify(transformed));
      },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Upload Sensor Data</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded w-full max-w-md"
      />

      {data.length > 0 && (
        <div className="mt-6">
          <p className="text-green-600 mb-4">✅ File uploaded successfully.</p>
          <button
            onClick={() => navigate("/forecast")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Continue to Forecast →
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
