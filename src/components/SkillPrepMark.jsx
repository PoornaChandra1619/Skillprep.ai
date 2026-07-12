import React from "react";

export function SkillPrepMark({ size = 40, className, style }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 180 180" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4c3fd6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="180" height="180" rx="40" fill="url(#badgeGrad)" />
      <g stroke="#c4b5fd" strokeWidth="2.5">
        <line x1="50" y1="40" x2="85" y2="60" />
        <line x1="85" y1="60" x2="50" y2="80" />
        <line x1="50" y1="80" x2="90" y2="100" />
        <line x1="90" y1="100" x2="50" y2="120" />
        <line x1="50" y1="120" x2="85" y2="140" />
      </g>
      {/* Neural network nodes */}
      <circle cx="50" cy="40" r="9" fill="#22d3ee">
        <animate attributeName="r" values="9;11;9" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="85" cy="60" r="7" fill="#e0e7ff" />
      <circle cx="50" cy="80" r="9" fill="#22d3ee">
        <animate attributeName="r" values="9;7;9" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="90" cy="100" r="7" fill="#e0e7ff" />
      <circle cx="50" cy="120" r="9" fill="#22d3ee">
        <animate attributeName="r" values="9;11;9" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="85" cy="140" r="9" fill="#22d3ee">
        <animate attributeName="r" values="9;7;9" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default SkillPrepMark;
