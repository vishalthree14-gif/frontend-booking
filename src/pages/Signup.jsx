import React, { useState } from "react";
import "./Signup.css";

const Signup = () => {

  const baseURL = import.meta.env.VITE_APP_USER_SERVICE_URL;

  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering user:", formData);
    // TODO: Call your backend API here

    try{

    setLoading(true);

    const bodyData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    // Only send role if it's admin
    if (formData.role === "admin") {
      bodyData.role = "admin";
    }

    const response = await fetch(`${baseURL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( bodyData  )

      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("User registered successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setMsg(data.msg)

      } else {
        alert(data.message || "Registration failed");
      }
    }catch(err){
      res.status(404).json({error: err.message});
      console.log(err.message);
    }finally{
      setLoading(false);
    }

  };

  const handleGoogleSignUp = () => {
    console.log("Sign up with Google clicked");
    // TODO: Add Google signup logic
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Create an Account</h2>

        {loading && <p>checking you patience</p> }
        {msg && <p>{msg}</p>}

        <button className="google-btn" onClick={handleGoogleSignUp}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="google-logo"
          />
          Sign up with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="login-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
