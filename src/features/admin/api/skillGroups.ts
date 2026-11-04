import { adminApi } from './client';

export type SkillGroup = {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
  techStacks: string[];
  createdAt: string;
  updatedAt: string;
};

export type SkillGroupRequest = {
  name: string;
  description: string | null;
  sortOrder: number;
  techStacks: string[];
};

export const fetchSkillGroups = async (): Promise<SkillGroup[]> => {
  const { data } = await adminApi.get<SkillGroup[]>('/api/skill-groups');
  return data;
};

export const createSkillGroup = async (body: SkillGroupRequest): Promise<number> => {
  const { data } = await adminApi.post<number>('/api/skill-groups', body);
  return data;
};

export const updateSkillGroup = async (id: number, body: SkillGroupRequest): Promise<SkillGroup> => {
  const { data } = await adminApi.put<SkillGroup>(`/api/skill-groups/${id}`, body);
  return data;
};

export const deleteSkillGroup = async (id: number): Promise<void> => {
  await adminApi.post(`/api/skill-groups/${id}/delete`);
};
