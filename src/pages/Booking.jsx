import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Booking.css";
import { useNavigate } from "react-router-dom";

const Booking = () => {

  const navigate = useNavigate();
  
  const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;

  const { id } = useParams();
  const [movie, setMovie] = useState(null);


  useEffect(() => {
    fetch(`${baseURL}/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMovie(data.movie);
      })
      .catch((err) => console.error("Error loading movie:", err));
  }, [id]);

  if (!movie) return <p>Loading booking details...</p>;

  return (
    <div className="booking-page">
      <div className="booking-card">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="booking-poster"
        />

        <div className="booking-info">
          <h1>{movie.title}</h1>
          <p className="movie-desc">{movie.description}</p>

          <p>
            <strong>Genre:</strong> {movie.genre?.join(", ")}
          </p>
          <p>
            <strong>Language:</strong> {movie.language}
          </p>
          <p>
            <strong>Duration:</strong> {movie.duration} mins
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {movie.rating || "N/A"}
          </p>
          <p>
            <strong>Release Date:</strong>{" "}
            {new Date(movie.releaseDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  movie.status === "Now Showing" ? "green" : "orange",
                fontWeight: "bold",
              }}
            >
              {movie.status}
            </span>
          </p>

            {/* <button onClick={() => navigate(`/booking/${movie._id}/select`)}> */}

            <button onClick={() => navigate(`/booking/${movie._id}/select`)}>


            Continue Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
