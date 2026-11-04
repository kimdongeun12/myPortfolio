import { adminApi } from './client';
import type { ImageTargetType, TechStack, UploadedImage, VisitStats } from './types';

export const fetchTechStacks = async (): Promise<TechStack[]> => {
  const { data } = await adminApi.get<TechStack[]>('/api/tech-stacks');
  return data;
};

export const uploadImage = async (file: File, targetType: ImageTargetType, targetId: number): Promise<UploadedImage> => {
  const form = new FormData();
  form.append('file', file);
  form.append('targetType', targetType);
  form.append('targetId', String(targetId));
  const { data } = await adminApi.post<UploadedImage>('/api/images', form);
  return data;
};

export const fetchVisitStats = async (params?: { from?: string; to?: string }): Promise<VisitStats> => {
  const { data } = await adminApi.get<VisitStats>('/api/visits/stats', { params });
  return data;
};
