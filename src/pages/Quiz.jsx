import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mcqs, setMcqs] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!location.state || !location.state.notes) {
      navigate("/notes");
      return;
    }

    generateMCQ(location.state.notes);
  }, []);

  const generateMCQ = async (notes) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/generate-mcqs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMcqs(data);
    } catch (err) {
      alert("MCQ generation failed");
      navigate("/notes");
    }
  };

  const saveScore = async (finalScore, total) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/save-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: finalScore,
          total,
        }),
      });
    } catch (err) {
      console.error("Score save failed", err);
    }
  };

  if (!mcqs.length) {
    return (
      <div id="page-wrapper">
        <Navbar />
        <section id="wrapper">
          <header>
            <div className="inner">
              <h2 className="bebas-font">Generating Quiz...</h2>
              <p>Our AI is analyzing your notes to compile custom questions.</p>
            </div>
          </header>
        </section>
      </div>
    );
  }

  const q = mcqs[current];

  const selectAnswer = (option) => {
    let newScore = score;

    if (option === q.answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (current + 1 < mcqs.length) {
      setCurrent(current + 1);
    } else {
      saveScore(newScore, mcqs.length);
      navigate("/quiz/result", {
        state: { score: newScore, total: mcqs.length },
      });
    }
  };

  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header style={{ backgroundImage: `url('/images/pic06.jpg')` }}>
          <div className="inner">
            <h2 className="bebas-font">Question {current + 1} of {mcqs.length}</h2>
            <p>Select the correct answer below.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <motion.div 
              className="glass-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={current}
            >
              <h3 style={{ fontSize: "1.4rem", lineHeight: "1.4", marginBottom: "25px", fontWeight: "600" }}>{q.question}</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className="button fit"
                    style={{ 
                      textTransform: "none", 
                      textAlign: "left", 
                      padding: "14px 20px", 
                      fontSize: "1rem", 
                      lineHeight: "1.4",
                      background: "rgba(0,0,0,0.3)",
                      letterSpacing: "0"
                    }}
                    onClick={() => selectAnswer(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
