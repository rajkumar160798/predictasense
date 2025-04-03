import React from 'react';
import Plot from 'react-plotly.js';

interface Point {
  x: number;
  y: number;
  cluster: string;
  timestamp: string;
}

interface Props {
  points: Point[];
}

const ClusterPCAPlot: React.FC<Props> = ({ points }) => {
  const clusters = Array.from(new Set(points.map((p) => p.cluster)));

  const data: Partial<Plotly.ScatterData>[] = clusters.map((clusterId) => {
    const clusterPoints = points.filter((p) => p.cluster === clusterId);
    return {
      x: clusterPoints.map((p) => p.x),
      y: clusterPoints.map((p) => p.y),
      text: clusterPoints.map((p) => p.timestamp),
      mode: 'markers',
      type: 'scatter',
      name: `Cluster ${clusterId}`,
      marker: { size: 10 },
    };
  });

  return (
    <Plot
      data={data}
      layout={{
        title: '🧬 Anomaly Cluster Visualization (PCA)',
        xaxis: { title: 'PC1' },
        yaxis: { title: 'PC2' },
        height: 400,
      }}
      style={{ width: '100%' }}
    />
  );
};

export default ClusterPCAPlot;
