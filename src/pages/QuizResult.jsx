import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) return null;

  const { score, total } = location.state;

  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header style={{ backgroundImage: `url('/images/pic06.jpg')` }}>
          <div className="inner">
            <h2 className="bebas-font">Quiz Completed 🎉</h2>
            <p>Check out your score below and track your dashboard progress.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: "550px", margin: "0 auto", textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card"
            >
              <h3 className="bebas-font" style={{ fontSize: "1.8rem", color: "var(--brand-red)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "15px", marginBottom: "20px" }}>
                Attempt Score
              </h3>
              
              <div style={{ fontSize: "4.5em", fontWeight: "800", color: "var(--brand-red)", margin: "20px 0" }}>
                {score} <span style={{ fontSize: "24px", color: "white", opacity: 0.6 }}>/ {total}</span>
              </div>

              <p style={{ fontSize: "16px", opacity: 0.8, marginBottom: "35px" }}>
                {score === total ? "Amazing! Perfect score." : score >= total * 0.7 ? "Great job! Keep practicing." : "Review your notes and try again!"}
              </p>

              <button className="button primary fit" onClick={() => navigate("/dashboard")} style={{ width: "100%" }}>
                Back to Dashboard
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
