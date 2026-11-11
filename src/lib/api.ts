import { API_URL } from '@/lib/api-url';

export const REVALIDATE_SECONDS = 60;
export const API_CACHE_TAG = 'api';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const toError = async (res: Response) => {
  let message = '';
  try {
    const body = await res.json();
    if (body && typeof body.message === 'string') message = body.message;
  } catch {
    message = '';
  }
  return new ApiError(res.status, message || `요청을 처리하지 못했습니다. (${res.status})`);
};

const parseBody = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
};

export async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS, tags: [API_CACHE_TAG] } });
  if (!res.ok) throw await toError(res);
  return parseBody<T>(res);
}

export async function fetchApiOr<T>(path: string, fallback: T): Promise<T> {
  try {
    return await fetchApi<T>(path);
  } catch {
    return fallback;
  }
}

export async function requestApi<T>(path: string, init: { method?: 'GET' | 'POST' | 'PUT'; body?: unknown } = {}): Promise<T> {
  const hasBody = init.body !== undefined;
  const res = await fetch(`${API_URL}${path}`, {
    method: init.method ?? (hasBody ? 'POST' : 'GET'),
    headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
    body: hasBody ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) throw await toError(res);
  return parseBody<T>(res);
}

export const getErrorMessage = (error: unknown, fallback = '요청을 처리하지 못했습니다.') =>
  error instanceof Error && error.message ? error.message : fallback;
