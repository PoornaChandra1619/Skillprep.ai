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
    const truncatedNotes = notes.slice(0, 6000);
    const prompt = `Generate 5 high-quality Multiple Choice Questions (MCQs) based on the following notes. 
    Notes:
    ${truncatedNotes}

    Return the response as a JSON object with a key "mcqs" containing an array of 5 questions.
    Each question must have:
    - "question": string
    - "options": array of 4 strings
    - "answer": string (the exact correct option from the list)
    `;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a teacher. You must always return a JSON object with a key 'mcqs'." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      });
    } catch (apiErr) {
      console.log("llama-3.1-8b-instant MCQ gen failed, falling back to llama-3.3-70b-versatile:", apiErr.message);
      completion = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a teacher. You must always return a JSON object with a key 'mcqs'." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      });
    }

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

/* ================= GENERATE FLASHCARDS ================= */
router.post("/generate-flashcards", async (req, res) => {
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
    const truncatedNotes = notes.slice(0, 6000);
    const prompt = `Based on the following notes, extract 5 key terms, formulas, or concepts and generate flashcards.
    Notes:
    ${truncatedNotes}

    Return the response as a JSON object with a key "flashcards" containing an array of 5 flashcard objects.
    Each flashcard object must have:
    - "front": string (the term, question, or concept name)
    - "back": string (a short, clear definition, formula, explanation, or answer)
    `;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a teacher. You must always return a JSON object with a key 'flashcards'." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      });
    } catch (apiErr) {
      console.log("llama-3.1-8b-instant flashcard gen failed, falling back to llama-3.3-70b-versatile:", apiErr.message);
      completion = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a teacher. You must always return a JSON object with a key 'flashcards'." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      });
    }

    let content = JSON.parse(completion.choices[0].message.content);
    let flashcards = content.flashcards || (Array.isArray(content) ? content : []);

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error("No flashcards found in AI response");
    }

    res.json(flashcards);
  } catch (err) {
    console.error("Flashcard Generation Error:", err);
    res.status(500).json({ message: "Failed to generate flashcards: " + err.message });
  }
});

/* ================= REVIEW RESUME ================= */
router.post("/review-resume", upload.single("resume"), async (req, res) => {
  let resumeText = req.body.resumeText;

  if (req.file) {
    try {
      if (req.file.mimetype === "application/pdf") {
        const parser = new PDFParse({ data: req.file.buffer });
        const result = await parser.getText();
        resumeText = result.text;
      } else {
        resumeText = req.file.buffer.toString("utf-8");
      }
    } catch (parseErr) {
      console.error("Failed to parse uploaded resume:", parseErr);
      return res.status(400).json({ message: "Failed to parse resume file: " + parseErr.message });
    }
  }

  if (!resumeText || !resumeText.trim()) {
    return res.status(400).json({ message: "Resume text or file is required" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: "Groq API Key is missing" });
  }

  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
  });

  try {
    const prompt = `You are a resume reviewer for engineering and CS students applying to internships
    and entry-level roles. Given the resume text below, return JSON with:
    - "overall_score": integer 0-100
    - "strengths": array of up to 4 short strings
    - "gaps": array of up to 4 short strings (missing metrics, unclear impact, formatting issues)
    - "ats_flags": array of any ATS-compatibility issues (tables, images, non-standard headers)
    - "rewrite_suggestions": array of { "original": string, "improved": string } objects for the 3 weakest bullet points

    Be specific and reference the actual text. Do not invent experience the candidate didn't list.

    Resume:
    """
    ${resumeText.slice(0, 8000)}
    """

    Return only valid JSON, no prose.`;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a professional technical recruiter. You must always return a JSON object." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.5
      });
    } catch (apiErr) {
      console.log("llama-3.1-8b-instant resume review failed, falling back to llama-3.3-70b-versatile:", apiErr.message);
      completion = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional technical recruiter. You must always return a JSON object." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.5
      });
    }

    const reviewData = JSON.parse(completion.choices[0].message.content);
    res.json(reviewData);
  } catch (err) {
    console.error("Resume Review Error:", err);
    res.status(500).json({ message: "Failed to analyze resume: " + err.message });
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
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7
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
    let text = "";
    if (req.file.mimetype === "application/pdf") {
      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } else {
      text = req.file.buffer.toString("utf-8");
    }

    if (!text || text.trim().length === 0) {
      throw new Error("File parsing returned empty content");
    }

    console.log("Resume parsed successfully");
    res.json({ text });
  } catch (err) {
    console.error("PDF Parsing Error:", err);
    res.status(500).json({ message: "Failed to parse resume: " + err.message });
  }
});

