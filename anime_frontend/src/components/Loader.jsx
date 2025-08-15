import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Loader shows a minimal loading state.
 */
export default function Loader({ text = 'Loading...' }) {
  return <div className="loading" role="status" aria-live="polite">{text}</div>;
}
