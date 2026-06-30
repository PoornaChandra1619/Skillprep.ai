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
        <header>
          <div className="inner">
            <h2>Quiz Results Completed 🎉</h2>
            <p>Check out your score below and track your dashboard progress.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: "550px", margin: "0 auto", textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: "rgba(255, 255, 255, 0.03)", padding: "40px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}
            >
              <h3 className="major" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "15px", marginBottom: "20px" }}>
                Attempt Score
              </h3>
              
              <div style={{ fontSize: "3.5em", fontWeight: "800", color: "#22d3ee", margin: "30px 0" }}>
                {score} <span style={{ fontSize: "20px", color: "white", opacity: 0.6 }}>/ {total}</span>
              </div>

              <p style={{ fontSize: "15px", opacity: 0.8, marginBottom: "35px" }}>
                {score === total ? "Amazing! Perfect score." : score >= total * 0.7 ? "Great job! Keep practicing." : "Review your notes and try again!"}
              </p>

              <button className="button primary fit" onClick={() => navigate("/")} style={{ width: "100%" }}>
                Back to Dashboard
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
