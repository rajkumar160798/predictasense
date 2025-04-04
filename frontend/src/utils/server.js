// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/slack-alert", async (req, res) => {
  const webhookUrl = "https://hooks.slack.com/services/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";

  try {
    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!slackRes.ok) throw new Error("Slack API failed");
    res.status(200).send("✅ Sent to Slack");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Slack error");
  }
});

app.listen(3001, () => {
  console.log("🚀 Proxy running on http://localhost:3001");
});
