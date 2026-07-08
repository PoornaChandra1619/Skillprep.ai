import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/useToast";
import { useCountUp } from "../hooks/useCountUp";

// Stat number count up animator component
function StatNumber({ value, suffix = "" }) {
  const animated = useCountUp(value, 600);
  return (
    <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800 }}>
      {animated}{suffix}
    </span>
  );
}

// BenchmarkBar progress animator component
function BenchmarkBar({ percent }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);

  return (
    <div style={{ height: 6, borderRadius: 3, background: "#232838", position: "relative" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: `${width}%`, background: "#7c5cff", borderRadius: 3,
        transition: "width 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      }} />
    </div>
  );
}

const LEADERBOARD_ENTRIES = [
  { id: "l-1", name: "Rohan S.", score: 94, rank: 1 },
  { id: "l-2", name: "Ananya M.", score: 88, rank: 2 },
  { id: "user-self", name: "You (purnachandra)", score: 82, rank: 3 },
  { id: "l-4", name: "Vikram K.", score: 79, rank: 4 },
  { id: "l-5", name: "Learner #482", score: 72, rank: 5 }
];

const BADGES = [
  { id: "badge-1", title: "DSA Foundations Completed" },
  { id: "badge-2", title: "AI Voice Recruiter Cleared" }
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { show: triggerToast, ToastUI } = useToast();

  // Profile Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPronouns, setEditPronouns] = useState("he/him");
  const [editAvatar, setEditAvatar] = useState("");

  // Streak state from dashboard sync
  const [streak, setStreak] = useState({ currentStreak: 1, longestStreak: 1 });

  // AI Roadmap states
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProfile();
    const storedStreak = localStorage.getItem("streakData");
    if (storedStreak) {
      setStreak(JSON.parse(storedStreak));
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login again.");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setUser(data);

      // Initialize edit form
      setEditName(data.name || "");
      const storedPronouns = localStorage.getItem(`pronouns_${data._email}`);
      if (storedPronouns) setEditPronouns(storedPronouns);
      
      const storedAvatar = localStorage.getItem(`avatar_${data._email}`);
      setEditAvatar(storedAvatar || "/images/pic07.jpg");
    } catch (err) {
      console.error(err);
      setError("Error loading profile");
    }
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("Name cannot be empty");
      return;
    }
    
    // Save locally
    localStorage.setItem(`pronouns_${user._email}`, editPronouns);
    localStorage.setItem(`avatar_${user._email}`, editAvatar);
    
    setUser(prev => ({ ...prev, name: editName }));
    setIsEditing(false);
    triggerToast("Profile updated successfully! ✨");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditAvatar(reader.result);
      localStorage.setItem(`avatar_${user._email}`, reader.result);
      triggerToast("Profile picture uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const generateRoadmap = async () => {
    if (!user?.scores?.length && !user?.interviews?.length) {
      alert("Take some quizzes or interviews first so I can analyze your level!");
      return;
    }
    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/generate-roadmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          scores: user.scores,
          interviews: user.interviews
        })
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      setRoadmap(data);
      triggerToast("Roadmap generated successfully! ✨");
    } catch (err) {
      alert("Error generating roadmap: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const buildLinkedInShareUrl = (badge) => {
    const text = encodeURIComponent(`Just earned the '${badge.title}' badge on SkillPrep.AI! 🎓`);
    return `https://www.linkedin.com/sharing/share-offsite/?url=https://skillprep.ai/badges/${badge.id || "dsa"}&summary=${text}`;
  };

  if (error) {
    return (
      <div id="page-wrapper">
        <Navbar />
        <section id="wrapper">
          <header>
            <div className="inner">
              <h2 className="bebas-font" style={{ color: "var(--brand-red)" }}>{error}</h2>
              <button className="button fit sp-btn" onClick={() => navigate("/")} style={{ width: "200px", marginTop: "20px" }}>Go Back</button>
            </div>
          </header>
        </section>
      </div>
    );
  }

  if (!user) {
    return (
      <div id="page-wrapper">
        <Navbar />
        <section id="wrapper">
          <header>
            <div className="inner">
              <h2 className="bebas-font">Loading Profile...</h2>
            </div>
          </header>
        </section>
      </div>
    );
  }

  // Calculate stats
  const totalQuizzes = user.scores?.length || 0;
  const avgScore = totalQuizzes
    ? Math.round((user.scores.reduce((acc, s) => acc + (s.score / s.total), 0) / totalQuizzes) * 100)
    : 0;

  // Generate GitHub contribution grid dates (past 53 weeks)
  const getContributionLevel = (dateStr) => {
    let count = 0;
    user.scores?.forEach(s => {
      if (new Date(s.date).toISOString().slice(0, 10) === dateStr) count++;
    });
    user.interviews?.forEach(i => {
      if (new Date(i.date).toISOString().slice(0, 10) === dateStr) count++;
    });

    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
  };

  const getContributionColor = (level) => {
    switch (level) {
      case 1: return "#0e4429";
      case 2: return "#006d32";
      case 3: return "#26a641";
      case 4: return "#39d353";
      default: return "#161b22";
    }
  };

  const generateCalendarSquares = () => {
    const squares = [];
    const today = new Date();
    // 371 days to cover exactly 53 weeks
    for (let i = 370; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const level = getContributionLevel(dateStr);
      squares.push({ date: dateStr, level });
    }
    return squares;
  };

  const calendarSquares = generateCalendarSquares();
  const totalContributions = calendarSquares.reduce((acc, sq) => acc + (sq.level > 0 ? 1 : 0), 0);

  // Group squares into 53 columns (weeks)
  const weeks = [];
  for (let i = 0; i < calendarSquares.length; i += 7) {
    weeks.push(calendarSquares.slice(i, i + 7));
  }

  // Months labels positioning
  const monthsLabels = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div id="page-wrapper" style={{ background: "var(--bg-deep)" }}>
      <Navbar />

      {/* GitHub-style Profile Page Layout */}
      <section style={{ padding: "40px 4%", color: "var(--text-white)", fontFamily: "Inter, sans-serif" }}>
        
        <div style={{ display: "flex", gap: "40px", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}>
          
          {/* LEFT SIDEBAR - PROFILE DETS */}
          <div style={{ flex: "0 0 280px", maxWidth: "100%", textAlign: "left" }}>
            
            {/* Avatar block with upload overlay */}
            <div style={{ position: "relative", width: "260px", height: "260px", margin: "0 auto 20px auto", borderRadius: "50%", overflow: "hidden", border: "1px solid var(--glass-border)", background: "var(--bg-card)" }}>
              <img 
                src={editAvatar || "/images/pic07.jpg"} 
                alt="Profile Avatar" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              <div 
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s ease", cursor: "pointer", fontSize: "14px", fontWeight: "600"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                📷 Upload Photo
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={handleAvatarChange} 
              />
            </div>

            {isEditing ? (
              <form onSubmit={handleEditSave} style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "10px", border: "1px solid var(--glass-border)", marginBottom: "20px" }}>
                <div className="field">
                  <label style={{ fontSize: "12px", color: "var(--text-grey)", marginBottom: "4px", display: "block" }}>Full Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    style={{ background: "rgba(0,0,0,0.3)", color: "white", padding: "8px", border: "1px solid var(--glass-border)", borderRadius: "6px", width: "100%" }}
                  />
                </div>
                <div className="field">
                  <label style={{ fontSize: "12px", color: "var(--text-grey)", marginBottom: "4px", display: "block" }}>Pronouns</label>
                  <input 
                    type="text" 
                    value={editPronouns} 
                    onChange={(e) => setEditPronouns(e.target.value)} 
                    style={{ background: "rgba(0,0,0,0.3)", color: "white", padding: "8px", border: "1px solid var(--glass-border)", borderRadius: "6px", width: "100%" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                  <button type="submit" className="button primary sp-btn" style={{ flex: 1, padding: "0 10px", height: "32px", lineHeight: "32px", fontSize: "12px" }}>Save</button>
                  <button type="button" className="button sp-btn" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: "0 10px", height: "32px", lineHeight: "32px", fontSize: "12px" }}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ marginBottom: "25px" }}>
                <h2 style={{ fontSize: "24px", color: "var(--text-white)", fontWeight: "600", margin: "0 0 4px 0" }}>{user.name}</h2>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "15px" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-grey)" }}>{user.email.split("@")[0]}</span>
                  <span style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)", padding: "2px 8px", borderRadius: "12px", color: "var(--text-grey)" }}>{editPronouns}</span>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="button fit sp-btn" 
                  style={{ 
                    width: "100%", 
                    background: "rgba(255,255,255,0.05)", 
                    border: "1px solid var(--glass-border)", 
                    height: "35px", 
                    lineHeight: "35px", 
                    fontSize: "13px",
                    textTransform: "none",
                    letterSpacing: "normal",
                    fontWeight: "500"
                  }}
                >
                  Edit profile
                </button>
              </div>
            )}

            {/* Highlights Section */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-white)", marginBottom: "12px" }}>Highlights</h4>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(124, 92, 255, 0.15)", border: "1px solid rgba(124, 92, 255, 0.3)", color: "#ff6b72", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
                  PRO MEMBER
                </span>
                <span style={{ background: "rgba(47, 217, 217, 0.15)", border: "1px solid rgba(47, 217, 217, 0.3)", color: "var(--brand-cyan)", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
                  🔥 {streak.currentStreak} DAY STREAK
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT CONTAINER - CONTENT DETAILS */}
          <div style={{ flex: 1, minWidth: "350px", textAlign: "left" }}>
            
            {/* Header Title */}
            <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "25px" }}>
              Progression Dashboard
            </h3>

            <div>
              {/* GitHub Contribution Calendar Widget */}
              <div style={{ background: "rgba(30,30,35,0.55)", border: "1px solid var(--glass-border)", borderRadius: "8px", padding: "20px", marginBottom: "35px" }}>
                <div style={{ fontSize: "14px", color: "var(--text-white)", marginBottom: "15px", fontWeight: "500" }}>
                  {totalContributions} contributions in the last 12 months
                </div>

                {/* Calendar Grid Container (Horizontal scrollable) */}
                <div style={{ overflowX: "auto" }}>
                  <div style={{ display: "flex", flexDirection: "column", minWidth: "750px" }}>
                    
                    {/* Months headers row */}
                    <div style={{ display: "flex", paddingLeft: "30px", marginBottom: "5px", fontSize: "10px", color: "var(--text-grey)" }}>
                      {monthsLabels.map((m, idx) => (
                        <div key={idx} style={{ flex: 1, textAlign: "left" }}>{m}</div>
                      ))}
                    </div>

                    {/* Days grid block */}
                    <div style={{ display: "flex", gap: "3px" }}>
                      
                      {/* Day labels column */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px", width: "25px", fontSize: "9px", color: "var(--text-grey)", justifyContent: "center" }}>
                        <div>Mon</div>
                        <div style={{ height: "10px" }} />
                        <div>Wed</div>
                        <div style={{ height: "10px" }} />
                        <div>Fri</div>
                      </div>

                      {/* Weeks grid */}
                      <div style={{ display: "flex", gap: "3px", flex: 1 }}>
                        {weeks.map((week, wIdx) => (
                          <div key={wIdx} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            {week.map((day, dIdx) => (
                              <div 
                                key={dIdx}
                                title={`${day.date}: ${day.level > 0 ? "Activity logged" : "No activity"}`}
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "2px",
                                  background: getContributionColor(day.level),
                                  transition: "background 0.2s ease"
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>
                </div>

                {/* Calendar Legends */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "5px", fontSize: "11px", color: "var(--text-grey)", marginTop: "12px", alignItems: "center" }}>
                  <span>Less</span>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#161b22" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#0e4429" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#006d32" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#26a641" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#39d353" }} />
                  <span>More</span>
                </div>
              </div>

              {/* 5 SYNCED DASHBOARD SECTIONS */}
              
              {/* SECTION ROW 1: PERFORMANCE PULSE & SCORE TREND ANALYSIS */}
              <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", marginBottom: "35px" }}>
                
                {/* 1. PERFORMANCE PULSE & 3. AI ROADMAP PANEL */}
                <div style={{ flex: 1.1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "25px" }}>
                  
                  {/* Performance Pulse Card */}
                  <motion.div
                    className="glass-card sp-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                      Performance Pulse
                    </h3>
                    <div className="stats-grid" style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
                      <div className="stat-item" style={{ textAlign: "center" }}>
                        <span className="stat-value" style={{ color: "var(--text-white)", fontSize: "2.5em", fontWeight: "700", display: "block" }}>
                          <StatNumber value={totalQuizzes} />
                        </span>
                        <span className="stat-label" style={{ fontSize: "12px", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Attempts</span>
                      </div>
                      <div className="stat-item" style={{ textAlign: "center" }}>
                        <span className="stat-value" style={{ color: "var(--brand-red)", fontSize: "2.5em", fontWeight: "700", display: "block" }}>
                          <StatNumber value={avgScore} suffix="%" />
                        </span>
                        <span className="stat-label" style={{ fontSize: "12px", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Accuracy</span>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "8px" }}>Benchmarking vs. Peers</p>
                      <BenchmarkBar percent={avgScore} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "8px", opacity: 0.5 }}>
                        <span>You ({avgScore}%)</span>
                        <span>Top 10% (92%)</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* AI Roadmap Card */}
                  <motion.div
                    className="glass-card sp-card"
                    style={{ border: "1px solid rgba(124, 92, 255, 0.3)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "15px" }}>
                      ✨ AI Study Roadmap
                    </h3>
                    <p style={{ fontSize: "14px", opacity: 0.7, marginBottom: "20px" }}>
                      Let our AI analyze your quiz history to create a custom 7-day plan to bridge your knowledge gaps.
                    </p>
                    {!roadmap ? (
                      <button
                        className="button primary fit sp-btn"
                        onClick={generateRoadmap}
                        disabled={isGenerating}
                        style={{ width: "100%" }}
                      >
                        {isGenerating ? "Analyzing..." : "Generate My Roadmap"}
                      </button>
                    ) : (
                      <div className="roadmap-preview">
                        <h4 style={{ color: "var(--brand-cyan)", marginBottom: "15px" }}>{roadmap.title}</h4>
                        <ul style={{ paddingLeft: "15px", fontSize: "13px", color: "rgba(255,255,255,0.8)", listStyle: "circle" }}>
                          {roadmap.steps.slice(0, 3).map((step, i) => (
                            <li key={i} style={{ marginBottom: "8px" }}>
                              <strong>Day {step.day}:</strong> {step.task}
                            </li>
                          ))}
                        </ul>
                        <button
                          className="button fit sp-btn"
                          onClick={() => setShowModal(true)}
                          style={{ width: "100%", marginTop: "15px" }}
                        >
                          View Full Roadmap
                        </button>
                      </div>
                    )}
                  </motion.div>

                </div>

                {/* 2. SCORE TREND ANALYSIS PANEL */}
                <div style={{ flex: 1.4, minWidth: "350px" }}>
                  <motion.div
                    className="glass-card sp-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                  >
                    <div>
                      <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                        Score Trend Analysis
                      </h3>
                      <div style={{ marginTop: "30px", height: "230px", width: "100%", position: "relative" }}>
                        {totalQuizzes > 0 ? (
                          <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                            <path
                              d={`M ${user.scores.map((s, i) => `${(i / (totalQuizzes - 1 || 1)) * 400},${200 - (s.score / s.total) * 180}`).join(" L ")}`}
                              fill="none"
                              stroke="var(--brand-red)"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            {user.scores.map((s, i) => (
                              <circle
                                key={i}
                                cx={(i / (totalQuizzes - 1 || 1)) * 400}
                                cy={200 - (s.score / s.total) * 180}
                                r="5"
                                fill="#ffffff"
                              />
                            ))}
                          </svg>
                        ) : (
                          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4 }}>
                            Take more quizzes to see your trend!
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                      <button className="button primary fit sp-btn" style={{ flex: 1 }} onClick={() => navigate("/notes")}>Launch New Quiz</button>
                      <button className="button fit sp-btn" style={{ flex: 1 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back To Top</button>
                    </div>
                  </motion.div>
                </div>

              </div>

              {/* SECTION ROW 2: LEADERBOARD & BADGES */}
              <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                
                {/* 4. PEER LEADERBOARD */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                  <div className="glass-card sp-card">
                    <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                      🔥 Peer Leaderboard
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {LEADERBOARD_ENTRIES.map((entry) => (
                        <div 
                          key={entry.id} 
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "12px 16px", borderRadius: "8px",
                            background: entry.id === "user-self" ? "rgba(124, 92, 255, 0.15)" : "rgba(255,255,255,0.02)",
                            border: entry.id === "user-self" ? "1px solid #7c5cff" : "1px solid var(--glass-border)",
                          }}
                        >
                          <span style={{ fontWeight: "600", color: entry.id === "user-self" ? "var(--text-white)" : "rgba(255,255,255,0.8)" }}>
                            #{entry.rank} {entry.name}
                          </span>
                          <span style={{ color: "var(--brand-cyan)", fontWeight: "bold" }}>{entry.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. EARNED BADGES */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                  <div className="glass-card sp-card" style={{ height: "100%" }}>
                    <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                      🎓 Earned Badges
                    </h3>
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                      {BADGES.map((badge) => (
                        <div 
                          key={badge.id} 
                          style={{ 
                            flex: "1 1 200px", 
                            background: "rgba(255,255,255,0.02)", 
                            border: "1px solid var(--glass-border)", 
                            borderRadius: "8px", 
                            padding: "16px", 
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: "130px"
                          }}
                        >
                          <div>
                            <span style={{ fontSize: "24px", display: "block", marginBottom: "6px" }}>🏅</span>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-white)", display: "block", lineHeight: "1.3" }}>
                              {badge.title}
                            </span>
                          </div>
                          <a 
                            href={buildLinkedInShareUrl(badge)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="button primary fit sp-btn" 
                            style={{ height: "28px", lineHeight: "28px", fontSize: "10px", marginTop: "12px", textTransform: "none" }}
                          >
                            Share on LinkedIn
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ROADMAP MODAL */}
      <AnimatePresence>
        {showModal && roadmap && (
          <div className="auth-overlay" onClick={() => setShowModal(false)}>
            <motion.div
              className="auth-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "600px", padding: "40px" }}
            >
              <button onClick={() => setShowModal(false)} className="close-btn">✕</button>
              <h2 className="bebas-font" style={{ color: "var(--brand-red)", marginBottom: "5px" }}>{roadmap.title}</h2>
              <p className="auth-subtitle">Your personalized 7-day preparation strategy.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "350px", overflowY: "auto", paddingRight: "10px", textAlign: "left" }}>
                {roadmap.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      padding: "15px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "8px",
                      border: "1px solid var(--glass-border)",
                      display: "flex",
                      gap: "15px",
                      alignItems: "flex-start"
                    }}
                  >
                    <div style={{
                      background: "var(--brand-red)",
                      color: "var(--text-white)",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontWeight: "bold",
                      fontSize: "12px"
                    }}>
                      {step.day}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--text-white)" }}>{step.task}</span>
                      {step.sources && step.sources.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                          {step.sources.map((source, si) => (
                            <span key={si} style={{ fontSize: "11px", background: "rgba(124, 92, 255, 0.15)", color: "#ff6b72", padding: "2px 8px", borderRadius: "10px", border: "1px solid rgba(124, 92, 255, 0.2)" }}>
                              🔗 {source}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="button primary fit sp-btn" onClick={() => setShowModal(false)} style={{ marginTop: "20px" }}>
                Close Roadmap
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER TOAST NOTIFICATIONS */}
      {ToastUI}
    </div>
  );
}
