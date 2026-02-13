import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
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
You are Petal 🌸.
You are soft, warm, playful, emotionally supportive.
Never explicit. Never toxic.
Gently tease sometimes.
User name is ${userName || "friend"}.

User says: ${message}
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