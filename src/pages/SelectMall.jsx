import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./SelectMall.css";

const SelectMall = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;

  useEffect(() => {
    fetch(`${baseURL}/api/malls/by-movie/${movieId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMalls(data.malls);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading malls:", err);
        setLoading(false);
      });
  }, [movieId]);

  if (loading) return <p>Loading malls...</p>;

  if (malls.length === 0)
    return <p>No malls found showing this movie.</p>;

  return (
    <div className="malls-page">
      <h1>Select a Mall</h1>

      <div className="mall-list">
        {malls.map((mall) => (
          <div className="mall-card" key={mall._id}>
            <img src={mall.imageUrl} alt={mall.name} className="mall-img" />

            <h2>{mall.name}</h2>
            <p><strong>Location:</strong> {mall.location}</p>
            <p><strong>City:</strong> {mall.city}</p>
            <p><strong>Rating:</strong> ⭐ {mall.rating}</p>

            <button
              className="continue-btn"
              onClick={() =>
                navigate(`/booking/${movieId}/mall/${mall._id}/shows`)
              }
            >
              Continue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectMall;
