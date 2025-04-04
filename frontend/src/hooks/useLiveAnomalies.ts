import { useEffect, useState } from "react";
import { onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "../utils/firebase";

const useLiveAnomalies = () => {
  const [liveData, setLiveData] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "anomalies"), orderBy("timestamp", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLiveData(updates);
    });

    return () => unsubscribe();
  }, []);

  return liveData;
};

export default useLiveAnomalies;
