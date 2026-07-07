import React from "react";

export default function Logo({ size = 24 }) {
  const displayFont = "'Sora', 'Space Grotesk', sans-serif";
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
      <div style={{
        width: size, 
        height: size, 
        borderRadius: 6,
        background: "linear-gradient(135deg, #7c5cff, #2fd9d9)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: displayFont, 
        fontWeight: 800, 
        fontSize: size * 0.62, 
        color: "#05070c",
      }}>S</div>
      <span style={{ 
        fontFamily: displayFont, 
        fontWeight: 700, 
        fontSize: size * 0.82, 
        color: "#f2f3f7", 
        letterSpacing: "-0.02em" 
      }}>
        SkillPrep<span style={{ color: "#7c5cff" }}>.AI</span>
      </span>
    </div>
  );
}
