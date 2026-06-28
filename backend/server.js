import "dotenv/config"; // ⭐ MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// ✅ keep folder name lowercase: routes
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */

// ✅ CORS – local + production safe
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://skillprep-ai-1.onrender.com",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());

/* ================= ROUTES ================= */

// 🔍 Health check (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.status(200).send("SkillPrep API running");
});

// 🔐 API routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/interview", interviewRoutes);

/* ================= START SERVER ================= */

const startServer = async () => {
  try {
    await connectDB(); // ✅ wait until MongoDB connects

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
