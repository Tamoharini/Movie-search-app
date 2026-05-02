import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="not-found__code">404</span>
      <h1 className="not-found__title">Page Not Found</h1>
      <p className="not-found__body">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="not-found__link">
        ← Back to Home
      </Link>
    </main>
  );
}