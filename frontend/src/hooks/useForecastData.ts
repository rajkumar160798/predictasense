import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { AnomalyInsight } from "../utils/types";

export default function useForecastData() {
  const sensorData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("sensorData") || "[]");
    } catch (err) {
      console.error("❌ Failed to parse sensor data:", err);
      return [];
    }
  }, []);

  const anomalyInsights: AnomalyInsight[] = useMemo(() => {
    const insights: AnomalyInsight[] = [];

    sensorData.forEach((row: any) => {
      const time = format(parseISO(row.timestamp), "yyyy-MM-dd HH:mm");

      if (row.temperature > 80) {
        insights.push({
          time,
          metric: "Temperature",
          severity: "High",
          description: "Overheating detected. Consider cooling inspection.",
        });
      }

      if (row.vibration > 0.07) {
        insights.push({
          time,
          metric: "Vibration",
          severity: "Medium",
          description: "Unusual vibration. Possible imbalance or wear.",
        });
      }

      if (row.pressure > 1015) {
        insights.push({
          time,
          metric: "Pressure",
          severity: "Medium",
          description: "Pressure exceeds expected limits. Check for blockages.",
        });
      }
    });

    return insights;
  }, [sensorData]);

  return {
    sensorData,
    anomalyInsights,
  };
}
