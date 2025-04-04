import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase"; 

interface Anomaly {
  id: string;
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
  severity: string;
  confidence: number;
}

const useAnomaliesListener = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "anomalies"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Anomaly[];
      setAnomalies(docs);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return anomalies;
};

export default useAnomaliesListener;
