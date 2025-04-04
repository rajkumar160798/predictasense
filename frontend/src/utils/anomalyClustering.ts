// utils/anomalyClustering.ts
import { kmeans } from "ml-kmeans";

interface SensorRow {
  temperature: number;
  vibration: number;
  pressure: number;
}

export const clusterAnomalies = (data: SensorRow[]) => {
  // Prepare input data for clustering
  const inputData = data.map((row) => [row.temperature, row.vibration, row.pressure]);

  // Ensure inputData is not empty
  if (inputData.length === 0) {
    console.warn("No data available for clustering.");
    return [];
  }

  try {
    // Perform k-means clustering with 3 clusters
    const clusters = kmeans(inputData, 3, {});

    console.log("Clustering Result:", clusters);

    // Map the clusters back to the original data
    return data.map((row, index) => ({
      ...row,
      cluster: clusters.clusters[index],
    }));
  } catch (error) {
    console.error("Error during clustering:", error);
    throw error;
  }
};
