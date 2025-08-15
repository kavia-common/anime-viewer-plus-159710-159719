import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';
import AnimeCard from '../components/AnimeCard';
import { searchAnime } from '../api/anime';
import Pagination from '../components/Pagination';

/**
 * PUBLIC_INTERFACE
 * SearchResults displays anime matching the search query.
 */
export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const page = parseInt(params.get('page') || '1', 10);
  const [state, setState] = useState({ items: [], loading: true, error: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setState({ items: [], loading: true, error: '' });
      if (!q) {
        setState({ items: [], loading: false, error: 'Enter a search query' });
        return;
      }
      try {
        const res = await searchAnime(q, page);
        if (mounted) setState({ items: res.items, loading: false, error: '' });
      } catch (e) {
        if (mounted) setState({ items: [], loading: false, error: e.message || 'Search failed' });
      }
    })();
    return () => { mounted = false; };
  }, [q, page]);

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-title">Search</div>
        <div className="section-subtitle">Query: “{q}”</div>
      </div>
      {state.loading ? <Loader /> : state.error ? <div className="error">{state.error}</div> : (
        <>
          <div className="grid">
            {state.items.map((a) => <AnimeCard key={a.id} anime={a} />)}
          </div>
          <Pagination />
        </>
      )}
    </section>
  );
}
