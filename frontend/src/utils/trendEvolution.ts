// src/utils/trendEvolution.ts
import { parseISO, format, getISOWeek } from "date-fns";

interface SensorRow {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
}

interface TrendPoint {
  week: string;
  value: number;
}

export function computeWeeklyTrends(
  data: SensorRow[],
  metric: "temperature" | "vibration" | "pressure"
): TrendPoint[] {
  const weeklyMap: { [week: string]: number[] } = {};

  data.forEach((row) => {
    const date = parseISO(row.timestamp);
    const week = `Week ${getISOWeek(date)} (${format(date, "yyyy")})`;

    if (!weeklyMap[week]) weeklyMap[week] = [];
    weeklyMap[week].push(row[metric]);
  });

  return Object.entries(weeklyMap).map(([week, values]) => ({
    week,
    value: parseFloat((values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2)),
  }));
}
