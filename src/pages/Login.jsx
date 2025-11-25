import React, { useState } from "react";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");


  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);

      const response = await fetch(API_ENDPOINTS.USERS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("📨 Login response:", data);

      if (response.ok) {
        // Update global user context
        login(data.accessToken, data.user);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        // localStorage.setItem("role", JSON.stringify(data.role));
        localStorage.setItem("role", data.role);
        // alert("Login successful!");
        
        // Redirect admin
        if (data.user.role === "admin") {
          navigate("/admin/malls");
        } else {
          navigate("/");
        }

      } else {
        setMsg(data.msg || data.error || "Invalid credentials");
      }
    } catch (err) {
      console.log(err.message);
      setMsg("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  // // 🔹 Google Login
  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     const idToken = credentialResponse.credential;

  //     const res = await fetch(API_ENDPOINTS.USERS.GOOGLE_LOGIN, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ idToken }),
  //     });

  //     const data = await res.json();
  //     console.log("✅ Google login success:", data);

  //     if (res.ok) {
  //       localStorage.setItem("accessToken", data.accessToken);
  //       localStorage.setItem("refreshToken", data.refreshToken);
  //       alert("Logged in with Google successfully!");
  //       // Redirect if you want:
  //       // window.location.href = "/";
  //     } else {
  //       alert(data.msg || data.error || "Google login failed");
  //     }
  //   } catch (err) {
  //     console.error("❌ Google login error:", err);
  //     alert("Google login failed. Try again.");
  //   }
  // };


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const res = await fetch(API_ENDPOINTS.USERS.GOOGLE_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      console.log("✅ Google login success:", data);

      if (res.ok) {
        // Save tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Store user (optional depending on your auth flow)
        login(data.accessToken, data.user);
        localStorage.setItem("role", data.user.role);

        // Redirect to homepage
        // navigate("/");

        if (data.user.role === "admin") {
          navigate("/admin/malls");
        } else {
          navigate("/");
        }


      } else {
        alert(data.msg || data.error || "Google login failed");
      }
    } catch (err) {
      console.error("❌ Google login error:", err);
      alert("Google login failed. Try again.");
    }
  };



  const handleGoogleFailure = () => {
    alert("Google login failed. Please try again.");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>

        {loading && <div className="spinner"></div>}
        {msg && <p>{msg}</p>}

        {/* ✅ Official Google Login Button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
