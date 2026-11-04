import { adminApi, isUnauthorized } from './client';

type SessionResponse = { authenticated: boolean; expiresAt: string | null };

export const login = async (password: string): Promise<SessionResponse> => {
  const { data } = await adminApi.post<SessionResponse>('/api/admin/login', { password });
  return data;
};

export const logout = async (): Promise<void> => {
  await adminApi.post('/api/admin/logout');
};

export const fetchIsLoggedIn = async (): Promise<boolean> => {
  try {
    await adminApi.get<SessionResponse>('/api/admin/me');
    return true;
  } catch (error) {
    if (isUnauthorized(error)) return false;
    throw error;
  }
};
