import { AnomalyInsight } from "../utils/types";

export interface AnomalyFrequency {
  metric: string;
  severity: string;
  count: number;
}

export function calculateAnomalyFrequency(anomalies: AnomalyInsight[]): AnomalyFrequency[] {
  console.log("Calculating Anomaly Frequencies for:", anomalies); // Debugging log

  if (!anomalies || anomalies.length === 0) {
    console.log("No anomalies provided for frequency calculation."); // Debugging log
    return [];
  }

  const frequencyMap: { [key: string]: { [key: string]: number } } = {};

  anomalies.forEach((anomaly) => {
    if (!frequencyMap[anomaly.metric]) {
      frequencyMap[anomaly.metric] = {};
    }
    if (!frequencyMap[anomaly.metric][anomaly.severity]) {
      frequencyMap[anomaly.metric][anomaly.severity] = 0;
    }
    frequencyMap[anomaly.metric][anomaly.severity]++;
  });

  const frequencies: AnomalyFrequency[] = [];
  for (const metric in frequencyMap) {
    for (const severity in frequencyMap[metric]) {
      frequencies.push({
        metric,
        severity,
        count: frequencyMap[metric][severity],
      });
    }
  }

  console.log("Calculated Anomaly Frequencies:", frequencies); // Debugging log
  return frequencies;
}