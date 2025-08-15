import React, { useEffect, useState } from 'react';
import { getComments, postComment } from '../api/interactions';
import useUserId from '../hooks/useUserId';

/**
 * PUBLIC_INTERFACE
 * CommentList renders a list of comments and a form to add a new comment.
 */
export default function CommentList({ animeId, episodeId = null, placeholder = 'Add a comment...' }) {
  const userId = useUserId();
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const list = await getComments({ animeId, episodeId });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || 'Failed to load comments');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, episodeId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setBusy(true);
    try {
      await postComment({ animeId, episodeId, userId, content });
      setText('');
      await load();
    } catch (e2) {
      setError(e2.message || 'Failed to post comment');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="comments" aria-label="comments">
      <div className="section-header">
        <div className="section-title">Comments</div>
        <div className="section-subtitle">{items.length} total</div>
      </div>
      <form className="comment-form" onSubmit={onSubmit}>
        <input
          className="comment-input"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="New comment"
        />
        <button className="btn" type="submit" disabled={busy || !text.trim()}>
          {busy ? 'Posting...' : 'Post'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <div>
        {items.map((c, idx) => (
          <div className="comment" key={c.id || idx}>
            <strong>{c.userId || 'guest'}</strong>
            <div>{c.content || c.text || ''}</div>
            <small>{c.episodeId ? `Episode: ${c.episodeId}` : 'Anime'}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
