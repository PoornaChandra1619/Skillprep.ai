import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import Logo from "../components/Logo";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_]/;
    if (!hasSpecial.test(password)) {
      return setError("Password must contain at least one special character");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const data = await resetPassword(token, password);
      setSuccess(data.msg || "Password reset successfully!");
      setTimeout(() => {
        navigate("/?login=true");
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to reset password. The link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #05070c, #0a0e16)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ marginBottom: "30px" }}>
        <Logo size={32} />
      </div>

      <div className="auth-card" style={{ width: "400px", maxWidth: "100%", padding: "45px 35px", position: "relative" }}>
        <h2 className="bebas-font" style={{ fontSize: "2rem", marginBottom: "10px", color: "#f2f3f7", textAlign: "left" }}>
          New Password
        </h2>
        <p className="auth-subtitle" style={{ textAlign: "left", marginBottom: "25px" }}>
          Please enter and confirm your new password below.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div style={{
            background: "rgba(47, 217, 217, 0.1)",
            border: "1px solid rgba(47, 217, 217, 0.3)",
            color: "var(--brand-cyan)",
            borderRadius: "6px",
            padding: "12px 16px",
            fontSize: "0.9rem",
            marginBottom: "20px",
            textAlign: "left"
          }}>
            {success} Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div className="input-group">
            <input
              type="password"
              placeholder="New Password (6+ chars, special char)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success !== ""}
              style={{ margin: 0, width: "100%" }}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || success !== ""}
              style={{ margin: 0, width: "100%" }}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || success !== ""}
            style={{ width: "100%", padding: "13px 0", marginTop: "10px" }}
          >
            {loading ? "Resetting..." : "Save New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
