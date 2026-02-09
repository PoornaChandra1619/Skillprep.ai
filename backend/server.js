import dotenv from "dotenv";
dotenv.config(); // ⭐ MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// ✅ Use ONE naming style consistently
import authRoutes from "./Routes/authRoutes.js";
import aiRoutes from "./Routes/aiRoutes.js";
import interviewRoutes from "./Routes/interviewRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */

// 🔐 CORS – allow frontend only
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("SkillPrep API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/interview", interviewRoutes);

/* ================= START SERVER ================= */

const startServer = async () => {
  try {
    await connectDB(); // ✅ wait for DB
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
