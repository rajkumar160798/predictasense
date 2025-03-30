import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';

interface HeatmapProps {
  data: {
    hour: string;
    [key: string]: string | number;
  }[];
}

const AnomalyHeatmap: React.FC<HeatmapProps> = ({ data }) => {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveHeatMap
        data={['Temperature', 'Vibration', 'Pressure'].map((metric) => ({
          id: metric,
          data: data.map((item) => ({
            x: item.hour,
            y: item[metric] as number, // ✅ Cast to number
          })),
        }))}
        margin={{ top: 60, right: 90, bottom: 60, left: 100 }}
        colors={{ type: 'sequential', scheme: 'reds' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 45 }}
        axisLeft={{ tickSize: 5, tickPadding: 5 }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
        animate={true}
        motionConfig="wobbly"
      />
    </div>
  );
};

export default AnomalyHeatmap;
