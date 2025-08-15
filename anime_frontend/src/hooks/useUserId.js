import { useEffect, useState } from 'react';

function generateId() {
  // Simple random id without external deps
  return 'guest-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// PUBLIC_INTERFACE
export default function useUserId() {
  /** Return a stable userId string stored in localStorage */
  const [userId, setUserId] = useState(() => localStorage.getItem('avp_user_id') || '');

  useEffect(() => {
    if (!userId) {
      const id = generateId();
      localStorage.setItem('avp_user_id', id);
      setUserId(id);
    }
  }, [userId]);

  return userId || 'guest';
}
