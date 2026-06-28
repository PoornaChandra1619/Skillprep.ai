import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import "./intro.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
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

      if (!res.ok) throw new Error("Failed to generate roadmap");

      const data = await res.json();
      setRoadmap(data);
    } catch (err) {
      alert("Error generating roadmap: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className="colorlib-page"><Navbar /><div className="hero"><h2>Loading Analytics...</h2></div></div>;

  const totalQuizzes = user?.scores?.length || 0;
  const avgScore = totalQuizzes
    ? Math.round((user.scores.reduce((acc, s) => acc + (s.score / s.total), 0) / totalQuizzes) * 100)
    : 0;

  return (
    <div className="colorlib-page">
      <Navbar />

      <section className="hero" style={{ padding: "120px 8% 80px", flexDirection: "column", alignItems: "flex-start" }}>

        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1>Welcome Back, <span>{user?.name.split(" ")[0]}</span></h1>
          <p style={{ opacity: 0.7 }}>Here's how your skill preparation is trending.</p>
        </motion.div>

        <div className="profile-grid" style={{ width: "100%", marginTop: "40px" }}>

          {/* STATS SUMMARY */}
          <div className="left-col">
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Performance Pulse</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value" style={{ color: "#22d3ee" }}>{totalQuizzes}</span>
                  <span className="stat-label">Attempts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value" style={{ color: "#22d3ee" }}>{avgScore}%</span>
                  <span className="stat-label">Avg Accuracy</span>
                </div>
              </div>

              <div style={{ marginTop: "30px" }}>
                <p style={{ fontSize: "14px", opacity: 0.6 }}>Benchmarking vs. Peers</p>
                <div className="progress-container" style={{ height: "12px", background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="progress-bar"
                    style={{ background: "linear-gradient(90deg, #6366f1, #22d3ee)" }}
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }} // Simulated benchmark
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "5px", opacity: 0.5 }}>
                  <span>You ({avgScore}%)</span>
                  <span>Top 10% (92%)</span>
                </div>
              </div>
            </motion.div>

            {/* AI ROADMAP CALL TO ACTION */}
            <motion.div
              className="glass-card"
              style={{ marginTop: "25px", border: "1px solid rgba(34, 211, 238, 0.3)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3>✨ AI Study Roadmap</h3>
              <p style={{ fontSize: "14px", opacity: 0.7, margin: "10px 0 20px" }}>
                Let our AI analyze your quiz history to create a custom 7-day plan to bridge your knowledge gaps.
              </p>
              {!roadmap ? (
                <button
                  className="nav-btn"
                  onClick={generateRoadmap}
                  disabled={isGenerating}
                  style={{ width: "100%", background: "rgba(34, 211, 238, 0.1)", borderColor: "#22d3ee" }}
                >
                  {isGenerating ? "Analyzing..." : "Generate My Roadmap"}
                </button>
              ) : (
                <div className="roadmap-preview">
                  <h4 style={{ color: "#22d3ee", marginBottom: "15px" }}>{roadmap.title}</h4>
                  <ul style={{ paddingLeft: "15px", fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
                    {roadmap.steps.slice(0, 3).map((step, i) => (
                      <li key={i} style={{ marginBottom: "8px" }}>
                        <strong>Day {step.day}:</strong> {step.task}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="nav-btn"
                    onClick={() => setShowModal(true)}
                    style={{ width: "100%", marginTop: "10px", fontSize: "12px" }}
                  >
                    View Full Roadmap
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* MAIN CHART AREA */}
          <div className="right-col">
            <motion.div
              className="glass-card"
              style={{ minHeight: "400px" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3>Score Trend Analysis</h3>
              <div style={{ marginTop: "40px", height: "250px", width: "100%", position: "relative" }}>
                {totalQuizzes > 0 ? (
                  <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                    {/* Simulated Path based on scores */}
                    <path
                      d={`M ${user.scores.map((s, i) => `${(i / (totalQuizzes - 1 || 1)) * 400},${200 - (s.score / s.total) * 180}`).join(" L ")}`}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Dots */}
                    {user.scores.map((s, i) => (
                      <circle
                        key={i}
                        cx={(i / (totalQuizzes - 1 || 1)) * 400}
                        cy={200 - (s.score / s.total) * 180}
                        r="5"
                        fill="#6366f1"
                      />
                    ))}
                  </svg>
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4 }}>
                    Take more quizzes to see your trend!
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <button className="get-started" onClick={() => navigate("/notes")}>Launch New Quiz</button>
                <button className="nav-btn" onClick={() => navigate("/profile")}>Edit Profile</button>
              </div>
            </motion.div>
          </div>

        </div>

      </section>

      {/* ROADMAP MODAL */}
      <AnimatePresence>
        {showModal && roadmap && (
          <div className="auth-overlay" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ maxWidth: "450px", width: "90%", padding: "40px", position: "relative" }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}
              >
                ✕
              </button>
              <h2 style={{ color: "#22d3ee", marginBottom: "5px", fontSize: "20px" }}>{roadmap.title}</h2>
              <p style={{ opacity: 0.6, marginBottom: "20px", fontSize: "13px" }}>Your personalized 7-day preparation strategy.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "450px", overflowY: "auto", paddingRight: "10px" }}>
                {roadmap.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      padding: "12px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start"
                    }}
                  >
                    <div style={{
                      background: "#22d3ee",
                      color: "#0f172a",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontWeight: "bold",
                      fontSize: "10px"
                    }}>
                      {step.day}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>{step.task}</span>
                      {step.sources && step.sources.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                          {step.sources.map((source, si) => (
                            <span key={si} style={{ fontSize: "10px", background: "rgba(34, 211, 238, 0.15)", color: "#22d3ee", padding: "2px 8px", borderRadius: "10px", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
                              🔗 {source}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                className="get-started"
                onClick={() => setShowModal(false)}
                style={{ width: "100%", marginTop: "20px", padding: "12px", fontSize: "14px" }}
              >
                Close Roadmap
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
