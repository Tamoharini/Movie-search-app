import "./ErrorMessage.css";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-msg" role="alert" aria-live="assertive">
      <span className="error-msg__icon" aria-hidden="true">⚠️</span>
      <h2 className="error-msg__title">Something went wrong</h2>
      <p className="error-msg__body">{message}</p>
      {onRetry && (
        <button className="error-msg__retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}