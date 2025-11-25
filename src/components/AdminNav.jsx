import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminNav.css";

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Manage Malls", path: "/admin/malls" },
    { label: "Manage Movies", path: "/admin/movies" },
    // { label: "Manage Halls", path: "/admin/halls" },
    // { label: "Manage Shows", path: "/admin/shows" },
  ];

  return (
    <nav className="admin-nav">
      <div className="admin-nav-container">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`admin-nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default AdminNav;
