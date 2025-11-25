import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ShowTimes.css";

const ShowTimes = () => {
  const { movieId, mallId } = useParams();
  const navigate = useNavigate();

    const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;


  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetch(`${baseURL}/api/shows/by-mall-movie/${mallId}/${movieId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setHalls(data.halls);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading showtimes:", err);
        setLoading(false);
      });
  }, [mallId, movieId]);

  if (loading) return <p>Loading show times...</p>;

  if (halls.length === 0)
    return <p>No showtimes available for this movie in this mall.</p>;

  return (
    <div className="showtimes-page">
      <h1>Select a Show Time</h1>

      {halls.map((hall) => (
        <div className="hall-block" key={hall.hallId}>
          <h2>{hall.hallName}</h2>

          <div className="showtime-buttons">
            {hall.shows.map((show) => (
              <button
                key={show._id}
                className="show-btn"
                onClick={() => navigate(`/booking/show/${show._id}/seats`)}
              >
                {show.time}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowTimes;
