import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const generateQuiz = () => {
    if (!notes.trim()) {
      alert("Please enter or upload notes first.");
      return;
    }
    navigate("/quiz", { state: { notes } });
  };

  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header>
          <div className="inner">
            <h2>Notes → Quiz (MCQs)</h2>
            <p>Convert your study notes into multiple-choice questions instantly to test your knowledge.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: "760px", margin: "0 auto" }}>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ fontSize: "16px", opacity: 0.8, marginBottom: "30px", textAlign: "center" }}
            >
              Paste your study notes below or click the <strong>+</strong> button to upload a PDF/Text file.
            </motion.p>

            <motion.div
              className="prompt-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <div className="prompt-bar" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "20px" }}>
                <textarea
                  className="prompt-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste study notes, textbook chapters, or raw study text here..."
                  style={{
                    width: "100%",
                    minHeight: "220px",
                    background: "transparent",
                    border: "none",
                    color: "white",
                    fontSize: "16px",
                    resize: "vertical",
                    outline: "none"
                  }}
                />
                
                <div className="prompt-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "15px", marginTop: "15px" }}>
                  <div className="prompt-left-tools" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <motion.button
                      className="prompt-btn-plus"
                      type="button"
                      title="Upload Notes (PDF/Text)"
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "white",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        fontSize: "20px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      +
                    </motion.button>
                    <motion.div
                      className="prompt-pill"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      style={{
                        background: "rgba(34, 211, 238, 0.1)",
                        border: "1px solid rgba(34, 211, 238, 0.2)",
                        padding: "6px 16px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span style={{ color: "#22d3ee" }}>✨ AI Quiz Mode</span>
                    </motion.div>
                  </div>

                  <motion.button
                    className="button primary"
                    onClick={generateQuiz}
                    disabled={!notes.trim() || isUploading}
                    whileHover={notes.trim() ? { scale: 1.05 } : {}}
                    whileTap={notes.trim() ? { scale: 0.95 } : {}}
                    style={{ padding: "0 20px", height: "40px", lineHeight: "40px", fontSize: "12px", letterSpacing: "0.1em" }}
                  >
                    Generate Quiz
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

                  setIsUploading(true);
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
                  } finally {
                    setIsUploading(false);
                  }
                }}
              />
            </motion.div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
