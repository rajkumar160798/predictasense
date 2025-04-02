import React from "react";
import { AnomalyFrequency } from "../utils/anomalyFrequency";

interface Props {
  frequencies: AnomalyFrequency[];
}

const AnomalyFrequencyTable: React.FC<Props> = ({ frequencies }) => {
  if (frequencies.length === 0) return <p>No anomaly frequency data available.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-purple-200 text-purple-900">
            <th className="py-2 px-4 ">Metric</th>
            <th className="py-2 px-4 ">Severity</th>
            <th className="py-2 px-4 ">Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {frequencies.map((freq, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2 px-4">{freq.metric}</td>
              <td className="py-2 px-4">{freq.severity}</td>
              <td className="py-2 px-4">{freq.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnomalyFrequencyTable;
// This component displays a table of anomaly frequencies.
// It takes an array of AnomalyFrequency objects as props and renders them in a styled table.
// Each row represents a metric, its severity, and the number of occurrences.