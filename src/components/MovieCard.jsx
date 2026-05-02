import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import "./MovieCard.css";

/** Fallback poster when the API returns "N/A" */
const FALLBACK_POSTER = "https://via.placeholder.com/300x445?text=No+Poster";

/** Human-readable type badge labels */
const TYPE_LABELS = {
  movie: "Movie",
  series: "Series",
  episode: "Episode",
};

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const favorite = isFavorite(movie.imdbID);
  const posterSrc = movie.Poster && movie.Poster !== "N/A"
    ? movie.Poster
    : FALLBACK_POSTER;

  /** Navigate to the detail page */
  function handleCardClick() {
    navigate(`/movie/${movie.imdbID}`);
  }

  /** Toggle favourite without propagating the click to the card */
  function handleFavoriteClick(e) {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  }

  return (
    <article
      className="movie-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={`View details for ${movie.Title}`}
    >
      {/* Poster Image */}
      <div className="movie-card__poster-wrap">
        <img
          src={posterSrc}
          alt={`${movie.Title} poster`}
          className="movie-card__poster"
          loading="lazy"
          onError={(e) => {
            e.target.src = FALLBACK_POSTER;
          }}
        />

        {/* Favourite Button */}
        <button
          className={`movie-card__fav-btn ${favorite ? "movie-card__fav-btn--active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
          title={favorite ? "Remove from favourites" : "Add to favourites"}
        >
          {favorite ? "❤️" : "🤍"}
        </button>

        {/* Type Badge */}
        <span className={`movie-card__badge movie-card__badge--${movie.Type}`}>
          {TYPE_LABELS[movie.Type] || movie.Type}
        </span>
      </div>

      {/* Card Info */}
      <div className="movie-card__info">
        <h3 className="movie-card__title" title={movie.Title}>
          {movie.Title}
        </h3>
        <p className="movie-card__year">{movie.Year}</p>
      </div>
    </article>
  );
}