import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import Logo from "./Logo";

export default function Navbar({ onLoginClick }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Navbar storedUser parse error:", err);
            }
        }

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/");
        window.location.reload();
    };

    const toggleMenu = (e) => {
        e.preventDefault();
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (showMenu) {
            document.body.classList.add("is-menu-visible");
        } else {
            document.body.classList.remove("is-menu-visible");
        }
        return () => {
            document.body.classList.remove("is-menu-visible");
        };
    }, [showMenu]);

    const handleLoginClick = (e) => {
        e.preventDefault();
        setShowMenu(false);
        if (onLoginClick) {
            onLoginClick();
        } else {
            navigate("/?login=true");
        }
    };

    const handleNavClick = (sectionId, e) => {
        e.preventDefault();
        setShowMenu(false);
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
        <>
            <header id="header" className={isScrolled ? "scrolled" : ""}>
                <h1>
                    <Link to="/" onClick={(e) => handleNavClick("top", e)} style={{ display: "inline-block", textDecoration: "none", border: "none" }}>
                        <Logo size={24} />
                    </Link>
                </h1>
                <nav>
                    {user ? (
                        <>
                            <Link to="/questions" style={{ fontWeight: '600' }}>Questions</Link>
                            <Link to="/dashboard" style={{ fontWeight: '600' }}>Dashboard</Link>
                            <Link to="/profile" style={{ fontWeight: '600' }}>Profile</Link>
                            <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} style={{ color: 'var(--brand-red)' }}>Logout</a>
                        </>
                    ) : (
                        <>
                            <a href="#" className="menu-btn" onClick={handleLoginClick}>Sign In</a>
                        </>
                    )}
                    <button className="menu-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', marginLeft: '10px' }} onClick={toggleMenu}>☰</button>
                </nav>
            </header>

            {createPortal(
                <nav id="menu" onClick={() => setShowMenu(false)}>
                    <div className="inner" onClick={(e) => e.stopPropagation()}>
                        <h2>Menu</h2>
                        <ul className="links">
                            <li><Link to="/" onClick={(e) => handleNavClick("top", e)}>Home</Link></li>
                            <li><a href="#features" onClick={(e) => handleNavClick("features", e)}>Features</a></li>
                            <li><a href="#faq" onClick={(e) => handleNavClick("faq", e)}>FAQs</a></li>
                            
                            {user ? (
                                <>
                                    <li><Link to="/questions" onClick={() => setShowMenu(false)}>Interview Questions</Link></li>
                                    <li><Link to="/dashboard" onClick={() => setShowMenu(false)}>Dashboard</Link></li>
                                    <li><Link to="/profile" onClick={() => setShowMenu(false)}>Profile</Link></li>
                                    <li>
                                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                                            Logout (👤 {(user.name || user.email || "User").split(" ")[0]})
                                        </a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li><a href="#" onClick={handleLoginClick}>Log In</a></li>
                                    <li><a href="#" onClick={handleLoginClick}>Sign Up</a></li>
                                </>
                            )}
                        </ul>
                        <a href="#" className="close" onClick={(e) => { e.preventDefault(); setShowMenu(false); }}>✕</a>
                    </div>
                </nav>,
                document.body
            )}
        </>
    );
}
