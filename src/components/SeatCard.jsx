import React from "react";
import "./SeatCard.css";

const SeatCard = ({ seatId, seatNumber, status, isSelected, onClick }) => {
  // Determine the CSS class based on status and selection
  const getSeatClass = () => {
    if (isSelected) return "seat selected";
    if (status === "booked") return "seat booked";
    if (status === "locked") return "seat locked";
    return "seat available";
  };

  // Disable click for booked and locked seats
  const isClickable = status === "available" || isSelected;

  return (
    <div
      className={getSeatClass()}
      onClick={isClickable ? onClick : undefined}
      title={`${seatNumber} - ${status}`}
    >
      <span className="seat-number">{seatNumber}</span>
    </div>
  );
};

export default SeatCard;
