import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "../components/AuthModal";
import Navbar from "../components/Navbar";
import "./intro.css";

export default function Intro() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Open auth modal if ?login=true in URL
    if (searchParams.get("login") === "true") {
      setShowAuth(true);
      setSearchParams({}, { replace: true }); // clean URL
    }
  }, []);

  const openAuth = () => setShowAuth(true);
  const closeAuth = () => setShowAuth(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Floating particles for background
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="colorlib-page">
      <Navbar onLoginClick={openAuth} />

      {/* ================= FLOATING PARTICLES ================= */}
      <div className="particles-container" aria-hidden="true">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ================= HERO ================= */}
      <section className="hero">

        <motion.div
          className="watermark"
          animate={{ opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          S
        </motion.div>

        {/* LEFT */}
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            <motion.span
              className="hero-title-main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Skill
            </motion.span>
            <motion.span
              className="hero-title-accent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Prep
            </motion.span>
            <motion.span
              className="hero-title-ai"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
            >
              {" "}AI
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Practice interviews. Convert notes into quizzes.
            <br />
            Prepare smarter for your career.
          </motion.p>

          {!user ? (
            <motion.button
              className="get-started"
              onClick={openAuth}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          ) : (
            <motion.button
              className="get-started dashboard-btn"
              onClick={() => navigate("/dashboard")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: "transparent", border: "2px solid #22d3ee", color: "#22d3ee" }}
            >
              📊 Go to Dashboard
            </motion.button>
          )}
        </motion.div>

        {/* RIGHT — DASHBOARD AFTER LOGIN */}
        {user && (
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="feature-box">

              <motion.div
                className="feature-card"
                onClick={() => navigate("/notes")}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.04, y: -8 }}
              >
                <h3>🧠 Notes → Quiz (MCQs)</h3>
                <p>Convert notes into AI-generated quizzes.</p>
              </motion.div>

              <motion.div
                className="feature-card"
                onClick={() => navigate("/interview")}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.04, y: -8 }}
              >
                <h3>🎤 Interview Prep with AI</h3>
                <p>Practice real interview-style questions.</p>
              </motion.div>

            </div>
          </motion.div>
        )}
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Choose SkillPrep AI?
        </motion.h2>

        <div className="features-grid">
          {[
            { icon: "📄", title: "Notes to Quiz", desc: "Paste your study notes and let our AI generate multiple-choice questions instantly to test your knowledge.", delay: 0.1 },
            { icon: "🎤", title: "AI Voice Interviewer", desc: "Experience realistic technical interviews with our AI that speaks to you and reacts to your answers in real-time.", delay: 0.2 },
            { icon: "📊", title: "Performance Tracking", desc: "Keep track of your quiz scores and interview attempts to monitor your progress over time.", delay: 0.3 },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="feature-item"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.5, type: "spring", stiffness: 80 }}
              whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)" }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="section-container about-section">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>About Us</h2>
          <p>
            SkillPrep AI was built with a single mission: to make career preparation accessible, smart, and interactive.
            Whether you are a student preparing for exams or a professional gearing up for your next big interview,
            our AI-powered tools are designed to give you the competitive edge you need.
          </p>
          <p>
            Built by <strong>Poorna Chandra</strong>, this platform leverages the latest in Generative AI to provide
            personalized learning experiences.
          </p>
        </motion.div>
      </section>

      {/* ================= CONTACT / FOOTER SECTION ================= */}
      <footer id="contact" className="footer-section">
        <div className="footer-content">
          <motion.div
            className="footer-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            Sk<span>.</span>
          </motion.div>

          <div className="footer-info">
            <h3>Get in Touch</h3>
            <p>Ready to sharpen your skills? Contact us for any queries or feedback.</p>
            <div className="contact-details">
              <a href="mailto:purnachandra1619@gmail.com" className="contact-link">📧 purnachandra1619@gmail.com</a>
              <a
                href="https://github.com/PoornaChandra1619"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" width="20" />
                GitHub Profile
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} SkillPrep AI. Built by Poorna Chandra.</p>
          </div>
        </div>
      </footer>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuth && <AuthModal close={closeAuth} />}
      </AnimatePresence>
    </div>
  );
}
