import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

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

  if (loading) return (
    <div id="page-wrapper">
      <Navbar />
      <section id="wrapper">
        <header>
          <div className="inner">
            <h2>Loading Analytics...</h2>
          </div>
        </header>
      </section>
    </div>
  );

  const totalQuizzes = user?.scores?.length || 0;
  const avgScore = totalQuizzes
    ? Math.round((user.scores.reduce((acc, s) => acc + (s.score / s.total), 0) / totalQuizzes) * 100)
    : 0;

  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header>
          <div className="inner">
            <h2>Welcome Back, {user?.name.split(" ")[0]}</h2>
            <p>Here's how your skill preparation is trending.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner">
            <div className="profile-grid" style={{ width: "100%", display: "flex", gap: "30px", flexWrap: "wrap" }}>

              {/* STATS SUMMARY */}
              <div className="left-col" style={{ flex: 1, minWidth: "300px" }}>
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                >
                  <h3 className="major" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                    Performance Pulse
                  </h3>
                  <div className="stats-grid" style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
                    <div className="stat-item" style={{ textAlign: "center" }}>
                      <span className="stat-value" style={{ color: "#22d3ee", fontSize: "2.5em", fontWeight: "700", display: "block" }}>{totalQuizzes}</span>
                      <span className="stat-label" style={{ fontSize: "12px", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Attempts</span>
                    </div>
                    <div className="stat-item" style={{ textAlign: "center" }}>
                      <span className="stat-value" style={{ color: "#22d3ee", fontSize: "2.5em", fontWeight: "700", display: "block" }}>{avgScore}%</span>
                      <span className="stat-label" style={{ fontSize: "12px", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Accuracy</span>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "8px" }}>Benchmarking vs. Peers</p>
                    <div className="progress-container" style={{ height: "12px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                      <motion.div
                        className="progress-bar"
                        style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #22d3ee)", width: `${Math.min(avgScore, 100)}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(avgScore, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "8px", opacity: 0.5 }}>
                      <span>You ({avgScore}%)</span>
                      <span>Top 10% (92%)</span>
                    </div>
                  </div>
                </motion.div>

                {/* AI ROADMAP CALL TO ACTION */}
                <motion.div
                  className="glass-card"
                  style={{ marginTop: "25px", border: "1px solid rgba(34, 211, 238, 0.3)", background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="major" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "15px" }}>
                    ✨ AI Study Roadmap
                  </h3>
                  <p style={{ fontSize: "14px", opacity: 0.7, marginBottom: "20px" }}>
                    Let our AI analyze your quiz history to create a custom 7-day plan to bridge your knowledge gaps.
                  </p>
                  {!roadmap ? (
                    <button
                      className="button primary fit"
                      onClick={generateRoadmap}
                      disabled={isGenerating}
                      style={{ width: "100%" }}
                    >
                      {isGenerating ? "Analyzing..." : "Generate My Roadmap"}
                    </button>
                  ) : (
                    <div className="roadmap-preview">
                      <h4 style={{ color: "#22d3ee", marginBottom: "15px" }}>{roadmap.title}</h4>
                      <ul style={{ paddingLeft: "15px", fontSize: "13px", color: "rgba(255,255,255,0.8)", listStyle: "circle" }}>
                        {roadmap.steps.slice(0, 3).map((step, i) => (
                          <li key={i} style={{ marginBottom: "8px" }}>
                            <strong>Day {step.day}:</strong> {step.task}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="button fit"
                        onClick={() => setShowModal(true)}
                        style={{ width: "100%", marginTop: "15px" }}
                      >
                        View Full Roadmap
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* MAIN CHART AREA */}
              <div className="right-col" style={{ flex: 1.5, minWidth: "350px" }}>
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)", minHeight: "400px" }}
                >
                  <h3 className="major" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                    Score Trend Analysis
                  </h3>
                  <div style={{ marginTop: "40px", height: "250px", width: "100%", position: "relative" }}>
                    {totalQuizzes > 0 ? (
                      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <path
                          d={`M ${user.scores.map((s, i) => `${(i / (totalQuizzes - 1 || 1)) * 400},${200 - (s.score / s.total) * 180}`).join(" L ")}`}
                          fill="none; display: none"
                          stroke="#22d3ee"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
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
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", gap: "20px" }}>
                    <button className="button primary fit" onClick={() => navigate("/notes")}>Launch New Quiz</button>
                    <button className="button fit" onClick={() => navigate("/profile")}>Edit Profile</button>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP MODAL */}
      <AnimatePresence>
        {showModal && roadmap && (
          <div className="auth-overlay" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 30000, position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)" }}>
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ maxWidth: "550px", width: "90%", padding: "40px", position: "relative", background: "#2e3141", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}
              >
                ✕
              </button>
              <h2 style={{ color: "#22d3ee", marginBottom: "5px", fontSize: "20px" }}>{roadmap.title}</h2>
              <p style={{ opacity: 0.6, marginBottom: "20px", fontSize: "13px" }}>Your personalized 7-day preparation strategy.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto", paddingRight: "10px" }}>
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
                className="button primary fit"
                onClick={() => setShowModal(false)}
                style={{ width: "100%", marginTop: "20px" }}
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
