// src/utils/rootCauseConfidence.ts

interface RootCauseEntry {
    metric: string;
    severity: string;
    time: string;
    timestamp: string;
  }
  
  interface ScoredRootCause extends RootCauseEntry {
    confidence: number;
  }
  
  export function scoreRootCauses(entries: RootCauseEntry[]): ScoredRootCause[] {
    return entries.map((entry) => {
      let baseScore = 0;
  
      switch (entry.severity) {
        case "High":
          baseScore = 0.9;
          break;
        case "Medium":
          baseScore = 0.6;
          break;
        case "Low":
        default:
          baseScore = 0.3;
      }
  
      // You can add more scoring logic here if needed
      return {
        ...entry,
        confidence: parseFloat(baseScore.toFixed(2)),
      };
    });
  }
  