import "./Loader.css";

export default function Loader({ message = "Loading…" }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__spinner" aria-hidden="true" />
      <p className="loader__message">{message}</p>
    </div>
  );
}