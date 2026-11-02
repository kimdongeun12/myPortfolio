import { adminApi } from './client';

export type ProjectType = 'COMPANY' | 'PERSONAL' | 'SIDE';

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  COMPANY: '회사',
  PERSONAL: '개인',
  SIDE: '사이드',
};

/** 프로젝트 (ProjectResponseDto) */
export type Project = {
  id: number;
  experienceId: number | null;
  companyName: string | null;
  title: string;
  summary: string | null;
  role: string | null;
  responsibilities: string | null;
  content: string | null; // MDX
  type: ProjectType;
  thumbnailUrl: string | null;
  pinned: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null; // null = 진행중
  techStacks: string[];
  createdAt: string;
  updatedAt: string;
};

/** 등록·수정 요청 (ProjectRequestDto) */
export type ProjectRequest = {
  experienceId: number | null;
  title: string;
  summary: string | null;
  role: string | null;
  responsibilities: string | null;
  content: string | null;
  type: ProjectType;
  thumbnailUrl: string | null;
  pinned: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  techStacks: string[];
};

/** 경력 선택 목록용 (회사 프로젝트 연결) */
export type ExperienceOption = { id: number; companyName: string; startDate: string; endDate: string | null };

export const fetchProjects = async (type?: ProjectType): Promise<Project[]> => {
  const { data } = await adminApi.get<Project[]>('/api/projects', { params: type ? { type } : undefined });
  return data;
};

export const fetchProject = async (id: number): Promise<Project> => {
  const { data } = await adminApi.get<Project>(`/api/projects/${id}`);
  return data;
};

export const createProject = async (body: ProjectRequest): Promise<number> => {
  const { data } = await adminApi.post<number>('/api/projects', body);
  return data;
};

export const updateProject = async (id: number, body: ProjectRequest): Promise<Project> => {
  const { data } = await adminApi.put<Project>(`/api/projects/${id}`, body);
  return data;
};

/** 삭제 (숨김 처리) */
export const deleteProject = async (id: number): Promise<void> => {
  await adminApi.post(`/api/projects/${id}/delete`);
};

export const fetchExperienceOptions = async (): Promise<ExperienceOption[]> => {
  const { data } = await adminApi.get<ExperienceOption[]>('/api/experiences');
  return data;
};
