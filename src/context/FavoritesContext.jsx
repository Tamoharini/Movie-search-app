import { createContext, useContext, useState, useEffect, useCallback } from "react";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "cinesearch_favorites";

/**
 * FavoritesProvider wraps the app and makes favourites available
 * to any descendant via the useFavorites() hook.
 */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync whenever the favorites list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  /** Add a movie to favorites (no duplicates) */
  const addFavorite = useCallback((movie) => {
    setFavorites((prev) => {
      const alreadyExists = prev.some((m) => m.imdbID === movie.imdbID);
      if (alreadyExists) return prev;
      return [...prev, movie];
    });
  }, []);

  /** Remove a movie from favorites by its IMDB ID */
  const removeFavorite = useCallback((imdbID) => {
    setFavorites((prev) => prev.filter((m) => m.imdbID !== imdbID));
  }, []);

  /** Returns true if the movie is already in favorites */
  const isFavorite = useCallback(
    (imdbID) => favorites.some((m) => m.imdbID === imdbID),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

/** Custom hook – throws if used outside <FavoritesProvider> */
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside a <FavoritesProvider>");
  }
  return ctx;
}