import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo">
          Sk<span>.</span>
        </div>

        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li>Features</li>
          <li>Contact</li>
        </ul>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span>👤 {user?.name}</span>
          <button className="nav-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <section className="hero" style={{ justifyContent: "center" }}>
        <div className="hero-left" style={{ maxWidth: "720px" }}>
          <h1>
            Notes<span> → Quiz</span>
          </h1>

          <p>Paste your notes below and generate MCQ quiz instantly.</p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your study notes here..."
            style={{
              width: "100%",
              height: "220px",
              padding: "18px",
              borderRadius: "14px",
              border: "none",
              outline: "none",
              fontSize: "16px",
              marginTop: "20px",
            }}
          />

          <button
            className="get-started"
            style={{ marginTop: "26px" }}
            onClick={generateQuiz}
          >
            Generate MCQ Quiz
          </button>

          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ opacity: 0.7 }}>OR</span>
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
            <button
              className="plus-btn"
              type="button"
              title="Upload Notes (PDF/Text)"
              onClick={(e) => {
                e.preventDefault();
                console.log("Plus button clicked");
                fileInputRef.current?.click();
              }}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginTop: "10px",
                lineHeight: "0",
                fontWeight: "bold",
                padding: "0",
                zIndex: "10"
              }}
            >
              <span style={{ transform: "translateY(-2px)" }}>+</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
