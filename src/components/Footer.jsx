import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h3 className="footer-logo">Mall Booking</h3>
        <p className="footer-tagline">Your favorite malls, one click away.</p>
      </div>

      <div className="footer-right">
        <a href="/about" className="footer-link">About</a>
        <a href="/contact" className="footer-link">Contact</a>
        <a href="/privacy" className="footer-link">Privacy Policy</a>
        <p className="footer-copy">© {new Date().getFullYear()} Mall Booking</p>
      </div>
    </footer>
  );
};

export default Footer;
