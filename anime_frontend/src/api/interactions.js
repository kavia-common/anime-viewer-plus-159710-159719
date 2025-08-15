import client, { handleApiError } from './client';

// PUBLIC_INTERFACE
export async function getComments({ animeId, episodeId } = {}) {
  /** Fetch comments optionally filtered by animeId and/or episodeId */
  try {
    const { data } = await client.get('/api/interactions/comments', {
      params: { animeId, episodeId },
    });
    return Array.isArray(data) ? data : data?.results || [];
  } catch (e) {
    throw handleApiError(e);
  }
}

// PUBLIC_INTERFACE
export async function postComment({ animeId, episodeId = null, userId = 'guest', content }) {
  /** Create a new comment */
  try {
    const { data } = await client.post('/api/interactions/comments', {
      animeId,
      episodeId,
      userId,
      content,
    });
    return data;
  } catch (e) {
    throw handleApiError(e);
  }
}

// PUBLIC_INTERFACE
export async function getLikes(animeId, userId) {
  /** Get likes summary and whether current user liked */
  try {
    const { data } = await client.get('/api/interactions/likes', {
      params: { animeId, userId },
    });
    return data;
  } catch (e) {
    throw handleApiError(e);
  }
}

// PUBLIC_INTERFACE
export async function postLike({ animeId, userId = 'guest', like = true }) {
  /** Like or unlike anime */
  try {
    const { data } = await client.post('/api/interactions/likes', { animeId, userId, like });
    return data;
  } catch (e) {
    throw handleApiError(e);
  }
}

// PUBLIC_INTERFACE
export async function getProgress({ animeId, userId = 'guest', episodeId }) {
  /** Fetch saved playback progress */
  try {
    const { data } = await client.get('/api/interactions/tracking', {
      params: { animeId, userId, episodeId },
    });
    return data;
  } catch (e) {
    throw handleApiError(e);
  }
}

// PUBLIC_INTERFACE
export async function setProgress({ animeId, episodeId, userId = 'guest', progressSeconds }) {
  /** Save playback progress */
  try {
    const { data } = await client.post('/api/interactions/tracking', {
      animeId,
      episodeId,
      userId,
      progressSeconds,
    });
    return data;
  } catch (e) {
    throw handleApiError(e);
  }
}
