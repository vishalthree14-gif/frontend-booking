import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SeatCard from "../components/SeatCard";
import "./SeatSelection.css";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [show, setShow] = useState(null);
  const [hallSeats, setHallSeats] = useState([]);
  const [seatsStatus, setSeatsStatus] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lockTimer, setLockTimer] = useState(null);
  const lockTimerRef = useRef(null);

  const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;


  // Fetch show and seat data
  useEffect(() => {
    fetch(`${baseURL}/api/shows/${showId}/seats`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setShow(data.show);
          setHallSeats(data.hallSeats);
          setSeatsStatus(data.seatsStatus);
        } else {
          setError(data.message || "Failed to load seats");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading seats:", err);
        setError("Failed to load seats");
        setLoading(false);
      });
  }, [showId]);

  // Handle seat selection
  const toggleSeat = (seatId, seatNumber) => {
    const seatStatus = seatsStatus.find((s) => s.seatId === seatId);

    // Don't allow selecting booked or locked seats
    if (seatStatus && (seatStatus.isBooked || seatStatus.isLocked)) {
      return;
    }

    setSelectedSeats((prev) => {
      if (prev.some((s) => s.seatId === seatId)) {
        // Deselect
        return prev.filter((s) => s.seatId !== seatId);
      } else {
        // Select
        return [...prev, { seatId, seatNumber }];
      }
    });
  };

  // Get seat status
  const getSeatStatus = (seatId) => {
    const status = seatsStatus.find((s) => s.seatId === seatId);
    if (!status) return "available";
    if (status.isBooked) return "booked";
    if (status.isLocked) return "locked";
    return "available";
  };

  // Check if seat is selected
  const isSeatSelected = (seatId) => {
    return selectedSeats.some((s) => s.seatId === seatId);
  };

  // Organize seats by row
  const organizeSeatsByRow = () => {
    const rows = {};
    hallSeats.forEach((seat) => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }
      rows[seat.row].push(seat);
    });

    // Sort seats within each row by column number
    Object.keys(rows).forEach((row) => {
      rows[row].sort((a, b) => a.column - b.column);
    });

    return rows;
  };

  // Calculate total price (assuming 200 per seat)
  const PRICE_PER_SEAT = 200;
  const totalPrice = selectedSeats.length * PRICE_PER_SEAT;

  // Lock seats on the server
  const lockSeatsOnServer = async (seatNumbers) => {
    if (!user || !user.id) {
      alert("Please login to book seats");
      navigate("/login");
      return false;
    }

    try {
      const response = await fetch(`${baseURL}/api/bookings/lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId,
          seats: seatNumbers,
          userId: user.id,
          lockDurationMs: 120000, // 2 minutes
        }),
      });

      const data = await response.json();
      if (!data.success) {
        alert(data.message || "Failed to lock seats");
        return false;
      }

      // Start countdown timer
      const lockedUntil = new Date(data.lockedUntil);
      const countdown = setInterval(() => {
        const remaining = Math.floor((lockedUntil - new Date()) / 1000);
        if (remaining <= 0) {
          clearInterval(countdown);
          setLockTimer(null);
          alert("Seat lock expired. Please select seats again.");
          setSelectedSeats([]);
        } else {
          setLockTimer(remaining);
        }
      }, 1000);

      lockTimerRef.current = countdown;
      return true;
    } catch (err) {
      console.error("Error locking seats:", err);
      alert("Failed to lock seats");
      return false;
    }
  };

  // Unlock seats on the server
  const unlockSeatsOnServer = async (seatNumbers) => {
    if (!user || !user.id || seatNumbers.length === 0) return;

    try {
      await fetch(`${baseURL}/api/bookings/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId,
          seats: seatNumbers,
          userId: user.id,
        }),
      });
    } catch (err) {
      console.error("Error unlocking seats:", err);
    }
  };

  // Clean up locks when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current);
      }
      if (selectedSeats.length > 0) {
        unlockSeatsOnServer(selectedSeats.map((s) => s.seatNumber));
      }
    };
  }, [selectedSeats]);

  // Proceed to booking
  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    // Lock seats before proceeding
    const locked = await lockSeatsOnServer(selectedSeats.map((s) => s.seatNumber));
    if (!locked) {
      setSelectedSeats([]);
      return;
    }

    // Navigate to booking confirmation with seat data
    navigate("/booking/confirm", {
      state: {
        showId,
        selectedSeats: selectedSeats.map((s) => s.seatNumber),
        totalPrice,
        show,
      },
    });
  };

  if (loading) {
    return (
      <div className="seat-selection-page">
        <p>Loading seats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seat-selection-page">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  const seatRows = organizeSeatsByRow();

  return (
    <div className="seat-selection-page">
      <div className="seat-selection-header">
        <h1>Select Your Seats</h1>
        {show && (
          <div className="show-info">
            <p>Date: {show.date}</p>
            <p>Time: {show.time}</p>
          </div>
        )}
      </div>

      <div className="screen-indicator">
        <div className="screen">SCREEN</div>
      </div>

      <div className="seat-grid">
        {Object.keys(seatRows)
          .sort()
          .map((rowKey) => (
            <div key={rowKey} className="seat-row">
              <div className="row-label">{rowKey}</div>
              <div className="seats-container">
                {seatRows[rowKey].map((seat) => (
                  <SeatCard
                    key={seat.seatId}
                    seatId={seat.seatId}
                    seatNumber={seat.seatNumber}
                    status={getSeatStatus(seat.seatId)}
                    isSelected={isSeatSelected(seat.seatId)}
                    onClick={() => toggleSeat(seat.seatId, seat.seatNumber)}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-box available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-box booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-box locked"></div>
          <span>Locked</span>
        </div>
      </div>

      <div className="booking-summary">
        <div className="summary-info">
          <p>
            Selected Seats: <strong>{selectedSeats.map((s) => s.seatNumber).join(", ") || "None"}</strong>
          </p>
          <p>
            Total: <strong>₹{totalPrice}</strong>
          </p>
          {lockTimer !== null && (
            <p className="lock-timer">
              Time remaining: <strong>{Math.floor(lockTimer / 60)}:{String(lockTimer % 60).padStart(2, '0')}</strong>
            </p>
          )}
        </div>
        <button
          className="proceed-btn"
          onClick={handleProceed}
          disabled={selectedSeats.length === 0}
        >
          Proceed to Book
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
