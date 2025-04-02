// src/utils/healthScore.ts
import { AnomalyInsight } from "./types";

export function calculateHealthScore(anomalies: AnomalyInsight[]): number {
  if (anomalies.length === 0) return 100;

  const severityWeight = {
    High: 3,
    Medium: 2,
    Low: 1, // for future use
  };

  const totalWeight = anomalies.reduce((acc, a) => {
    return acc + (severityWeight[a.severity] || 0);
  }, 0);

  const maxWeight = anomalies.length * 3; // all High = worst case

  const score = Math.max(0, Math.round(100 - (totalWeight / maxWeight) * 100));
  return score;
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