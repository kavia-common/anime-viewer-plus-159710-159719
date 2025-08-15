import React, { useEffect, useState } from 'react';
import { getTrending, getRecent } from '../api/anime';
import AnimeCard from '../components/AnimeCard';
import Loader from '../components/Loader';

/**
 * PUBLIC_INTERFACE
 * Home renders trending and recent sections.
 */
export default function Home() {
  const [trending, setTrending] = useState({ items: [], loading: true, error: '' });
  const [recent, setRecent] = useState({ items: [], loading: true, error: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [t, r] = await Promise.all([getTrending(1), getRecent(1, 1)]);
        if (mounted) {
          setTrending({ items: t.items.slice(0, 12), loading: false, error: '' });
          setRecent({ items: r.items.slice(0, 12), loading: false, error: '' });
        }
      } catch (e) {
        setTrending((s) => ({ ...s, loading: false, error: e.message || 'Failed to load trending' }));
        setRecent((s) => ({ ...s, loading: false, error: e.message || 'Failed to load recent' }));
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <section className="section">
        <div className="section-header">
          <div className="section-title">Trending</div>
          <div className="section-subtitle">Top airing and popular</div>
        </div>
        {trending.loading ? <Loader /> : trending.error ? <div className="error">{trending.error}</div> : (
          <div className="grid">
            {trending.items.map((a) => <AnimeCard key={a.id} anime={a} />)}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <div className="section-title">Recent Episodes</div>
          <div className="section-subtitle">Fresh releases (sub)</div>
        </div>
        {recent.loading ? <Loader /> : recent.error ? <div className="error">{recent.error}</div> : (
          <div className="grid">
            {recent.items.map((a) => <AnimeCard key={a.id} anime={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}
