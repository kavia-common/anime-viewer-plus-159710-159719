import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Navbar renders the application brand, search bar, and theme toggle.
 */
export default function Navbar({ onToggleTheme, theme }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const [q, setQ] = useState(() => (location.pathname === '/search' ? (params.get('q') || '') : ''));

  const submitSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (query.length > 0) {
      navigate(`/search?q=${encodeURIComponent(query)}&page=1`);
    }
  };

  return (
    <header className="navbar" role="banner">
      <Link to="/" className="brand" data-testid="brand">
        <span className="dot" />
        <span>Anime Viewer Plus</span>
      </Link>
      <form className="search-wrap" onSubmit={submitSearch} role="search" aria-label="search">
        <input
          className="search-input"
          type="search"
          placeholder="Search for anime..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search query"
        />
        <button className="btn" type="submit">Search</button>
        <button
          type="button"
          className="btn secondary"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </form>
    </header>
  );
}
