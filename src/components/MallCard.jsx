import React from "react";
import "./MallCard.css";
import { useNavigate } from "react-router-dom";


const MallCard = ({ mall }) => {

  const navigate = useNavigate();

  const getRatings = () => {

    navigate(`/mall/${mall._id}`);
  }



  return (
    <div className="mall-card">
      <img
        src={mall.imageUrl || "https://via.placeholder.com/600x400?text=No+Image"}
        alt={mall.name}
        className="mall-image"
      />
      <div className="mall-details">
        <h3>{mall.name}</h3>
        <p>{mall.city}</p>
        <p className="mall-rating">⭐ {mall.rating?.toFixed(1)}</p>
        <button onClick={getRatings}>View Ratings</button>
      </div>
    </div>
  );
};

export default MallCard;

