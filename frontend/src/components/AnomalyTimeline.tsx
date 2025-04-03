// src/components/AnomalyTimeline.tsx
import React, { useEffect, useRef } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

interface AnomalyInsight {
  time: string;
  metric: string;
  severity: string;
  description: string;
}

interface Props {
  insights: AnomalyInsight[];
}

const AnomalyTimeline: React.FC<Props> = ({ insights }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = new DataSet(
      insights.map((item, idx) => ({
        id: idx,
        content: `🔥 ${item.metric}`,
        start: new Date(item.time),
        group: item.metric,
        title: `${item.description} (${item.severity})`,
        className:
          item.severity === "High"
            ? "red-dot"
            : item.severity === "Medium"
            ? "orange-dot"
            : "green-dot",
      }))
    );

    const groups = new DataSet([
      { id: "Temperature", content: "🌡 Temperature" },
      { id: "Pressure", content: "💨 Pressure" },
      { id: "Vibration", content: "🔧 Vibration" },
    ]);

    const timeline = new Timeline(containerRef.current, items, groups, {
      stack: false,
      groupOrder: "id",
      selectable: false,
      multiselect: false,
      zoomable: true,
    });

    return () => {
      timeline.destroy();
    };
  }, [insights]);

  return (
    <div>
      <h3 className="text-xl font-bold text-purple-700 mb-4">
        📍 Interactive Anomaly Timeline
      </h3>
      <div
        ref={containerRef}
        style={{ height: "400px", background: "white", borderRadius: "8px" }}
      />
      <style>{`
        .red-dot { background-color: #dc2626; color: white; border-radius: 8px; padding: 4px; }
        .orange-dot { background-color: #f97316; color: white; border-radius: 8px; padding: 4px; }
        .green-dot { background-color: #16a34a; color: white; border-radius: 8px; padding: 4px; }
      `}</style>
    </div>
  );
};

export default AnomalyTimeline;
