// src/components/TrendForecastChart.tsx

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import regression from "regression";

// Register ChartJS components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

interface TrendForecastChartProps {
  data: SensorRow[];
  metric: "temperature" | "vibration" | "pressure";
}

const TrendForecastChart: React.FC<TrendForecastChartProps> = ({ data, metric }) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded shadow mt-6 text-center text-yellow-800 dark:text-yellow-100">
          No data available for {metric}.
        </div>
      );
    }
  
    const timestamps = data.map((d) => d.timestamp);
    const values = data.map((d) => d[metric]);
  
    const regressionPoints: [number, number][] = values.map((val, i) => [i, val]);
    const result = regression.linear(regressionPoints);
    const forecastValues = values.map((_, i) => result.predict(i)[1]);
  
    const chartData = {
      labels: timestamps,
      datasets: [
        {
          label: `${metric.charAt(0).toUpperCase() + metric.slice(1)} - Actual`,
          data: values,
          borderColor: "rgba(59,130,246,1)",
          backgroundColor: "rgba(59,130,246,0.2)",
          tension: 0.4,
        },
        {
          label: `${metric.charAt(0).toUpperCase() + metric.slice(1)} - Forecast`,
          data: forecastValues,
          borderColor: "rgba(239,68,68,1)",
          backgroundColor: "rgba(239,68,68,0.2)",
          borderDash: [6, 4],
          tension: 0.4,
        },
      ],
    };
  
    const options = {
        responsive: true,
        plugins: {
          legend: { position: "top" as const },
          tooltip: {
            callbacks: {
              title: (tooltipItems: any) => {
                return `Timestamp: ${tooltipItems[0].label}`;
              },
              label: (tooltipItem: any) => {
                return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
              },
            },
          },
        },
        interaction: {
          mode: "nearest" as const,
          axis: "x" as const,
          intersect: false,
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: metric.charAt(0).toUpperCase() + metric.slice(1),
            },
          },
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
        },
      };
  
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow mt-6">
        <h2 className="text-lg font-semibold mb-2">
          📈 Trend Forecast: {metric.charAt(0).toUpperCase() + metric.slice(1)}
        </h2>
        <Line data={chartData} options={options} />
      </div>
    );
  };
  ;

export default TrendForecastChart;
