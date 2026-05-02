
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getMovieById } from "../services/api.jsx";
import {useFavorites}  from "../context/FavoritesContext.jsx";
import Loader   from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import "./MovieDetailPage.css";

const FALLBACK_POSTER = "https://via.placeholder.com/400x600?text=No+Poster";

/** Maps rating source names to badge icons */
const RATING_ICONS = {
  "Internet Movie Database": "⭐",
  "Rotten Tomatoes": "🍅",
  Metacritic: "🎯",
};

export default function MovieDetailPage() {
  const { imdbID }   = useParams();
  const navigate     = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [movie,   setMovie]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Fetch movie details on mount / when imdbID changes
  useEffect(() => {
    let cancelled = false; // prevent state updates after unmount

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      setMovie(null);

      try {
        const data = await getMovieById(imdbID);
        if (!cancelled) setMovie(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetail();
    return () => { cancelled = true; };
  }, [imdbID]);

  // Derived values
  const favorite    = movie ? isFavorite(movie.imdbID) : false;
  const posterSrc   = movie?.Poster && movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;

  function handleFavoriteToggle() {
    if (!movie) return;
    if (favorite) {
      removeFavorite(movie.imdbID);
    } else {
      // Store a minimal object consistent with search results
      addFavorite({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Poster: movie.Poster,
      });
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return <Loader message="Loading movie details…" />;
  if (error)   return (
    <div className="detail-page detail-page--error">
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      <button className="detail-page__back" onClick={() => navigate(-1)}>
        ← Back to results
      </button>
    </div>
  );
  if (!movie)  return null;

  return (
    <main className="detail-page">
      {/* Back button */}
      <button
        className="detail-page__back"
        onClick={() => navigate(-1)}
        aria-label="Go back to search results"
      >
        ← Back
      </button>

      <article className="detail-card">
        {/* ── Left column: poster ── */}
        <div className="detail-card__poster-col">
          <img
            src={posterSrc}
            alt={`${movie.Title} poster`}
            className="detail-card__poster"
            onError={(e) => { e.target.src = FALLBACK_POSTER; }}
          />

          {/* Favourite button */}
          <button
            className={`detail-card__fav-btn ${favorite ? "detail-card__fav-btn--active" : ""}`}
            onClick={handleFavoriteToggle}
            aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
          >
            {favorite ? "❤️ Remove from Favourites" : "🤍 Add to Favourites"}
          </button>
        </div>

        {/* ── Right column: info ── */}
        <div className="detail-card__info-col">
          {/* Title & meta badges */}
          <h1 className="detail-card__title">{movie.Title}</h1>

          <div className="detail-card__meta">
            {movie.Year      && <span className="detail-card__tag">{movie.Year}</span>}
            {movie.Rated     && <span className="detail-card__tag">{movie.Rated}</span>}
            {movie.Runtime   && <span className="detail-card__tag">{movie.Runtime}</span>}
            {movie.Type      && (
              <span className={`detail-card__tag detail-card__tag--type detail-card__tag--${movie.Type}`}>
                {movie.Type}
              </span>
            )}
          </div>

          {/* Genre */}
          {movie.Genre && movie.Genre !== "N/A" && (
            <p className="detail-card__genre">
              <strong>Genre:</strong> {movie.Genre}
            </p>
          )}

          {/* Plot */}
          {movie.Plot && movie.Plot !== "N/A" && (
            <div className="detail-card__section">
              <h2 className="detail-card__section-title">Plot</h2>
              <p className="detail-card__plot">{movie.Plot}</p>
            </div>
          )}

          {/* Cast & Crew */}
          <div className="detail-card__section">
            <h2 className="detail-card__section-title">Cast & Crew</h2>
            <dl className="detail-card__dl">
              {movie.Director && movie.Director !== "N/A" && (
                <>
                  <dt>Director</dt>
                  <dd>{movie.Director}</dd>
                </>
              )}
              {movie.Writer && movie.Writer !== "N/A" && (
                <>
                  <dt>Writer</dt>
                  <dd>{movie.Writer}</dd>
                </>
              )}
              {movie.Actors && movie.Actors !== "N/A" && (
                <>
                  <dt>Stars</dt>
                  <dd>{movie.Actors}</dd>
                </>
              )}
              {movie.Language && movie.Language !== "N/A" && (
                <>
                  <dt>Language</dt>
                  <dd>{movie.Language}</dd>
                </>
              )}
              {movie.Country && movie.Country !== "N/A" && (
                <>
                  <dt>Country</dt>
                  <dd>{movie.Country}</dd>
                </>
              )}
            </dl>
          </div>

          {/* Ratings */}
          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className="detail-card__section">
              <h2 className="detail-card__section-title">Ratings</h2>
              <div className="detail-card__ratings">
                {movie.Ratings.map((r) => (
                  <div key={r.Source} className="detail-card__rating-badge">
                    <span className="detail-card__rating-icon" aria-hidden="true">
                      {RATING_ICONS[r.Source] || "🏆"}
                    </span>
                    <div>
                      <p className="detail-card__rating-source">
                        {r.Source.replace("Internet Movie Database", "IMDb")}
                      </p>
                      <p className="detail-card__rating-value">{r.Value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Box Office / Awards */}
          {(movie.Awards && movie.Awards !== "N/A") ||
            (movie.BoxOffice && movie.BoxOffice !== "N/A") ? (
            <div className="detail-card__section">
              <h2 className="detail-card__section-title">Awards & Box Office</h2>
              <dl className="detail-card__dl">
                {movie.Awards && movie.Awards !== "N/A" && (
                  <>
                    <dt>Awards</dt>
                    <dd>{movie.Awards}</dd>
                  </>
                )}
                {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                  <>
                    <dt>Box Office</dt>
                    <dd>{movie.BoxOffice}</dd>
                  </>
                )}
              </dl>
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}