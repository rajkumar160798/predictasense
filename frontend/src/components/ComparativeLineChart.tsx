// src/components/ComparativeLineChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

interface Props {
  data: SensorRow[];
  selectedMetrics: string[];
}

const colorMap: Record<string, string> = {
  temperature: 'orange',
  vibration: 'green',
  pressure: 'blue',
};

const ComparativeLineChart: React.FC<Props> = ({ data, selectedMetrics }) => {
  const chartData = {
    labels: data.map(row => row.timestamp),
    datasets: selectedMetrics.map(metric => ({
      label: metric.charAt(0).toUpperCase() + metric.slice(1),
      data: data.map(row => row[metric as keyof SensorRow] as number),
      borderColor: colorMap[metric],
      backgroundColor: `${colorMap[metric]}44`,
      tension: 0.3,
    })),
  };

  return <Line data={chartData} />;
};

export default ComparativeLineChart;
