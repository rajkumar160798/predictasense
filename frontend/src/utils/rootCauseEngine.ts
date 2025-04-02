import { AnomalyInsight } from "../utils/types";

export interface RootCause {
  timestamp: string;
  metric: string;
  severity: string;
  rootCause: string;
}

export function generateRootCauses(anomalies: AnomalyInsight[]): RootCause[] {
  console.log("Generating Root Causes for:", anomalies); // Debugging log

  if (!anomalies || anomalies.length === 0) {
    console.log("No anomalies provided for root cause generation."); // Debugging log
    return [];
  }

  const rootCauses: RootCause[] = anomalies.map((anomaly) => {
    let rootCause = "";

    if (anomaly.metric === "Temperature") {
      rootCause =
        anomaly.severity === "High"
          ? "Overheating due to insufficient cooling."
          : "Minor temperature fluctuations.";
    } else if (anomaly.metric === "Vibration") {
      rootCause =
        anomaly.severity === "Medium"
          ? "Possible imbalance in rotating components."
          : "Minor vibration due to normal operation.";
    } else if (anomaly.metric === "Pressure") {
      rootCause =
        anomaly.severity === "Medium"
          ? "Potential blockage or leak in the system."
          : "Minor pressure variations.";
    }

    return {
      timestamp: anomaly.time,
      metric: anomaly.metric,
      severity: anomaly.severity,
      rootCause,
    };
  });

  console.log("Generated Root Causes:", rootCauses); // Debugging log
  return rootCauses;
}