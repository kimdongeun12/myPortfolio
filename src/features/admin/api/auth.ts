import { adminApi, isUnauthorized } from './client';

type SessionResponse = { authenticated: boolean; expiresAt: string | null };

/** 로그인 (성공 시 서버가 admin_token 쿠키를 심어줌) */
export const login = async (password: string): Promise<SessionResponse> => {
  const { data } = await adminApi.post<SessionResponse>('/api/admin/login', { password });
  return data;
};

export const logout = async (): Promise<void> => {
  await adminApi.post('/api/admin/logout');
};

/** 로그인 상태 확인 — 로그인 안 됨(401)이면 false, 그 외 오류는 그대로 던짐 */
export const fetchIsLoggedIn = async (): Promise<boolean> => {
  try {
    await adminApi.get<SessionResponse>('/api/admin/me');
    return true;
  } catch (error) {
    if (isUnauthorized(error)) return false;
    throw error;
  }
};
