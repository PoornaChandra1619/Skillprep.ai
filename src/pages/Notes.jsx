import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "./intro.css"; // 👈 reuse SAME CSS

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const generateQuiz = () => {
    if (!notes.trim()) {
      alert("Please enter notes");
      return;
    }
    navigate("/quiz", { state: { notes } });
  };

  return (
    <div className="colorlib-page">
      <Navbar />

      {/* ================= CONTENT ================= */}
      <section className="hero" style={{ justifyContent: "center" }}>
        <div className="hero-left" style={{ maxWidth: "720px" }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Notes<span> → Quiz</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Paste your notes below and generate MCQ quiz instantly.
          </motion.p>

          <motion.div
            className="prompt-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
          >
            <div className="prompt-bar">
              <textarea
                className="prompt-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your study notes here or upload a file..."
              />
              <div className="prompt-actions">
                <div className="prompt-left-tools">
                  <motion.button
                    className="prompt-btn-plus"
                    type="button"
                    title="Upload Notes (PDF/Text)"
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    +
                  </motion.button>
                  <motion.div
                    className="prompt-pill"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span>✨ AI Quiz Mode</span>
                  </motion.div>
                </div>

                <motion.button
                  className="prompt-btn-send"
                  onClick={generateQuiz}
                  disabled={!notes.trim()}
                  title="Generate Quiz"
                  whileHover={notes.trim() ? { scale: 1.1, rotate: -5 } : {}}
                  whileTap={notes.trim() ? { scale: 0.9 } : {}}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </motion.button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept=".pdf,.txt"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("notes", file);

                try {
                  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/upload-notes`, {
                    method: "POST",
                    body: formData,
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message);
                  setNotes(data.text);
                } catch (err) {
                  alert("Upload failed: " + err.message);
                }
              }}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
