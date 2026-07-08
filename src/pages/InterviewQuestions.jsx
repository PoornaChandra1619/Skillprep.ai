import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const COMPANIES = [
  { id: "google", name: "Google", type: "MNC", color: "#7c5cff" },
  { id: "amazon", name: "Amazon", type: "MNC", color: "#2dd4dc" },
  { id: "microsoft", name: "Microsoft", type: "MNC", color: "#7c5cff" },
  { id: "service", name: "TCS / Infosys-style", type: "Service", color: "#2dd4dc" },
  { id: "startup", name: "Startups", type: "Startup", color: "#7c5cff" },
];

const ROUNDS = ["Technical", "Behavioral", "HR"];

const QUESTIONS = {
  google: {
    Technical: [
      { q: "Explain how you'd design a rate limiter for an API.", note: "Structure your answer around requirements → back-of-envelope estimation → high-level design → trade-offs. Don't jump straight to a solution." },
      { q: "Given an array, find the longest subarray with sum equal to k.", note: "Talk through brute force first, then optimize to prefix-sum + hashmap. Narrating your reasoning matters more than the final code." },
    ],
    Behavioral: [
      { q: "Tell me about a time you disagreed with a teammate's technical decision.", note: "Use STAR (Situation, Task, Action, Result). End on the outcome and what you'd do differently, not just the disagreement." },
    ],
    HR: [
      { q: "Why do you want to work at Google specifically?", note: "Avoid generic 'impact and scale' answers — reference a specific product, team, or engineering blog post that genuinely interests you." },
    ],
  },
  amazon: {
    Technical: [
      { q: "Design a system for Amazon's 'frequently bought together' feature.", note: "Amazon interviewers weight leadership principles even in technical rounds — mention customer obsession or ownership where it naturally fits." },
    ],
    Behavioral: [
      { q: "Describe a time you had to make a decision with incomplete information.", note: "This maps to 'Bias for Action.' Be explicit about the risk you accepted and how you mitigated it." },
      { q: "Tell me about a time you failed.", note: "Pick a real failure with a genuine lesson — avoid disguised humble-brags like 'I worked too hard.'" },
    ],
    HR: [
      { q: "Which Amazon Leadership Principle do you relate to most, and why?", note: "Have one specific, ready story per principle you mention — vague alignment without an example falls flat here." },
    ],
  },
  microsoft: {
    Technical: [
      { q: "How would you detect a cycle in a linked list?", note: "State the two-pointer (Floyd's) approach and its O(1) space advantage over a hash-set approach before coding." },
    ],
    Behavioral: [
      { q: "Tell me about a project where you had to learn a new technology quickly.", note: "Emphasize your learning process, not just the outcome — Microsoft rounds often probe how you approach ambiguity." },
    ],
    HR: [
      { q: "How do you handle feedback that you disagree with?", note: "Show you can separate emotional reaction from evaluation — a brief example beats a general philosophy." },
    ],
  },
  service: {
    Technical: [
      { q: "Explain the difference between SQL joins (INNER, LEFT, RIGHT, FULL).", note: "Service-company technical rounds lean toward fundamentals — be precise and use a small example table, don't just define terms." },
      { q: "What is the difference between process and thread?", note: "Cover memory sharing and context-switch cost — these are the two points interviewers usually probe further." },
    ],
    Behavioral: [
      { q: "How do you handle working under a tight deadline?", note: "A short, concrete example beats a general statement about being a 'hard worker.'" },
    ],
    HR: [
      { q: "Are you willing to relocate / work in shifts?", note: "Answer directly and honestly — hedging here reads as a red flag more than the answer itself does." },
    ],
  },
  startup: {
    Technical: [
      { q: "Walk me through how you'd build a feature end-to-end with limited resources.", note: "Startups care about pragmatic trade-offs — explicitly call out what you'd cut or defer and why." },
    ],
    Behavioral: [
      { q: "Tell me about a time you took ownership of something outside your defined role.", note: "This is the single most common startup behavioral question — have one strong example ready before the interview, not improvised." },
    ],
    HR: [
      { q: "Why a startup instead of a bigger company?", note: "Avoid 'more responsibility' as your only reason — mention something specific about their product or stage that draws you in." },
    ],
  },
};

