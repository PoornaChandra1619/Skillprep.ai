import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState(null);

  // Categories and assessments data model
  const CATEGORIES = [
    {
      id: "dsa",
      label: "Data Structures & Algorithms",
      cover: "/images/pic01.jpg",
      items: [
        { id: "dsa-1", title: "Arrays & Two Pointers", level: "Beginner", mins: 25, tag: "Foundations", desc: "Sharpen pattern recognition across sliding windows, prefix sums, and two-pointer techniques with AI-graded practice sets.", topics: ["Arrays", "Two Pointers", "Sliding Window", "Prefix Sums"], type: "quiz" },
        { id: "dsa-2", title: "Trees & Graph Traversal", level: "Intermediate", mins: 40, tag: "Core", desc: "Work through BFS, DFS, and tree recursion problems, with instant feedback on time complexity reasoning.", topics: ["Binary Trees", "Graphs", "BFS/DFS", "Recursion"], type: "quiz" },
        { id: "dsa-3", title: "Dynamic Programming Drills", level: "Advanced", mins: 45, tag: "Interview-Ready", desc: "Tackle classic DP formulations and get personalized hints when your recurrence relation goes off track.", topics: ["Memoization", "Tabulation", "Knapsack", "LIS"], type: "quiz" },
        { id: "dsa-4", title: "Heaps & Priority Queues", level: "Intermediate", mins: 30, tag: "Core", desc: "Practice problems that rely on heap-based scheduling and top-k selection patterns.", topics: ["Heaps", "Priority Queues", "Top-K"], type: "quiz" },
      ],
    },
    {
      id: "ml",
      label: "Machine Learning",
      cover: "/images/pic03.jpg",
      items: [
        { id: "ml-1", title: "Model Evaluation Metrics", level: "Beginner", mins: 20, tag: "Foundations", desc: "Precision, recall, F1, and ROC-AUC explained through interactive scenario questions.", topics: ["Precision/Recall", "F1 Score", "ROC-AUC", "Confusion Matrix"], type: "quiz" },
        { id: "ml-2", title: "Neural Network Fundamentals", level: "Intermediate", mins: 50, tag: "Core", desc: "Backpropagation, activation functions, and optimizer behavior — quizzed and explained by the assessment engine.", topics: ["Backprop", "Activations", "Optimizers", "Loss Functions"], type: "quiz" },
        { id: "ml-3", title: "Transfer Learning in Practice", level: "Intermediate", mins: 35, tag: "Applied", desc: "Based on real transfer-learning workflows, like fine-tuning MobileNet for image classification tasks.", topics: ["Fine-tuning", "MobileNet", "Feature Extraction"], type: "quiz" },
        { id: "ml-4", title: "RAG & LLM Pipelines", level: "Advanced", mins: 55, tag: "Interview-Ready", desc: "Design questions on retrieval-augmented generation, chunking strategy, and vector search trade-offs.", topics: ["RAG", "Embeddings", "Vector DBs", "LangChain"], type: "quiz" },
      ],
    },
    {
      id: "web",
      label: "Web Development",
      cover: "/images/pic04.jpg",
      items: [
        { id: "web-1", title: "React Component Patterns", level: "Beginner", mins: 25, tag: "Foundations", desc: "Hooks, prop drilling, and component composition, assessed through short applied challenges.", topics: ["Hooks", "State", "Props", "Composition"], type: "quiz" },
        { id: "web-2", title: "REST API Design", level: "Intermediate", mins: 30, tag: "Core", desc: "Practice designing clean, resource-oriented APIs with feedback on status codes and structure.", topics: ["REST", "Status Codes", "Auth", "Versioning"], type: "quiz" },
        { id: "web-3", title: "SQL & Database Modeling", level: "Intermediate", mins: 35, tag: "Core", desc: "Schema design and query-writing drills graded for correctness and efficiency.", topics: ["Joins", "Normalization", "Indexing"], type: "quiz" },
      ],
    },
    {
      id: "apt",
      label: "Aptitude & Reasoning",
      cover: "/images/pic06.jpg",
      items: [
        { id: "apt-1", title: "Logical Reasoning Sprint", level: "Beginner", mins: 20, tag: "Placement Prep", desc: "Timed reasoning sets modeled on common placement-exam formats.", topics: ["Puzzles", "Series", "Syllogisms"], type: "quiz" },
        { id: "apt-2", title: "Quantitative Aptitude", level: "Intermediate", mins: 30, tag: "Placement Prep", desc: "Speed and accuracy drills across arithmetic, percentages, and probability.", topics: ["Arithmetic", "Percentages", "Probability"], type: "quiz" },
        { id: "apt-3", title: "Verbal & Comprehension", level: "Beginner", mins: 20, tag: "Placement Prep", desc: "Reading comprehension and grammar sets with explanation-on-demand.", topics: ["Grammar", "Comprehension", "Vocabulary"], type: "quiz" },
      ],
    },
  ];

  // Trending career modules
  const TRENDING_MODULES = [
    {
      id: "trend-1",
      title: "Resume Deep-Dive",
      category: "Career Support",
      level: "All Levels",
      mins: 15,
      tag: "Profile",
      desc: "Analyze your profile credentials, score history, and badge achievements to customize your resume representation.",
      cover: "/images/pic07.jpg",
      type: "profile"
    },
    {
      id: "trend-2",
      title: "System Design Sprint",
      category: "Architecture & Scaling",
      level: "Advanced",
      mins: 35,
      tag: "Design",
      desc: "Practice scaling design questions like building tinyURL or chat architecture, evaluated for reliability.",
      cover: "/images/pic04.jpg",
      topics: ["Microservices", "Caching", "Load Balancing", "DB Sharding"],
      type: "quiz"
    },
    {
      id: "trend-3",
      title: "AI Voice Mock Recruiter",
      category: "General Interviewing",
      level: "Intermediate",
      mins: 30,
      tag: "Interview",
      desc: "Simulate a live speech interview for standard tech job descriptions, with prompt accuracy evaluation.",
      cover: "/images/pic02.jpg",
      topics: ["Behavioral QA", "Coding Logic", "Career Alignment"],
      type: "interview",
      role: "Full Stack Developer"
    }
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const track = params.get("track");
    if (track && !loading) {
      setTimeout(() => {
        const element = document.getElementById(`track-${track}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          // Highlight border briefly
          element.style.borderColor = "var(--brand-cyan)";
          setTimeout(() => { element.style.borderColor = "var(--glass-border)"; }, 2000);
        }
      }, 500);
    }
  }, [location, loading]);

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

  const handleStartAssessment = (item) => {
    setActiveAssessment(null);
    if (item.type === "profile") {
      navigate("/profile");
    } else if (item.type === "interview") {
      navigate("/interview", { state: { role: item.role || "Full Stack Developer" } });
    } else {
      // Dynamic quiz prompt generation
      const prompt = `Generate an MCQ quiz covering the following topic: ${item.title}. Subtopics to include: ${item.topics?.join(", ") || "General concepts"}. Difficulty level: ${item.level}.`;
      navigate("/quiz", { state: { notes: prompt } });
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
            <button className="button primary" onClick={() => navigate("/interview", { state: { role: "Full Stack Developer" } })}>
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
            
            {/* ROW 1: TRENDING MODULES */}
            <div className="features-slider-container">
              <h3 className="bebas-font">Trending Career Prep Modules</h3>
              <div className="features-slider">
                {TRENDING_MODULES.map((item) => (
                  <article key={item.id} onClick={() => setActiveAssessment(item)}>
                    <div className="image">
                      <img src={item.cover} alt={item.title} />
                    </div>
                    <div className="content">
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                      <span className="special">Launch Module ➔</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* SUBJECT-SPECIFIC PRACTICE TRACKS */}
            {CATEGORIES.map((cat) => (
              <div key={cat.id} id={`track-${cat.id}`} className="features-slider-container" style={{ marginTop: "30px", border: "1px solid transparent", borderRadius: "12px", transition: "border-color 0.5s ease" }}>
                <h3 className="bebas-font">{cat.label}</h3>
                <div className="features-slider">
                  {cat.items.map((item) => (
                    <article key={item.id} onClick={() => setActiveAssessment({ ...item, cover: cat.cover, category: cat.label })}>
                      <div className="image">
                        <img src={cat.cover} alt={item.title} />
                      </div>
                      <div className="content">
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                        <span className="special">Start Drill ➔</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}

            {/* EXPLORE ADDITIONAL TOOLS */}
            <div className="features-slider-container" style={{ marginTop: "40px" }}>
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
                        style={{ height: "100%", background: "linear-gradient(90deg, #7c5cff, #2fd9d9)", width: `${Math.min(avgScore, 100)}%` }}
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
                  style={{ marginTop: "25px", border: "1px solid rgba(124, 92, 255, 0.3)" }}
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
                      <h4 style={{ color: "var(--brand-cyan)", marginBottom: "15px" }}>{roadmap.title}</h4>
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

              <button className="button primary fit" onClick={() => setShowModal(false)} style={{ marginTop: "20px" }}>
                Close Roadmap
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSESSMENT DETAIL MODAL */}
      <AnimatePresence>
        {activeAssessment && (
          <div className="auth-overlay" onClick={() => setActiveAssessment(null)}>
            <motion.div
              className="auth-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "600px", padding: "0px", overflow: "hidden", borderRadius: "16px" }}
            >
              {/* Cover Image */}
              <div style={{ height: "200px", position: "relative", backgroundImage: `url(${activeAssessment.cover})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--bg-deep) 100%)" }} />
                <button onClick={() => setActiveAssessment(null)} className="close-btn" style={{ top: "15px", right: "15px" }}>✕</button>
              </div>

              {/* Content */}
              <div style={{ padding: "30px", textAlign: "left" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(124,92,255,0.15)", border: "1px solid rgba(124,92,255,0.3)", color: "var(--brand-red)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", padding: "4px 10px", borderRadius: "20px" }}>
                    {activeAssessment.tag || activeAssessment.level}
                  </span>
                  <span style={{ background: "rgba(47,217,217,0.15)", border: "1px solid rgba(47,217,217,0.3)", color: "var(--brand-cyan)", fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "20px" }}>
                    ⏱ {activeAssessment.mins} mins
                  </span>
                </div>

                <h2 className="bebas-font" style={{ fontSize: "2.2rem", color: "var(--text-white)", marginBottom: "8px", lineHeight: "1.1" }}>{activeAssessment.title}</h2>
                <p style={{ color: "var(--text-grey)", fontSize: "13px", marginBottom: "16px" }}>{activeAssessment.category || "General Prep"}</p>
                
                <p style={{ fontSize: "15px", color: "var(--text-white)", lineHeight: "1.6", opacity: 0.9, marginBottom: "22px" }}>
                  {activeAssessment.desc}
                </p>

                {activeAssessment.topics && (
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
                    <h4 className="bebas-font" style={{ fontSize: "1.1rem", color: "var(--text-grey)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>Topics covered</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {activeAssessment.topics.map(t => (
                        <span key={t} style={{ fontSize: "12px", padding: "5px 12px", borderRadius: "20px", background: "var(--bg-deep)", border: "1px solid var(--glass-border)", color: "var(--text-white)", display: "flex", alignItems: "center", gap: "5px" }}>
                          <span style={{ color: "var(--brand-cyan)" }}>✓</span> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px" }}>
                  <button className="button primary fit" onClick={() => handleStartAssessment(activeAssessment)} style={{ flex: 2 }}>
                    ▶ Start Assessment
                  </button>
                  <button className="button fit" onClick={() => setActiveAssessment(null)} style={{ flex: 1 }}>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
