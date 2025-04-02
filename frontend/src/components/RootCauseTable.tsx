import React from "react";
import { RootCause } from "../utils/rootCauseEngine";

interface Props {
  causes: RootCause[];
}

const RootCauseTable: React.FC<Props> = ({ causes }) => {
  console.log("Rendering Root Cause Table:", causes); // Debugging log

  if (causes.length === 0) {
    return <p className="text-center text-gray-600">No root cause data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-purple-200 text-purple-900">
            <th className="py-2 px-4 text-gray-800">Timestamp</th>
            <th className="py-2 px-4 text-gray-800">Metric</th>
            <th className="py-2 px-4 text-gray-800">Severity</th>
            <th className="py-2 px-4 text-gray-800">Root Cause</th>
          </tr>
        </thead>
        <tbody>
          {causes.map((cause, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2 px-4 text-gray-800">{cause.timestamp}</td>
              <td className="py-2 px-4 text-gray-800">{cause.metric}</td>
              <td className="py-2 px-4 text-gray-800">{cause.severity}</td>
              <td className="py-2 px-4 text-gray-800">{cause.rootCause}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RootCauseTable;
// This component displays a table of root causes.
// It takes an array of RootCause objects as props and renders them in a styled table.
// Each row represents a timestamp, metric, severity, and the identified root cause.