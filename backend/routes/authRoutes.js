import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "244988304520-ndhnfmpejnlt73mejeo62nbussveh4vq.apps.googleusercontent.com");

/* ================= TEST ================= */
// ... (existing test route)

/* ================= GOOGLE AUTH ================= */
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID || "244988304520-ndhnfmpejnlt73mejeo62nbussveh4vq.apps.googleusercontent.com",
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name,
        email,
        // No password for social login
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ msg: "Google Authentication failed" });
  }
});
router.get("/test", (req, res) => {
  res.json({ msg: "Auth route working" });
});

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ msg: "Please login with Google" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

import crypto from "crypto";
import nodemailer from "nodemailer";

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // To prevent email enumeration, return general success message
      return res.json({ msg: "If a user exists with that email, a reset link has been sent." });
    }

    // Generate token
    const token = crypto.randomBytes(20).toString("hex");
    
    // Set token details
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create Transporter
    let transporter;
    const isSmtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

    if (isSmtpConfigured) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback: Generate Ethereal test account automatically
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // Reset Link
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${token}`;

    const mailOptions = {
      from: `"SkillPrep.AI" <${process.env.SMTP_USER || "no-reply@skillprep.ai"}>`,
      to: user.email,
      subject: "Password Reset Request - SkillPrep.AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #7c5cff; text-align: center;">SkillPrep.AI</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your SkillPrep.AI account. Click the button below to reset your password. This link is valid for 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #7c5cff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste the following URL into your browser:</p>
          <p style="word-break: break-all; color: #8a90a3;">${resetUrl}</p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #8a90a3;">If you did not request this reset, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!isSmtpConfigured) {
      console.log("\n==================================================");
      console.log("📨 DEVELOPER FALLBACK: Forgot Password Reset Link");
      console.log(`URL: ${resetUrl}`);
      console.log(`Ethereal Test Mail Preview: ${nodemailer.getTestMessageUrl(info)}`);
      console.log("==================================================\n");
    }

    res.json({ msg: "If a user exists with that email, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send reset link." });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "New password is required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Password reset token is invalid or has expired." });
    }

    // Hash and save new password
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: "Password has been reset successfully. You can now login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error resetting password." });
  }
});

export default router;
