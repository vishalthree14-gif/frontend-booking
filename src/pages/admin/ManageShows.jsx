import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axiosIntance";

const ManageShows = () => {
  const { hallId } = useParams();

  const [movieMap, setMovieMap] = useState({});
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);

  const [formData, setFormData] = useState({
    movieId: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch shows
  const fetchShows = async () => {
    try {
      const res = await API.get(`/api/admin/shows/hall/${hallId}`);
      setShows(res.data.shows || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load shows");
    }
  };

  // Fetch movies
  const fetchMovies = async () => {
    try {
      const res = await API.get(`/api/movies?page=1&limit=200`);
      const moviesList = res.data.movies || [];

      setMovies(moviesList);

      // Build movieId → title map
      const map = {};
      moviesList.forEach((m) => {
        map[m._id] = m.title;
      });

      setMovieMap(map);

    } catch (error) {
      console.log("Movie fetch failed", error);
    }
  };

  useEffect(() => {
    fetchShows();
    fetchMovies();
  }, []);

  // Create show
  const createShow = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post(`/api/admin/shows/add`, {
        movieId: formData.movieId,
        hallId,
        date: formData.date,
        time: formData.time,
      });

      alert("Show added!");
      setFormData({ movieId: "", date: "", time: "" });
      fetchShows();

    } catch (error) {
      console.log(error);
      alert("Failed to add show");
    }

    setLoading(false);
  };

  // Delete show
  const deleteShow = async (showId) => {
    if (!window.confirm("Delete this show?")) return;

    try {
      await API.delete(`/api/admin/shows/${showId}`);
      alert("Show deleted!");
      setShows(shows.filter((s) => s._id !== showId));

    } catch (error) {
      console.log(error);
      alert("Failed to delete show");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Shows</h2>

      <h3>Add New Show</h3>
      <form onSubmit={createShow} style={{ marginBottom: "20px" }}>
        
        {/* Movie dropdown */}
        <select
          value={formData.movieId}
          onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
          required
          style={{ padding: "10px" }}
        >
          <option value="" >Select Movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Show"}
        </button>
      </form>

      {/* Show List */}
      <h3>Show List</h3>

      {shows.length === 0 ? (
        <p>No shows for this hall yet.</p>
      ) : (
        shows.map((show) => {
          
          // Fix movieId type issue
          // const movieId =
          //   typeof show.movieId === "object"
          //     ? show.movieId._id || show.movieId.$oid || show.movieId.toString()
          //     : show.movieId;

                    
          const movieId =
            show?.movieId?._id ||
            show?.movieId?.$oid ||
            (typeof show.movieId === "string" ? show.movieId : null);



          return (
            <div
              key={show._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h4>Movie: {movieMap[movieId] || "Unknown Movie"}</h4>
              <p><strong>Date:</strong> {show.date}</p>
              <p><strong>Time:</strong> {show.time}</p>

              <button
                style={{ background: "red", color: "white" }}
                onClick={() => deleteShow(show._id)}
              >
                Delete
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ManageShows;
