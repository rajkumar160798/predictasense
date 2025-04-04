import { db } from "../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const addCommentToAnomaly = async (anomalyId: string, comment: any) => {
  try {
    await addDoc(collection(db, `anomalies/${anomalyId}/comments`), {
      ...comment,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

// export const getCommentsForAnomaly = async (anomalyId: string) => {
//   try {
//     const commentsSnapshot = await collection(db, `anomalies/${anomalyId}/comments`).get();
//     const comments = commentsSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     return comments;
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return [];
//   }
// };