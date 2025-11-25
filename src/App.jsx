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
import AdminNav from "./components/AdminNav";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageMalls from "./pages/admin/ManageMalls";
import ManageMovies from "./pages/admin/ManageMovies";
import ManageHalls from "./pages/admin/ManageHalls";
import ManageShows from "./pages/admin/ManageShows";
import SelectMall from "./pages/SelectMall";
import ShowTimes from "./pages/ShowTimes";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmation from "./pages/BookingConfirmation";


import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";


import "./App.css";

// Protected Route Component for authenticated users
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="app">
        <Header />

        <main className="main-content">
          <Routes>

            {/* Landing page - Login */}
            <Route path="/" element={
              user ? (
                user.role === "admin" ? <Navigate to="/admin/malls" replace /> : <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } />

            {/* Auth routes - redirect to home if already logged in */}
            <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin/malls" : "/home"} replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />

            {/* User routes - protected */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />

            <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />

            <Route path="/mall/:id" element={<ProtectedRoute><MallDetails /></ProtectedRoute>} />

            <Route path="/booking/:movieId/select" element={<ProtectedRoute><SelectMall /></ProtectedRoute>} />
            <Route path="/booking/:movieId/mall/:mallId/shows" element={<ProtectedRoute><ShowTimes /></ProtectedRoute>} />
            <Route path="/booking/show/:showId/seats" element={<ProtectedRoute><SeatSelection /></ProtectedRoute>} />
            <Route path="/booking/confirm" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />

            <Route path="*" element={<h2>404 - Page Not Found</h2>} />


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
                  <AdminNav />
                  <ManageMalls />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/movies"
              element={
                <AdminRoute>
                  <AdminNav />
                  <ManageMovies />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/malls/:id"
              element={
                <AdminRoute>
                  <AdminNav />
                  <ManageHalls />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/halls/:hallId/shows"
              element={
                <AdminRoute>
                  <AdminNav />
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

