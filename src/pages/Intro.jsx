import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import { useScrollReveal } from "../hooks/useScrollReveal";

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

      {/* BANNER / HERO WITH KEN BURNS EFFECT */}
      <section id="banner" style={{ position: "relative", overflow: "hidden" }}>
        <div className="hero-bg" style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
          zIndex: 1
        }} />
        <div className="inner" style={{ position: "relative", zIndex: 2 }}>
          <h2>Skills, evaluated.<br />Feedback, instant<span>.</span></h2>
          <p>AI-graded assessments across DSA, Machine Learning, Web Dev, and placement aptitude — with feedback that tells you exactly what to fix, not just a score.</p>
          
          {!user ? (
            <form onSubmit={handleGetStarted} style={{ marginTop: "2.5em" }}>
              <div className="email-signup-row">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
                <button type="submit" className="sp-btn">
                  Get Started <span style={{ fontSize: "1.1rem" }}>➔</span>
                </button>
              </div>
            </form>
          ) : (
            <div style={{ marginTop: "2.5em" }}>
              <button className="button primary sp-btn" onClick={() => navigate("/dashboard")} style={{ minWidth: "220px", fontSize: "1.1rem" }}>
                📊 Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </section>

      {/* WRAPPER */}
      <section id="wrapper">
        
        {/* ROW 1 - NOTES TO MCQ */}
        <RevealSection>
          <section id="one" className="wrapper spotlight">
            <div className="inner">
              <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/notes"); }}>
                <img src="/images/pic01.jpg" alt="Notes to Quiz" />
              </a>
              <div className="content">
                <h2 className="major">Notes → Quiz (MCQs)</h2>
                <p>
                  Transform your study notes, textbook chapters, or reference PDF documents into interactive, custom multiple-choice quizzes in seconds. Our advanced AI automatically parses key concepts, generates high-quality questions, and tracks your scores to help reinforce your knowledge.
                </p>
                <button className="button sp-btn" onClick={() => handleActionClick("/notes")}>
                  Generate a Quiz
                </button>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* ROW 2 - AI VOICE INTERVIEWER */}
        <RevealSection>
          <section id="two" className="wrapper alt spotlight">
            <div className="inner">
              <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/interview"); }}>
                <img src="/images/pic02.jpg" alt="AI Interview Prep" />
              </a>
              <div className="content">
                <h2 className="major">AI Voice Interviewer</h2>
                <p>
                  Experience realistic, real-time mock interviews with our conversational AI recruiter. Select your target engineering role, upload your resume, and practice answering custom technical and behavioral questions via interactive voice recognition.
                </p>
                <button className="button sp-btn" onClick={() => handleActionClick("/interview")}>
                  Start Mock Interview
                </button>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* ROW 3 - PERFORMANCE ANALYTICS */}
        <RevealSection>
          <section id="three" className="wrapper spotlight">
            <div className="inner">
              <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/dashboard"); }}>
                <img src="/images/pic03.jpg" alt="Performance Tracking" />
              </a>
              <div className="content">
                <h2 className="major">Performance Tracking</h2>
                <p>
                  Monitor your learning velocity over time. Review historical quiz scores, review comprehensive feedback reports from previous interview sessions, and track your metrics comparison vs. top-performing peer benchmarks.
                </p>
                <button className="button sp-btn" onClick={() => handleActionClick("/dashboard")}>
                  View Your Analytics
                </button>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* PRACTICE TRACKS SECTION */}
        <RevealSection>
          <section id="practice-tracks" className="wrapper spotlight" style={{ paddingBottom: "40px" }}>
            <div className="inner" style={{ display: "block" }}>
              <p style={{ textAlign: "center", color: "var(--text-grey)", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 25 }}>
                Practice Tracks
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div 
                  onClick={() => handleActionClick("/dashboard?track=dsa")} 
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: "12px",
                    padding: "24px 20px", cursor: "pointer"
                  }}
                  className="sp-card"
                >
                  <h3 className="bebas-font" style={{ fontSize: "1.45rem", marginBottom: "8px", lineHeight: "1.2", color: "var(--text-white)" }}>Data Structures & Algorithms</h3>
                  <div style={{ color: "var(--text-grey)", fontSize: "13px" }}>4 assessments</div>
                </div>
                <div 
                  onClick={() => handleActionClick("/dashboard?track=ml")} 
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: "12px",
                    padding: "24px 20px", cursor: "pointer"
                  }}
                  className="sp-card"
                >
                  <h3 className="bebas-font" style={{ fontSize: "1.45rem", marginBottom: "8px", lineHeight: "1.2", color: "var(--text-white)" }}>Machine Learning</h3>
                  <div style={{ color: "var(--text-grey)", fontSize: "13px" }}>4 assessments</div>
                </div>
                <div 
                  onClick={() => handleActionClick("/dashboard?track=web")} 
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: "12px",
                    padding: "24px 20px", cursor: "pointer"
                  }}
                  className="sp-card"
                >
                  <h3 className="bebas-font" style={{ fontSize: "1.45rem", marginBottom: "8px", lineHeight: "1.2", color: "var(--text-white)" }}>Web Development</h3>
                  <div style={{ color: "var(--text-grey)", fontSize: "13px" }}>3 assessments</div>
                </div>
                <div 
                  onClick={() => handleActionClick("/dashboard?track=apt")} 
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--glass-border)", borderRadius: "12px",
                    padding: "24px 20px", cursor: "pointer"
                  }}
                  className="sp-card"
                >
                  <h3 className="bebas-font" style={{ fontSize: "1.45rem", marginBottom: "8px", lineHeight: "1.2", color: "var(--text-white)" }}>Aptitude & Reasoning</h3>
                  <div style={{ color: "var(--text-grey)", fontSize: "13px" }}>3 assessments</div>
                </div>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* FEATURE CARD GRID */}
        <RevealSection>
          <section id="features" className="wrapper alt">
            <div className="inner">
              <h2 className="major" style={{ borderBottom: "2px solid var(--brand-red)", paddingBottom: "10px", marginBottom: "20px" }}>Advanced Prep Tools</h2>
              <p style={{ color: "var(--text-grey)", marginBottom: "40px" }}>
                SkillPrep AI provides you with all the necessary tools to fast-track your career preparation. Whether you are review-studying key concepts or practicing full simulated voice interviews, we have you covered.
              </p>
              <div className="features" style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
                <article style={{ flex: "1 1 45%", minWidth: "300px" }} className="sp-card">
                  <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/dashboard"); }}>
                    <img src="/images/pic04.jpg" alt="AI Roadmaps" />
                  </a>
                  <div className="content">
                    <h3 className="major">Custom Study Roadmaps</h3>
                    <p>Let our AI analyze your quiz history and score trends to generate a custom 7-day master study roadmap tailored to bridge your exact knowledge gaps.</p>
                    <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/dashboard"); }}>Learn more ➔</a>
                  </div>
                </article>
                <article style={{ flex: "1 1 45%", minWidth: "300px" }} className="sp-card">
                  <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/interview"); }}>
                    <img src="/images/pic05.jpg" alt="Voice Recognition" />
                  </a>
                  <div className="content">
                    <h3 className="major">Voice Speech-to-Text</h3>
                    <p>Respond to technical questions naturally with your voice. Our integrated Web Speech API interprets your audio inputs for a fluid, hands-free prep experience.</p>
                    <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/interview"); }}>Learn more ➔</a>
                  </div>
                </article>
                <article style={{ flex: "1 1 45%", minWidth: "300px" }} className="sp-card">
                  <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/notes"); }}>
                    <img src="/images/pic06.jpg" alt="Instant MCQ Feedback" />
                  </a>
                  <div className="content">
                    <h3 className="major">Instant MCQ Evaluations</h3>
                    <p>Receive immediate grading, answer breakdowns, and detailed explanation metrics after every quiz attempt to ensure you understand correct methodologies.</p>
                    <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/notes"); }}>Learn more ➔</a>
                  </div>
                </article>
                <article style={{ flex: "1 1 45%", minWidth: "300px" }} className="sp-card">
                  <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/profile"); }}>
                    <img src="/images/pic07.jpg" alt="User Profile Details" />
                  </a>
                  <div className="content">
                    <h3 className="major">History & User Profiles</h3>
                    <p>Access your centralized profile directory. Manage personal credentials, review saved attempts, check earned preparation badges, and track your study progression.</p>
                    <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/profile"); }}>Learn more ➔</a>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* FAQs SECTION (Netflix Style Accordion) */}
        <RevealSection>
          <section id="faq" className="faq-section">
            <h2>Frequently Asked Questions</h2>
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
          </section>
        </RevealSection>

      </section>

      {/* FOOTER */}
      <RevealSection>
        <section id="footer">
          <div className="inner">
            <h2 className="major">Get in touch</h2>
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
              <ul className="actions">
                <li>
                  <button type="submit" className="button primary sp-btn">Send Message</button>
                </li>
              </ul>
            </form>
            
            <ul className="copyright">
              <li>&copy; {new Date().getFullYear()} SkillPrep.AI. All rights reserved.</li>
            </ul>
          </div>
        </section>
      </RevealSection>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuth && <AuthModal close={closeAuth} />}
      </AnimatePresence>
    </div>
  );
}
