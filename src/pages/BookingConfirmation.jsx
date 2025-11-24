import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./BookingConfirmation.css";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { showId, selectedSeats, totalPrice, show } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if no booking data
  if (!showId || !selectedSeats || !show) {
    return (
      <div className="booking-confirmation-page">
        <div className="error-container">
          <h2>No booking data found</h2>
          <p>Please start the booking process again.</p>
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      </div>
    );
  }

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle booking confirmation with Razorpay
  const handleConfirmBooking = async () => {
    if (!user || !user.id) {
      alert("Please login to complete booking");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create temporary booking to lock seats
      const bookingResponse = await fetch("http://localhost:5002/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId,
          seats: selectedSeats,
          userId: user.id,
          amount: totalPrice,
        }),
      });

      const bookingData = await bookingResponse.json();

      if (!bookingData.success) {
        setError(bookingData.message || "Failed to create booking.");
        setLoading(false);
        return;
      }

      const bookingId = bookingData.booking._id;

      // Step 2: Create Razorpay order via payment service
      const orderResponse = await fetch("http://localhost:5003/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          bookingId: bookingId,
          userId: user.id,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        setError("Failed to create payment order.");
        setLoading(false);
        return;
      }

      // Step 3: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      // Step 4: Configure Razorpay options
      const options = {
        key: orderData.order.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Mall Booking",
        description: `Booking for ${selectedSeats.length} seat(s)`,
        order_id: orderData.order.orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch("http://localhost:5003/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              alert("Payment successful! Your booking is confirmed.");
              navigate("/home");
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            setError("Failed to verify payment. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#e50914",
        },
        modal: {
          ondismiss: function () {
            setError("Payment cancelled. Please try again.");
            setLoading(false);
          },
        },
      };

      // Step 5: Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to seat selection
    navigate(`/booking/show/${showId}/seats`);
  };

  return (
    <div className="booking-confirmation-page">
      <div className="confirmation-container">
        <h1>Confirm Your Booking</h1>

        <div className="booking-details">
          <div className="detail-section">
            <h3>Show Details</h3>
            <div className="detail-row">
              <span className="label">Date:</span>
              <span className="value">{show.date}</span>
            </div>
            <div className="detail-row">
              <span className="label">Time:</span>
              <span className="value">{show.time}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Seat Details</h3>
            <div className="detail-row">
              <span className="label">Selected Seats:</span>
              <span className="value seats-list">{selectedSeats.join(", ")}</span>
            </div>
            <div className="detail-row">
              <span className="label">Number of Seats:</span>
              <span className="value">{selectedSeats.length}</span>
            </div>
          </div>

          <div className="detail-section payment-section">
            <h3>Payment Summary</h3>
            <div className="detail-row">
              <span className="label">Price per Seat:</span>
              <span className="value">₹200</span>
            </div>
            <div className="detail-row total-row">
              <span className="label">Total Amount:</span>
              <span className="value">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="action-buttons">
          <button
            className="cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Go Back
          </button>
          <button
            className="confirm-btn"
            onClick={handleConfirmBooking}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>

        <div className="info-note">
          <p>Note: Secure payment powered by Razorpay. Your payment information is encrypted and secure.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
