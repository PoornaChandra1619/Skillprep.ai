// ⚠️ Always use SAME origin as backend CORS
const API_URL = "http://localhost:5000/api/auth";

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

    const result = await res.json();

    // ❌ backend error
    if (!res.ok) {
      throw new Error(result.msg || result.message || "Register failed");
    }

    // ✅ success
    return result; // { token, user } (or msg if token not yet implemented)

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // 🔥 IMPORTANT: propagate real error
    throw new Error(err.message || "Server not reachable");
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

    const result = await res.json();

    // ❌ backend error
    if (!res.ok) {
      throw new Error(result.msg || result.message || "Login failed");
    }

    // 🔐 token must be present
    if (!result.token) {
      throw new Error("Token not received from server");
    }

    // ✅ success
    return result; // { token, user }

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    // 🔥 propagate actual backend error
    throw new Error(err.message || "Server not reachable");
  }
};
