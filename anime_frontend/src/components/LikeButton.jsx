import React, { useEffect, useState } from 'react';
import useUserId from '../hooks/useUserId';
import { getLikes, postLike } from '../api/interactions';

/**
 * PUBLIC_INTERFACE
 * LikeButton shows a like count and toggle for current user.
 */
export default function LikeButton({ animeId }) {
  const userId = useUserId();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getLikes(animeId, userId);
        const total = data?.count ?? data?.likes ?? 0;
        const mine = data?.liked ?? data?.userLiked ?? false;
        if (mounted) {
          setCount(total);
          setLiked(!!mine);
        }
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [animeId, userId]);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const next = !liked;
      await postLike({ animeId, userId, like: next });
      setLiked(next);
      setCount((c) => c + (next ? 1 : -1));
    } catch {
      // noop
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className="btn"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike' : 'Like'}
      disabled={busy}
      title={liked ? 'Unlike' : 'Like'}
    >
      {liked ? '💜 Liked' : '🤍 Like'} • {count}
    </button>
  );
}
