// src/pages/Upload.tsx
import React, { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Upload as UploadIcon, ArrowRight,Sun,Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from "../utils/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import 'animate.css';
import { sendSlackAlert } from "../utils/sendSlackAlert";
import { useTheme } from '../context/ThemeContext';

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
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const { theme, toggleTheme } = useTheme();
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) handleFileUpload(files[0]);
  };

  const handleFileUpload = (file: File) => {
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

        // Process anomalies and update Firestore
        parsed.forEach(async (row) => {
          try {
            if (row.temperature > 80 || row.vibration > 0.07 || row.pressure > 1015) {
              const severity = row.temperature > 90 ? "High" : "Moderate";
              const confidence = 0.9;
        
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

        // Process heatmap data
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center relative">
          <button
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 border border-gray-200 shadow-sm
            dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white ">
            Upload Your Sensor Data
          </h1>
          <p className="text-gray-600 dark:text-white ">
            Upload your CSV file to start analyzing your machine's performance
          </p>
        </header>

        <main>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm
            dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-700  dark:text-white mb-2 flex items-center gap-2">
                <span className="text-blue-500">📄</span> Your CSV file should have these headers:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-white space-y-1">
                <li><strong className="text-gray-900 dark:text-white">timestamp</strong> (e.g., 2024-01-01T00:00:00Z)</li>
                <li><strong className="text-gray-900 dark:text-white  ">temperature</strong> (in °C)</li>
                <li><strong className="text-gray-900 dark:text-white  ">vibration</strong> (in g-force)</li>
                <li><strong className="text-gray-900 dark:text-white  ">pressure</strong> (in hPa)</li>
              </ul>
            </div>

            <div
              className={`
                border-2 border-dashed rounded-xl p-12 text-center
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                transition-all duration-300 ease-in-out
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-8 rounded-lg bg-white border border-gray-100 shadow-sm
                dark:bg-gray-800 dark:border-gray-700">
                <UploadIcon className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white ">Upload Your Data</h2>
                <p className="text-gray-600 dark:text-white  mb-6">
                  Drag and drop your CSV file here, or click to select
                </p>
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer font-semibold shadow-sm"
                >
                  Choose File <ArrowRight className="ml-2 w-4 h-4" />
                </label>
              </div>
            </div>

            {data.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                <div className="bg-white border border-green-200 p-6 rounded-lg shadow-sm
                dark:bg-gray-800 dark:border-green-700">
                  <p className="text-2xl font-bold mb-2 text-green-600">✅ File Upload Successful!</p>
                  <p className="mb-4 text-gray-700 dark:text-white ">Your sensor data has been processed and is ready for analysis.</p>
                  <ul className="text-sm space-y-2 text-gray-600 dark: ">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span><span className="text-gray-900 dark:text-white "> {data.length} data points processed </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span><span className="text-gray-900 dark:text-white ">  Anomaly detection complete</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> <span className="text-gray-900 dark:text-white "> Heatmap data generated</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-blue-500 text-white px-10 py-4 rounded-xl text-xl shadow-sm hover:shadow-blue-500/50 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  Continue to Dashboard <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-100 pt-8 pb-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <UploadIcon className="w-6 h-6 text-blue-500" />
              <span className="text-gray-900 font-semibold dark:text-white ">ProvansIQ</span>
            </div>
            <p className="text-gray-600 text-sm text-center">
              Empowering Industry 4.0 with Advanced Predictive Maintenance
            </p>
            <div className="mt-4 flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm">Contact</a>
            </div>
            <p className="mt-6 text-gray-500 text-sm">
              © 2024 ProvansIQ. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 left-6 p-3 rounded-full bg-gray-800 dark:bg-white text-white dark:text-gray-800 shadow-lg hover:scale-110 transition-transform"
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default Upload;
