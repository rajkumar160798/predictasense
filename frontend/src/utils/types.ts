// src/types/index.ts

export type SeverityLevel = "Low" | "Medium" | "High";

export interface AnomalyInsight {
  time: string;
  metric: string;
  severity: SeverityLevel;
  description: string;
}
