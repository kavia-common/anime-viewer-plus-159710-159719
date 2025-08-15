import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { getAnimeById, getEpisodeRedirectUrl, getEpisodeStreamUrl } from '../api/anime';
import { getProgress, setProgress } from '../api/interactions';
import useUserId from '../hooks/useUserId';
import CommentList from '../components/CommentList';
import Loader from '../components/Loader';

/**
 * PUBLIC_INTERFACE
 * Player renders the episode playback UI and handles progress tracking.
 */
export default function Player() {
  const { animeId, episodeId } = useParams();
  const [params] = useSearchParams();
  const quality = params.get('quality') || '';
  const userId = useUserId();
  const [anime, setAnime] = useState(null);
  const [error, setError] = useState('');
  const [initProgress, setInitProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const videoEl = useRef(null);
  const navigate = useNavigate();

  const streamUrl = getEpisodeStreamUrl(episodeId, quality);
  const redirectUrl = getEpisodeRedirectUrl(episodeId, quality);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError('');
      setLoading(true);
      try {
        const [infoRes, progRes] = await Promise.all([
          getAnimeById(animeId),
          getProgress({ animeId, episodeId, userId }),
        ]);
        if (!mounted) return;
        setAnime(infoRes.item);
        const p = progRes?.progressSeconds || progRes?.progress || progRes?.seconds || 0;
        setInitProgress(Number(p) || 0);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [animeId, episodeId, userId]);

  useEffect(() => {
    const id = setInterval(() => {
      const v = videoEl.current;
      if (!v) return;
      const current = Math.floor(v.currentTime || 0);
      // Save progress every 15 seconds
      setProgress({ animeId, episodeId, userId, progressSeconds: current }).catch(() => {});
    }, 15000);
    return () => clearInterval(id);
  }, [animeId, episodeId, userId]);

  const onReady = (video) => {
    videoEl.current = video;
    if (initProgress > 0) {
      video.currentTime = initProgress;
    }
  };

  const onError = () => {
    setError('Playback failed. Try direct stream link below.');
  };

  if (loading) return <Loader />;
  if (error && !anime) return <div className="error">{error}</div>;
  if (!anime) return null;

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-title">{anime.title}</div>
        <div className="section-subtitle">Episode: {episodeId}</div>
      </div>

      <div className="player-wrap">
        <VideoPlayer src={streamUrl} onReady={onReady} onError={onError} />
        {error && (
          <div className="error">
            {error} <br />
            <a href={redirectUrl} className="btn" target="_blank" rel="noreferrer">Open Direct Stream</a>
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Episodes</div>
          <div className="section-subtitle">{anime.episodes?.length || 0} available</div>
        </div>
        <div className="episode-list">
          {anime.episodes?.map((ep, idx) => {
            const id = ep.id || ep.episodeId || ep.number || idx + 1;
            const label = ep.title || `Episode ${ep.number || idx + 1}`;
            const active = String(id) === String(episodeId);
            return (
              <Link
                key={id}
                className="episode-item"
                style={active ? { background: 'var(--secondary)', color: '#fff' } : undefined}
                to={`/watch/${encodeURIComponent(animeId)}/episode/${encodeURIComponent(id)}${quality ? `?quality=${encodeURIComponent(quality)}` : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/watch/${encodeURIComponent(animeId)}/episode/${encodeURIComponent(id)}${quality ? `?quality=${encodeURIComponent(quality)}` : ''}`);
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <CommentList
        animeId={animeId}
        episodeId={episodeId}
        placeholder="Discuss this episode..."
      />
    </section>
  );
}
