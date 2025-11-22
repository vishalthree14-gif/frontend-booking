import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Booking from "./pages/Booking";  // if you added this
import MallDetails from "./pages/MallDetails";


import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageMalls from "./pages/admin/ManageMalls";
import ManageHalls from "./pages/admin/ManageHalls";
import ManageShows from "./pages/admin/ManageShows";
import SelectMall from "./pages/SelectMall";
import ShowTimes from "./pages/ShowTimes";


import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";


import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        <main className="main-content">
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/movie/:id" element={<MovieDetails />} />

            <Route path="/booking/:id" element={<Booking />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/home" element={<Navigate to="/" />} />

            <Route path="*" element={<h2>404 - Page Not Found</h2>} />

            <Route path="/mall/:id" element={<MallDetails />} />

            <Route path="/booking/:movieId/select" element={<SelectMall />} />
            <Route path="/booking/:movieId/mall/:mallId/shows" element={<ShowTimes />} />


            {/* ------- ADMIN ONLY ROUTES ------- */}
            {/* <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            /> */}

            <Route
              path="/admin/malls"
              element={
                <AdminRoute>
                  <ManageMalls />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/malls/:id"
              element={
                <AdminRoute>
                  <ManageHalls />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/halls/:hallId/shows"
              element={
                <AdminRoute>
                  <ManageShows />
                </AdminRoute>
              }
            />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

