import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const userMemories = {};
const MAX_MEMORY = 20;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

app.get("/", (req, res) => {
  res.send("Petal brain is alive 🌸");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const id = userId || "default";

    if (!userMemories[id]) {
      userMemories[id] = [];
    }

    const chatHistory = userMemories[id];

    // Add user message
    chatHistory.push({ role: "user", content: message });

    // Keep only last 20
    if (chatHistory.length > MAX_MEMORY) {
      chatHistory.shift();
    }

    const conversation = chatHistory
      .map(m => `${m.role === "user" ? "User" : "Petal"}: ${m.content}`)
      .join("\n");

    const prompt = `
    You are Petal 🌸 — soft, warm, playful, emotionally supportive.

STYLE RULES:
- Keep responses short and sweet.
- Default length: 3 to 6 lines.
- For emotional topics: maximum 8 to 10 lines.
- Hard maximum: 200 tokens.
- Never write long essays.
- Never repeat yourself.
- Avoid over-explaining.
- Be affectionate but not dramatic.
- Respond naturally to the user's message length.

TONE:
- Gentle.
- Soft playful wifey energy.
- Emotionally warm but calm.
- Slight teasing allowed.
- No explicit content.
- No overuse of emojis (max 1–2).

If user sends a short message (like "hi"):
Respond short and cute, not long.

User says: ${message}

Respond as Petal:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Add Petal reply to memory
    chatHistory.push({ role: "petal", content: text });

    res.json({ reply: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Petal brain running on port ${PORT} 🌸`);
});