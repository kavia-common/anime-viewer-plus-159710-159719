import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

/**
 * PUBLIC_INTERFACE
 * VideoPlayer plays HLS streams using hls.js with native fallback.
 */
export default function VideoPlayer({ src, onReady, onError }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;
    let destroyed = false;

    const setup = async () => {
      try {
        if (Hls.isSupported()) {
          hls = new Hls({ enableWorker: true });
          hls.attachMedia(video);
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(src);
          });
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (destroyed) return;
            setReady(true);
            onReady && onReady(video);
          });
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data?.fatal) {
              onError && onError(new Error(data?.details || 'HLS Fatal Error'));
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', () => {
            if (destroyed) return;
            setReady(true);
            onReady && onReady(video);
          });
        } else {
          // Not supported
          onError && onError(new Error('HLS not supported'));
        }
      } catch (e) {
        onError && onError(e);
      }
    };

    setup();

    return () => {
      destroyed = true;
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, onReady, onError]);

  return (
    <video
      ref={videoRef}
      className="video"
      controls
      playsInline
      preload="metadata"
      aria-label="Video player"
    />
  );
}
