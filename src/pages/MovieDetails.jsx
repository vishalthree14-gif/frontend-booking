import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;


  useEffect(() => {
    fetch(`${baseURL}/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMovie(data.movie);
      })
      .catch((err) => console.error("Error fetching movie:", err));
  }, [id]);

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="movie-details-page">
      <div className="movie-detail-container">
        <img src={movie.posterUrl} alt={movie.title} className="movie-detail-img" />

        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="movie-genre">{movie.genre?.join(", ")}</p>
          <p className="movie-lang">
            {movie.language} • {movie.duration} mins
          </p>
          <p className="movie-desc">{movie.description}</p>
          <p className="movie-status">
            <strong>Status:</strong> {movie.status}
          </p>

          {movie.status === "Now Showing" && (
            <button
              className="book-btn"
              onClick={() => navigate(`/booking/${movie._id}`)} // ✅ navigate to booking page
            >
              🎟️ Book Show
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

