import React from "react";
import "./MovieCard.css";
import { useNavigate } from "react-router-dom";

const MovieCard = ({movie})=>{

    const navigate = useNavigate();

    return(
        <div className="movie-card">
            <img src={movie.posterUrl} alt={movie.title} className="movie-image"/>

            <div className="movie-details">
                <h3>{movie.title}</h3>
                <p className="movie-genre">{movie.genre?.join(", ")}</p>
                <p className="movie-lang">{movie.language} • {movie.duration} mins</p>
                {/* <p className="movie-status">{movie.status}</p> */}

                {movie.status === "Now Showing" ? (
                    <button className="book-btn" onClick={()=> navigate(`/booking/${movie._id}`)}>🎟️Book show</button>
                ):(
                    <p className="movie-status">{movie.status}</p>
                )
                }

            </div>
        </div>
    );
};
export default MovieCard; 