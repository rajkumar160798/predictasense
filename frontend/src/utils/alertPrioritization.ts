// src/utils/alertPrioritization.ts
import { AnomalyInsight } from "./types";

interface AlertScore {
  metric: string;
  severityWeight: number;
  frequency: number;
  impactScore: number;
  finalScore: number;
}

export function prioritizeAlerts(
  insights: AnomalyInsight[],
  impactMap: { [metric: string]: number }
): AlertScore[] {
  const severityWeights = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const alertMap: { [metric: string]: { totalSeverity: number; count: number } } = {};

  for (const insight of insights) {
    const metric = insight.metric;
    const weight = severityWeights[insight.severity] || 1;

    if (!alertMap[metric]) {
      alertMap[metric] = { totalSeverity: 0, count: 0 };
    }

    alertMap[metric].totalSeverity += weight;
    alertMap[metric].count += 1;
  }

  const results: AlertScore[] = Object.entries(alertMap).map(([metric, data]) => {
    const severityWeight = data.totalSeverity;
    const frequency = data.count;
    const impactScore = impactMap[metric] || 0;

    const finalScore = severityWeight * frequency * impactScore;
    return {
      metric,
      severityWeight,
      frequency,
      impactScore,
      finalScore,
    };
  });

  return results.sort((a, b) => b.finalScore - a.finalScore);
}