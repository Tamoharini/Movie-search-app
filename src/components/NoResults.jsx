import "./NoResults.css";

export default function NoResults({ query }) {
  return (
    <div className="no-results" role="status">
      <span className="no-results__icon" aria-hidden="true">🎭</span>
      <h2 className="no-results__title">No results found</h2>
      <p className="no-results__body">
        We couldn&apos;t find anything matching{" "}
        <strong>&ldquo;{query}&rdquo;</strong>. Try a different title or
        broaden your search.
      </p>
    </div>
  );
}