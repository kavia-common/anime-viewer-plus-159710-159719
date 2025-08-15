import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAnimeById } from '../api/anime';
import Loader from '../components/Loader';
import LikeButton from '../components/LikeButton';
import CommentList from '../components/CommentList';

/**
 * PUBLIC_INTERFACE
 * AnimeDetails shows metadata and episodes for a selected anime.
 */
export default function AnimeDetails() {
  const { id } = useParams();
  const [state, setState] = useState({ anime: null, loading: true, error: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAnimeById(id);
        if (mounted) setState({ anime: res.item, loading: false, error: '' });
      } catch (e) {
        if (mounted) setState({ anime: null, loading: false, error: e.message || 'Failed to load' });
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (state.loading) return <Loader />;
  if (state.error) return <div className="error">{state.error}</div>;
  if (!state.anime) return null;

  const { title, image, description, episodes = [] } = state.anime;

  return (
    <section className="section">
      <div className="details">
        <div className="cover-lg">
          <img src={image || 'https://via.placeholder.com/600x800?text=No+Image'} alt={title} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="meta">
          <div className="section-title">{title}</div>
          <p className="description">{description || 'No description available.'}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <LikeButton animeId={id} />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Episodes</div>
          <div className="section-subtitle">{episodes.length} episodes</div>
        </div>
        <div className="episode-list">
          {episodes.map((ep, idx) => {
            const epId = ep.id || ep.episodeId || ep.number || idx + 1;
            const label = ep.title || `Episode ${ep.number || idx + 1}`;
            return (
              <Link
                key={epId}
                className="episode-item"
                to={`/watch/${encodeURIComponent(id)}/episode/${encodeURIComponent(epId)}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <CommentList animeId={id} placeholder="Share your thoughts about this anime..." />
    </section>
  );
}
