import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar({ onLoginClick }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
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
            <header id="header" className="alt">
                <h1>
                    <Link to="/" onClick={(e) => handleNavClick("top", e)}>SkillPrep AI</Link>
                </h1>
                <nav>
                    <a href="#menu" onClick={toggleMenu}>Menu</a>
                </nav>
            </header>

            <nav id="menu">
                <div className="inner">
                    <h2>Menu</h2>
                    <ul className="links">
                        <li><Link to="/" onClick={(e) => handleNavClick("top", e)}>Home</Link></li>
                        <li><a href="#features" onClick={(e) => handleNavClick("features", e)}>Features</a></li>
                        <li><a href="#contact" onClick={(e) => handleNavClick("contact", e)}>Contact</a></li>
                        
                        {user ? (
                            <>
                                <li><Link to="/dashboard" onClick={() => setShowMenu(false)}>Dashboard</Link></li>
                                <li><Link to="/profile" onClick={() => setShowMenu(false)}>Profile</Link></li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                                        Logout (👤 {user.name.split(" ")[0]})
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
                    <a href="#" className="close" onClick={toggleMenu}>Close</a>
                </div>
            </nav>
        </>
    );
}
