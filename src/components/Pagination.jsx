
import "./Pagination.css";

const RESULTS_PER_PAGE = 10;

/** Maximum number of numbered page buttons to show at once */
const MAX_VISIBLE_PAGES = 5;

export default function Pagination({ currentPage, totalResults, onPageChange }) {
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  if (totalPages <= 1) return null; // Nothing to paginate

  /**
   * Calculates which page numbers to render.
   * Centers the window around the current page when possible.
   */
  function getPageNumbers() {
    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

    // Shift start left if we hit the right edge
    if (end - start < MAX_VISIBLE_PAGES - 1) {
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination" aria-label="Search result pages">
      {/* Previous button */}
      <button
        className="pagination__btn pagination__btn--prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {/* First page shortcut */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            className="pagination__btn"
            onClick={() => onPageChange(1)}
            aria-label="Page 1"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="pagination__ellipsis">…</span>
          )}
        </>
      )}

      {/* Visible page numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`pagination__btn ${
            page === currentPage ? "pagination__btn--active" : ""
          }`}
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* Last page shortcut */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="pagination__ellipsis">…</span>
          )}
          <button
            className="pagination__btn"
            onClick={() => onPageChange(totalPages)}
            aria-label={`Page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        className="pagination__btn pagination__btn--next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}