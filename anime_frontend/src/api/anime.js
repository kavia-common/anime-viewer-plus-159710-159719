import client, { getBaseUrl, handleApiError } from './client';

// Helpers to normalize list items from various backend shapes
function mapItem(item) {
  return {
    id: item.id || item.animeId || item.anime_id || item.slug || item._id || item.identifier || '',
    title: item.title?.english || item.title?.romaji || item.title?.native || item.title || item.name || 'Untitled',
    image: item.image || item.cover || item.poster || item.img || item.thumbnail || '',
    description: item.description || item.synopsis || item.overview || '',
    episodes: item.episodes || item.episodeList || item.episodesList || [],
  };
}
function mapList(resp) {
  const arr = resp?.results || resp?.items || resp?.data || resp?.list || resp || [];
  return (Array.isArray(arr) ? arr : []).map(mapItem);
}

// PUBLIC_INTERFACE
export async function searchAnime(q, page = 1) {
  /** Search for anime by query using backend */
  try {
    const { data } = await client.get('/api/anime/search', { params: { q, page } });
    return { items: mapList(data), raw: data };
  } catch (e) {
    throw handleApiError(e);
  }
}

// PUBLIC_INTERFACE
export async function getTrending(page = 1) {
  /** Get trending/top-airing anime */
  try {
    const { data } = await client.get('/api/anime/trending', { params: { page } });
    return { items: mapList(data), raw: data };
  } catch (e) {
    throw handleApiError(e);
  }
}

// PUBLIC_INTERFACE
export async function getRecent(page = 1, type = 1) {
  /** Get recent episodes feed (type: 1=sub, 2=dub) */
  try {
    const { data } = await client.get('/api/anime/recent', { params: { page, type } });
    return { items: mapList(data), raw: data };
  } catch (e) {
    throw handleApiError(e);
  }
}

// PUBLIC_INTERFACE
export async function getAnimeById(id) {
  /** Get anime info by id (expecting episodes inside response) */
  try {
    const { data } = await client.get(`/api/anime/${encodeURIComponent(id)}`);
    // Return normalized object with episodes list if present
    const mapped = mapItem(data);
    // Episodes array normalization
    const episodes =
      data?.episodes ||
      data?.episodeList ||
      data?.episodesList ||
      data?.episodes?.map((ep) => ({
        id: ep.id || ep.episodeId || ep.number || ep.slug || ep._id || '',
        number: ep.number || ep.ep || ep.episodeNumber || ep.index || ep.id || 0,
        title: ep.title || `Episode ${ep.number || ep.id || ''}`,
      })) ||
      [];
    mapped.episodes = episodes;
    return { item: mapped, raw: data };
  } catch (e) {
    throw handleApiError(e);
  }
}

// PUBLIC_INTERFACE
export function getEpisodeStreamUrl(episodeId, quality) {
  /** Construct stream proxy URL for an episode (for HLS playback) */
  const base = getBaseUrl();
  const q = quality ? `?quality=${encodeURIComponent(quality)}` : '';
  return `${base}/api/anime/episode/${encodeURIComponent(episodeId)}/stream${q}`;
}

// PUBLIC_INTERFACE
export function getEpisodeRedirectUrl(episodeId, quality) {
  /** Construct redirect URL for direct stream (used as fallback) */
  const base = getBaseUrl();
  const q = quality ? `?quality=${encodeURIComponent(quality)}` : '';
  return `${base}/api/anime/episode/${encodeURIComponent(episodeId)}/redirect${q}`;
}

// PUBLIC_INTERFACE
export async function getEpisodeSources(episodeId) {
  /** Fetch episode sources (if you want to display quality selector) */
  try {
    const { data } = await client.get(`/api/anime/episode/${encodeURIComponent(episodeId)}/sources`);
    return data;
  } catch (e) {
    throw handleApiError(e);
  }
}
