import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function Flashcards() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [masteredCount, setMasteredCount] = useState(0);
  const [masteredIndices, setMasteredIndices] = useState(new Set());

  useEffect(() => {
    if (!location.state || !location.state.notes) {
      navigate("/notes");
      return;
    }

    generateFlashcards(location.state.notes);
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || cards.length === 0) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        handleNext();
      } else if (e.code === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, cards, current]);

  const generateFlashcards = async (notes) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/generate-flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate");

      setCards(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (current < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrent((prev) => prev + 1), 100);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrent((prev) => prev - 1), 100);
    }
  };

  const handleMastered = () => {
    if (!masteredIndices.has(current)) {
      const nextSet = new Set(masteredIndices);
      nextSet.add(current);
      setMasteredIndices(nextSet);
      setMasteredCount(nextSet.size);
    }
    handleNext();
  };

  if (loading) {
    return (
      <div id="page-wrapper">
        <Navbar />
        <section id="wrapper">
          <header style={{ backgroundImage: `url('/images/pic04.jpg')` }}>
            <div className="inner">
              <h2 className="bebas-font">Flashcards</h2>
              <p>Analyzing notes to compile active recall flashcards...</p>
            </div>
          </header>
          <div className="wrapper">
            <div className="inner" style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 0", textAlign: "center" }}>
              <div className="skeleton" style={{ height: "300px", borderRadius: "16px", marginBottom: "20px" }} />
              <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                <div className="skeleton" style={{ height: "40px", width: "100px" }} />
                <div className="skeleton" style={{ height: "40px", width: "100px" }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div id="page-wrapper">
        <Navbar />
        <section id="wrapper">
          <header style={{ backgroundImage: `url('/images/pic04.jpg')` }}>
            <div className="inner">
              <h2 className="bebas-font">Flashcard Error</h2>
              <p>Something went wrong compiling your cards.</p>
            </div>
          </header>
          <div className="wrapper">
            <div className="inner" style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 0", textAlign: "center" }}>
              <div className="glass-card">
                <h3 className="bebas-font" style={{ color: "var(--brand-red)", fontSize: "2rem", marginBottom: "15px" }}>Failed to generate</h3>
                <p style={{ opacity: 0.8, marginBottom: "25px" }}>{error}</p>
                <button className="button sp-btn" onClick={() => navigate("/notes")}>Back to Notes</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const finished = cards.length > 0 && masteredCount === cards.length;

  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header style={{ backgroundImage: `url('/images/pic04.jpg')` }}>
          <div className="inner">
            <h2 className="bebas-font">AI Revision Flashcards</h2>
            <p>Use active recall to review definitions. Press Space to flip, Left/Right arrows to navigate.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 0" }}>
            
            {finished ? (
              <motion.div 
                className="glass-card" 
                style={{ textAlign: "center", padding: "50px 30px" }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <span style={{ fontSize: "4rem", display: "block", marginBottom: "15px" }}>🏆</span>
                <h3 className="bebas-font" style={{ fontSize: "2.5rem", color: "var(--brand-cyan)", marginBottom: "10px" }}>Deck Completed!</h3>
                <p style={{ opacity: 0.8, fontSize: "16px", marginBottom: "30px" }}>You have mastered all {cards.length} concepts in this set.</p>
                <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                  <button className="button primary sp-btn" onClick={() => navigate("/notes")}>New Notes</button>
                  <button className="button sp-btn" onClick={() => { setMasteredIndices(new Set()); setMasteredCount(0); setCurrent(0); setIsFlipped(false); }}>Reset Deck</button>
                </div>
              </motion.div>
            ) : (
              <div>
                {/* Progress bar */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", opacity: 0.6, marginBottom: "10px" }}>
                  <span>Deck Progress: {current + 1} / {cards.length}</span>
                  <span>Mastered: {masteredCount}</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden", marginBottom: "40px" }}>
                  <div style={{ height: "100%", background: "var(--brand-cyan)", width: `${((current + 1) / cards.length) * 100}%`, transition: "width 0.2s ease" }} />
                </div>

                {/* 3D Flip Card Container */}
                <div 
                  onClick={() => setIsFlipped((prev) => !prev)}
                  style={{
                    height: "320px",
                    perspective: "1000px",
                    cursor: "pointer",
                    marginBottom: "40px"
                  }}
                >
                  <motion.div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                  >
                    {/* Front Side */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      background: "rgba(30, 30, 35, 0.65)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "30px",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
                    }}>
                      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-cyan)", marginBottom: "15px" }}>Concept Card</span>
                      <h3 style={{ fontSize: "1.8rem", color: "#ffffff", textAlign: "center", fontWeight: "600", margin: 0, fontFamily: "Sora, sans-serif" }}>
                        {cards[current]?.front}
                      </h3>
                      <span style={{ position: "absolute", bottom: "20px", fontSize: "12px", opacity: 0.4 }}>Click to Reveal Answer</span>
                    </div>

                    {/* Back Side */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "rgba(20, 20, 25, 0.85)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(124,92,255,0.3)",
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "30px",
                      boxShadow: "0 15px 35px rgba(124,92,255,0.15)"
                    }}>
                      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-red)", marginBottom: "15px" }}>Explanation</span>
                      <p style={{ fontSize: "1.1rem", color: "#ffffff", textAlign: "center", lineHeight: "1.6", margin: 0 }}>
                        {cards[current]?.back}
                      </p>
                      <span style={{ position: "absolute", bottom: "20px", fontSize: "12px", opacity: 0.4 }}>Click to Flip Back</span>
                    </div>
                  </motion.div>
                </div>

                {/* Control Panel */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "15px" }}>
                  <button 
                    className="button sp-btn" 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    disabled={current === 0}
                    style={{ flex: 1 }}
                  >
                    ◀ Prev
                  </button>
                  <button 
                    className="button sp-btn" 
                    onClick={(e) => { e.stopPropagation(); handleMastered(); }}
                    style={{ flex: 1.5, background: "rgba(47, 217, 217, 0.15)", border: "1px solid rgba(47, 217, 217, 0.3)", color: "var(--brand-cyan)" }}
                  >
                    ✓ Mastered
                  </button>
                  <button 
                    className="button sp-btn" 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    disabled={current === cards.length - 1}
                    style={{ flex: 1 }}
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
