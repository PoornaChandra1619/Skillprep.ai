import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/useToast";

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

  // Navigation tab state
  const [activeTab, setActiveTab] = useState("Overview");

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

          {/* RIGHT CONTAINER - CONTENT TABS */}
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

              {/* Side-by-side Quiz & Interview History Section */}
              <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
                
                {/* QUIZ HISTORY CARD */}
                <div style={{ flex: 1, minWidth: "300px", background: "rgba(30, 30, 35, 0.55)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "20px" }}>
                  <h3 className="bebas-font" style={{ fontSize: "1.4rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "15px" }}>
                    Quiz History
                  </h3>
                  {user.scores?.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: "13px" }}>No quiz attempts yet. Start practicing!</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
                      {[...user.scores].reverse().map((s, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(0,0,0,0.25)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div>
                            <div style={{ fontWeight: "600", fontSize: "13px", color: "white" }}>
                              {s.score} / {s.total} Correct
                            </div>
                            <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "2px" }}>
                              {new Date(s.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ color: (s.score / s.total) >= 0.8 ? "var(--brand-red)" : "#fbbf24", fontWeight: 700, fontSize: "14px" }}>
                            {Math.round((s.score / s.total) * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* INTERVIEW HISTORY CARD */}
                <div style={{ flex: 1, minWidth: "300px", background: "rgba(30, 30, 35, 0.55)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "20px" }}>
                  <h3 className="bebas-font" style={{ fontSize: "1.4rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px", marginBottom: "15px" }}>
                    Interview History
                  </h3>
                  {user.interviews?.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: "13px" }}>No interviews completed yet. Get started!</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
                      {[...user.interviews].reverse().map((int, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(0,0,0,0.25)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div>
                            <div style={{ fontWeight: "600", fontSize: "13px", color: "white" }}>
                              {int.role}
                            </div>
                            <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "2px" }}>
                              {new Date(int.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ color: (int.score / 100) >= 0.8 ? "var(--brand-red)" : "#fbbf24", fontWeight: 700, fontSize: "14px" }}>
                            {int.score}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* RENDER TOAST NOTIFICATIONS */}
      {ToastUI}
    </div>
  );
}