/* ================= GENERATE AI ROADMAP ================= */
router.post("/generate-roadmap", authMiddleware, async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: "Groq API Key is missing" });
  }

  const { scores, interviews } = req.body;

  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
  });

  try {
    const historySummary = `
      Quiz Scores: ${scores?.map(s => `${s.score}/${s.total} on ${new Date(s.date).toLocaleDateString()}`).join(", ") || "No quiz data yet."}
      Interview History: ${interviews?.map(i => `${i.role} (Score: ${i.score}%)`).join(", ") || "No interview data yet."}
    `;

    const prompt = `Based on the following student performance history, generate a personalized 7-day study roadmap to help them improve their technical skills.
    
    Performance History:
    ${historySummary}
    
    Return the response as a JSON object with:
    - "title": string (e.g., "7-Day [Topic] Mastery Plan")
    - "steps": an array of 7 objects. Each object must have:
      - "day": number (1-7)
      - "task": string (highly actionable study task)
      - "sources": an array of 2-3 specific learning resource names or URLs (e.g., "MDN Web Docs", "FreeCodeCamp", "YouTube: [Topic] tutorial").
    Keep the tasks concise.`;

    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a career coach. You must ALWAYS return a JSON object with 'title' (string) and 'steps' (array of 7 objects with 'day', 'task', and 'sources')." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7
    });

    const roadmap = JSON.parse(completion.choices[0].message.content);
    res.json(roadmap);

  } catch (err) {
    console.error("Roadmap Generation Error:", err);
    res.status(500).json({ message: "Failed to generate roadmap" });
  }
});

/* ================= PREP AI ASSISTANT CHAT ================= */
const AGENT_SYSTEM_PROMPT = `You are "Prep", the embedded AI assistant inside SkillPrep.AI, a career-prep platform for CS students.

You can help with:
- Recommending which module or interview pack fits the student's goal (Trending modules: Resume Deep-Dive, System Design Sprint, Behavioral Round Prep, Coding Assessment, HR Round Simulator)
- Explaining features: AI Voice Interviewer (realistic conversational mock interviews), Notes to MCQ Generator (turns study notes into quizzes), AI Study Roadmap (7-day personalized plan on the Dashboard)
- Interview prep packs by company type: FAANG-Style, Startup-Style, Service-Company-Style (TCS/Infosys-style)
- Interview Questions page: organized by company (Google, Amazon, Microsoft, Service-Company, Startups) and round (Technical, Behavioral, HR), each with a coaching note

Keep answers short (2-4 sentences) and conversational, like a helpful in-app guide, not a formal essay. If a student would benefit from visiting a specific page, end your reply on its own new line with exactly:
ACTION: goto:<page>
where <page> is one of: home, dashboard, questions, profile. Only include this line when it's genuinely useful navigation, and only ever one per reply. Do not explain the ACTION line itself, just append it silently after your normal answer.`;

router.post("/prep-chat", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ message: "History array required" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: "Groq API Key is missing" });
  }

  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
  });

  try {
    const recentHistory = history.slice(-10);
    const messages = [
      { role: "system", content: AGENT_SYSTEM_PROMPT },
      ...recentHistory.map(msg => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.text
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 400,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Prep Chat Error:", err);
    res.status(500).json({ message: "Prep Assistant is currently unavailable" });
  }
});

export default router;
