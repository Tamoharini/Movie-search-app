import MovieCard from "./MovieCard";
import "./MovieGrid.css";

export default function MovieGrid({ movies }) {
  return (
    <section className="movie-grid" aria-label="Search results">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </section>
  );
}