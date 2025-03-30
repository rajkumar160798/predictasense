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

const getYAxisTitle = (metrics: string[]): string => {
  if (metrics.length === 1) {
    switch (metrics[0]) {
      case 'temperature':
        return 'Temperature (°C)';
      case 'vibration':
        return 'Vibration';
      case 'pressure':
        return 'Pressure (kPa)';
      default:
        return 'Sensor Value';
    }
  }
  return 'Sensor Values';
};

const ComparativeLineChart: React.FC<Props> = ({ data, selectedMetrics }) => {
  if (!data || data.length === 0 || selectedMetrics.length === 0) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded shadow mt-6 text-center text-yellow-800 dark:text-yellow-100">
        No data available for selected metrics.
      </div>
    );
  }

  const chartData = {
    labels: data.map((row) => row.timestamp),
    datasets: selectedMetrics.map((metric) => ({
      label: metric.charAt(0).toUpperCase() + metric.slice(1),
      data: data.map((row) => row[metric as keyof SensorRow] as number),
      borderColor: colorMap[metric],
      backgroundColor: `${colorMap[metric]}44`,
      tension: 0.3,
    })),
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
          text: "Sensor Value",
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
    <div className="w-full">
      <Line data={chartData} options={options} />
    </div>
  );
  

};

export default ComparativeLineChart;
