import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./auth.css";
import Logo from "./Logo";
import { registerUser, loginUser, googleLogin, forgotPassword } from "../services/authService";

export default function AuthModal({ close }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");

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

    if (!isLogin) {
      if (!form.name.trim()) return "Name is required";
      if (form.password.length < 6) return "Password must be at least 6 characters";
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>_]/;
      if (!hasSpecial.test(form.password)) {
        return "Password must contain at least one special character";
      }
    } else {
      if (!form.password) return "Password is required";
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

  const handleForgotSubmit = async () => {
    setError("");
    setForgotSuccess("");
    if (!form.email) {
      return setError("Email is required");
    }
    if (!form.email.includes("@") || !form.email.includes(".")) {
      return setError("Please enter a valid email address");
    }

    setLoading(true);
    try {
      const data = await forgotPassword(form.email);
      setForgotSuccess(data.msg || "If a user exists with that email, a reset link has been sent.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send reset link.");
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

  if (isForgot) {
    return (
      <div className="auth-overlay" onClick={close}>
        <div className="auth-card" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={close} aria-label="Close">✕</button>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
            <Logo size={28} />
          </div>

          <h2>Reset Password</h2>
          <p className="auth-subtitle">
            Enter your email to receive a password reset link
          </p>

          {error && <div className="auth-error">{error}</div>}
          {forgotSuccess && (
            <div style={{ background: "rgba(47, 217, 217, 0.1)", border: "1px solid rgba(47, 217, 217, 0.3)", color: "var(--brand-cyan)", borderRadius: "6px", padding: "12px 16px", fontSize: "0.9rem", marginBottom: "20px", textAlign: "left" }}>
              {forgotSuccess}
            </div>
          )}

          <div className="input-group">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleForgotSubmit()}
              autoComplete="email"
            />
          </div>

          <button
            className="submit-btn"
            onClick={handleForgotSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="toggle-auth">
            <span onClick={() => { setError(""); setForgotSuccess(""); setIsForgot(false); setIsLogin(true); }}>
              Back to Login
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-overlay" onClick={close}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close} aria-label="Close">✕</button>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
          <Logo size={28} />
        </div>

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

        {isLogin && (
          <div style={{ textAlign: "right", marginTop: "-8px", marginBottom: "15px" }}>
            <span
              onClick={() => { setError(""); setIsForgot(true); }}
              style={{ color: "var(--brand-cyan)", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              Forgot Password?
            </span>
          </div>
        )}

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
