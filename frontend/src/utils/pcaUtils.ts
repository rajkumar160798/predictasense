import { PCA } from 'ml-pca';

interface Anomaly {
  temperature: number;
  vibration: number;
  pressure: number;
  cluster: number;
  timestamp: string;
}

export function get2DClusterData(anomalies: Anomaly[]) {
  if (!anomalies || anomalies.length === 0) return [];

  const features = anomalies.map((a) => [a.temperature, a.vibration, a.pressure]);
  const pca = new PCA(features);

  const projected = pca.predict(features, { nComponents: 2 }); // ✅ Project to 2D

  return anomalies.map((a, i) => ({
    x: projected.get(i, 0),
    y: projected.get(i, 1),
    cluster: a.cluster,
    timestamp: a.timestamp,
  }));
}

// ✅ 2. Helper to convert to a metric → score map (used for prioritization)