export default function InterviewQuestions() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("google");
  const [round, setRound] = useState("Technical");

  const active = COMPANIES.find(c => c.id === company);
  const list = QUESTIONS[company]?.[round] || [];

  const handlePractice = () => {
    let mockRole = "Software Engineer";
    if (company === "google") mockRole = "Google Systems Engineer";
    else if (company === "amazon") mockRole = "Amazon SDE";
    else if (company === "microsoft") mockRole = "Microsoft Cloud Engineer";
    else if (company === "startup") mockRole = "Startup Generalist";
    else if (company === "service") mockRole = "System Analyst";

    navigate("/interview", { state: { role: mockRole } });
  };

  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header style={{ backgroundImage: `url('/images/pic02.jpg')` }}>
          <div className="inner">
            <h2 className="bebas-font">Common Interview Questions</h2>
            <p>Commonly reported preparation patterns. Tap a company and round to practice answering.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 0" }}>
            
            {/* Header info */}
            <p style={{ color: "var(--text-grey)", fontSize: "14px", marginBottom: "30px", lineHeight: "1.6" }}>
              💡 <em>Note: These are commonly reported patterns for each company type, organized by round — pulled from the same packs your AI Voice Interviewer draws on. Not a guarantee of exact questions, just what to prepare for.</em>
            </p>

            {/* Company Selection Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px", marginBottom: "35px" }}>
              {COMPANIES.map(c => (
                <div
                  key={c.id}
                  onClick={() => setCompany(c.id)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    background: company === c.id ? `${c.color}22` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${company === c.id ? c.color : "var(--glass-border)"}`,
                    textAlign: "center"
                  }}
                  className="sp-card"
                >
                  <h4 style={{ margin: "0 0 6px 0", color: "#ffffff", fontWeight: "600", fontSize: "15px" }}>{c.name}</h4>
                  <span style={{ fontSize: "11px", color: "var(--text-grey)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.type}</span>
                </div>
              ))}
            </div>

            {/* Round Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px" }}>
              {ROUNDS.map(r => (
                <button
                  key={r}
                  onClick={() => setRound(r)}
                  style={{
                    background: round === r ? "var(--brand-red)" : "rgba(255,255,255,0.03)",
                    color: "#ffffff",
                    border: round === r ? "1px solid var(--brand-red)" : "1px solid var(--glass-border)",
                    padding: "8px 18px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                  className="sp-btn"
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "40px" }}>
              {list.length === 0 ? (
                <div style={{ padding: "30px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "10px", textAlign: "center", color: "var(--text-grey)" }}>
                  No questions logged yet for this company + round combination.
                </div>
              ) : (
                list.map((item, i) => (
                  <div 
                    key={i} 
                    style={{
                      background: "rgba(30, 30, 35, 0.55)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "12px",
                      padding: "20px"
                    }}
                    className="sp-card"
                  >
                    <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                      <span style={{ color: active.color, fontWeight: "bold", fontSize: "14px" }}>Q{i + 1}</span>
                      <h4 style={{ margin: 0, color: "#ffffff", fontSize: "16px", lineHeight: "1.4", fontWeight: "600" }}>{item.q}</h4>
                    </div>
                    <div style={{ display: "flex", gap: "8px", paddingLeft: "32px", fontSize: "13.5px", color: "var(--text-grey)", lineHeight: "1.6" }}>
                      <span>💡</span>
                      <span>{item.note}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Practice CTA */}
            {list.length > 0 && (
              <button 
                onClick={handlePractice} 
                className="button primary fit sp-btn" 
                style={{ width: "100%", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "15px" }}
              >
                ▶ Practice this with AI Voice Interviewer
              </button>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
