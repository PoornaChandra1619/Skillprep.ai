import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./auth.css";
import { registerUser, loginUser, googleLogin } from "../services/authService";

export default function AuthModal({ close }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email.includes("@") || !form.email.includes(".")) {
      return "Please enter a valid email address";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      return "Password must contain at least one special character";
    }
    if (!isLogin && !form.name) {
      return "Name is required";
    }
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

    setLoading(true);

    try {
      let data;

      if (isLogin) {
        data = await loginUser({
          email: form.email,
          password: form.password,
        });
      } else {
        data = await registerUser(form);
      }

      if (!data?.token) {
        throw new Error(data?.msg || "Authentication failed. Please try again.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      close();
      navigate("/dashboard");

    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      if (!credentialResponse?.credential) {
        throw new Error("Google did not return credentials. Please try again.");
      }

      const data = await googleLogin(credentialResponse.credential);

      if (!data?.token) {
        throw new Error(data?.msg || "Google Authentication failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      close();
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Google Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Login failed. Please check your Google account settings or try email login.");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="auth-overlay" onClick={close}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close} aria-label="Close">✕</button>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="auth-subtitle">
          {isLogin ? "Enter your details to login" : "Get started with your free account"}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <div className="social-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            shape="pill"
            text="continue_with"
            width="100%"
          />
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        {!isLogin && (
          <div className="input-group">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="name"
            />
          </div>
        )}

        <div className="input-group">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password (6+ chars, special char)"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="auth-loading">
              {isLogin ? "Logging in..." : "Creating account..."}
            </span>
          ) : (
            isLogin ? "Login" : "Sign Up"
          )}
        </button>

        <p className="toggle-auth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => { setError(""); setIsLogin(!isLogin); }}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
