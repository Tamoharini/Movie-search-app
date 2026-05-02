import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import {FavoritesProvider}  from "./context/FavoritesContext.jsx";
import Navbar     from "./components/Navbar.jsx";
import SearchPage      from "./pages/SearchPage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import FavoritesPage  from "./pages/FavoritesPage.jsx";
import NotFoundPage    from "./pages/NotFoundPage.jsx";

/** Scrolls to the top of the page on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <FavoritesProvider>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* Search / home page */}
        <Route path="/" element={<SearchPage />} />

        {/* Movie detail page – :imdbID is the IMDB identifier */}
        <Route path="/movie/:imdbID" element={<MovieDetailPage />} />

        {/* Saved favourites */}
        <Route path="/favorites" element={<FavoritesPage />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </FavoritesProvider>
  );
}