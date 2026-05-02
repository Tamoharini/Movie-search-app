import { Link, NavLink } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import "./Navbar.css";
import "../services/api";

export default function Navbar() {
  const { favorites } = useFavorites();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-icon">🎬</span>
          <span className="navbar__brand-name">CineSearch</span>
        </Link>

        {/* Navigation links */}
        <nav className="navbar__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
            end
          >
            Search
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Favourites
            {favorites.length > 0 && (
              <span className="navbar__badge">{favorites.length}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}