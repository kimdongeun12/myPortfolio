'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { requestApi } from '@/lib/api';
import { API_URL } from '@/lib/api-url';

const SESSION_KEY = 'portfolio-visit-session';
const NO_TRACK_KEY = 'portfolio-no-track';
const RECORD_DELAY_MS = 2000;
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

const shouldTrack = () => {
  if (navigator.webdriver) return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('notrack')) localStorage.setItem(NO_TRACK_KEY, '1');
    if (params.has('track')) localStorage.removeItem(NO_TRACK_KEY);
    return localStorage.getItem(NO_TRACK_KEY) !== '1';
  } catch {
    return true;
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
    if (!shouldTrack()) return;

    const sessionId = getSessionId();
    const referrer = document.referrer || null;
    let visitId: number | null = null;
    let recorded = false;
    let recordTimer: number | null = null;
    let elapsed = 0;
    let startedAt: number | null = document.visibilityState === 'visible' ? performance.now() : null;

    const total = () => elapsed + (startedAt === null ? 0 : performance.now() - startedAt);
    const flush = () => {
      if (visitId !== null) sendDuration(visitId, sessionId, total());
    };
    const record = () => {
      recorded = true;
      requestApi<{ id: number | null }>('/api/visits', { body: { sessionId, path: pathname, referrer } })
        .then((res) => {
          visitId = res?.id ?? null;
        })
        .catch(() => undefined);
    };
    const scheduleRecord = () => {
      if (recorded || recordTimer !== null) return;
      recordTimer = window.setTimeout(() => {
        recordTimer = null;
        record();
      }, Math.max(0, RECORD_DELAY_MS - total()));
    };
    const cancelRecord = () => {
      if (recordTimer === null) return;
      window.clearTimeout(recordTimer);
      recordTimer = null;
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (startedAt !== null) {
          elapsed += performance.now() - startedAt;
          startedAt = null;
        }
        cancelRecord();
        flush();
      } else {
        if (startedAt === null) startedAt = performance.now();
        scheduleRecord();
      }
    };

    if (startedAt !== null) scheduleRecord();
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', flush);
      cancelRecord();
      flush();
    };
  }, [pathname]);

  return null;
}
