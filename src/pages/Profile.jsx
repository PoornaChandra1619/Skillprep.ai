import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
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

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setError("Error loading profile");
    }
  };

  if (error) {
    return (
      <div id="page-wrapper">
        <Navbar />
        <section id="wrapper">
          <header>
            <div className="inner">
              <h2 style={{ color: "#ef4444" }}>{error}</h2>
              <button className="button fit" onClick={() => navigate("/")} style={{ width: "200px", marginTop: "20px" }}>Go Back</button>
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
              <h2>Loading Profile...</h2>
            </div>
          </header>
        </section>
      </div>
    );
  }

  // Calculate Stats
  const totalQuizzes = user.scores?.length || 0;
  const avgScore = totalQuizzes
    ? Math.round((user.scores.reduce((acc, s) => acc + (s.score / s.total), 0) / totalQuizzes) * 100)
    : 0;

  const totalQuestions = user.scores?.reduce((acc, s) => acc + s.total, 0) || 0;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Determine Achievements
  const achievements = [];
  if (totalQuizzes >= 1) achievements.push({ icon: "🎯", label: "First Step" });
  if (totalQuizzes >= 5) achievements.push({ icon: "🔥", label: "Consistent" });
  if (avgScore >= 80 && totalQuizzes >= 3) achievements.push({ icon: "🎓", label: "Top Performer" });
  if (totalQuizzes >= 10) achievements.push({ icon: "🏆", label: "Quiz Master" });

  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header>
          <div className="inner">
            <h2>User Profile</h2>
            <p>Manage your account analytics, earned credentials, and study history.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner">
            <motion.div
              className="profile-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}
            >

              {/* LEFT COLUMN - USER INFO */}
              <div className="left-col" style={{ flex: 1, minWidth: "300px" }}>
                <div className="glass-card user-info-card" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
                  <div className="user-avatar" style={{ fontSize: "3.5em", marginBottom: "15px", display: "inline-block", background: "rgba(255,255,255,0.05)", borderRadius: "50%", width: "90px", height: "90px", lineHeight: "90px" }}>
                    👤
                  </div>
                  <h2 style={{ fontSize: "22px", color: "white", margin: "10px 0 5px" }}>{user.name}</h2>
                  <p style={{ opacity: 0.7, fontSize: "14px", margin: 0 }}>{user.email}</p>
                  <p style={{ fontSize: "12px", opacity: 0.5, marginTop: "8px" }}>Member since {memberSince}</p>

                  <div className="stats-grid" style={{ display: "flex", justifyContent: "space-around", marginTop: "30px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
                    <div className="stat-item" style={{ textAlign: "center" }}>
                      <span className="stat-value" style={{ color: "#22d3ee", fontSize: "1.8em", fontWeight: "700", display: "block" }}>{totalQuizzes}</span>
                      <span className="stat-label" style={{ fontSize: "10px", opacity: 0.6, textTransform: "uppercase" }}>Quizzes</span>
                    </div>
                    <div className="stat-item" style={{ textAlign: "center" }}>
                      <span className="stat-value" style={{ color: "#22d3ee", fontSize: "1.8em", fontWeight: "700", display: "block" }}>{totalQuestions}</span>
                      <span className="stat-label" style={{ fontSize: "10px", opacity: 0.6, textTransform: "uppercase" }}>Questions</span>
                    </div>
                    <div className="stat-item" style={{ textAlign: "center" }}>
                      <span className="stat-value" style={{ color: "#22d3ee", fontSize: "1.8em", fontWeight: "700", display: "block" }}>{avgScore}%</span>
                      <span className="stat-label" style={{ fontSize: "10px", opacity: 0.6, textTransform: "uppercase" }}>Avg. Score</span>
                    </div>
                  </div>

                  <div className="progress-section" style={{ marginTop: "25px", textAlign: "left" }}>
                    <span className="stat-label" style={{ fontSize: "12px", opacity: 0.8, display: "block", marginBottom: "8px" }}>Overall Proficiency</span>
                    <div className="progress-container" style={{ height: "10px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "5px", overflow: "hidden" }}>
                      <motion.div
                        className="progress-bar"
                        style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #22d3ee)", width: `${avgScore}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${avgScore}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="glass-card achievements-section" style={{ marginTop: "25px", background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <h3 className="major" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "15px" }}>Quick Actions</h3>
                  <div style={{ display: "flex", gap: "15px", marginTop: "15px", flexWrap: "wrap" }}>
                    <button className="button primary fit" onClick={() => navigate("/notes")}>Start Quiz</button>
                    <button className="button fit" onClick={() => navigate("/interview")}>Interview Prep</button>
                  </div>
                </div>

                {/* ACHIEVEMENTS */}
                <div className="glass-card achievements-section" style={{ marginTop: "25px", background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <h3 className="major" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "15px" }}>Achievements</h3>
                  {achievements.length > 0 ? (
                    <div className="badge-grid" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
                      {achievements.map((a, i) => (
                        <motion.div
                          key={i}
                          className="badge"
                          whileHover={{ scale: 1.05 }}
                          style={{
                            background: "rgba(34, 211, 238, 0.1)",
                            border: "1px solid rgba(34, 211, 238, 0.2)",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#22d3ee"
                          }}
                        >
                          <span>{a.icon}</span> {a.label}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ opacity: 0.6, fontSize: "14px" }}>Complete more quizzes to earn study badges!</p>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN - HISTORY */}
              <div className="right-col" style={{ flex: 1.5, minWidth: "350px", display: "flex", flexDirection: "column", gap: "25px" }}>
                
                {/* QUIZ HISTORY */}
                <div className="glass-card history-section" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <h3 className="major" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>Quiz History</h3>

                  {user.scores?.length === 0 ? (
                    <p style={{ opacity: 0.6 }}>No quiz attempts yet. Start practicing!</p>
                  ) : (
                    <div className="history-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {[...user.scores].reverse().map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}
                        >
                          <div>
                            <div className="history-score" style={{ fontWeight: "600", fontSize: "15px", color: "white" }}>
                              {s.score} / {s.total} Correct
                            </div>
                            <div className="history-date" style={{ fontSize: "11px", opacity: 0.5, marginTop: "2px" }}>
                              {new Date(s.date).toLocaleDateString()} at {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="score-percentage" style={{
                            color: (s.score / s.total) >= 0.8 ? "#22d3ee" : (s.score / s.total) >= 0.5 ? "#fbbf24" : "#ef4444",
                            fontWeight: 700,
                            fontSize: "16px"
                          }}>
                            {Math.round((s.score / s.total) * 100)}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* INTERVIEW HISTORY */}
                <div className="glass-card history-section" style={{ background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <h3 className="major" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>Interview History</h3>

                  {user.interviews?.length === 0 ? (
                    <p style={{ opacity: 0.6 }}>No interviews completed yet. Get started!</p>
                  ) : (
                    <div className="history-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {[...user.interviews].reverse().map((int, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}
                        >
                          <div>
                            <div className="history-score" style={{ fontWeight: "600", fontSize: "15px", color: "white" }}>
                              {int.role}
                            </div>
                            <div className="history-date" style={{ fontSize: "11px", opacity: 0.5, marginTop: "2px" }}>
                              {new Date(int.date).toLocaleDateString()} at {new Date(int.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="score-percentage" style={{
                            color: (int.score / 100) >= 0.8 ? "#22d3ee" : (int.score / 100) >= 0.5 ? "#fbbf24" : "#ef4444",
                            fontWeight: 700,
                            fontSize: "16px"
                          }}>
                            {int.score}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
