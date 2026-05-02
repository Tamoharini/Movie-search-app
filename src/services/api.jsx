const BASE_URL = "https://www.omdbapi.com/";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "e41e9151";

async function apiFetch(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }

  return response.json(); // ← return raw JSON, let callers handle Response:"False"
}

/**
 * Search movies — returns the RAW OMDB response so SearchPage.jsx can read
 * data.Response, data.Search, and data.totalResults directly.
 */
export async function searchMovies(query, page = 1, type = "") {
  if (!query || query.trim() === "") {
    throw new Error("Please enter a search term.");
  }

  const typeParam = type ? `&type=${encodeURIComponent(type)}` : "";
  const url = `${BASE_URL}?s=${encodeURIComponent(query.trim())}&page=${page}${typeParam}&apikey=${API_KEY}`;

  return apiFetch(url); // ✅ returns { Response, Search, totalResults }
}

/**
 * Fetch full details for a single movie by IMDB ID.
 */
export async function getMovieById(imdbID) {
  if (!imdbID) throw new Error("A valid IMDB ID is required.");

  const url = `${BASE_URL}?i=${encodeURIComponent(imdbID)}&plot=full&apikey=${API_KEY}`;

  return apiFetch(url);
}