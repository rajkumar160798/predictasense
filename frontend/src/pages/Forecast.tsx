// src/pages/Forecast.tsx
import React, { useState } from "react";
import Papa from "papaparse";
import { parseISO } from "date-fns";
import TrendForecastChart from "../components/TrendForecastChart";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

const Forecast: React.FC = () => {
  const [data, setData] = useState<SensorRow[]>([]);

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
        setData(parsed.filter((row) => parseISO(row.timestamp))); // clean timestamps
      },
    });
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">📈 Forecast Trends</h1>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="border p-2 rounded"
        />
      </div>

      {data.length > 0 ? (
        <>
          <TrendForecastChart data={data} metric="temperature" />
          <TrendForecastChart data={data} metric="vibration" />
          <TrendForecastChart data={data} metric="pressure" />
        </>
      ) : (
        <div className="text-gray-500 dark:text-gray-400">
          Upload CSV file to view forecast charts.
        </div>
      )}
    </div>
  );
};

export default Forecast;
