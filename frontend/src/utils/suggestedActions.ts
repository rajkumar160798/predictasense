import { AnomalyInsight, SeverityLevel } from "../utils/types";

export interface SuggestedAction {
  metric: string;
  severity: SeverityLevel;
  suggestion: string;
}

export function getSuggestedActions(anomalies: AnomalyInsight[]): SuggestedAction[] {
  if (!anomalies || anomalies.length === 0) {
    console.log("No anomalies provided for suggested actions."); // Debugging log
    return [];
  }

  const suggestions: SuggestedAction[] = [];

  for (const anomaly of anomalies) {
    let suggestion = "";

    if (anomaly.metric === "Temperature") {
      suggestion =
        anomaly.severity === "High"
          ? "🔧 Check cooling systems and fans."
          : "Monitor temperature closely.";
    } else if (anomaly.metric === "Vibration") {
      suggestion =
        anomaly.severity === "Medium"
          ? "🛠️ Inspect for imbalanced components or wear."
          : "Check mounting and alignment.";
    } else if (anomaly.metric === "Pressure") {
      suggestion =
        anomaly.severity === "Medium"
          ? "🧪 Check for leaks or blockages in the pipeline."
          : "Inspect pressure sensors.";
    }

    suggestions.push({
      metric: anomaly.metric,
      severity: anomaly.severity,
      suggestion,
    });
  }

  console.log("Generated Suggested Actions:", suggestions); // Debugging log
  return suggestions;
}
