import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useCountUp } from "../hooks/useCountUp";
import { useToast } from "../hooks/useToast";
import SkillPrepMark from "../components/SkillPrepMark";
import {
  Layers, GitFork, Workflow, ListOrdered, BarChart3, Brain,
  GitCompare, Database, Atom, Server, BrainCircuit, Binary, BookOpen, AlertCircle,
  FileText, Network, Mic, CheckSquare, Award, Building, MessageSquare, ShieldCheck, Zap, Terminal, Cpu, Code
} from "lucide-react";

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

// Skeletons
function PerformancePulseSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 0" }}>
      <div className="skeleton" style={{ height: 24, width: "60%" }} />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={{ textAlign: "center" }}>
          <div className="skeleton" style={{ height: 40, width: 60, marginBottom: "8px" }} />
          <div className="skeleton" style={{ height: 12, width: 70 }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="skeleton" style={{ height: 40, width: 60, marginBottom: "8px" }} />
          <div className="skeleton" style={{ height: 12, width: 70 }} />
        </div>
      </div>
      <div>
        <div className="skeleton" style={{ height: 12, width: "100%", marginBottom: "10px" }} />
        <div className="skeleton" style={{ height: 12, width: "100%" }} />
      </div>
    </div>
  );
}

function GraphSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15, height: "300px", justifyContent: "center" }}>
      <div className="skeleton" style={{ height: 25, width: "50%" }} />
      <div className="skeleton" style={{ height: "180px", width: "100%" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="skeleton" style={{ height: 35, width: "45%" }} />
        <div className="skeleton" style={{ height: 35, width: "45%" }} />
      </div>
    </div>
  );
}

