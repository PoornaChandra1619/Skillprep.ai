const API_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

export { API_URL };

export const registerUser = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const text = await res.text();

    if (!res.ok) {
      let errorMsg = "Registration failed";
      try {
        const parsed = JSON.parse(text);
        if (parsed.msg || parsed.message) errorMsg = parsed.msg || parsed.message;
      } catch (e) {
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }

    return text ? JSON.parse(text) : {};
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    }
    throw err;
  }
};

export const loginUser = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const text = await res.text();

    if (!res.ok) {
      let errorMsg = "Login failed";
      try {
        const parsed = JSON.parse(text);
        if (parsed.msg || parsed.message) errorMsg = parsed.msg || parsed.message;
      } catch (e) {
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }

    return text ? JSON.parse(text) : {};
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    }
    throw err;
  }
};
