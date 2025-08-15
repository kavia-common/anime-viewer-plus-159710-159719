import React from 'react';
import { useNavigate } from 'react-router-dom';

const GENRES = [
  'Action','Adventure','Comedy','Drama','Fantasy','Horror','Mystery','Romance','Sci-Fi','Slice of Life',
  'Sports','Supernatural','Thriller','Mecha','Isekai','Historical','Music','Seinen','Shounen','Shoujo'
];

/**
 * PUBLIC_INTERFACE
 * Sidebar lists quick genre filters; clicks navigate to search page using the genre as query.
 */
export default function Sidebar() {
  const navigate = useNavigate();
  const onGenre = (g) => navigate(`/search?q=${encodeURIComponent(g)}&page=1`);

  return (
    <aside className="sidebar" aria-label="Sidebar with genres">
      <div className="section-title">Genres</div>
      <ul className="genre-list">
        {GENRES.map((g) => (
          <li
            key={g}
            className="genre-item"
            role="button"
            tabIndex={0}
            onClick={() => onGenre(g)}
            onKeyDown={(e) => (e.key === 'Enter' ? onGenre(g) : undefined)}
          >
            {g}
          </li>
        ))}
      </ul>
    </aside>
  );
}
