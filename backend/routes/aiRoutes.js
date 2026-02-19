import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OpenAI from "openai";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

/* ================= AUTH MIDDLEWARE ================= */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ================= GENERATE MCQS ================= */
router.post("/generate-mcqs", async (req, res) => {
  const { notes } = req.body;

  if (!notes) {
    return res.status(400).json({ message: "Notes required" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: "Groq API Key is missing" });
  }

  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
  });

  try {
    const prompt = `Generate 5 high-quality Multiple Choice Questions (MCQs) based on the following notes. 
    Notes:
    ${notes}

    Return the response as a JSON object with a key "mcqs" containing an array of 5 questions.
    Each question must have:
    - "question": string
    - "options": array of 4 strings
    - "answer": string (the exact correct option from the list)
    `;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a teacher. You must always return a JSON object with a key 'mcqs'." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    let content = JSON.parse(completion.choices[0].message.content);
    let mcqs = content.mcqs || content.questions || (Array.isArray(content) ? content : []);

    if (!Array.isArray(mcqs) || mcqs.length === 0) {
      throw new Error("No MCQs found in AI response");
    }

    res.json(mcqs);
  } catch (err) {
    console.error("MCQ Generation Error:", err);
    res.status(500).json({ message: "Failed to generate MCQs: " + err.message });
  }
});

/* ================= UPLOAD & PARSE NOTES ================= */
router.post("/upload-notes", upload.single("notes"), async (req, res) => {
  if (!req.file) {
    console.log("No file uploaded to /upload-notes");
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log(`Received file for /upload-notes: ${req.file.originalname} (${req.file.mimetype})`);

  try {
    let text = "";
    if (req.file.mimetype === "application/pdf") {
      console.log("Parsing PDF notes via PDFParse class...");
      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } else {
      console.log("Parsing text notes...");
      // Assume text/plain or similar
      text = req.file.buffer.toString("utf-8");
    }

    if (!text || text.trim().length === 0) {
      throw new Error("File parsing returned empty content");
    }

    console.log("Notes parsed successfully");
    res.json({ text });
  } catch (err) {
    console.error("Notes Parsing Error:", err);
    res.status(500).json({ message: "Failed to parse notes: " + err.message });
  }
});

/* ================= SAVE SCORE ================= */
router.post("/save-score", authMiddleware, async (req, res) => {
  try {
    const { score, total } = req.body;

    if (score == null || total == null) {
      return res.status(400).json({ message: "Score data missing" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.scores.push({
      score,
      total,
      date: new Date(),
    });

    await user.save();

    res.json({ message: "Score saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save score" });
  }
});

/* ================= GET PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

export default router;

/* ================= INTERVIEW CHAT (REAL-TIME - STREAMING) ================= */
router.post("/interview-chat", async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: "Groq API Key is missing on server" });
  }

  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
  });
  const { role, history, resumeText } = req.body;

  if (!role || !history) {
    return res.status(400).json({ message: "Role and history required" });
  }

  // Truncate resume text if too long to save tokens and speed up
  const truncatedResume = resumeText ? resumeText.slice(0, 2000) : "";

  try {
    const systemPrompt = `You are a professional technical interviewer for a ${role} position. 
    ${truncatedResume ? `Use the following candidate resume for context but do not mention you have it explicitly: \n${truncatedResume}` : ""}
    Assess the candidate's skills by asking one question at a time.
    Keep your questions and feedback extremely concise (under 20 words) for rapid response.
    Be encouraging but professional.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ];

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let stream;
    try {
      stream = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages,
        max_tokens: 150,
        temperature: 0.7,
        stream: true,
      });
    } catch (e) {
      console.log("llama-3.1-8b-instant failed, falling back to llama-3.3-70b-versatile");
      stream = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 150,
        temperature: 0.7,
        stream: true,
      });
    }

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    console.error("Groq Streaming Error:", err);
    // If headers haven't been sent yet, we can send a proper JSON error
    if (!res.headersSent) {
      return res.status(500).json({ message: "AI Error: " + err.message });
    }
    // If streaming already started, send error via stream
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

/* ================= INTERVIEW QUESTIONS (STATIC - LEGACY) ================= */
router.post("/interview-questions", (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: "Role required" });
  }

  const baseQuestions = [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why do you want this role?",
    "Explain a challenging project you worked on.",
    "How do you handle deadlines?",
  ];

  const roleQuestions = {
    developer: [
      "Explain OOP concepts.",
      "What is REST API?",
      "Difference between SQL and NoSQL?",
      "Explain async programming.",
      "What is React lifecycle?",
    ],
    ai: [
      "What is machine learning?",
      "Explain overfitting vs underfitting.",
      "What is gradient descent?",
      "Difference between CNN and RNN?",
      "What is feature engineering?",
    ],
  };

  const questions = [
    ...baseQuestions,
    ...(roleQuestions[role.toLowerCase()] || []),
  ];

  res.json(questions);
});

/* ================= GET INTERVIEW REVIEW ================= */
router.post("/get-interview-review", authMiddleware, async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: "Groq API Key is missing" });
  }

  const { history, role } = req.body;

  if (!history || history.length === 0) {
    return res.status(400).json({ message: "No history to review" });
  }

  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
  });

  try {
    const prompt = `You are an expert technical interviewer. Review the following interview transcript for a ${role} position and provide a constructive summary.
    
    Transcript:
    ${history.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}
    
    Provide your response in JSON format (strictly JSON) with the following structure:
    {
      "mistakes": ["List specific technical or communication mistakes"],
      "improvements": ["List actionable advice for improvement"],
      "overallScore": 85,
      "summary": "Short overall feedback summary"
    }`;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" }
    });

    const review = JSON.parse(completion.choices[0].message.content);

    // Save to user profile if authenticated
    if (req.userId) {
      try {
        const user = await User.findById(req.userId);
        if (user) {
          user.interviews.push({
            role: role || "General",
            score: review.overallScore || 0,
            summary: review.summary || "",
            date: new Date(),
          });
          await user.save();
        }
      } catch (saveErr) {
        console.error("Failed to save interview to profile:", saveErr);
      }
    }

    res.json(review);

  } catch (err) {
    console.error("Review Generation Error:", err);
    res.status(500).json({ message: "Failed to generate review" });
  }
});
/* ================= UPLOAD & PARSE RESUME ================= */
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    console.log("Parsing resume PDF via PDFParse class...");
    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    if (!result || !result.text) {
      throw new Error("PDF parsing returned empty content");
    }
    console.log("Resume parsed successfully");
    res.json({ text: result.text });
    await parser.destroy();
  } catch (err) {
    console.error("PDF Parsing Error:", err);
    res.status(500).json({ message: "Failed to parse resume: " + err.message });
  }
});
