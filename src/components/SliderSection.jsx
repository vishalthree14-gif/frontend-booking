import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderSection.css";

const SliderSection = () => {
  const [movies, setMovies] = useState([]);

  const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;


  useEffect(() => {
    fetch(`${baseURL}/api/ratings/top-rated`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched slider data:", data);
        if (data.success && Array.isArray(data.movies)) {
          setMovies(data.movies);
        }
      })
      .catch((err) => console.error("Error fetching slider data:", err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    cssEase: "ease-in-out",
  };

  return (
    <div className="slider-wrapper">
      <Slider key={movies.length} {...settings}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.movieId} className="slide">
              <div className="overlay"></div>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="slide-image"
              />
              <div className="slide-info">
                <h2>{movie.title}</h2>
                <p className="rating">
                  ⭐ {movie.averageRating.toFixed(1)} ({movie.totalRatings} ratings)
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="slide">
            <div className="overlay"></div>
            <img
              src="https://picsum.photos/1200/500?blur=4"
              alt="Loading..."
              className="slide-image"
            />
            <div className="slide-info">
              <h2>Loading Featured Movies...</h2>
            </div>
          </div>
        )}
      </Slider>
    </div>
  );
};

export default SliderSection;
