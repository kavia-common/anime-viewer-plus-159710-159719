import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * AnimeCard renders a poster and title; clicking navigates to details page.
 */
export default function AnimeCard({ anime }) {
  const cover = anime.image || 'https://via.placeholder.com/300x420?text=No+Image';
  return (
    <div className="card" aria-label={anime.title}>
      <Link to={`/anime/${encodeURIComponent(anime.id)}`} className="card-cover">
        <img src={cover} alt={anime.title} loading="lazy" />
      </Link>
      <div className="card-body">
        <Link to={`/anime/${encodeURIComponent(anime.id)}`} className="card-title">
          {anime.title}
        </Link>
      </div>
    </div>
  );
}
