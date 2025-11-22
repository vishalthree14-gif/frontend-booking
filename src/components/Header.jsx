import React from "react";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  // ✅ Hide buttons on "/", "/login", and "/signup"
  const hideAuthButtons =
    path === "/" || path === "/login" || path === "/signup";

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Mall Booking
        </h1>
      </div>

      {/* ✅ Only show buttons if not hidden */}
      {!hideAuthButtons && (
        <div className="header-right">
          <button className="btn login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn signup-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      )}

      {/* ✅ Conditional button swapping (only visible on login/signup) */}
      {path === "/login" && (
        <div className="header-right">
          <button className="btn signup-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      )}
      {path === "/signup" && (
        <div className="header-right">
          <button className="btn login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
