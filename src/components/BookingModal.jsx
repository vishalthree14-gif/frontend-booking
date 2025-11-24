import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./BookingModal.css";

const BookingModal = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && user && user.id) {
      fetchBookings();
    }
  }, [isOpen, user]);

  const fetchBookings = async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5002/api/bookings/user/${user.id}`);
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

  const handleBrowseMovies = () => {
    onClose();
    navigate("/home");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>My Bookings</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={fetchBookings} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <h3>No Bookings Yet</h3>
              <p>Start exploring movies and book your first show!</p>
              <button onClick={handleBrowseMovies} className="browse-btn">
                Browse Movies
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
