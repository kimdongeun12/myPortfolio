import { toAssetUrl } from '@/lib/api-url';
import type { ProjectDto } from '@/lib/api-types';

export type ProjectCover = {
  label: string;
  title: string;
  sub: string;
  year: string;
  image: string;
};

const TYPE_LABEL: Record<ProjectDto['type'], string> = {
  COMPANY: 'Company',
  PERSONAL: 'Personal',
  SIDE: 'Side Project',
};

const yearOf = (date: string | null) => (date ? date.slice(0, 4) : '');

export const formatYearRange = (start: string | null, end: string | null) => {
  const from = yearOf(start);
  const to = yearOf(end);
  if (!from) return to;
  if (!to) return `${from} –`;
  return from === to ? from : `${from} – ${to}`;
};

export const toProjectCover = (dto: ProjectDto): ProjectCover => ({
  label: dto.coverLabel ?? TYPE_LABEL[dto.type],
  title: dto.coverTitle ?? dto.title,
  sub: dto.coverSub ?? dto.companyName ?? '',
  year: formatYearRange(dto.startDate, dto.endDate),
  image: toAssetUrl(dto.thumbnailUrl),
});
