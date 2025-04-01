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
