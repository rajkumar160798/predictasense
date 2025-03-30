import React from "react";
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap";

interface HeatmapProps {
  data: {
    hour: string;
    [key: string]: string | number;
  }[];
}

const AnomalyHeatmap: React.FC<HeatmapProps> = ({ data }) => {
  const transformed = ["Temperature", "Vibration", "Pressure"].map((metric) => ({
    id: metric,
    data: data.map((item) => ({
      x: item.hour,
      y: item[metric] as number,
    })),
  }));

  return (
    <div style={{ height: 400, overflowX: "auto" }}>
      <ResponsiveHeatMapCanvas
        data={transformed}
        valueFormat=".0f"
        margin={{ top: 60, right: 90, bottom: 60, left: 100 }}
        colors={({ value }) => (value === 1 ? "#d90429" : "#f8f9fa")} // Red for anomalies
        enableLabels={false}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 45,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
        }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
        animate={true}
        motionConfig="wobbly"
        tooltip={({ cell }) => (
          <strong>
            {cell.serieId} at {cell.x}: {cell.value === 1 ? "Anomaly" : "Normal"}
          </strong>
        )}
      />
    </div>
  );
};

export default AnomalyHeatmap;
