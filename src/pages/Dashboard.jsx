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
            <h2 className="bebas-font">Loading Dashboard...</h2>
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

      {/* NETFLIX BILLBOARD HERO BANNER */}
      <section className="billboard-container" style={{ backgroundImage: `url('/images/pic02.jpg')` }}>
        <div className="billboard-content">
          <h2 className="bebas-font">AI VOICE INTERVIEWER</h2>
          <p>
            Experience realistic, real-time mock interviews with our conversational AI recruiter. Speak your answers naturally and get evaluated instantly.
          </p>
          <div className="billboard-buttons">
            <button className="button primary" onClick={() => navigate("/interview")}>
              ▶ Play Mock
            </button>
            <button className="button" onClick={() => {
              const element = document.getElementById("analytics-pulse");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}>
              ⓘ More Info
            </button>
          </div>
        </div>
      </section>

      {/* DASHBOARD CONTENT ROWS */}
      <section id="wrapper" style={{ paddingTop: "0" }}>
        <div className="wrapper">
          <div className="inner">
            
            {/* ROW 1: RECOMMENDATIONS */}
            <div className="features-slider-container">
              <h3 className="bebas-font">Trending Career Prep Modules</h3>
              <div className="features-slider">
                <article onClick={() => navigate("/notes")}>
                  <div className="image">
                    <img src="/images/pic01.jpg" alt="Notes to MCQ" />
                  </div>
                  <div className="content">
                    <h3>Notes to MCQ Generator</h3>
                    <p>Convert your notes or study material into custom quiz questions instantly.</p>
                    <span className="special">Launch Module ➔</span>
                  </div>
                </article>

                <article onClick={() => navigate("/interview")}>
                  <div className="image">
                    <img src="/images/pic02.jpg" alt="AI Interview" />
                  </div>
                  <div className="content">
                    <h3>AI Voice Mock Recruiter</h3>
                    <p>Simulate voice interviews and receive detailed scorecard evaluations.</p>
                    <span className="special">Launch Module ➔</span>
                  </div>
                </article>

                <article onClick={() => {
                  const element = document.getElementById("analytics-pulse");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}>
                  <div className="image">
                    <img src="/images/pic03.jpg" alt="Score Trends" />
                  </div>
                  <div className="content">
                    <h3>Performance Analytics</h3>
                    <p>Track your quiz accuracy, study velocity, and peer benchmarking.</p>
                    <span className="special">Scroll to Stats ➔</span>
                  </div>
                </article>
              </div>
            </div>

            {/* ROW 2: EXPLORE ADDITIONAL TOOLS */}
            <div className="features-slider-container" style={{ marginTop: "20px" }}>
              <h3 className="bebas-font">Advanced Preparation Features</h3>
              <div className="features-slider">
                <article onClick={() => navigate("/interview")}>
                  <div className="image">
                    <img src="/images/pic05.jpg" alt="Voice speech" />
                  </div>
                  <div className="content">
                    <h3>Speech-to-Text</h3>
                    <p>Interpret technical terms using natural voice audio input recognition.</p>
                    <span className="special">Explore ➔</span>
                  </div>
                </article>

                <article onClick={() => navigate("/notes")}>
                  <div className="image">
                    <img src="/images/pic06.jpg" alt="MCQ Evaluation" />
                  </div>
                  <div className="content">
                    <h3>Instant Evaluations</h3>
                    <p>Gain deep knowledge breakdowns and correction milestones.</p>
                    <span className="special">Explore ➔</span>
                  </div>
                </article>

                <article onClick={() => navigate("/profile")}>
                  <div className="image">
                    <img src="/images/pic07.jpg" alt="Badge History" />
                  </div>
                  <div className="content">
                    <h3>Profile & Badge Milestones</h3>
                    <p>Manage credentials, check score reports, and review earned awards.</p>
                    <span className="special">Explore ➔</span>
                  </div>
                </article>
              </div>
            </div>

            {/* ANALYTICS SECTION */}
            <div id="analytics-pulse" className="profile-grid" style={{ width: "100%", display: "flex", gap: "30px", flexWrap: "wrap", marginTop: "50px" }}>

              {/* STATS CARD */}
              <div className="left-col" style={{ flex: 1, minWidth: "300px" }}>
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                    Performance Pulse
                  </h3>
                  <div className="stats-grid" style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
                    <div className="stat-item" style={{ textAlign: "center" }}>
                      <span className="stat-value" style={{ color: "var(--text-white)", fontSize: "2.5em", fontWeight: "700", display: "block" }}>{totalQuizzes}</span>
                      <span className="stat-label" style={{ fontSize: "12px", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Attempts</span>
                    </div>
                    <div className="stat-item" style={{ textAlign: "center" }}>
                      <span className="stat-value" style={{ color: "var(--brand-red)", fontSize: "2.5em", fontWeight: "700", display: "block" }}>{avgScore}%</span>
                      <span className="stat-label" style={{ fontSize: "12px", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Accuracy</span>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "8px" }}>Benchmarking vs. Peers</p>
                    <div className="progress-container" style={{ height: "12px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                      <motion.div
                        className="progress-bar"
                        style={{ height: "100%", background: "linear-gradient(90deg, #E50914, #ff6b72)", width: `${Math.min(avgScore, 100)}%` }}
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

                {/* AI ROADMAP CTAS */}
                <motion.div
                  className="glass-card"
                  style={{ marginTop: "25px", border: "1px solid rgba(229, 9, 20, 0.3)" }}
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
                      className="button primary fit"
                      onClick={generateRoadmap}
                      disabled={isGenerating}
                      style={{ width: "100%" }}
                    >
                      {isGenerating ? "Analyzing..." : "Generate My Roadmap"}
                    </button>
                  ) : (
                    <div className="roadmap-preview">
                      <h4 style={{ color: "var(--brand-red)", marginBottom: "15px" }}>{roadmap.title}</h4>
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

              {/* SCORE TREND GRAPH */}
              <div className="right-col" style={{ flex: 1.5, minWidth: "350px" }}>
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ minHeight: "400px" }}
                >
                  <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                    Score Trend Analysis
                  </h3>
                  <div style={{ marginTop: "40px", height: "250px", width: "100%", position: "relative" }}>
                    {totalQuizzes > 0 ? (
                      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <path
                          d={`M ${user.scores.map((s, i) => `${(i / (totalQuizzes - 1 || 1)) * 400},${200 - (s.score / s.total) * 180}`).join(" L ")}`}
                          fill="none"
                          stroke="#E50914"
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
          <div className="auth-overlay">
            <motion.div
              className="auth-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
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
                            <span key={si} style={{ fontSize: "11px", background: "rgba(229, 9, 20, 0.15)", color: "#ff6b72", padding: "2px 8px", borderRadius: "10px", border: "1px solid rgba(229, 9, 20, 0.2)" }}>
                              🔗 {source}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="button primary fit" onClick={() => setShowModal(false)} style={{ marginTop: "20px" }}>
                Close Roadmap
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
