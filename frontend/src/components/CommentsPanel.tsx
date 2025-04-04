import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";


interface Comment {
  id?: string;
  text: string;
  username: string;
  role: string;
  timestamp: any;
}

interface CommentsPanelProps {
    anomalyId: string; // Firestore doc ID for the anomaly
  }
  
  const CommentsPanel: React.FC<CommentsPanelProps> = ({ anomalyId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
  
    useEffect(() => {
      const q = query(
        collection(db, `anomalies/${anomalyId}/comments`),
        orderBy("timestamp", "desc")
      );
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];
        setComments(fetchedComments);
      });
  
      return () => unsubscribe();
    }, [anomalyId]);
  
    const handleSubmit = async () => {
      if (!newComment.trim()) return;
  
      await addDoc(collection(db, `anomalies/${anomalyId}/comments`), {
        text: newComment,
        username: "Raj",
        role: "Engineer",
        timestamp: new Date().toISOString(),
      });
  
      setNewComment("");
    };
  
    return (
      <div className="bg-white p-4 rounded-lg shadow mt-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-purple-700">💬 Comments</h2>
  
        <div className="space-y-3 max-h-[250px] overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="border-b pb-2">
              <p className="text-sm text-gray-700">{c.text}</p>
              <p className="text-xs text-gray-500">
                👤 {c.username} ({c.role}) • 🕒 {new Date(c.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
  
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow border border-purple-300 rounded px-3 py-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            Send
          </button>
        </div>
      </div>
    );
  };
  
  export default CommentsPanel;
  