// src/utils/rootCauseConfidence.ts

interface RootCauseEntry {
  
    metric: string;
    severity: string;
    time: string;
    timestamp?: string;
  }
  
  interface ScoredRootCause extends RootCauseEntry {
    confidence: number;
  }
  
  export function scoreRootCauses(entries: RootCauseEntry[]): ScoredRootCause[] {
    return entries.map((entry) => {
      let baseScore = 0;
  
      switch (entry.severity) {
        case "High":
          baseScore = 0.7;
          break;
        case "Medium":
          baseScore = 0.5;
          break;
        case "Low":
        default:
          baseScore = 0.3;
      }
  
      // Add a small boost based on metric type
      if (entry.metric === "Temperature") baseScore += 0.05;
      if (entry.metric === "Vibration") baseScore += 0.03;
      if (entry.metric === "Pressure") baseScore += 0.02;
  
      // Add a little randomness for realism
      const randomBoost = Math.random() * 0.1; // 0 to 0.1
      const finalScore = Math.min(1, baseScore + randomBoost);
  
      return {
        ...entry,
        confidence: parseFloat(finalScore.toFixed(2)),
      };
    });
  }
  