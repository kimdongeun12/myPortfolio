import { ApiError, fetchApi, fetchApiOr, requestApi } from '@/lib/api';
import type { PageResponse, ProjectDto } from '@/lib/api-types';
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

export const PORTFOLIO_PAGE_SIZE = 10;

export type PortfolioPage = {
  items: PortfolioProject[];
  page: number;
  last: boolean;
};

const EMPTY_PAGE: PageResponse<ProjectDto> = { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0, last: true };

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

const toPortfolioPage = (page: PageResponse<ProjectDto>): PortfolioPage => ({
  items: page.content.map(toPortfolioProject),
  page: page.page,
  last: page.last,
});

const pagePath = (page: number) => `/api/projects/page?page=${page}&size=${PORTFOLIO_PAGE_SIZE}`;

export async function getPortfolioFirstPage(): Promise<PortfolioPage> {
  return toPortfolioPage(await fetchApiOr<PageResponse<ProjectDto>>(pagePath(0), EMPTY_PAGE));
}

export async function fetchPortfolioPage(page: number): Promise<PortfolioPage> {
  return toPortfolioPage(await requestApi<PageResponse<ProjectDto>>(pagePath(page)));
}

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
