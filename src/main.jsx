import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { AuthProvider } from "./context/AuthContext";  // <-- import this

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="679100230789-lr28mqkm5uaik0p0ev0hphid3l9r6sbr.apps.googleusercontent.com">
      <AuthProvider>          {/* <-- Add this wrapper */}
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);


// import { StrictMode } from 'react'
// import ReactDOM from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import React from "react";


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId="679100230789-lr28mqkm5uaik0p0ev0hphid3l9r6sbr.apps.googleusercontent.com">
//     <App />
//     </GoogleOAuthProvider>
//   </React.StrictMode>,
// )
