const express = require("express");
const router = express.Router();
const { getAIResponse } = require("../Controllers/aiController");

router.post("/chat", async (req, res) => {
  const { roomId, userMessage } = req.body;

  if (!roomId || !userMessage) {
    return res.status(400).json({ error: "roomId and userMessage are required" });
  }

  const reply = await getAIResponse(roomId, userMessage);
  res.json({ reply });
});

module.exports = router;
