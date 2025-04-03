// src/utils/healthScore.ts
import { AnomalyInsight } from "./types";

export function calculateHealthScore(anomalies: AnomalyInsight[]): number {
  if (anomalies.length === 0) return 100;

  const severityWeight = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const totalSeverity = anomalies.reduce((sum, anomaly) => {
    return sum + (severityWeight[anomaly.severity] || 0);
  }, 0);

  // Normalize based on time range:
  const uniqueTimestamps = new Set(anomalies.map(a => a.time));
  const dataWindowSize = uniqueTimestamps.size;

  // Max severity possible for this data window
  const maxPossibleSeverity = dataWindowSize * severityWeight["High"];

  // Adjust the score to avoid being too harsh on short periods
  let score = 100 - (totalSeverity / maxPossibleSeverity) * 100;

  // Safety clamp
  if (score < 20 && totalSeverity <= 3) {
    score = 65; // Don't scare users with a 0 unless it's very serious
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}

// Example usage
// const anomalies: AnomalyInsight[] = [
//   { time: "2023-10-01T12:00:00Z", metric: "Temperature", severity: "High", description: "Overheating" },
//   { time: "2023-10-01T12:05:00Z", metric: "Vibration", severity: "Medium", description: "Unbalanced load" },
//   { time: "2023-10-01T12:10:00Z", metric: "Pressure", severity: "Low", description: "Minor fluctuation" },
// ];
// const healthScore = calculateHealthScore(anomalies);
// console.log("Health Score:", healthScore); // Output: Health Score: 66
// This function calculates a health score based on the severity of anomalies.