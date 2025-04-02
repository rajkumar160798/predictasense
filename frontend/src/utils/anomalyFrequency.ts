import { AnomalyInsight } from "./types";

export interface AnomalyFrequency {
  metric: string;
  severity: string;
  count: number;
}

export function calculateAnomalyFrequency(insights: AnomalyInsight[]): AnomalyFrequency[] {
  const frequencyMap: { [key: string]: number } = {};

  for (const insight of insights) {
    const key = `${insight.metric}-${insight.severity}`;
    frequencyMap[key] = (frequencyMap[key] || 0) + 1;
  }

  // Convert to array
  return Object.entries(frequencyMap).map(([key, count]) => {
    const [metric, severity] = key.split("-");
    return { metric, severity, count };
  });
}
// Example usage
// const insights: AnomalyInsight[] = [
//   { time: "2023-10-01T12:00:00Z", metric: "Temperature", severity: "High", description: "High temperature detected" },
//   { time: "2023-10-01T12:05:00Z", metric: "Vibration", severity: "Medium", description: "Vibration detected" },