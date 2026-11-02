import { adminApi } from './client';
import type { ImageTargetType, TechStack, UploadedImage, VisitStats } from './types';

/** 기술 스택 전체 목록 (입력 자동완성용) */
export const fetchTechStacks = async (): Promise<TechStack[]> => {
  const { data } = await adminApi.get<TechStack[]>('/api/tech-stacks');
  return data;
};

/** 이미지 업로드 — 대상(블로그/프로젝트)이 먼저 저장되어 있어야 합니다. */
export const uploadImage = async (file: File, targetType: ImageTargetType, targetId: number): Promise<UploadedImage> => {
  const form = new FormData();
  form.append('file', file);
  form.append('targetType', targetType);
  form.append('targetId', String(targetId));
  const { data } = await adminApi.post<UploadedImage>('/api/images', form);
  return data;
};

/** 방문 통계 (기본: 최근 30일) */
export const fetchVisitStats = async (params?: { from?: string; to?: string }): Promise<VisitStats> => {
  const { data } = await adminApi.get<VisitStats>('/api/visits/stats', { params });
  return data;
};
