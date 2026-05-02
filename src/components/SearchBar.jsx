import { useRef } from "react";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSearch }) {
  const inputRef = useRef(null);

  /** Allow submitting with the Enter key */
  function handleKeyDown(e) {
    if (e.key === "Enter") onSearch();
  }

  /** Clear the input and re-focus */
  function handleClear() {
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div className="searchbar">
      <div className="searchbar__wrapper">
        {/* Search icon */}
        <span className="searchbar__icon" aria-hidden="true">🔍</span>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          className="searchbar__input"
          placeholder="Search movies, series, episodes…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search for movies"
          autoFocus
        />

        {/* Clear button – only visible when there is text */}
        {value && (
          <button
            className="searchbar__clear"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {/* Submit button */}
      <button
        className="searchbar__button"
        onClick={onSearch}
        type="button"
        aria-label="Submit search"
      >
        Search
      </button>
    </div>
  );
}