import { useEffect, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  function show(message, duration = 3000) {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  }

  const ToastUI = toast ? (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      background: "#131826", border: "1px solid #7c5cff", color: "#f4f5f9",
      padding: "12px 22px", borderRadius: 8, fontFamily: "Inter, sans-serif",
      fontSize: 14, fontWeight: 600, zIndex: 1000,
      animation: "toastIn 220ms ease-out",
      boxShadow: "0 10px 30px -8px rgba(124,92,255,0.4)",
    }}>{toast}</div>
  ) : null;

  return { show, ToastUI };
}
