import React, { useEffect, useState } from "react";
import API from "../../api/axiosIntance";
import "./ManageMovies.css";

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    language: "",
    duration: "",
    rating: "",
    releaseDate: "",
    posterUrl: "",
  });

  // Fetch all movies
  const fetchMovies = async () => {
    try {
      const res = await API.get("/api/movies");
      setMovies(res.data.movies || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch movies");
      setMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleAddMovie = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/admin/movies", formData);

      alert("Movie added successfully!");
      setFormData({
        title: "",
        description: "",
        genre: "",
        language: "",
        duration: "",
        rating: "",
        releaseDate: "",
        posterUrl: "",
      });
      setShowModal(false);
      fetchMovies();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete movie
  const deleteMovie = async (id) => {
    if (!window.confirm("Delete this movie?")) return;

    try {
      await API.delete(`/api/admin/movies/${id}`);
      alert("Movie deleted!");
      setMovies(movies.filter((m) => m._id !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete movie");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Manage Movies</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e50914",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          + Add Movie
        </button>
      </div>

      {/* Modal for Adding Movie */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Movie</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMovie} className="movie-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Movie title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Movie description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    placeholder="e.g., Action, Drama"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Language</label>
                  <input
                    type="text"
                    name="language"
                    placeholder="e.g., English, Hindi"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="e.g., 120"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    name="rating"
                    placeholder="e.g., 8.5"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Release Date</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Poster URL</label>
                <input
                  type="url"
                  name="posterUrl"
                  placeholder="https://example.com/poster.jpg"
                  value={formData.posterUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? "Adding..." : "Add Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movies List */}
      <div>
        <h3>Movie List</h3>
        {movies.length === 0 ? (
          <p>No movies available. Click "Add Movie" to get started!</p>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie._id} className="movie-card">
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="movie-poster"
                  />
                )}
                <div className="movie-info">
                  <h4>{movie.title}</h4>
                  <p className="genre">{movie.genre}</p>
                  <p className="language">{movie.language}</p>
                  <p className="rating">⭐ {movie.rating}</p>
                  <p className="duration">{movie.duration} mins</p>
                  <p className="description">{movie.description.substring(0, 80)}...</p>

                  <div className="movie-actions">
                    <button
                      className="delete-btn"
                      onClick={() => deleteMovie(movie._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMovies;
