import { ApiError, fetchApi, fetchApiOr } from '@/lib/api';
import type { ProjectDto } from '@/lib/api-types';
import { toAssetUrl } from '@/lib/api-url';
import { formatPeriod } from '@/lib/format';

export type PortfolioProject = {
  id: string;
  title: string;
  summary: string;
  pinned: boolean;
  role: string;
  period: string;
  stack: string[];
  description: string;
  responsibilities: string[];
  content: string;
  thumbnail: string;
};

const splitLines = (text: string | null) =>
  (text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const toPortfolioProject = (dto: ProjectDto): PortfolioProject => ({
  id: String(dto.id),
  title: dto.title,
  summary: dto.summary ?? '',
  pinned: dto.pinned,
  role: dto.role ?? '',
  period: formatPeriod(dto.startDate, dto.endDate),
  stack: dto.techStacks,
  description: dto.summary ?? '',
  responsibilities: splitLines(dto.responsibilities),
  content: dto.content ?? '',
  thumbnail: toAssetUrl(dto.thumbnailUrl),
});

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const projects = await fetchApiOr<ProjectDto[]>('/api/projects', []);
  return projects.map(toPortfolioProject);
}

export async function getPortfolioProject(id: string): Promise<PortfolioProject | null> {
  if (!/^\d+$/.test(id)) return null;
  try {
    return toPortfolioProject(await fetchApi<ProjectDto>(`/api/projects/${id}`));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
