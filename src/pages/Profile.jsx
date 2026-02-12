import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./intro.css";

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
      <div className="profile-container">
        <h2 style={{ color: "#ef4444" }}>{error}</h2>
        <button className="get-started" onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  // Calculate Stats
  const totalQuizzes = user.scores?.length || 0;
  const avgScore = totalQuizzes
    ? Math.round((user.scores.reduce((acc, s) => acc + (s.score / s.total), 0) / totalQuizzes) * 100)
    : 0;

  // Determine Achievements
  const achievements = [];
  if (totalQuizzes >= 1) achievements.push({ icon: "🎯", label: "First Step" });
  if (totalQuizzes >= 5) achievements.push({ icon: "🔥", label: "Consistent" });
  if (avgScore >= 80 && totalQuizzes >= 3) achievements.push({ icon: "🎓", label: "Top Performer" });
  if (totalQuizzes >= 10) achievements.push({ icon: "🏆", label: "Quiz Master" });

  return (
    <div className="profile-container">
      <motion.div
        className="profile-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        {/* LEFT COLUMN - USER INFO */}
        <div className="left-col">
          <div className="glass-card user-info-card">
            <div className="user-avatar">
              👤
            </div>
            <h2>{user.name}</h2>
            <p style={{ opacity: 0.7 }}>{user.email}</p>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{totalQuizzes}</span>
                <span className="stat-label">Quizzes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{avgScore}%</span>
                <span className="stat-label">Avg. Score</span>
              </div>
            </div>

            <div className="progress-section" style={{ marginTop: "20px", textAlign: "left" }}>
              <span className="stat-label">Overall Proficiency</span>
              <div className="progress-container">
                <motion.div
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${avgScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="glass-card achievements-section">
            <h3>Achievements</h3>
            {achievements.length > 0 ? (
              <div className="badge-grid">
                {achievements.map((a, i) => (
                  <motion.div
                    key={i}
                    className="badge"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>{a.icon}</span> {a.label}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.6 }}>Complete more quizzes to earn badges!</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - HISTORY */}
        <div className="right-col">
          <div className="glass-card history-section">
            <h3>Quiz History</h3>

            {user.scores?.length === 0 ? (
              <p>No quiz attempts yet. Start practicing!</p>
            ) : (
              <div className="history-list">
                {[...user.scores].reverse().map((s, i) => (
                  <motion.div
                    key={i}
                    className="history-item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div>
                      <div className="history-score">
                        {s.score} / {s.total}
                      </div>
                      <div className="history-date">
                        {new Date(s.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="score-percentage" style={{
                      color: (s.score / s.total) >= 0.8 ? "#22d3ee" : (s.score / s.total) >= 0.5 ? "#fbbf24" : "#ef4444",
                      fontWeight: 700
                    }}>
                      {Math.round((s.score / s.total) * 100)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

      </motion.div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button className="nav-btn" onClick={() => navigate("/")}>Back to Dashboard</button>
      </div>
    </div>
  );
}
