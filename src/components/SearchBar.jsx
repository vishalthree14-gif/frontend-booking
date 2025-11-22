import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import algoliasearch from "algoliasearch/lite";

import {
  InstantSearch,
  SearchBox,
  Hits
} from "react-instantsearch-hooks-web";

import "./SearchBar.css";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);


function MovieHit({ hit }) {
  const navigate = useNavigate();

  return (
    <div
      className="yt-hit"
      onClick={() => navigate(`/movie/${hit.objectID}`)}
    >
      
      <img
        src={hit.posterUrl}
        alt={hit.title}
        className="movie-poster"
      />

      <div className="yt-info">
        <p className="yt-title">{hit.title}</p>
        {hit.genre && (
          <p className="yt-genre">{hit.genre.join(", ")}</p>
        )}
      </div>
    </div>
  );
}




export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="yt-search-container" ref={containerRef}>
      <InstantSearch
        searchClient={searchClient}
        indexName={import.meta.env.VITE_ALGOLIA_INDEX_NAME}
      >
        {/* OPEN DROPDOWN ON SEARCH CLICK */}
        <div className="yt-search-row" onClick={() => setOpen(true)}>
          <SearchBox
            placeholder="Search movies..."
            classNames={{
              root: "yt-searchbox",
              input: "yt-input",
            }}
          />

        <button className="yt-search-btn">
            🔍
        </button>

        </div>

        {/* SHOW DROPDOWN ONLY WHEN OPEN */}
        {open && (
          <div className="yt-dropdown">
            <Hits hitComponent={MovieHit} />
          </div>
        )}
      </InstantSearch>
    </div>
  );
}
