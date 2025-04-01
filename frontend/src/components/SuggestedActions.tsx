// src/components/SuggestedActions.tsx
// This component displays suggested actions based on the provided actions array.
// Each action is displayed with its metric, severity, and suggestion in a styled box.
// The component checks if there are any actions to display and renders them accordingly.
// The actions are styled with a light blue background and a blue left border for emphasis.

import React from "react";
import { SuggestedAction } from "../utils/suggestedActions";

interface Props {
  actions: SuggestedAction[];
}

const SuggestedActions: React.FC<Props> = ({ actions }) => {
  console.log("Rendering Suggested Actions:", actions); // Debugging log

  if (actions.length === 0) return <p className="text-center text-gray-600">No suggested actions found.</p>;

  return (
    <div className="space-y-4">
      {actions.map((action, index) => (
        <div
          key={index}
          className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded shadow-sm"
        >
          <p className="text-sm text-gray-500">{action.metric} - {action.severity}</p>
          <p className="font-semibold text-blue-900">{action.suggestion}</p>
        </div>
      ))}
    </div>
  );
};

export default SuggestedActions;
