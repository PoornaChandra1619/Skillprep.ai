const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/auth`;

/* ================= REGISTER ================= */
export const registerUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await res.text();
    if (!res.ok) {
      let errorMsg = "Register failed";
      try {
        const parsed = JSON.parse(text);
        if (parsed.msg) errorMsg = parsed.msg;
      } catch (e) {
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }
    return text ? JSON.parse(text) : {};
  } catch (err) {
    // Network error — backend not running or unreachable
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Cannot connect to server. Please ensure the backend is running on port 5000.");
    }
    throw err;
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await res.text();
    if (!res.ok) {
      let errorMsg = "Login failed";
      try {
        const parsed = JSON.parse(text);
        if (parsed.msg) errorMsg = parsed.msg;
      } catch (e) {
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }
    return text ? JSON.parse(text) : {};
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Cannot connect to server. Please ensure the backend is running on port 5000.");
    }
    throw err;
  }
};

/* ================= GOOGLE AUTH ================= */
export const googleLogin = async (idToken) => {
  try {
    const res = await fetch(`${API_URL}/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const text = await res.text();
    if (!res.ok) {
      let errorMsg = "Google Login failed";
      try {
        const parsed = JSON.parse(text);
        if (parsed.msg) errorMsg = parsed.msg;
      } catch (e) {
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }
    return text ? JSON.parse(text) : {};
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Cannot connect to server. Please ensure the backend is running on port 5000.");
    }
    throw err;
  }
};
