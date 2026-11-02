import { adminApi } from './client';

/** 경력 (ExperienceResponseDto) */
export type Experience = {
  id: number;
  companyName: string;
  formerName: string | null;
  department: string | null;
  jobTitle: string | null;
  role: string | null;
  position: string | null;
  responsibilities: string | null;
  startDate: string; // 2023-06-20
  endDate: string | null; // null = 재직중
  current: boolean;
  createdAt: string;
  updatedAt: string;
};

/** 등록·수정 요청 (ExperienceRequestDto) */
export type ExperienceRequest = {
  companyName: string;
  formerName?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  role?: string | null;
  position?: string | null;
  responsibilities?: string | null;
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

/** 삭제 (숨김 처리) */
export const deleteExperience = async (id: number): Promise<void> => {
  await adminApi.post(`/api/experiences/${id}/delete`);
};
