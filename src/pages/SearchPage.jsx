import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMovies } from "../services/api";

// ─── Inline style tokens ───────────────────────────────────────────────────
const colors = {
  bg: "#080c14",
  surface: "#111827",
  surfaceAlt: "#1a2035",
  border: "rgba(255,255,255,0.08)",
  borderFocus: "#6c63ff",
  accent: "#6c63ff",
  accentHover: "#7b74ff",
  textPrimary: "#e8eaf0",
  textMuted: "#8891a4",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    color: colors.textPrimary,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: "0 1.5rem 4rem",
  },

  hero: {
    textAlign: "center",
    maxWidth: 600,
    margin: "0 auto 2.5rem",
    paddingTop: "2rem",
  },
  h1: {
    fontFamily: "'Syne', system-ui, sans-serif",
    fontSize: "clamp(2rem, 5vw, 2.8rem)",
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: "0.75rem",
  },
  accent: { color: colors.accent },
  subtitle: { color: colors.textMuted, fontSize: "1rem" },
  searchRow: {
    display: "flex",
    gap: "0.75rem",
    maxWidth: 680,
    margin: "0 auto 2rem",
    flexWrap: "wrap",
  },
  searchWrap: { flex: 1, minWidth: 240, position: "relative" },
  searchIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.4,
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    padding: "0.75rem 1rem 0.75rem 2.75rem",
    color: colors.textPrimary,
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
  },
  select: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    padding: "0.75rem 1.25rem",
    color: colors.textPrimary,
    fontSize: "0.95rem",
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
  },
  btn: {
    background: colors.accent,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "0.75rem 1.5rem",
    fontFamily: "'Syne', system-ui, sans-serif",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  resultCount: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
    gap: "1rem",
    maxWidth: 900,
    margin: "0 auto",
  },
  card: {
    background: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  cardImgPlaceholder: {
    width: "100%",
    aspectRatio: "2/3",
    background: colors.surfaceAlt,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
  },
  cardImg: {
    width: "100%",
    aspectRatio: "2/3",
    objectFit: "cover",
    display: "block",
  },
  cardBody: { padding: "0.7rem" },
  cardTitle: {
    fontFamily: "'Syne', system-ui, sans-serif",
    fontSize: "0.82rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: 4,
  },
  cardYear: { fontSize: "0.75rem", color: colors.textMuted },
  badge: {
    display: "inline-block",
    background: "#1e2a40",
    color: colors.accent,
    fontSize: "0.65rem",
    borderRadius: 4,
    padding: "2px 6px",
    marginTop: 4,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  center: { textAlign: "center", padding: "5rem 0", color: colors.textMuted },
  icon: { fontSize: "3rem", marginBottom: "1rem" },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "2.5rem",
  },
  pageBtn: (active) => ({
    background: active ? colors.accent : colors.surface,
    border: `1px solid ${active ? colors.accent : colors.border}`,
    color: active ? "#fff" : colors.textMuted,
    borderRadius: 8,
    padding: "0.5rem 0.9rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontFamily: "inherit",
  }),
};

// ─── Sub-components ────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg style={styles.searchIcon} width="16" height="16" fill="none"
      stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = movie.Poster && movie.Poster !== "N/A" && !imgError;
  const navigate = useNavigate();

  return (
    <div style={styles.card}
      onClick={() => navigate(`/movie/${movie.imdbID}`)}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      {hasImage
        ? <img
            src={movie.Poster}
            alt={movie.Title}
            style={styles.cardImg}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        : <div style={styles.cardImgPlaceholder}>🎬</div>}
      <div style={styles.cardBody}>
        <div style={styles.cardTitle} title={movie.Title}>{movie.Title}</div>
        <div style={styles.cardYear}>{movie.Year}</div>
        {movie.Type && <span style={styles.badge}>{movie.Type}</span>}
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalResults, onPageChange }) {
  const totalPages = Math.ceil(totalResults / 10);
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div style={styles.pagination}>
      {currentPage > 1 && (
        <button style={styles.pageBtn(false)} onClick={() => onPageChange(currentPage - 1)}>←</button>
      )}
      {pages.map(p => (
        <button key={p} style={styles.pageBtn(p === currentPage)} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      {currentPage < totalPages && (
        <button style={styles.pageBtn(false)} onClick={() => onPageChange(currentPage + 1)}>→</button>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(!!searchParams.get("q"));

  const fetchMovies = useCallback(async (q, pg, tp) => {
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(q, pg, tp);
      if (data.Response === "True") {
        setMovies(data.Search || []);
        setTotalResults(parseInt(data.totalResults) || 0);
      } else {
        setMovies([]);
        setTotalResults(0);
        setError(data.Error || "No results found.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) fetchMovies(query, page, type);
  }, [query, page, type, fetchMovies]);

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setPage(1);
    setSearched(true);
    setSearchParams({ q: trimmed, type, page: 1 });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    setPage(1);
    if (query) setSearchParams({ q: query, type: newType, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams({ q: query, type, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showResults = !loading && !error && movies.length > 0;

  return (
    <main style={styles.page}>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.h1}>
          Find Your Next{" "}
          <span style={styles.accent}>Favourite Film</span>
        </h1>
        <p style={styles.subtitle}>
          Search movies, series and episodes from the OMDB database.
        </p>
      </section>

      {/* SEARCH CONTROLS */}
      <div style={styles.searchRow}>
        <div style={styles.searchWrap}>
          <SearchIcon />
          <input
            style={styles.input}
            placeholder="Search movies, series, episodes..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={e => e.target.style.borderColor = colors.borderFocus}
            onBlur={e => e.target.style.borderColor = colors.border}
          />
        </div>
        <select style={styles.select} value={type} onChange={handleTypeChange}>
          <option value="">All Types</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
        </select>
        <button
          style={styles.btn}
          onClick={handleSearch}
          onMouseEnter={e => e.target.style.background = colors.accentHover}
          onMouseLeave={e => e.target.style.background = colors.accent}
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
      <section style={{ maxWidth: 900, margin: "0 auto" }}>

        {showResults && (
          <p style={styles.resultCount}>
            Showing{" "}
            <strong style={{ color: colors.textPrimary }}>
              {(page - 1) * 10 + 1}–{Math.min(page * 10, totalResults)}
            </strong>{" "}
            of <strong style={{ color: colors.textPrimary }}>{totalResults}</strong> results for{" "}
            <span style={{ color: colors.accent }}>"{query}"</span>
          </p>
        )}

        {loading && (
          <div style={styles.center}>
            <div style={styles.icon}>⏳</div>
            <p>Searching movies...</p>
          </div>
        )}

        {error && (
          <div style={styles.center}>
            <div style={styles.icon}>😕</div>
            <p style={{ marginBottom: "1rem" }}>{error}</p>
            <button style={styles.btn} onClick={() => fetchMovies(query, page, type)}>
              Retry
            </button>
          </div>
        )}

        {searched && !loading && !error && movies.length === 0 && (
          <div style={styles.center}>
            <div style={styles.icon}>🔍</div>
            <p>No results found for "{query}"</p>
          </div>
        )}

        {showResults && (
          <div style={styles.grid}>
            {movies.map(m => <MovieCard key={m.imdbID} movie={m} />)}
          </div>
        )}

        {showResults && (
          <Pagination
            currentPage={page}
            totalResults={totalResults}
            onPageChange={handlePageChange}
          />
        )}

        {!searched && !loading && (
          <div style={styles.center}>
            <div style={styles.icon}>🍿</div>
            <p>Start by searching for a movie above.</p>
          </div>
        )}

      </section>
    </main>
  );
}