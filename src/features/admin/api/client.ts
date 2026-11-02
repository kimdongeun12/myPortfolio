import axios from 'axios';

import { API_URL } from '@/lib/api-url';

/**
 * 어드민 전용 axios 인스턴스
 * - withCredentials: 로그인 쿠키(admin_token)를 함께 보냄
 * - GET 이 아닌 요청에는 X-Admin-Request 헤더를 붙임 (백엔드 CSRF 방어 규칙)
 */
export const adminApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

adminApi.interceptors.request.use((config) => {
  if ((config.method ?? 'get').toLowerCase() !== 'get') {
    config.headers.set('X-Admin-Request', '1');
  }
  return config;
});

/** 백엔드 응답 형식: { "message": "..." } */
type ErrorBody = { message?: string };

/** 화면에 보여줄 에러 문구 */
export const getErrorMessage = (error: unknown, fallback = '요청을 처리하지 못했습니다.'): string => {
  if (axios.isAxiosError<ErrorBody>(error)) {
    if (!error.response) return '서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요.';
    if (error.response.status === 401) return '로그인이 만료되었습니다. 다시 로그인한 뒤 시도하세요.';
    return error.response.data?.message ?? fallback;
  }
  return fallback;
};

/** 401 응답인지 */
export const isUnauthorized = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 401;
