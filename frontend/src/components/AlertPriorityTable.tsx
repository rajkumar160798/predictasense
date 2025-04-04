// src/components/AlertPriorityTable.tsx
import React from "react";

interface Alert {
  metric: string;
  severityWeight: number;
  frequency: number;
  impactScore: number;
  finalScore: number;
}

interface Props {
  alerts: Alert[];
}

const AlertPriorityTable: React.FC<Props> = ({ alerts }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-xl">
        <thead>
          <tr className="bg-purple-100 text-purple-800 text-left">
            <th className="p-2 px-4 text-gray-800">Metric</th>
            <th className="p-2 px-4 text-gray-800">Severity Score</th>
            <th className="p-2 px-4 text-gray-800">Frequency</th>
            <th className="p-2 px-4 text-gray-800">Impact</th>
            <th className="p-2 px-4 text-gray-800">Priority Score</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 font-semibold">{alert.metric}</td>
              <td className="p-2 px-4 text-gray-800">{alert.severityWeight}</td>
              <td className="p-2 px-4 text-gray-800">{alert.frequency}</td>
              <td className="p-2 px-4 text-gray-800">{alert.impactScore.toFixed(2)}</td>
              <td className="p-2 text-red-600 font-bold">{alert.finalScore.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertPriorityTable;
