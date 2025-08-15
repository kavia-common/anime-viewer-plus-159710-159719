import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Pagination renders previous/next buttons based on 'page' query param.
 */
export default function Pagination() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(params.get('page') || '1', 10);
  const q = params.get('q') || '';

  const go = (n) => {
    const next = Math.max(1, n);
    const base = window.location.pathname;
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(next));
    if (q) url.searchParams.set('q', q);
    navigate(`${base}${url.search}`);
  };

  return (
    <div className="pagination" aria-label="pagination">
      <button className="btn secondary" onClick={() => go(page - 1)} disabled={page <= 1}>Prev</button>
      <span>Page {page}</span>
      <button className="btn" onClick={() => go(page + 1)}>Next</button>
    </div>
  );
}
