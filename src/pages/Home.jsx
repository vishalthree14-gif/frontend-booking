import "./Home.css";
import SliderSection from "../components/SliderSection.jsx";
import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard.jsx";
import MallCard from "../components/MallCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import SearchBar from "../components/SearchBar.jsx";

const Home = () => {
  // 🎬 States
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [malls, setMalls] = useState([]);

  // Pagination for both sections
  const [featuredPage, setFeaturedPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);

  const [totalFeatured, setTotalFeatured] = useState(0);
  const [totalUpcoming, setTotalUpcoming] = useState(0);

  const limit = 10;

  const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;

  // 🎥 Fetch Featured Movies
  const fetchFeaturedMovies = (page) => {
    fetch(`${baseURL}/api/movies/featured?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedMovies(data.movies || []);
        setTotalFeatured(data.total || 0);
      })
      .catch((err) => console.error("Featured movie fetch error:", err));
  };

  // 🎞️ Fetch Upcoming Movies
  const fetchUpcomingMovies = (page) => {
    fetch(`${baseURL}/api/movies/upcoming?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setUpcomingMovies(data.movies || []);
        setTotalUpcoming(data.total || 0);
      })
      .catch((err) => console.error("Upcoming movie fetch error:", err));
  };

  // 🏬 Fetch Malls (no pagination)
  const fetchMalls = () => {
    fetch(`${baseURL}/api/malls?page=1&limit=5`)
      .then((res) => res.json())
      .then((data) => setMalls(data.malls || []))
      .catch((err) => console.error("Mall fetch error:", err));
  };

  // Fetch all data on mount
  useEffect(() => {
    fetchMalls();
  }, []);

  useEffect(() => {
    fetchFeaturedMovies(featuredPage);
  }, [featuredPage]);

  useEffect(() => {
    fetchUpcomingMovies(upcomingPage);
  }, [upcomingPage]);

  // Pagination handlers
  const handleFeaturedNext = () => {
    const totalPages = Math.ceil(totalFeatured / limit);
    if (featuredPage < totalPages) setFeaturedPage((prev) => prev + 1);
  };

  const handleFeaturedPrev = () => {
    if (featuredPage > 1) setFeaturedPage((prev) => prev - 1);
  };

  const handleUpcomingNext = () => {
    const totalPages = Math.ceil(totalUpcoming / limit);
    if (upcomingPage < totalPages) setUpcomingPage((prev) => prev + 1);
  };

  const handleUpcomingPrev = () => {
    if (upcomingPage > 1) setUpcomingPage((prev) => prev - 1);
  };

  return (
    <div className="home-page">
      <SearchBar />
      <SliderSection />

      <div className="content-wrapper">

        {/* 🎥 Featured Movies Section */}
        <SectionHeading title="🎥 Featured Movies" />
        <div className="grid-container">
          {featuredMovies.length > 0 ? (
            featuredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          ) : (
            <p>No featured movies found.</p>
          )}
        </div>

        <div className="pagination">
          <button
            onClick={handleFeaturedPrev}
            disabled={featuredPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          <span className="page-info">
            Page {featuredPage} of {Math.ceil(totalFeatured / limit) || 1}
          </span>

          <button
            onClick={handleFeaturedNext}
            disabled={featuredPage >= Math.ceil(totalFeatured / limit)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>

        {/* 🎞️ Upcoming Movies Section */}
        <SectionHeading title="🎞️ Upcoming Movies" />
        <div className="grid-container">
          {upcomingMovies.length > 0 ? (
            upcomingMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          ) : (
            <p>No upcoming movies found.</p>
          )}
        </div>

        <div className="pagination">
          <button
            onClick={handleUpcomingPrev}
            disabled={upcomingPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          <span className="page-info">
            Page {upcomingPage} of {Math.ceil(totalUpcoming / limit) || 1}
          </span>

          <button
            onClick={handleUpcomingNext}
            disabled={upcomingPage >= Math.ceil(totalUpcoming / limit)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>

        {/* 🏬 Popular Malls Section */}
        <SectionHeading title="🏬 Popular Malls" />
        <div className="grid-container">
          {malls.map((mall) => (
            <MallCard key={mall._id} mall={mall} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
