import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Interview() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [review, setReview] = useState(null);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
    "UI/UX Designer",
    "Mobile App Developer"
  ];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Find 1 male and 2 female-ish voices
        const male = voices.find(v => v.name.includes("David") || v.name.includes("Male") || v.name.includes("Google US English") && !v.name.includes("Female")) || voices[0];
        const female1 = voices.find(v => v.name.includes("Zira") || v.name.includes("Female") || v.name.includes("Google UK English Female")) || voices[1] || voices[0];
        const female2 = voices.find(v => (v.name.includes("Samantha") || v.name.includes("Mary") || v.name.includes("Google US English")) && v !== female1) || voices[2] || voices[0];

        const options = [];
        if (male) options.push({ label: "Male Voice", voice: male });
        if (female1) options.push({ label: "Female Voice 1", voice: female1 });
        if (female2) options.push({ label: "Female Voice 2", voice: female2 });

        setAvailableVoices(options);
        if (options.length > 0) setSelectedVoice(options[0]);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/upload-resume`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResumeText(data.text);
      setResumeFile(file);
    } catch (err) {
      alert("Resume upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const startInterview = async () => {
    if (!role.trim()) {
      alert("Please select or type a role first.");
      return;
    }
    setLoading(true);
    setStarted(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/start-interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role, resumeText })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessages([{ sender: "ai", text: data.question }]);
      speakText(data.question);
    } catch (err) {
      alert("Failed to start interview: " + err.message);
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!selectedVoice) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice.voice;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = { sender: "user", text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/chat-interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          role,
          resumeText,
          history: messages,
          answer: inputText
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessages(prev => [...prev, { sender: "ai", text: data.question }]);
      speakText(data.question);
    } catch (err) {
      alert("Error sending message: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    window.speechSynthesis.cancel();
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = (e) => {
      console.error(e);
      setIsListening(false);
    };

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputText(transcript);
    };

    rec.start();
  };

  const endInterview = async () => {
    setIsGeneratingReview(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/end-interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role, history: messages })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReview(data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to generate review");
      navigate("/");
    } finally {
      setIsGeneratingReview(false);
    }
  };

  if (review) {
    return (
      <div id="page-wrapper">
        <Navbar />

        <section id="wrapper">
          <header>
            <div className="inner">
              <h2>Interview Review 📊</h2>
              <p>Review comprehensive feedback on your performance.</p>
            </div>
          </header>

          <div className="wrapper">
            <div className="inner" style={{ maxWidth: "800px", margin: "0 auto" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                <div className="stats-grid" style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
                  <div className="stat-item" style={{ textAlign: "center" }}>
                    <span className="stat-value" style={{ color: "#22d3ee", fontSize: "2.5em", fontWeight: "700" }}>{review.overallScore || 0}%</span>
                    <span className="stat-label" style={{ display: "block", fontSize: "12px", opacity: 0.6, marginTop: "8px" }}>Communication & Accuracy Score</span>
                  </div>
                </div>

                <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "30px", opacity: 0.9 }}>{review.summary || "No summary available."}</p>

                <div className="review-sections" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <div className="glass-card" style={{ flex: 1, minWidth: "280px", background: "rgba(239, 68, 68, 0.05)", borderColor: "rgba(239, 68, 68, 0.15)", padding: "20px", borderRadius: "10px", border: "1px solid" }}>
                    <h4 style={{ color: "#ef4444", marginBottom: "15px", fontWeight: "600" }}>Mistakes & Misunderstandings</h4>
                    <ul style={{ paddingLeft: "15px", fontSize: "13px", color: "rgba(255,255,255,0.8)", listStyle: "circle" }}>
                      {review.mistakes?.length > 0 ? review.mistakes.map((m, i) => <li key={i} style={{ marginBottom: "6px" }}>{m}</li>) : <li>No notable mistakes.</li>}
                    </ul>
                  </div>
                  <div className="glass-card" style={{ flex: 1, minWidth: "280px", background: "rgba(34, 211, 238, 0.05)", borderColor: "rgba(34, 211, 238, 0.15)", padding: "20px", borderRadius: "10px", border: "1px solid" }}>
                    <h4 style={{ color: "#22d3ee", marginBottom: "15px", fontWeight: "600" }}>Recommended Improvements</h4>
                    <ul style={{ paddingLeft: "15px", fontSize: "13px", color: "rgba(255,255,255,0.8)", listStyle: "circle" }}>
                      {review.improvements?.length > 0 ? review.improvements.map((m, i) => <li key={i} style={{ marginBottom: "6px" }}>{m}</li>) : <li>Keep up the good work!</li>}
                    </ul>
                  </div>
                </div>

                <button
                  className="button primary fit"
                  style={{ marginTop: "40px", width: "100%" }}
                  onClick={() => navigate("/")}
                >
                  Done
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header>
          <div className="inner">
            <h2>AI Voice Interviewer 🎤</h2>
            <p>Practice simulated technical and behavioral interviews with real-time feedback.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: started ? "800px" : "600px", margin: "0 auto" }}>
            
            {!started ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: "rgba(255, 255, 255, 0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                <h3 className="major" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "10px", marginBottom: "20px" }}>
                  Setup Interview Profile
                </h3>

                <div className="interview-setup-grid" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div className="field">
                    <label htmlFor="role-input">Target Job Role</label>
                    <input
                      id="role-input"
                      placeholder="e.g. Frontend Developer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "white", padding: "10px", borderRadius: "6px", width: "100%", outline: "none" }}
                      list="roles-list"
                    />
                    <datalist id="roles-list">
                      {roles.map((r, i) => (
                        <option key={i} value={r} />
                      ))}
                    </datalist>
                  </div>

                  <div className="field">
                    <label>Resume (Optional, PDF format)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                    />
                    <button
                      className="button fit"
                      onClick={() => fileInputRef.current.click()}
                      disabled={isUploading}
                      style={{
                        borderColor: resumeText ? "#22d3ee" : "",
                        color: resumeText ? "#22d3ee" : ""
                      }}
                    >
                      {isUploading ? "📤 Parsing PDF..." : resumeText ? "✅ Resume Attached successfully" : "📄 Upload Resume"}
                    </button>
                  </div>
                </div>

                <div className="voice-selector-setup" style={{ marginTop: '25px' }}>
                  <label>Select AI voice model</label>
                  <div className="voice-options" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                    {availableVoices.map((v, i) => (
                      <button
                        key={i}
                        className={`button ${selectedVoice?.label === v.label ? 'primary' : ''}`}
                        onClick={() => setSelectedVoice(v)}
                        style={{ fontSize: "10px", height: "35px", lineHeight: "35px", padding: "0 15px" }}
                      >
                        {v.label.includes("Male") ? "👨" : "👩"} {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="button primary fit"
                  style={{ marginTop: "35px", width: "100%" }}
                  onClick={startInterview}
                  disabled={isUploading}
                >
                  {isUploading ? "Wait for Resume..." : "Start Interview"}
                </button>
              </motion.div>
            ) : (
              <motion.div
                className="chat-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)", overflow: "hidden" }}
              >
                <div className="chat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.02)" }}>
                  <div className="header-info">
                    <h3 style={{ margin: 0, fontSize: "16px", color: "white" }}>{role} Interview</h3>
                    <div className="voice-indicator" style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
                      Voice: {selectedVoice?.label.includes("Male") ? "👨" : "👩"} {selectedVoice?.label}
                    </div>
                  </div>
                  <button
                    className="button"
                    onClick={endInterview}
                    disabled={isGeneratingReview}
                    style={{ background: "rgba(239, 68, 68, 0.2)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444", fontSize: "11px", height: "35px", lineHeight: "35px", padding: "0 15px" }}
                  >
                    {isGeneratingReview ? "Generating..." : "End Interview"}
                  </button>
                </div>

                <div className="chat-box" style={{ padding: "20px", minHeight: "350px", maxHeight: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        alignSelf: msg.sender === "ai" ? "flex-start" : "flex-end",
                        background: msg.sender === "ai" ? "rgba(255, 255, 255, 0.06)" : "linear-gradient(135deg, #6366f1, #22d3ee)",
                        color: "white",
                        padding: "12px 18px",
                        borderRadius: msg.sender === "ai" ? "12px 12px 12px 0px" : "12px 12px 0px 12px",
                        maxWidth: "80%",
                        fontSize: "14px",
                        lineHeight: "1.4",
                        border: msg.sender === "ai" ? "1px solid rgba(255, 255, 255, 0.08)" : ""
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {loading && <div style={{ alignSelf: "flex-start", opacity: 0.5, fontSize: "12px", fontStyle: "italic" }}>AI is typing response...</div>}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area hybrid" style={{ display: "flex", gap: "10px", padding: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.02)", alignItems: "center" }}>
                  <button
                    className={`button ${isListening ? "primary" : ""}`}
                    onClick={startListening}
                    title="Voice input (Speak to AI)"
                    style={{ width: "42px", height: "42px", borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", minWidth: "42px", borderColor: isListening ? "#22d3ee" : "", color: isListening ? "#0f172a" : "" }}
                  >
                    🎤
                  </button>

                  <input
                    placeholder="Type your response or click microphone..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "white", padding: "10px 15px", borderRadius: "30px", outline: "none" }}
                  />

                  <button
                    className="button primary"
                    onClick={() => sendMessage()}
                    disabled={!inputText.trim()}
                    style={{ width: "42px", height: "42px", borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", minWidth: "42px" }}
                  >
                    ➔
                  </button>
                </div>
              </motion.div>
            )}
            
          </div>
        </div>
      </section>
    </div>
  );
}
