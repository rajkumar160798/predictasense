// src/components/RootCauseConfidenceTable.tsx
import React from "react";

interface RootCauseEntry {
  timestamp?: string;
  metric: string;
  severity: string;
  time: string;
  confidence: number;
}

interface Props {
  entries: RootCauseEntry[];
}

const RootCauseConfidenceTable: React.FC<Props> = ({ entries }) => {
  return (
    <table className="w-full text-left border border-gray-300 mt-4">
      <thead className="bg-purple-100">
        <tr>
          <th className="p-2 text-purple-700">Metric</th>
          <th className="p-2 text-purple-700">Severity</th>
          <th className="p-2 text-purple-700">Time</th>
          <th className="p-2 text-purple-700">Confidence Score</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((row, idx) => (
          <tr key={idx} className="border-b border-gray-200">
            <td className="p-2 px-4 text-gray-800">{row.metric}</td>
            <td className="p-2 px-4 text-gray-800">{row.severity}</td>
            <td className="p-2 px-4 text-gray-800">{row.time}</td>
            <td
              className={`p-2 font-bold ${
                row.confidence > 0.75
                  ? "text-red-600"
                  : row.confidence > 0.5
                  ? "text-orange-500"
                  : "text-green-600"
              }`}
            >
              {row.confidence}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RootCauseConfidenceTable;
