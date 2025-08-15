import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import AnimeDetails from './pages/AnimeDetails';
import Player from './pages/Player';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * PUBLIC_INTERFACE
   * App is the main entry point for the React SPA, providing routes and shared layout.
   * Applies theme, renders Navbar + Sidebar, and switches between pages.
   */
  const [theme, setTheme] = useState(() => localStorage.getItem('avp_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('avp_theme', theme);
  }, [theme]);

  const toggleTheme = useMemo(() => () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell">
        <Navbar onToggleTheme={toggleTheme} theme={theme} />
        <div className="content-shell">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/watch/:animeId/episode/:episodeId" element={<Player />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
