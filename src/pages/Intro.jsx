import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import { useScrollReveal } from "../hooks/useScrollReveal";
import BlurText from "../components/BlurText";
import Lightfall from "../components/Lightfall";
import LogoLoop from "../components/LogoLoop";
import { Code, Brain, Globe, Lightbulb } from "lucide-react";
import { FaGoogle, FaAmazon, FaMicrosoft, FaApple, FaFacebook, FaSpotify, FaPaypal, FaGithub } from "react-icons/fa";
import SkillPrepMark from "../components/SkillPrepMark";

const techLogos = [
  { node: <FaGoogle />, title: "Google" },
  { node: <FaAmazon />, title: "Amazon" },
  { node: <FaMicrosoft />, title: "Microsoft" },
  { node: <FaApple />, title: "Apple" },
  { node: <FaFacebook />, title: "Facebook" },
  { node: <FaSpotify />, title: "Spotify" },
  { node: <FaPaypal />, title: "PayPal" },
  { node: <FaGithub />, title: "GitHub" }
];

function RevealSection({ children }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 500ms ease, transform 500ms ease",
      }}
    >
      {children}
    </div>
  );
}

export default function Intro() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "true") {
      setShowAuth(true);
    }
  }, []);

  const openAuth = () => setShowAuth(true);
  const closeAuth = () => {
    setShowAuth(false);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  };

  const handleActionClick = (targetPath) => {
    if (user) {
      navigate(targetPath);
    } else {
      openAuth();
    }
  };

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    openAuth();
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in all fields.");
      return;
    }
    alert(`Thank you, ${contactForm.name}! Your message has been sent successfully.`);
    setContactForm({ name: "", email: "", message: "" });
  };

  const faqs = [
    {
      question: "What is SkillPrep AI?",
      answer: "SkillPrep AI is an advanced career preparation platform that helps you study smarter using AI. You can generate custom multiple-choice quizzes from your study notes or practice technical and behavioral mock interviews with our interactive AI voice agent."
    },
    {
      question: "How does the AI Voice Interviewer work?",
      answer: "Choose your target role (like Frontend Developer, Data Scientist, DevOps) and upload your resume. Our AI agent will speak mock interview questions aloud, listen to your response via Web Speech API, and compile a detailed rating score report detailing mistakes and improvements."
    },
    {
      question: "Is my personal study data saved?",
      answer: "Yes! When you log in with your account or through Google, your quiz attempts, interview reports, proficiency trends, and AI-generated study roadmaps are fully preserved on your personal dashboard directory."
    },
    {
      question: "How do I get started?",
      answer: "Simply enter your email address in the signup box above and click 'Get Started' to register your free account, or click the 'Sign In' button on the top right to access your personalized dashboard."
    }
  ];

  return (
    <div id="page-wrapper">
      {/* NAVBAR */}
      <Navbar onLoginClick={openAuth} />

      {/* BANNER / HERO WITH LIGHTFALL BACKDROP */}
      <section id="banner" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <Lightfall
            colors={['#A6C8FF', '#5227FF', '#FF9FFC']}
            backgroundColor="#0B091B"
            speed={0.8}
            streakCount={8}
            streakWidth={1.5}
            streakLength={1.5}
            glow={1.2}
            density={0.8}
            twinkle={0.8}
            zoom={2.5}
            backgroundGlow={0.6}
            opacity={1}
            mouseInteraction={true}
            mouseStrength={0.8}
            mouseRadius={0.7}
          />
        </div>
        {/* Large Logo Watermark */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 1
        }}>
          <SkillPrepMark size={420} />
        </div>
        <div className="inner" style={{
          position: "relative",
          zIndex: 2,
          background: "radial-gradient(circle, rgba(10, 7, 29, 0.85) 0%, rgba(10, 7, 29, 0.3) 70%, rgba(10, 7, 29, 0) 100%)",
          padding: "40px 20px",
          maxWidth: "900px",
          margin: "0 auto"
        }}>
          <div className="pill-badge-container" style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <span className="pill-badge" style={{
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "999px",
              padding: "8px 16px",
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.8)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backdropFilter: "blur(8px)",
              fontWeight: "500",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.15)"
            }}>
              <span style={{
                background: "#fff",
                color: "#0a071d",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase"
              }}>NEW</span>
              <span>AI Voice Recruiter v2.0</span>
            </span>
          </div>

          <h2 style={{
            fontSize: "clamp(36px, 5vw, 68px)",
            fontWeight: "800",
            textAlign: "center",
            marginBottom: "20px",
            color: "#fff",
            lineHeight: "1.15",
            letterSpacing: "-0.02em"
          }}>
            <BlurText
              text="Skills, evaluated. Feedback, instant."
              delay={60}
              animateBy="words"
              direction="top"
              as="span"
              style={{ justifyContent: "center", width: "100%" }}
            />
          </h2>

          <RevealSection>
            <p style={{
              maxWidth: "700px",
              margin: "0 auto 35px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "clamp(15px, 2vw, 19px)",
              lineHeight: "1.6"
            }}>
              AI-graded assessments across DSA, Machine Learning, Web Dev, and placement aptitude — with feedback that tells you exactly what to fix, not just a score.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginTop: "30px" }}>
              {!user ? (
                <>
                  <button
                    onClick={openAuth}
                    style={{
                      background: "#ffffff",
                      color: "#0a071d",
                      border: "none",
                      padding: "14px 28px",
                      borderRadius: "999px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(255,255,255,0.15)"
                    }}
                    className="hero-btn-primary"
                  >
                    Get started
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); const el = document.getElementById("one"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                    style={{
                      background: "rgba(82, 39, 255, 0.25)",
                      color: "#ffffff",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      padding: "14px 28px",
                      borderRadius: "999px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(10px)"
                    }}
                    className="hero-btn-secondary"
                  >
                    Learn more
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/dashboard")}
                    style={{
                      background: "#ffffff",
                      color: "#0a071d",
                      border: "none",
                      padding: "14px 28px",
                      borderRadius: "999px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(255,255,255,0.15)"
                    }}
                    className="hero-btn-primary"
                  >
                    📊 Go to Dashboard
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); const el = document.getElementById("one"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                    style={{
                      background: "rgba(82, 39, 255, 0.25)",
                      color: "#ffffff",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      padding: "14px 28px",
                      borderRadius: "999px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(10px)"
                    }}
                    className="hero-btn-secondary"
                  >
                    Learn more
                  </button>
                </>
              )}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* PROOF & LOGOLOOP */}
      <section style={{
        padding: "40px 0 30px",
        background: "#08041c",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        position: "relative",
        zIndex: 5
      }}>
        <div className="inner" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <p style={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "12px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "24px",
            fontWeight: "600"
          }}>
            Prep for interviews at
          </p>
          <div style={{ opacity: 0.55 }}>
            <LogoLoop
              logos={techLogos}
              speed={60}
              direction="left"
              logoHeight={32}
              gap={64}
              hoverSpeed={10}
              scaleOnHover={true}
              fadeOut={true}
              fadeOutColor="#08041c"
            />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{
        background: "linear-gradient(135deg, rgba(82, 39, 255, 0.1) 0%, rgba(239, 68, 68, 0.03) 100%)",
        padding: "24px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        position: "relative",
        zIndex: 5,
        backdropFilter: "blur(5px)"
      }}>
        <div className="inner" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "30px",
            textAlign: "center"
          }}>
            <div>
              <h3 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#fff", marginBottom: "4px", background: "linear-gradient(to right, #ffffff, #a6c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>500+</h3>
              <p style={{ fontSize: "13px", color: "var(--text-grey)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Practice Questions</p>
            </div>
            <div>
              <h3 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#fff", marginBottom: "4px", background: "linear-gradient(to right, #ffffff, #ff9ffc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>4 Tracks</h3>
              <p style={{ fontSize: "13px", color: "var(--text-grey)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>DSA, ML, Web & Aptitude</p>
            </div>
            <div>
              <h3 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#fff", marginBottom: "4px", background: "linear-gradient(to right, #ffffff, #a6c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Real-time</h3>
              <p style={{ fontSize: "13px", color: "var(--text-grey)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>AI Voice Grading</p>
            </div>
            <div>
              <h3 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#fff", marginBottom: "4px", background: "linear-gradient(to right, #ffffff, #ff9ffc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Instant</h3>
              <p style={{ fontSize: "13px", color: "var(--text-grey)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Mistake Diagnosis</p>
            </div>
          </div>
        </div>
      </section>

      {/* WRAPPER */}
      <section id="wrapper">
        
        {/* ROW 1 - NOTES TO MCQ */}
        <section id="one" className="wrapper spotlight">
          <div className="inner">
            <RevealSection>
              <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/notes"); }}>
                <img src="/images/pic01.jpg" alt="Notes to Quiz" />
              </a>
            </RevealSection>
            <div className="content">
              <BlurText as="h2" className="major" text="Notes → Quiz (MCQs)" delay={80} animateBy="words" direction="top" />
              <RevealSection>
                <p>
                  Transform your study notes, textbook chapters, or reference PDF documents into interactive, custom multiple-choice quizzes in seconds. Our advanced AI automatically parses key concepts, generates high-quality questions, and tracks your scores to help reinforce your knowledge.
                </p>
                <button className="button sp-btn" onClick={() => handleActionClick("/notes")}>
                  Generate a Quiz
                </button>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ROW 2 - AI VOICE INTERVIEWER */}
        <section id="two" className="wrapper alt spotlight">
          <div className="inner">
            <RevealSection>
              <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/interview"); }}>
                <img src="/images/pic02.jpg" alt="AI Interview Prep" />
              </a>
            </RevealSection>
            <div className="content">
              <BlurText as="h2" className="major" text="AI Voice Interviewer" delay={80} animateBy="words" direction="top" />
              <RevealSection>
                <p>
                  Experience realistic, real-time mock interviews with our conversational AI recruiter. Select your target engineering role, upload your resume, and practice answering custom technical and behavioral questions via interactive voice recognition.
                </p>
                <button className="button sp-btn" onClick={() => handleActionClick("/interview")}>
                  Start Mock Interview
                </button>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ROW 3 - PERFORMANCE ANALYTICS */}
        <section id="three" className="wrapper spotlight">
          <div className="inner">
            <RevealSection>
              <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/dashboard"); }}>
                <img src="/images/pic03.jpg" alt="Performance Tracking" />
              </a>
            </RevealSection>
            <div className="content">
              <BlurText as="h2" className="major" text="Performance Tracking" delay={80} animateBy="words" direction="top" />
              <RevealSection>
                <p>
                  Monitor your learning velocity over time. Review historical quiz scores, review comprehensive feedback reports from previous interview sessions, and track your metrics comparison vs. top-performing peer benchmarks.
                </p>
                <button className="button sp-btn" onClick={() => handleActionClick("/dashboard")}>
                  View Your Analytics
                </button>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ROW 4 - INTERVIEW QUESTIONS BY COMPANY */}
        {user && (
          <section id="questions-teaser" className="wrapper alt spotlight">
            <div className="inner">
              <RevealSection>
                <a href="#" className="image" onClick={(e) => { e.preventDefault(); navigate("/questions"); }}>
                  <img src="/images/pic04.jpg" alt="Company Interview Questions" />
                </a>
              </RevealSection>
              <div className="content">
                <BlurText as="h2" className="major" text="Interview Questions by Company" delay={80} animateBy="words" direction="top" />
                <RevealSection>
                  <p>
                    Browse commonly reported patterns for Google, Amazon, Microsoft, service-company, and startup interview sessions. Questions are organized by round (Technical, Behavioral, HR) with professional coaching notes on how to answer each one.
                  </p>
                  <button className="button sp-btn" onClick={() => navigate("/questions")}>
                    Explore Company Questions
                  </button>
                </RevealSection>
              </div>
            </div>
          </section>
        )}

        {/* PRACTICE TRACKS SECTION */}
        <section id="practice-tracks" className="wrapper spotlight" style={{ paddingBottom: "40px" }}>
          <div className="inner" style={{ display: "block" }}>
            <BlurText
              as="p"
              text="Practice Tracks"
              delay={50}
              animateBy="letters"
              direction="top"
              style={{
                justifyContent: "center",
                textAlign: "center",
                color: "var(--text-grey)",
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 25
              }}
            />
            <RevealSection>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div 
                  onClick={() => handleActionClick("/dashboard?track=dsa")} 
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: "12px",
                    padding: "24px 20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "16px"
                  }}
                  className="sp-card"
                >
                  <div style={{ color: "var(--brand-red, #ef4444)", display: "flex", alignItems: "center" }}>
                    <Code size={28} />
                  </div>
                  <div>
                    <BlurText as="h3" className="bebas-font" text="Data Structures & Algorithms" delay={60} animateBy="words" direction="top" style={{ fontSize: "1.45rem", marginBottom: "8px", lineHeight: "1.2", color: "var(--text-white)" }} />
                    <div style={{ color: "var(--text-grey)", fontSize: "13px" }}>4 assessments</div>
                  </div>
                </div>
                <div 
                  onClick={() => handleActionClick("/dashboard?track=ml")} 
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: "12px",
                    padding: "24px 20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "16px"
                  }}
                  className="sp-card"
                >
                  <div style={{ color: "#a6c8ff", display: "flex", alignItems: "center" }}>
                    <Brain size={28} />
                  </div>
                  <div>
                    <BlurText as="h3" className="bebas-font" text="Machine Learning" delay={60} animateBy="words" direction="top" style={{ fontSize: "1.45rem", marginBottom: "8px", lineHeight: "1.2", color: "var(--text-white)" }} />
                    <div style={{ color: "var(--text-grey)", fontSize: "13px" }}>4 assessments</div>
                  </div>
                </div>
                <div 
                  onClick={() => handleActionClick("/dashboard?track=web")} 
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: "12px",
                    padding: "24px 20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "16px"
                  }}
                  className="sp-card"
                >
                  <div style={{ color: "#ff9ffc", display: "flex", alignItems: "center" }}>
                    <Globe size={28} />
                  </div>
                  <div>
                    <BlurText as="h3" className="bebas-font" text="Web Development" delay={60} animateBy="words" direction="top" style={{ fontSize: "1.45rem", marginBottom: "8px", lineHeight: "1.2", color: "var(--text-white)" }} />
                    <div style={{ color: "var(--text-grey)", fontSize: "13px" }}>3 assessments</div>
                  </div>
                </div>
                <div 
                  onClick={() => handleActionClick("/dashboard?track=apt")} 
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: "12px",
                    padding: "24px 20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "16px"
                  }}
                  className="sp-card"
                >
                  <div style={{ color: "#ffd56b", display: "flex", alignItems: "center" }}>
                    <Lightbulb size={28} />
                  </div>
                  <div>
                    <BlurText as="h3" className="bebas-font" text="Aptitude & Reasoning" delay={60} animateBy="words" direction="top" style={{ fontSize: "1.45rem", marginBottom: "8px", lineHeight: "1.2", color: "var(--text-white)" }} />
                    <div style={{ color: "var(--text-grey)", fontSize: "13px" }}>3 assessments</div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* FEATURE CARD GRID */}
        <section id="features" className="wrapper alt">
          <div className="inner">
            <BlurText
              as="h2"
              className="major"
              text="Advanced Prep Tools"
              delay={80}
              animateBy="words"
              direction="top"
              style={{ borderBottom: "2px solid var(--brand-red)", paddingBottom: "10px", marginBottom: "20px" }}
            />
            <RevealSection>
              <p style={{ color: "var(--text-grey)", marginBottom: "40px" }}>
                SkillPrep AI provides you with all the necessary tools to fast-track your career preparation. Whether you are review-studying key concepts or practicing full simulated voice interviews, we have you covered.
              </p>
              <div className="features" style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
                <article style={{ flex: "1 1 45%", minWidth: "300px" }} className="sp-card">
                  <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/dashboard"); }}>
                    <img src="/images/pic04.jpg" alt="AI Roadmaps" />
                  </a>
                  <div className="content">
                    <BlurText as="h3" className="major" text="Custom Study Roadmaps" delay={60} animateBy="words" direction="top" />
                    <p>Let our AI analyze your quiz history and score trends to generate a custom 7-day master study roadmap tailored to bridge your exact knowledge gaps.</p>
                    <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/dashboard"); }}>Learn more ➔</a>
                  </div>
                </article>
                <article style={{ flex: "1 1 45%", minWidth: "300px" }} className="sp-card">
                  <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/interview"); }}>
                    <img src="/images/pic05.jpg" alt="Voice Recognition" />
                  </a>
                  <div className="content">
                    <BlurText as="h3" className="major" text="Voice Speech-to-Text" delay={60} animateBy="words" direction="top" />
                    <p>Respond to technical questions naturally with your voice. Our integrated Web Speech API interprets your audio inputs for a fluid, hands-free prep experience.</p>
                    <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/interview"); }}>Learn more ➔</a>
                  </div>
                </article>
                <article style={{ flex: "1 1 45%", minWidth: "300px" }} className="sp-card">
                  <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/notes"); }}>
                    <img src="/images/pic06.jpg" alt="Instant MCQ Feedback" />
                  </a>
                  <div className="content">
                    <BlurText as="h3" className="major" text="Instant MCQ Evaluations" delay={60} animateBy="words" direction="top" />
                    <p>Receive immediate grading, answer breakdowns, and detailed explanation metrics after every quiz attempt to ensure you understand correct methodologies.</p>
                    <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/notes"); }}>Learn more ➔</a>
                  </div>
                </article>
                <article style={{ flex: "1 1 45%", minWidth: "300px" }} className="sp-card">
                  <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/profile"); }}>
                    <img src="/images/pic07.jpg" alt="User Profile Details" />
                  </a>
                  <div className="content">
                    <BlurText as="h3" className="major" text="History & User Profiles" delay={60} animateBy="words" direction="top" />
                    <p>Access your centralized profile directory. Manage personal credentials, review saved attempts, check earned preparation badges, and track your study progression.</p>
                    <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/profile"); }}>Learn more ➔</a>
                  </div>
                </article>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* FAQs SECTION (Netflix Style Accordion) */}
        <section id="faq" className="faq-section">
          <BlurText
            as="h2"
            text="Frequently Asked Questions"
            delay={80}
            animateBy="words"
            direction="top"
            style={{ justifyContent: "center" }}
          />
          <RevealSection>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-item ${activeFaq === i ? "open" : ""}`}>
                  <div className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                    <span>{faq.question}</span>
                    <span className="faq-icon">+</span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </section>

      </section>

      {/* FOOTER */}
      <section id="footer">
        <div className="inner">
          <BlurText
            as="h2"
            className="major"
            text="Get in touch"
            delay={80}
            animateBy="words"
            direction="top"
          />
          <RevealSection>
            <p style={{ color: "var(--text-grey)", marginBottom: "30px" }}>Have questions, ideas, or feedback about SkillPrep AI? Write to us or reach out via our contact details. We'd love to help support your learning and career preparation journey.</p>
            
            <form onSubmit={handleContactSubmit}>
              <div className="fields">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    name="message" 
                    id="message" 
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>
              </div>
              <div className="actions" style={{ marginTop: "20px" }}>
                <button type="submit" className="button primary sp-btn">Send Message</button>
              </div>
            </form>
            
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              marginBottom: "35px",
              marginTop: "40px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              paddingBottom: "30px"
            }}>
              <SkillPrepMark size={48} />
              <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1.2rem", margin: 0, color: "#fff" }}>
                SkillPrep<span style={{ color: "#7c5cff" }}>.AI</span>
              </h3>
              <p style={{ fontSize: "12.5px", color: "var(--text-grey)", margin: 0, fontStyle: "italic" }}>
                Skills, evaluated. Feedback, instant.
              </p>
            </div>

            <ul className="copyright">
              <li>&copy; {new Date().getFullYear()} SkillPrep.AI. All rights reserved.</li>
            </ul>
          </RevealSection>
        </div>
      </section>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuth && <AuthModal close={closeAuth} />}
      </AnimatePresence>
    </div>
  );
}
