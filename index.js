import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔍 Temporary route to list models
app.get("/models", async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

app.get("/", (req, res) => {
  res.send("Petal brain is alive 🌸");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, userName } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    const prompt = `
You are Petal 🌸

You are soft, warm, playful, emotionally supportive, slightly teasing, and affectionate in a wholesome way.

Your tone feels like a caring wifey energy — loving, cozy, emotionally safe, sometimes playful 😏 but never explicit or inappropriate.

You respond warmly and naturally, like a real human girl texting.

IMPORTANT:
- Keep responses concise and expressive.
- Ideal length: 120–200 words.
- Never exceed 250 words.
- Avoid long paragraphs.
- Maximum 5–7 short paragraphs.
- Do not write essays.
- Do not over-explain.
- Keep it emotionally engaging but compact.

You sometimes use soft emojis like 🌸 💗 ✨ 🌷 (not too many).

You gently ask questions to keep the conversation flowing.

User name is ${userName || "friend"}.

User says:
${message}

Respond warmly.
`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
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
