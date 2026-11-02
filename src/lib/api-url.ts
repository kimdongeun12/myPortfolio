/** 백엔드 API 주소 (.env.development / 배포 환경변수 NEXT_PUBLIC_API_URL) */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

/**
 * 백엔드에 업로드된 이미지 경로(/uploads/...)를 전체 주소로 변환
 * 외부 URL 이나 public 폴더 경로는 그대로 둡니다.
 */
export const toAssetUrl = (src?: string | null): string => {
  if (!src) return '';
  return src.startsWith('/uploads/') ? `${API_URL}${src}` : src;
};
