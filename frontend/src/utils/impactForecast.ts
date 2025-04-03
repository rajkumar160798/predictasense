// utils/impactForecast.ts
import { parseISO } from "date-fns";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

interface ImpactEntry {
  time: string;
  metric: string;
  impact: string;
  riskScore: number;
}

export function computeAnomalyImpact(data: SensorRow[]): ImpactEntry[] {
  const impacts: ImpactEntry[] = [];

  for (const row of data) {
    const time = parseISO(row.timestamp).toISOString();

    if (row.temperature > 80) {
      impacts.push({
        time,
        metric: "Temperature",
        impact: "High energy consumption, possible component wear.",
        riskScore: 90,
      });
    }

    if (row.vibration > 0.07) {
      impacts.push({
        time,
        metric: "Vibration",
        impact: "Potential misalignment or bearing failure.",
        riskScore: 75,
      });
    }

    if (row.pressure > 1015) {
      impacts.push({
        time,
        metric: "Pressure",
        impact: "System strain, could lead to leakage or failure.",
        riskScore: 60,
      });
    }
  }

  return impacts;
}

// ✅ 2. Helper to convert to a metric → score map (used for prioritization)
export function getImpactScorePerMetric(entries: ImpactEntry[]): { [metric: string]: number } {
  const impactMap: { [metric: string]: number[] } = {};

  for (const entry of entries) {
    if (!impactMap[entry.metric]) {
      impactMap[entry.metric] = [];
    }
    impactMap[entry.metric].push(entry.riskScore);
  }

  const averagedImpact: { [metric: string]: number } = {};
  for (const metric in impactMap) {
    const scores = impactMap[metric];
    const avg = scores.reduce((sum, val) => sum + val, 0) / scores.length;
    averagedImpact[metric] = parseFloat((avg / 100).toFixed(2)); // Normalize to 0–1
  }

  return averagedImpact;
}