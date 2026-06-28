import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ onLoginClick }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        // Apply theme
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
        window.location.reload();
    };

    const handleLoginClick = () => {
        if (onLoginClick) {
            // If parent provided a handler (e.g., Intro page), use it directly
            onLoginClick();
        } else {
            // Otherwise navigate to home with login param
            navigate("/?login=true");
        }
    };

    const handleNavClick = (sectionId) => {
        if (window.location.pathname === "/") {
            if (sectionId === "top") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }
        } else {
            if (sectionId === "top") {
                navigate("/");
            } else {
                navigate(`/?scroll=${sectionId}`);
            }
        }
    };

    return (
        <nav className="navbar">
            <motion.div
                className="logo"
                onClick={() => handleNavClick("top")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Sk<span>.</span>
            </motion.div>

            <ul className="nav-links">
                <li onClick={() => handleNavClick("top")}>Home</li>
                <li onClick={() => handleNavClick("features")}>Features</li>
                <li onClick={() => handleNavClick("contact")}>Contact</li>
            </ul>

            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                {/* THEME TOGGLE */}
                <motion.button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isDarkMode ? "☀️" : "🌙"}
                </motion.button>

                {!user ? (
                    <motion.button
                        className="nav-btn"
                        onClick={handleLoginClick}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Login
                    </motion.button>
                ) : (
                    <div className="profile-dropdown">
                        <motion.div
                            className="profile-trigger"
                            onClick={() => setShowProfile((prev) => !prev)}
                            whileHover={{ scale: 1.03 }}
                        >
                            👤 {user.name}
                        </motion.div>

                        <AnimatePresence>
                            {showProfile && (
                                <motion.div
                                    className="dropdown-menu"
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="dropdown-item">👤 {user.name}</div>
                                    <div className="dropdown-item" onClick={() => navigate("/dashboard")}>📊 Dashboard</div>
                                    <div className="dropdown-item" onClick={() => navigate("/profile")}>📄 Profile</div>
                                    <div className="dropdown-item logout" onClick={logout}>🚪 Logout</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </nav>
    );
}
