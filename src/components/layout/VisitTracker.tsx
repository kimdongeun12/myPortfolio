'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { requestApi } from '@/lib/api';
import { API_URL } from '@/lib/api-url';

const SESSION_KEY = 'portfolio-visit-session';
const MIN_DURATION_MS = 1000;

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

const trySendBeacon = (url: string) => {
  try {
    return navigator.sendBeacon?.(url) ?? false;
  } catch {
    return false;
  }
};

const sendDuration = (id: number, sessionId: string, durationMs: number) => {
  if (durationMs < MIN_DURATION_MS) return;
  const params = new URLSearchParams({ id: String(id), sessionId, durationMs: String(Math.round(durationMs)) });
  const url = `${API_URL}/api/visits/duration?${params.toString()}`;
  if (trySendBeacon(url)) return;
  fetch(url, { method: 'POST', keepalive: true }).catch(() => undefined);
};

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const sessionId = getSessionId();
    let visitId: number | null = null;
    let elapsed = 0;
    let startedAt: number | null = document.visibilityState === 'visible' ? performance.now() : null;

    const total = () => elapsed + (startedAt === null ? 0 : performance.now() - startedAt);
    const flush = () => {
      if (visitId !== null) sendDuration(visitId, sessionId, total());
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (startedAt !== null) {
          elapsed += performance.now() - startedAt;
          startedAt = null;
        }
        flush();
      } else if (startedAt === null) {
        startedAt = performance.now();
      }
    };

    requestApi<{ id: number | null }>('/api/visits', {
      body: { sessionId, path: pathname, referrer: document.referrer || null },
    })
      .then((res) => {
        visitId = res?.id ?? null;
      })
      .catch(() => undefined);

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [pathname]);

  return null;
}
