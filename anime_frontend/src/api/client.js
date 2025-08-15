import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

/**
 * Axios instance to interact with backend API.
 */
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// PUBLIC_INTERFACE
export function getBaseUrl() {
  /** Returns current API base URL. */
  return BASE_URL;
}

// PUBLIC_INTERFACE
export function handleApiError(error) {
  /** Normalize API error for UI */
  if (error.response) {
    return {
      message: error.response.data?.message || 'Request failed',
      status: error.response.status,
      data: error.response.data,
    };
  }
  if (error.request) {
    return { message: 'No response from server', status: 0 };
  }
  return { message: error.message || 'Unknown error', status: 0 };
}

export default client;
