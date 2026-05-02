import { useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

// ─── Same design tokens as SearchPage ─────────────────────────────────────
const colors = {
  bg: "#080c14",
  surface: "#111827",
  surfaceAlt: "#1a2035",
  border: "rgba(255,255,255,0.08)",
  accent: "#6c63ff",
  accentHover: "#7b74ff",
  textPrimary: "#e8eaf0",
  textMuted: "#8891a4",
  danger: "#ef4444",
  dangerHover: "#dc2626",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    color: colors.textPrimary,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: "2.5rem 1.5rem 5rem",
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    maxWidth: 900,
    margin: "0 auto 2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  title: {
    fontFamily: "'Syne', system-ui, sans-serif",
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: 800,
    color: colors.textPrimary,
    margin: 0,
  },
  countBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 28,
    height: 28,
    padding: "0 8px",
    background: colors.accent,
    color: "#fff",
    fontSize: "0.78rem",
    fontWeight: 700,
    borderRadius: 999,
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  clearBtn: {
    background: "transparent",
    border: `1px solid ${colors.danger}`,
    color: colors.danger,
    borderRadius: 8,
    padding: "0.45rem 1rem",
    fontSize: "0.82rem",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // ── Grid ────────────────────────────────────────────────────────────────
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
    gap: "1rem",
    maxWidth: 900,
    margin: "0 auto",
  },

  // ── Card ────────────────────────────────────────────────────────────────
  card: {
    background: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardImg: {
    width: "100%",
    aspectRatio: "2/3",
    objectFit: "cover",
    display: "block",
  },
  cardImgPlaceholder: {
    width: "100%",
    aspectRatio: "2/3",
    background: "linear-gradient(145deg, #1a2035, #0f1623)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: "2.5rem",
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
    color: colors.textPrimary,
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

  // Remove button (top-right of card)
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "rgba(8,12,20,0.8)",
    border: `1px solid rgba(255,255,255,0.12)`,
    color: "#fff",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    opacity: 0,
    transition: "opacity 0.2s, background 0.2s",
    backdropFilter: "blur(4px)",
    lineHeight: 1,
  },

  // ── Empty state ──────────────────────────────────────────────────────────
  empty: {
    textAlign: "center",
    padding: "6rem 0",
    color: colors.textMuted,
    maxWidth: 400,
    margin: "0 auto",
  },
  emptyIcon: { fontSize: "3.5rem", display: "block", marginBottom: "1rem" },
  emptyTitle: {
    fontFamily: "'Syne', system-ui, sans-serif",
    fontSize: "1.2rem",
    fontWeight: 800,
    color: colors.textPrimary,
    marginBottom: "0.5rem",
  },
  emptyText: {
    fontSize: "0.9rem",
    color: colors.textMuted,
    lineHeight: 1.6,
    marginBottom: "1.5rem",
  },
  emptyLink: {
    display: "inline-block",
    background: colors.accent,
    color: "#fff",
    textDecoration: "none",
    padding: "0.65rem 1.5rem",
    borderRadius: 10,
    fontFamily: "'Syne', system-ui, sans-serif",
    fontWeight: 700,
    fontSize: "0.9rem",
    transition: "background 0.2s",
  },
};

// ─── FavCard ───────────────────────────────────────────────────────────────
function FavCard({ movie, onRemove }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hasImage = movie.Poster && movie.Poster !== "N/A" && !imgError;

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(108,99,255,0.2)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasImage
        ? <img
            src={movie.Poster}
            alt={movie.Title}
            style={styles.cardImg}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        : (
          <div style={styles.cardImgPlaceholder}>
            <span>🎬</span>
            <span style={{ fontSize: "0.65rem", color: colors.textMuted }}>No Poster</span>
          </div>
        )}

      <div style={styles.cardBody}>
        <div style={styles.cardTitle} title={movie.Title}>{movie.Title}</div>
        <div style={styles.cardYear}>{movie.Year}</div>
        {movie.Type && <span style={styles.badge}>{movie.Type}</span>}
      </div>

      {/* Remove button — visible on hover */}
      <button
        style={{ ...styles.removeBtn, opacity: hovered ? 1 : 0 }}
        onClick={(e) => { e.stopPropagation(); onRemove(movie.imdbID); }}
        title="Remove from favourites"
        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.85)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(8,12,20,0.8)"}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [clearHovered, setClearHovered] = useState(false);

  return (
    <main style={styles.page}>
      {/* Google Fonts — same as SearchPage */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <h1 style={styles.title}>My Favourites</h1>
          {favorites.length > 0 && (
            <span style={styles.countBadge}>{favorites.length}</span>
          )}
        </div>

        {favorites.length > 0 && (
          <button
            style={{
              ...styles.clearBtn,
              background: clearHovered ? colors.danger : "transparent",
              color: clearHovered ? "#fff" : colors.danger,
            }}
            onClick={() => { if (window.confirm("Clear all favourites?")) clearFavorites?.(); }}
            onMouseEnter={() => setClearHovered(true)}
            onMouseLeave={() => setClearHovered(false)}
          >
            Clear all
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {favorites.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>🎬</span>
          <h2 style={styles.emptyTitle}>No favourites yet</h2>
          <p style={styles.emptyText}>
            Find movies you love on the search page and tap the ❤️ icon to save them here.
          </p>
          <Link
            to="/"
            style={styles.emptyLink}
            onMouseEnter={e => e.currentTarget.style.background = colors.accentHover}
            onMouseLeave={e => e.currentTarget.style.background = colors.accent}
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        /* GRID */
        <div style={styles.grid}>
          {favorites.map(movie => (
            <FavCard
              key={movie.imdbID}
              movie={movie}
              onRemove={removeFavorite}
            />
          ))}
        </div>
      )}
    </main>
  );
}