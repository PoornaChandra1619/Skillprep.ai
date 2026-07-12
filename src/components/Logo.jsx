import React from "react";
import SkillPrepMark from "./SkillPrepMark";

export default function Logo({ size = 24 }) {
  const displayFont = "'Sora', 'Space Grotesk', sans-serif";
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
      <SkillPrepMark size={size * 1.25} />
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
