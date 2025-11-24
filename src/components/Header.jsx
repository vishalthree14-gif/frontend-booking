import React, { useContext, useState } from "react";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BookingModal from "./BookingModal";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/malls" : "/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1 className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            Mall Booking
          </h1>
        </div>

        <div className="header-right">
          {user ? (
            // Show user info and logout when authenticated
            <>
              <span className="user-welcome">Welcome, {user.name}</span>
              {user.role !== "admin" && (
                <button
                  className="btn bookings-btn"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  My Bookings
                </button>
              )}
              <button className="btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            // Show Login/Signup when not authenticated
            <>
              {path !== "/login" && (
                <button className="btn login-btn" onClick={() => navigate("/login")}>
                  Login
                </button>
              )}
              {path !== "/signup" && (
                <button className="btn signup-btn" onClick={() => navigate("/signup")}>
                  Sign Up
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default Header;
