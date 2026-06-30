import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthModal from "../components/AuthModal";
import Navbar from "../components/Navbar";

export default function Intro() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  // Form state for footer contact
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    // Open auth modal if ?login=true in URL
    if (searchParams.get("login") === "true") {
      setShowAuth(true);
      setSearchParams({}, { replace: true });
    }

    // Scroll to section if ?scroll=id in URL
    const scrollSection = searchParams.get("scroll");
    if (scrollSection) {
      setTimeout(() => {
        document.getElementById(scrollSection)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openAuth = () => setShowAuth(true);
  const closeAuth = () => setShowAuth(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill out all fields.");
      return;
    }
    alert(`Thank you, ${contactForm.name}! Your message has been sent successfully.`);
    setContactForm({ name: "", email: "", message: "" });
  };

  const handleActionClick = (targetPath) => {
    if (user) {
      navigate(targetPath);
    } else {
      openAuth();
    }
  };

  return (
    <div id="page-wrapper">
      {/* NAVBAR */}
      <Navbar onLoginClick={openAuth} />

      {/* BANNER */}
      <section id="banner">
        <div className="inner">
          <div className="logo"><span className="icon fa-solid fa-gem"></span></div>
          <h2>SkillPrep AI</h2>
          <p>Practice interviews. Convert notes into quizzes. Prepare smarter for your career.</p>
          <ul className="actions" style={{ marginTop: "2em", justifyContent: "center" }}>
            {!user ? (
              <li>
                <button className="button primary fit" onClick={openAuth} style={{ minWidth: "200px" }}>
                  Get Started
                </button>
              </li>
            ) : (
              <li>
                <button className="button primary fit" onClick={() => navigate("/dashboard")} style={{ minWidth: "200px" }}>
                  📊 Go to Dashboard
                </button>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* WRAPPER */}
      <section id="wrapper">
        {/* ONE - NOTES TO MCQ */}
        <section id="one" className="wrapper spotlight style1">
          <div className="inner">
            <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/notes"); }}>
              <img src="/images/pic01.jpg" alt="Notes to Quiz" />
            </a>
            <div className="content">
              <h2 className="major">Notes → Quiz (MCQs)</h2>
              <p>
                Transform your study notes or reference documents into interactive, custom multiple-choice quizzes in seconds. Our advanced AI automatically parses key concepts, generates high-quality questions, and tracks your scores to help reinforce your knowledge.
              </p>
              <button className="special" onClick={() => handleActionClick("/notes")}>
                Generate a Quiz
              </button>
            </div>
          </div>
        </section>

        {/* TWO - AI VOICE INTERVIEWER */}
        <section id="two" className="wrapper alt spotlight style2">
          <div className="inner">
            <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/interview"); }}>
              <img src="/images/pic02.jpg" alt="AI Interview Prep" />
            </a>
            <div className="content">
              <h2 className="major">AI Voice Interviewer</h2>
              <p>
                Experience realistic, real-time mock interviews with our conversational AI recruiter. Select your target engineering role, upload your resume, and practice answering custom technical and behavioral questions via interactive voice recognition.
              </p>
              <button className="special" onClick={() => handleActionClick("/interview")}>
                Start Mock Interview
              </button>
            </div>
          </div>
        </section>

        {/* THREE - PERFORMANCE ANALYTICS */}
        <section id="three" className="wrapper spotlight style3">
          <div className="inner">
            <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/dashboard"); }}>
              <img src="/images/pic03.jpg" alt="Performance Tracking" />
            </a>
            <div className="content">
              <h2 className="major">Performance Tracking</h2>
              <p>
                Monitor your learning velocity over time. Review historical quiz scores, review comprehensive feedback reports from previous interview sessions, and track your metrics comparison vs. top-performing peer benchmarks.
              </p>
              <button className="special" onClick={() => handleActionClick("/dashboard")}>
                View Your Analytics
              </button>
            </div>
          </div>
        </section>

        {/* FOUR - FEATURES GRID */}
        <section id="features" className="wrapper alt style1">
          <div className="inner">
            <h2 className="major">Advanced Preparation Tools</h2>
            <p>
              SkillPrep AI provides you with all the necessary tools to fast-track your career preparation. Whether you are review-studying key concepts or practicing full simulated voice interviews, we have you covered.
            </p>
            <section className="features">
              <article>
                <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/dashboard"); }}>
                  <img src="/images/pic04.jpg" alt="AI Roadmaps" />
                </a>
                <h3 className="major">Custom Study Roadmaps</h3>
                <p>Let our AI analyze your quiz history and score trends to generate a custom 7-day master study roadmap tailored to bridge your exact knowledge gaps.</p>
                <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/dashboard"); }}>Learn more</a>
              </article>
              <article>
                <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/interview"); }}>
                  <img src="/images/pic05.jpg" alt="Voice Recognition" />
                </a>
                <h3 className="major">Voice Speech-to-Text</h3>
                <p>Respond to technical questions naturally with your voice. Our integrated Web Speech API interprets your audio inputs for a fluid, hands-free prep experience.</p>
                <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/interview"); }}>Learn more</a>
              </article>
              <article>
                <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/notes"); }}>
                  <img src="/images/pic06.jpg" alt="Instant MCQ Feedback" />
                </a>
                <h3 className="major">Instant MCQ Evaluations</h3>
                <p>Receive immediate grading, answer breakdowns, and detailed explanation metrics after every quiz attempt to ensure you understand correct methodologies.</p>
                <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/notes"); }}>Learn more</a>
              </article>
              <article>
                <a href="#" className="image" onClick={(e) => { e.preventDefault(); handleActionClick("/profile"); }}>
                  <img src="/images/pic07.jpg" alt="User Profile Details" />
                </a>
                <h3 className="major">History & User Profiles</h3>
                <p>Access your centralized profile directory. Manage personal credentials, review saved attempts, check earned preparation badges, and track your study progression.</p>
                <a href="#" className="special" onClick={(e) => { e.preventDefault(); handleActionClick("/profile"); }}>Learn more</a>
              </article>
            </section>
          </div>
        </section>
      </section>

      {/* FOOTER */}
      <section id="footer">
        <div className="inner">
          <h2 className="major">Get in touch</h2>
          <p>Have questions, ideas, or feedback about SkillPrep AI? Write to us or reach out via our contact details. We'd love to help support your learning and career preparation journey.</p>
          
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
                ></textarea>
              </div>
            </div>
            <ul className="actions">
              <li><input type="submit" value="Send Message" /></li>
            </ul>
          </form>

          <ul className="contact">
            <li className="icon solid fa-home">
              SkillPrep AI Studio<br />
              Built by Poorna Chandra<br />
              India
            </li>
            <li className="icon solid fa-envelope">
              <a href="mailto:purnachandra1619@gmail.com">purnachandra1619@gmail.com</a>
            </li>
            <li className="icon brands fa-github">
              <a href="https://github.com/PoornaChandra1619" target="_blank" rel="noopener noreferrer">
                github.com/PoornaChandra1619
              </a>
            </li>
          </ul>

          <ul className="copyright">
            <li>&copy; {new Date().getFullYear()} SkillPrep AI. All rights reserved.</li>
            <li>Design Template: <a href="http://html5up.net" target="_blank" rel="noopener noreferrer">HTML5 UP</a></li>
          </ul>
        </div>
      </section>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuth && <AuthModal close={closeAuth} />}
      </AnimatePresence>
    </div>
  );
}