const getCardVisualConfig = (itemId) => {
  switch (itemId) {
    case "dsa-1":
      return { icon: Layers, gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" };
    case "dsa-2":
      return { icon: GitFork, gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" };
    case "dsa-3":
      return { icon: Workflow, gradient: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)" };
    case "dsa-4":
      return { icon: ListOrdered, gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)" };
    case "ml-1":
      return { icon: BarChart3, gradient: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)" };
    case "ml-2":
      return { icon: Brain, gradient: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)" };
    case "ml-3":
      return { icon: GitCompare, gradient: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)" };
    case "ml-4":
      return { icon: Database, gradient: "linear-gradient(135deg, #b91c1c 0%, #ea580c 100%)" };
    case "web-1":
      return { icon: Atom, gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)" };
    case "web-2":
      return { icon: Server, gradient: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" };
    case "web-3":
      return { icon: Database, gradient: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)" };
    case "apt-1":
      return { icon: BrainCircuit, gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" };
    case "apt-2":
      return { icon: Binary, gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)" };
    case "apt-3":
      return { icon: BookOpen, gradient: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)" };
    case "trend-1":
      return { icon: FileText, gradient: "linear-gradient(135deg, #db2777 0%, #f43f5e 100%)" };
    case "trend-2":
      return { icon: Network, gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" };
    case "trend-3":
      return { icon: Mic, gradient: "linear-gradient(135deg, #059669 0%, #06b6d4 100%)" };
    case "nav-speech":
      return { icon: Mic, gradient: "linear-gradient(135deg, #059669 0%, #06b6d4 100%)" };
    case "nav-evals":
      return { icon: CheckSquare, gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" };
    case "nav-profile":
      return { icon: Award, gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" };
    case "nav-company":
      return { icon: Building, gradient: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" };
    
    // New Course Tracks visual config
    case "sys-1":
      return { icon: Server, gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" };
    case "sys-2":
      return { icon: Network, gradient: "linear-gradient(135deg, #581c87 0%, #a855f7 100%)" };
    case "sys-3":
      return { icon: Cpu, gradient: "linear-gradient(135deg, #0f172a 0%, #475569 100%)" };
    case "beh-1":
      return { icon: MessageSquare, gradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)" };
    case "beh-2":
      return { icon: ShieldCheck, gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)" };
    case "beh-3":
      return { icon: Mic, gradient: "linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)" };
    case "llm-1":
      return { icon: Code, gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" };
    case "llm-2":
      return { icon: Zap, gradient: "linear-gradient(135deg, #854d0e 0%, #eab308 100%)" };
    case "llm-3":
      return { icon: Terminal, gradient: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" };
    default:
      return { icon: AlertCircle, gradient: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)" };
  }
};

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
    id: "sys",
    label: "System Design & ML Architecture",
    cover: "/images/pic04.jpg",
    items: [
      { id: "sys-1", title: "Scale-Out Architectures", level: "Beginner", mins: 30, tag: "Architecture", desc: "Interactive scenarios mapping cache hits, load balancer algorithms, and relational database sharding techniques.", topics: ["Caching", "Load Balancers", "Database Sharding", "CDN"], type: "quiz" },
      { id: "sys-2", title: "RAG Pipeline Engineering", level: "Intermediate", mins: 45, tag: "Modern Systems", desc: "Build simulated semantic search systems comparing chunk overlap methods, vector database indexes, and hybrid keyword search.", topics: ["Vector Search", "Chunking Strategy", "HNSW Index", "Reciprocal Rank Fusion"], type: "quiz" },
      { id: "sys-3", title: "ML Serving & Feature Stores", level: "Advanced", mins: 50, tag: "Production ML", desc: "Design pipelines that handle drift, serving latency constraints, online feature generation, and offline-online storage sync.", topics: ["Feature Stores", "Model Registry", "Streaming Features", "Batch Prediction"], type: "quiz" },
    ],
  },
  {
    id: "beh",
    label: "STAR Behavioral Method",
    cover: "/images/pic02.jpg",
    items: [
      { id: "beh-1", title: "Conflict Resolution & Alignment", level: "Intermediate", mins: 25, tag: "STAR Method", desc: "Practice structuring disagree-and-commit situations and cross-functional alignment conversations in the STAR format.", topics: ["STAR Format", "Conflict Resolution", "Disagreement", "Influence"], type: "quiz" },
      { id: "beh-2", title: "Ownership & Bias for Action", level: "Beginner", mins: 20, tag: "Core Principles", desc: "Draft scenarios showing self-direction, accepting calculated technical risk, and driving a project beyond standard roles.", topics: ["Bias for Action", "Ownership", "Calculated Risk", "Proactivity"], type: "quiz" },
      { id: "beh-3", title: "STAR Builder Simulator", level: "Advanced", mins: 40, tag: "Recruiter Prep", desc: "Review guidelines and build structured STAR templates targeted directly at behavioral interviews for FAANG recruiters.", topics: ["STAR Format", "Recruiter Expectations", "FAANG Prep", "Behavioral Mock"], type: "quiz" },
    ],
  },
  {
    id: "llm",
    label: "Prompt Engineering & LLM Ops",
    cover: "/images/pic07.jpg",
    items: [
      { id: "llm-1", title: "Structured JSON Output Prompting", level: "Beginner", mins: 25, tag: "Prompt Engineering", desc: "Master system prompts, few-shot conditioning, and instruction structures to force LLMs into producing reliable JSON schemas.", topics: ["JSON Schema", "System Instructions", "Few-Shot Prompting", "Temperature Tuning"], type: "quiz" },
      { id: "llm-2", title: "LLM Evaluation & Red Teaming", level: "Intermediate", mins: 35, tag: "LLM Ops", desc: "Assess pipelines for safety checks, toxicity filtering, semantic similarity scoring, and mitigation against prompt injection.", topics: ["LLM Eval", "Red Teaming", "Hallucination Rating", "Prompt Injection"], type: "quiz" },
      { id: "llm-3", title: "Agentic Workflows & Tool Call", level: "Advanced", mins: 45, tag: "Agentic AI", desc: "Design ReAct loop agents that autonomously plan, select and invoke external APIs, parse outputs, and self-correct errors.", topics: ["ReAct Framework", "Tool Calling", "Loop Logic", "Error Recovery"], type: "quiz" },
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

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const { show: triggerToast, ToastUI } = useToast();

  // Streak state
  const [streak, setStreak] = useState({ currentStreak: 1, longestStreak: 1, lastActiveDate: "" });

  // Resume Review state
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [resumeResult, setResumeResult] = useState(null);
  const [showResumePanel, setShowResumePanel] = useState(false);

  // Selected Company Pack for Interview
  const [selectedPack, setSelectedPack] = useState("faang");



  const TRENDING_MODULES = [
    {
      id: "trend-1",
      title: "Resume Analyzer",
      category: "AI Support",
      level: "All Levels",
      mins: 10,
      tag: "LLM Review",
      desc: "Instant ATS score check, strength listings, keyword gaps, and professional bullet re-writing suggestions.",
      cover: "/images/pic07.jpg",
      type: "resume"
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

  const INTERVIEW_PACKS = [
    { id: "faang", label: "FAANG-Style Pack", focus: "System Design, STAR Behavioral, Medium/Hard Coding", tone: "Formal & time-boxed" },
    { id: "startup", label: "Startup-Style Pack", focus: "Ownership, Practical Coding Speed, Agile Mindset", tone: "Casual & fast-paced" },
    { id: "service", label: "Service-Company Pack", focus: "Tech Fundamentals, Aptitude, Client Communication", tone: "Structured & friendly" }
  ];



  useEffect(() => {
    fetchUserData();
    setupStreak();
  }, []);

  const setupStreak = () => {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem("streakData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const last = new Date(parsed.lastActiveDate);
      const diffDays = Math.floor((Date.now() - last.getTime()) / 86400000);

      if (diffDays === 0) {
        setStreak(parsed);
      } else if (diffDays === 1) {
        const nextStreak = {
          currentStreak: parsed.currentStreak + 1,
          longestStreak: Math.max(parsed.currentStreak + 1, parsed.longestStreak),
          lastActiveDate: today
        };
        setStreak(nextStreak);
        localStorage.setItem("streakData", JSON.stringify(nextStreak));
      } else {
        const nextStreak = {
          currentStreak: 1,
          longestStreak: parsed.longestStreak,
          lastActiveDate: today
        };
        setStreak(nextStreak);
        localStorage.setItem("streakData", JSON.stringify(nextStreak));
      }
    } else {
      const initial = { currentStreak: 1, longestStreak: 1, lastActiveDate: today };
      setStreak(initial);
      localStorage.setItem("streakData", JSON.stringify(initial));
    }
  };

  const fetchUserData = async () => {
    // 1. First load from localStorage to prevent screen flash/stuck on slow connections
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }

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
        localStorage.setItem("user", JSON.stringify(data)); // update cache
      } else if (res.status === 401) {
        // Token is invalid or expired: clear credentials and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
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
          scores: user?.scores || [],
          interviews: user?.interviews || []
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

  const handleStartAssessment = (item) => {
    setActiveAssessment(null);
    if (item.type === "resume") {
      setShowResumePanel(true);
    } else if (item.type === "profile") {
      navigate("/profile");
    } else if (item.type === "interview") {
      const packInfo = INTERVIEW_PACKS.find(p => p.id === selectedPack);
      navigate("/interview", { state: { role: item.role || "Full Stack Developer", tone: packInfo?.tone, focus: packInfo?.focus } });
    } else {
      const prompt = `Generate an MCQ quiz covering the following topic: ${item.title}. Subtopics to include: ${item.topics?.join(", ") || "General concepts"}. Difficulty level: ${item.level}.`;
      navigate("/quiz", { state: { notes: prompt } });
    }
  };

  const handleAnalyzeResume = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() && !resumeFile) {
      alert("Please upload a file or paste resume text first");
      return;
    }
    setIsReviewing(true);
    setResumeResult(null);

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append("resume", resumeFile);
      } else {
        formData.append("resumeText", resumeText);
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/review-resume`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to analyze");

      setResumeResult(data);
      triggerToast("Resume reviewed! ATS score calculated 🎯");
    } catch (err) {
      alert("Resume analysis failed: " + err.message);
    } finally {
      setIsReviewing(false);
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
    ? Math.round(((user?.scores || []).reduce((acc, s) => acc + (s.score / s.total), 0) / totalQuizzes) * 100)
    : 0;

  return (
    <div id="page-wrapper">
      <Navbar />

      {/* NETFLIX BILLBOARD HERO BANNER */}
      <section className="billboard-container" style={{ backgroundImage: `url('/images/pic02.jpg')` }}>
        <div className="billboard-content">
          <h2 className="bebas-font">AI VOICE INTERVIEWER</h2>
          <p>
            Experience realistic, mock interviews with our conversational AI recruiter. Select an interview prep pack focus area below to adjust interviewer tone.
          </p>

          {/* Company Pack selector */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap" }}>
            {INTERVIEW_PACKS.map(pack => (
              <button 
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
                  borderRadius: "20px",
                  background: selectedPack === pack.id ? "var(--brand-red)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${selectedPack === pack.id ? "var(--brand-red)" : "var(--glass-border)"}`,
                  color: "#ffffff",
                  cursor: "pointer"
                }}
                className="sp-btn"
              >
                {pack.label}
              </button>
            ))}
          </div>

          <div className="billboard-buttons">
            <button className="button primary sp-btn" onClick={() => handleStartAssessment({ type: "interview" })}>
              ▶ Start Mock
            </button>
            <button className="button sp-btn" onClick={() => {
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
                  <article 
                    key={item.id} 
                    onClick={() => setActiveAssessment(item)}
                    style={{ flex: "0 0 280px", height: "160px", position: "relative", overflow: "hidden", borderRadius: "10px", border: "1px solid var(--glass-border)", cursor: "pointer" }}
                    className="dashboard-thumbnail-card sp-card"
                  >
                    <div style={{ width: "100%", height: "100%" }}>
                      {(() => {
                        const config = getCardVisualConfig(item.id);
                        const IconComp = config.icon;
                        return (
                          <div style={{
                            width: "100%",
                            height: "100%",
                            background: config.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                          }} className="card-banner-img">
                            <div style={{
                              position: "absolute",
                              inset: 0,
                              opacity: 0.1,
                              backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
                              backgroundSize: "14px 14px"
                            }} />
                            <IconComp size={48} color="#ffffff" style={{ opacity: 0.9, zIndex: 2 }} />
                          </div>
                        );
                      })()}
                    </div>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,7,12,0.95) 0%, rgba(5,7,12,0.4) 50%, rgba(5,7,12,0) 100%)", display: "flex", alignItems: "flex-end", padding: "15px" }}>
                      <h3 style={{ fontSize: "1.05rem", color: "var(--text-white)", margin: 0, fontWeight: "600" }}>{item.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* SUBJECT-SPECIFIC PRACTICE TRACKS */}
            {CATEGORIES.map((cat) => (
              <div key={cat.id} id={`track-${cat.id}`} className="features-slider-container" style={{ marginTop: "35px", border: "1px solid transparent", borderRadius: "12px", transition: "border-color 0.5s ease" }}>
                <h3 className="bebas-font">{cat.label}</h3>
                <div className="features-slider">
                  {cat.items.map((item) => (
                    <article 
                      key={item.id} 
                      onClick={() => setActiveAssessment({ ...item, cover: cat.cover, category: cat.label })}
                      style={{ flex: "0 0 280px", height: "160px", position: "relative", overflow: "hidden", borderRadius: "10px", border: "1px solid var(--glass-border)", cursor: "pointer" }}
                      className="dashboard-thumbnail-card sp-card"
                    >
                      <div style={{ width: "100%", height: "100%" }}>
                        {(() => {
                          const config = getCardVisualConfig(item.id);
                          const IconComp = config.icon;
                          return (
                            <div style={{
                              width: "100%",
                              height: "100%",
                              background: config.gradient,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative"
                            }} className="card-banner-img">
                              <div style={{
                                position: "absolute",
                                inset: 0,
                                opacity: 0.1,
                                backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
                                backgroundSize: "14px 14px"
                              }} />
                              <IconComp size={48} color="#ffffff" style={{ opacity: 0.9, zIndex: 2 }} />
                            </div>
                          );
                        })()}
                      </div>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,7,12,0.95) 0%, rgba(5,7,12,0.4) 50%, rgba(5,7,12,0) 100%)", display: "flex", alignItems: "flex-end", padding: "15px" }}>
                        <h3 style={{ fontSize: "1.05rem", color: "var(--text-white)", margin: 0, fontWeight: "600" }}>{item.title}</h3>
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
                <article 
                  onClick={() => navigate("/interview")}
                  style={{ flex: "0 0 280px", height: "160px", position: "relative", overflow: "hidden", borderRadius: "10px", border: "1px solid var(--glass-border)", cursor: "pointer" }}
                  className="dashboard-thumbnail-card sp-card"
                >
                  <div style={{ width: "100%", height: "100%" }}>
                    {(() => {
                      const config = getCardVisualConfig("nav-speech");
                      const IconComp = config.icon;
                      return (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          background: config.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative"
                        }} className="card-banner-img">
                          <div style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0.1,
                            backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
                            backgroundSize: "14px 14px"
                          }} />
                          <IconComp size={48} color="#ffffff" style={{ opacity: 0.9, zIndex: 2 }} />
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,7,12,0.95) 0%, rgba(5,7,12,0.4) 50%, rgba(5,7,12,0) 100%)", display: "flex", alignItems: "flex-end", padding: "15px" }}>
                    <h3 style={{ fontSize: "1.05rem", color: "var(--text-white)", margin: 0, fontWeight: "600" }}>Speech-to-Text</h3>
                  </div>
                </article>

                <article 
                  onClick={() => navigate("/notes")}
                  style={{ flex: "0 0 280px", height: "160px", position: "relative", overflow: "hidden", borderRadius: "10px", border: "1px solid var(--glass-border)", cursor: "pointer" }}
                  className="dashboard-thumbnail-card sp-card"
                >
                  <div style={{ width: "100%", height: "100%" }}>
                    {(() => {
                      const config = getCardVisualConfig("nav-evals");
                      const IconComp = config.icon;
                      return (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          background: config.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative"
                        }} className="card-banner-img">
                          <div style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0.1,
                            backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
                            backgroundSize: "14px 14px"
                          }} />
                          <IconComp size={48} color="#ffffff" style={{ opacity: 0.9, zIndex: 2 }} />
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,7,12,0.95) 0%, rgba(5,7,12,0.4) 50%, rgba(5,7,12,0) 100%)", display: "flex", alignItems: "flex-end", padding: "15px" }}>
                    <h3 style={{ fontSize: "1.05rem", color: "var(--text-white)", margin: 0, fontWeight: "600" }}>Instant Evaluations</h3>
                  </div>
                </article>

                <article 
                  onClick={() => navigate("/profile")}
                  style={{ flex: "0 0 280px", height: "160px", position: "relative", overflow: "hidden", borderRadius: "10px", border: "1px solid var(--glass-border)", cursor: "pointer" }}
                  className="dashboard-thumbnail-card sp-card"
                >
                  <div style={{ width: "100%", height: "100%" }}>
                    {(() => {
                      const config = getCardVisualConfig("nav-profile");
                      const IconComp = config.icon;
                      return (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          background: config.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative"
                        }} className="card-banner-img">
                          <div style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0.1,
                            backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
                            backgroundSize: "14px 14px"
                          }} />
                          <IconComp size={48} color="#ffffff" style={{ opacity: 0.9, zIndex: 2 }} />
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,7,12,0.95) 0%, rgba(5,7,12,0.4) 50%, rgba(5,7,12,0) 100%)", display: "flex", alignItems: "flex-end", padding: "15px" }}>
                    <h3 style={{ fontSize: "1.05rem", color: "var(--text-white)", margin: 0, fontWeight: "600" }}>Profile & Badge Milestones</h3>
                  </div>
                </article>

                <article 
                  onClick={() => navigate("/questions")}
                  style={{ flex: "0 0 280px", height: "160px", position: "relative", overflow: "hidden", borderRadius: "10px", border: "1px solid var(--glass-border)", cursor: "pointer" }}
                  className="dashboard-thumbnail-card sp-card"
                >
                  <div style={{ width: "100%", height: "100%" }}>
                    {(() => {
                      const config = getCardVisualConfig("nav-company");
                      const IconComp = config.icon;
                      return (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          background: config.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative"
                        }} className="card-banner-img">
                          <div style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0.1,
                            backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
                            backgroundSize: "14px 14px"
                          }} />
                          <IconComp size={48} color="#ffffff" style={{ opacity: 0.9, zIndex: 2 }} />
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,7,12,0.95) 0%, rgba(5,7,12,0.4) 50%, rgba(5,7,12,0) 100%)", display: "flex", alignItems: "flex-end", padding: "15px" }}>
                    <h3 style={{ fontSize: "1.05rem", color: "var(--text-white)", margin: 0, fontWeight: "600" }}>Company Interview Packs</h3>
                  </div>
                </article>
              </div>
            </div>

            {/* ANALYTICS SECTION */}
            <div id="analytics-pulse" className="profile-grid" style={{ width: "100%", display: "flex", gap: "30px", flexWrap: "wrap", marginTop: "50px" }}>

              {/* STATS CARD */}
              <div className="left-col" style={{ flex: 1.1, minWidth: "300px" }}>
                <motion.div
                  className="glass-card sp-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                    Performance Pulse
                  </h3>
                  
                  {loading ? (
                    <PerformancePulseSkeleton />
                  ) : (
                    <>
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

                      {totalQuizzes === 0 && (
                        <div style={{
                          background: "rgba(124, 92, 255, 0.08)",
                          border: "1px solid rgba(124, 92, 255, 0.15)",
                          borderRadius: "8px",
                          padding: "12px",
                          marginTop: "20px",
                          textAlign: "center"
                        }}>
                          <p style={{ fontSize: "12.5px", color: "#a6c8ff", margin: 0, lineHeight: "1.4" }}>
                            🚀 <strong>Ready to start?</strong> Take a quick practice quiz to set your baseline score and start tracking your ranking trend!
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>

                {/* AI ROADMAP CTAS */}
                <motion.div
                  className="glass-card sp-card"
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

              {/* SCORE TREND GRAPH */}
              <div className="right-col" style={{ flex: 1.4, minWidth: "350px" }}>
                <motion.div
                  className="glass-card sp-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ minHeight: "400px" }}
                >
                  {loading ? (
                    <GraphSkeleton />
                  ) : (
                    <>
                      <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                        Score Trend Analysis
                      </h3>
                      <div style={{ marginTop: "40px", height: "250px", width: "100%", position: "relative" }}>
                        {totalQuizzes > 0 ? (
                          <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                            <path
                              d={`M ${(user?.scores || []).map((s, i) => `${(i / (totalQuizzes - 1 || 1)) * 400},${200 - (s.score / s.total) * 180}`).join(" L ")}`}
                              fill="none"
                              stroke="var(--brand-red)"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            {(user?.scores || []).map((s, i) => (
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
                          <div style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: "20px"
                          }}>
                            <div style={{
                              width: 60,
                              height: 60,
                              borderRadius: "50%",
                              background: "rgba(124, 92, 255, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "16px"
                            }}>
                              <span style={{ fontSize: "28px" }}>📈</span>
                            </div>
                            <p style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: "600", fontSize: "16px", marginBottom: "8px", margin: 0 }}>No quiz attempts yet</p>
                            <p style={{ color: "var(--text-grey)", fontSize: "13.5px", maxWidth: "280px", marginTop: "4px", marginBottom: "16px", lineHeight: "1.5" }}>
                              Your learning progress chart is currently empty. Take a quiz to map your proficiency!
                            </p>
                            <button
                              onClick={() => {
                                const el = document.getElementById("wrapper");
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth" });
                                } else {
                                  window.scrollTo({ top: 500, behavior: "smooth" });
                                }
                              }}
                              style={{
                                background: "rgba(124, 92, 255, 0.15)",
                                border: "1px solid rgba(124, 92, 255, 0.3)",
                                color: "#a6c8ff",
                                padding: "8px 18px",
                                borderRadius: "20px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                              }}
                              className="sp-btn"
                            >
                              Take your first quiz to unlock your trend →
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", gap: "20px" }}>
                        <button className="button primary fit sp-btn" onClick={() => navigate("/notes")}>Launch New Quiz</button>
                        <button className="button fit sp-btn" onClick={() => navigate("/profile")}>Edit Profile</button>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

            </div>



          </div>
        </div>
      </section>

      {/* RESUME REVIEW MODAL (Absolute slider panel) */}
      <AnimatePresence>
        {showResumePanel && (
          <div className="auth-overlay drawer-backdrop" onClick={() => setShowResumePanel(false)} style={{ zIndex: 20000 }}>
            <motion.div
              className="auth-card drawer-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "550px",
                maxWidth: "100%",
                borderRadius: 0,
                overflowY: "auto",
                padding: "40px 30px",
                textAlign: "left"
              }}
            >
              <button onClick={() => setShowResumePanel(false)} className="close-btn">✕</button>
              
              <h2 className="bebas-font" style={{ fontSize: "2rem", color: "var(--brand-red)", marginBottom: "5px" }}>
                AI Resume Reviewer
              </h2>
              <p className="auth-subtitle" style={{ marginBottom: "30px" }}>
                Score your resume compatibility and optimize bullet points for ATS scanners.
              </p>

              {isReviewing ? (
                <div style={{ padding: "40px 0", textAlign: "center" }}>
                  <div className="skeleton" style={{ height: "40px", width: "40px", borderRadius: "50%", margin: "0 auto 20px auto" }} />
                  <div className="skeleton" style={{ height: "20px", width: "60%", margin: "0 auto 10px auto" }} />
                  <div className="skeleton" style={{ height: "14px", width: "40%", margin: "0 auto" }} />
                </div>
              ) : resumeResult ? (
                <div>
                  {/* ATS Score banner */}
                  <div style={{ display: "flex", gap: "20px", alignItems: "center", background: "rgba(124, 92, 255, 0.1)", border: "1px solid rgba(124, 92, 255, 0.3)", borderRadius: "12px", padding: "20px", marginBottom: "30px" }}>
                    <div style={{
                      width: "70px", height: "70px", borderRadius: "50%", border: "4px solid var(--brand-red)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: "bold"
                    }}>
                      {resumeResult.overall_score}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: "#ffffff", fontWeight: "600" }}>Overall ATS Compatibility Score</h4>
                      <p style={{ margin: "5px 0 0 0", fontSize: "13px", opacity: 0.7 }}>Based on tech keyword alignments and STAR bullet points.</p>
                    </div>
                  </div>

                  {/* Strengths */}
                  <h4 className="bebas-font" style={{ color: "var(--brand-cyan)", fontSize: "1.1rem", marginBottom: "10px" }}>Strengths</h4>
                  <ul style={{ paddingLeft: "15px", listStyle: "circle", fontSize: "13px", marginBottom: "25px", opacity: 0.9 }}>
                    {resumeResult.strengths?.map((item, i) => (
                      <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
                    ))}
                  </ul>

                  {/* Gaps */}
                  <h4 className="bebas-font" style={{ color: "var(--brand-red)", fontSize: "1.1rem", marginBottom: "10px" }}>Gaps / Areas to improve</h4>
                  <ul style={{ paddingLeft: "15px", listStyle: "circle", fontSize: "13px", marginBottom: "25px", opacity: 0.9 }}>
                    {resumeResult.gaps?.map((item, i) => (
                      <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
                    ))}
                  </ul>

                  {/* ATS Flags */}
                  {resumeResult.ats_flags && resumeResult.ats_flags.length > 0 && (
                    <>
                      <h4 className="bebas-font" style={{ color: "#ffd23f", fontSize: "1.1rem", marginBottom: "10px" }}>⚠️ ATS Formatting Alerts</h4>
                      <ul style={{ paddingLeft: "15px", listStyle: "circle", fontSize: "13px", marginBottom: "25px", opacity: 0.9 }}>
                        {resumeResult.ats_flags.map((item, i) => (
                          <li key={i} style={{ marginBottom: "6px", color: "#ffd23f" }}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Bullet Rewrite Suggestions */}
                  {resumeResult.rewrite_suggestions && resumeResult.rewrite_suggestions.length > 0 && (
                    <div style={{ marginTop: "30px", borderTop: "1px solid var(--glass-border)", paddingTop: "20px" }}>
                      <h4 className="bebas-font" style={{ color: "#ffffff", fontSize: "1.2rem", marginBottom: "15px" }}>💡 Bullet Rewrite Suggestions</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {resumeResult.rewrite_suggestions.map((item, i) => (
                          <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "8px", padding: "15px" }}>
                            <div style={{ fontSize: "12px", color: "var(--text-grey)", textTransform: "uppercase", marginBottom: "6px" }}>Original</div>
                            <p style={{ fontSize: "13px", color: "var(--brand-red)", margin: "0 0 10px 0", fontStyle: "italic" }}>"{item.original}"</p>
                            <div style={{ fontSize: "12px", color: "var(--brand-cyan)", textTransform: "uppercase", marginBottom: "6px" }}>ATS-Optimized Option</div>
                            <p style={{ fontSize: "13px", color: "var(--text-white)", margin: 0, fontWeight: "500" }}>"{item.improved}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="button fit sp-btn" onClick={() => setResumeResult(null)} style={{ marginTop: "30px", width: "100%" }}>
                    Review Another Resume
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAnalyzeResume} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "2px dashed var(--glass-border)", borderRadius: "10px", padding: "30px 20px", textAlign: "center", cursor: "pointer" }}>
                    <input 
                      type="file" 
                      accept=".pdf,.txt" 
                      id="resume-file" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setResumeFile(file);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="resume-file" style={{ cursor: "pointer", display: "block" }}>
                      <span style={{ fontSize: "2rem", display: "block", marginBottom: "10px" }}>📄</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", display: "block" }}>
                        {resumeFile ? `Selected: ${resumeFile.name}` : "Upload Resume PDF or Text File"}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-grey)", marginTop: "4px", display: "block" }}>Maximum size 5MB</span>
                    </label>
                  </div>

                  <div style={{ textAlign: "center", color: "var(--text-grey)", fontSize: "12px" }}>OR PASTE TEXT</div>

                  <div className="input-group">
                    <textarea 
                      placeholder="Paste your raw resume text copy here..."
                      value={resumeText}
                      onChange={(e) => {
                        setResumeText(e.target.value);
                        setResumeFile(null); // Clear file upload if pasting text
                      }}
                      style={{ minHeight: "180px", width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", color: "#ffffff", border: "1px solid var(--glass-border)", borderRadius: "8px" }}
                    />
                  </div>

                  <button type="submit" className="button primary fit sp-btn" style={{ width: "100%" }}>
                    Analyze ATS Score
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              {(() => {
                const config = getCardVisualConfig(activeAssessment.id);
                if (config.icon !== AlertCircle) {
                  const IconComp = config.icon;
                  return (
                    <div style={{
                      height: "220px",
                      position: "relative",
                      background: config.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.1,
                        backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
                        backgroundSize: "16px 16px"
                      }} />
                      <IconComp size={64} color="#ffffff" style={{ opacity: 0.9 }} />
                      <button onClick={() => setActiveAssessment(null)} className="close-btn" style={{ top: "15px", right: "15px" }}>✕</button>
                    </div>
                  );
                }
                return (
                  <div style={{ height: "220px", position: "relative", backgroundImage: `url(${activeAssessment.cover})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--bg-deep) 100%)" }} />
                    <button onClick={() => setActiveAssessment(null)} className="close-btn" style={{ top: "15px", right: "15px" }}>✕</button>
                  </div>
                );
              })()}

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
                  <button className="button primary fit sp-btn" onClick={() => handleStartAssessment(activeAssessment)} style={{ flex: 2 }}>
                    ▶ Start Drill
                  </button>
                  <button className="button fit sp-btn" onClick={() => setActiveAssessment(null)} style={{ flex: 1 }}>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER TOAST POPUPS */}
      {ToastUI}

    </div>
  );
}
