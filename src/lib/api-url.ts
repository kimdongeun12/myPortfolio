export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

export const toAssetUrl = (src?: string | null): string => {
  if (!src) return '';
  return src.startsWith('/uploads/') ? `${API_URL}${src}` : src;
};
