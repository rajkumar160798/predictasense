// src/types/index.ts

export type SeverityLevel = "Low" | "Medium" | "High";

export interface AnomalyInsight {
  time: string;
  metric: string;
  severity: SeverityLevel;
  description: string;
}


// New interface for root cause data
export interface RootCauseEntry {
  time: string;
  metric: string;
  severity: SeverityLevel;
  rootCause: string;
  timestamp?: string; // optional field to store actual timestamp
}

// Optional: if your confidence scoring is separate
export interface RootCauseConfidence {
  time: string;
  metric: string;
  severity: SeverityLevel;
  rootCause: string;
  confidence: number; // 0–100 scale
}