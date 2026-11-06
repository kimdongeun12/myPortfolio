'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { requestApi } from '@/lib/api';

const SESSION_KEY = 'portfolio-visit-session';

const getSessionId = () => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) return saved;
    const created = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
};

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    requestApi('/api/visits', {
      body: { sessionId: getSessionId(), path: pathname, referrer: document.referrer || null },
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
