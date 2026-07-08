import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, X, Bot, ArrowRight, Send } from "lucide-react";

const C = {
  bgDeep: "#05070c",
  surfaceSolid: "#131826",
  accent: "#e50914", // aligned to Netflix brand red
  cyan: "#2dd4dc",
  text: "#f4f5f9",
  muted: "#9298ab",
  line: "#232838",
};

function parseAgentReply(text) {
  const marker = "ACTION: goto:";
  const idx = text.indexOf(marker);
  if (idx === -1) return { text: text.trim(), action: null };
  const before = text.slice(0, idx).trim();
  const action = text.slice(idx + marker.length).trim().split("\n")[0].trim();
  return { text: before, action };
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 2px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: C.muted,
          animation: `bounceDot 1.2s ${i * 0.15}s infinite ease-in-out`,
        }} />
      ))}
      <style>{`@keyframes bounceDot { 0%,80%,100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }`}</style>
    </div>
  );
}

export default function PrepAgent() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey! I'm Prep, your SkillPrep.AI assistant. Ask me what to practice next, or which interview pack fits your target company." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const suggestions = [
    "What should I practice today?",
    "FAANG or startup pack for me?",
    "Explain the AI Voice Interviewer"
  ];

  async function sendMessage(text) {
    const userText = text ?? input;
    if (!userText.trim() || loading) return;

    const nextMessages = [...messages, { role: "user", text: userText }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/prep-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: nextMessages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch response");

      const { text: cleanText, action } = parseAgentReply(data.reply || "Sorry, I didn't catch that — could you rephrase?");
      setMessages(prev => [...prev, { role: "assistant", text: cleanText, action }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", text: "Something went wrong reaching Prep assistant. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  const actionLabels = {
    home: "Go to Home",
    dashboard: "Open Dashboard",
    questions: "Open Interview Questions",
    profile: "Open Profile"
  };

  const handleAction = (action) => {
    let target = "/";
    if (action === "dashboard") target = "/dashboard";
    else if (action === "questions") target = "/questions";
    else if (action === "profile") target = "/profile";
    else if (action === "home") target = "/";

    navigate(target);
    setOpen(false);
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open Prep assistant"
        style={{
          position: "fixed",
          bottom: 26,
          right: 26,
          zIndex: 9999,
          width: 58,
          height: 58,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: `linear-gradient(135deg, ${C.accent}, var(--brand-cyan))`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 30px -6px rgba(229,9,20,0.5)",
          transition: "transform 180ms ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? <X size={22} color="#ffffff" /> : <Sparkles size={22} color="#ffffff" />}
      </button>

      {open && (
        <div style={{
          position: "fixed",
          bottom: 96,
          right: 26,
          zIndex: 9999,
          width: 360,
          maxHeight: "500px",
          display: "flex",
          flexDirection: "column",
          background: "#111726f5",
          border: "1px solid var(--glass-border)",
          borderRadius: 14,
          boxShadow: "0 20px 50px -12px rgba(0,0,0,0.6)",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
          animation: "agentSlideIn 220ms cubic-bezier(0.22,1,0.36,1)",
        }}>
          <style>{`@keyframes agentSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

          {/* Header */}
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${C.accent}, var(--brand-cyan))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}><Bot size={16} color="#ffffff" /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "white" }}>Prep</div>
              <div style={{ color: C.muted, fontSize: 11 }}>SkillPrep.AI Assistant</div>
            </div>
          </div>

          {/* Messages block */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                <div style={{
                  background: m.role === "user" ? "var(--brand-red)" : C.surfaceSolid,
                  color: m.role === "user" ? "#fff" : C.text,
                  border: m.role === "user" ? "none" : `1px solid ${C.line}`,
                  padding: "10px 13px",
                  borderRadius: 10,
                  fontSize: "13.5px",
                  lineHeight: 1.5,
                }}>{m.text}</div>
                {m.action && actionLabels[m.action] && (
                  <button
                    onClick={() => handleAction(m.action)}
                    style={{
                      marginTop: 6,
                      background: "transparent",
                      color: "var(--brand-cyan)",
                      border: "1px solid var(--brand-cyan)",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      textTransform: "none"
                    }}
                  >{actionLabels[m.action]} <ArrowRight size={12} /></button>
                )}
              </div>
            ))}
            {loading && <div style={{ alignSelf: "flex-start" }}><TypingDots /></div>}
          </div>

          {/* Suggestions block (only before first user message) */}
          {messages.length === 1 && (
            <div style={{ padding: "0 16px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {suggestions.map(s => (
                <span key={s} onClick={() => sendMessage(s)} style={{
                  fontSize: "11.5px",
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: `1px solid ${C.line}`,
                  color: "var(--text-grey)",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.02)"
                }}>{s}</span>
              ))}
            </div>
          )}

          {/* Input field */}
          <div style={{ padding: 12, borderTop: `1px solid ${C.line}`, display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Ask Prep anything..."
              style={{
                flex: 1,
                background: C.surfaceSolid,
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                padding: "10px 12px",
                color: C.text,
                fontSize: 13,
                outline: "none",
              }}
            />
            <button onClick={() => sendMessage()} disabled={loading} style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              border: "none",
              cursor: loading ? "default" : "pointer",
              background: "var(--brand-red)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.6 : 1,
            }}><Send size={15} color="#fff" /></button>
          </div>
        </div>
      )}
    </>
  );
}
