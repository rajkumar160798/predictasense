// src/pages/Upload.tsx
import React, { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import backgroundImage from "../assets/machine-background.jpg"; 
import Sidebar from "../components/Sidebar";
import { db } from "../utils/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import 'animate.css';
import { sendSlackAlert } from "../utils/sendSlackAlert";

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

        parsed.forEach(async (row) => {
          try {
            if (row.temperature > 80 || row.vibration > 0.07 || row.pressure > 1015) {
              const severity = row.temperature > 90 ? "High" : "Moderate";
              const confidence = 0.9; // You can calculate this based on rules if needed
        
              await addDoc(collection(db, "anomalies"), {
                timestamp: row.timestamp,
                temperature: row.temperature,
                vibration: row.vibration,
                pressure: row.pressure,
                severity,
                confidence,
              });
              if (severity === "High") {
                sendSlackAlert({
                  timestamp: row.timestamp,
                  temperature: row.temperature,
                  pressure: row.pressure,
                  vibration: row.vibration,
                  severity,
                  confidence,
                });
              }
            }
          } catch (error) {
            console.error("Error uploading to Firestore:", error);
          }
        });
        console.log("Synced anomalies to Firestore.");

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
    <div
      className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
          {/*Sidebar */}
          <Sidebar />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 opacity-100 z-0"></div>

      {/* Content */}
      <div className="z-10 p-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-6">Upload Sensor Data</h1>

        <div className="bg-purple-50 border border-purple-300 rounded-lg p-4 mb-10 shadow">
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

        <div className="flex flex-col items-center">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-white text-purple-700 px-4 py-2 rounded shadow-md hover:bg-purple-400 hover:shadow-lg transition"
          >
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
            </div>

        {data.length > 0 && (
          <div className="mt-6">
            <p className="text-2xl font-bold text-green-400 mb-4">✅ File uploaded successfully.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-10 py-4 rounded-full text-xl shadow-md hover:scale-105 transition-transform"
            >
              Continue to Dashboard →
            </button>
          </div>         
        )}
      </div>
      {/* Background Image Layer */}
      <img
        src={backgroundImage}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        style={{ filter: "brightness(0.4)" }}
      />
    </div>
  );
};

export default Upload;
