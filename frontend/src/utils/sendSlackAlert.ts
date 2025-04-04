export async function sendSlackAlert(anomaly: {
    timestamp: string;
    temperature: number;
    pressure: number;
    vibration: number;
    severity: string;
    confidence: number;
  }) {
    const message = {
      text: `⚠️ *High Risk Anomaly Detected*\n• Timestamp: ${anomaly.timestamp}\n• Temp: ${anomaly.temperature}°C\n• Pressure: ${anomaly.pressure}\n• Vibration: ${anomaly.vibration}\n• Severity: ${anomaly.severity}\n• Confidence: ${anomaly.confidence}`,
    };
  
    try {
      const res = await fetch("http://localhost:3001/slack-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
  
      if (!res.ok) {
        throw new Error("Failed to send Slack alert");
      }
      console.log("✅ Slack alert sent via proxy");
    } catch (err) {
      console.error("Slack error:", err);
    }
  }
  