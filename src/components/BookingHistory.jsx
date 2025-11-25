import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./BookingHistory.css";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;


  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/bookings/user/${user.id}`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      } else {
        setError(data.message || "Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load booking history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "SUCCESS":
        return "status-success";
      case "PENDING":
        return "status-pending";
      case "FAILED":
        return "status-failed";
      default:
        return "status-pending";
    }
  };

  if (loading) {
    return (
      <div className="booking-history">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-history">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchBookings} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="booking-history">
        <div className="empty-state">
          <h3>No Bookings Yet</h3>
          <p>Start exploring movies and book your first show!</p>
          <button onClick={() => navigate("/home")} className="browse-btn">
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-history">
      <div className="booking-history-header">
        <h2>My Bookings</h2>
        <span className="booking-count">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <div className="booking-card-content">
              {/* Movie Poster */}
              <div className="booking-poster">
                <img
                  src={booking.showId?.movieId?.poster || "/placeholder-movie.png"}
                  alt={booking.showId?.movieId?.title}
                />
              </div>

              {/* Booking Details */}
              <div className="booking-details">
                <h3 className="movie-title">{booking.showId?.movieId?.title}</h3>

                <div className="booking-meta">
                  <span className="meta-item">
                    <i className="icon">🎭</i>
                    {booking.showId?.movieId?.genre}
                  </span>
                  <span className="meta-item">
                    <i className="icon">🗣️</i>
                    {booking.showId?.movieId?.language}
                  </span>
                </div>

                <div className="booking-info">
                  <div className="info-row">
                    <span className="label">Mall:</span>
                    <span className="value">
                      {booking.showId?.hallId?.mallId?.name}, {booking.showId?.hallId?.mallId?.city}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Hall:</span>
                    <span className="value">{booking.showId?.hallId?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Show:</span>
                    <span className="value">
                      {formatDate(booking.showId?.date)} at {formatTime(booking.showId?.time)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Seats:</span>
                    <span className="value seats">{booking.seats.join(", ")}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Total:</span>
                    <span className="value price">₹{booking.amount}</span>
                  </div>
                </div>

                <div className="booking-footer">
                  <span className={`payment-status ${getPaymentStatusClass(booking.paymentStatus)}`}>
                    {booking.paymentStatus}
                  </span>
                  <span className="booking-date">
                    Booked on {formatDate(booking.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
