import { adminApi } from './client';

export type Experience = {
  id: number;
  companyName: string;
  formerName: string | null;
  department: string | null;
  jobTitle: string | null;
  role: string | null;
  position: string | null;
  responsibilities: string | null;
  achievements: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExperienceRequest = {
  companyName: string;
  formerName?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  role?: string | null;
  position?: string | null;
  responsibilities?: string | null;
  achievements?: string | null;
  startDate: string;
  endDate: string | null;
};

export const fetchExperiences = async (): Promise<Experience[]> => {
  const { data } = await adminApi.get<Experience[]>('/api/experiences');
  return data;
};

export const createExperience = async (body: ExperienceRequest): Promise<number> => {
  const { data } = await adminApi.post<number>('/api/experiences', body);
  return data;
};

export const updateExperience = async (id: number, body: ExperienceRequest): Promise<Experience> => {
  const { data } = await adminApi.put<Experience>(`/api/experiences/${id}`, body);
  return data;
};

export const deleteExperience = async (id: number): Promise<void> => {
  await adminApi.post(`/api/experiences/${id}/delete`);
};
