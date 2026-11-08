import { fetchApiOr } from '@/lib/api';
import type { BlogSummaryDto, CommentDto, ExperienceDto, PageResponse, ProjectDto, SkillGroupDto } from '@/lib/api-types';
import { toAssetUrl } from '@/lib/api-url';
import { formatCompactDate, formatPeriod, formatShortDate } from '@/lib/format';
import { formatSkill } from '@/data/skills';

import type { Experience, Post, ProfileData, Project, SkillGroup } from './data';

const BOARD_SIZE = 5;
const EMPTY_PAGE: PageResponse<BlogSummaryDto> = { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0, last: true };

const toLines = (text: string | null) =>
  (text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const toExperience = (dto: ExperienceDto): Experience => ({
  id: dto.id,
  startDate: formatCompactDate(dto.startDate),
  endDate: dto.current || !dto.endDate ? '재직중' : formatCompactDate(dto.endDate),
  name: dto.formerName ? `${dto.companyName} | (전) ${dto.formerName}` : dto.companyName,
  job: [dto.department, dto.position].filter(Boolean).join(' · '),
  info: dto.role ?? '',
  tasks: toLines(dto.responsibilities),
  achievements: toLines(dto.achievements),
});

const toSkillGroup = (dto: SkillGroupDto): SkillGroup => ({
  id: dto.id,
  name: dto.name,
  desc: dto.description ?? '',
  stack: dto.techStacks,
});

const toProject = (dto: ProjectDto): Project => ({
  id: dto.id,
  title: dto.title,
  subtitle: dto.summary ?? dto.companyName ?? '',
  thumbnail: toAssetUrl(dto.thumbnailUrl),
  roles: [
    { label: '기간', value: formatPeriod(dto.startDate, dto.endDate) },
    { label: '역할', value: dto.role ?? '' },
    { label: '기술', value: dto.techStacks.map(formatSkill).join(' · ') },
  ].filter((row) => row.value),
  highlights: toLines(dto.responsibilities),
  href: `/portfolio/${dto.id}`,
});

const toBlogPost = (dto: BlogSummaryDto): Post => ({
  title: dto.title,
  date: formatShortDate(dto.publishedAt ?? dto.createdAt),
  href: `/blog/${dto.id}`,
});

const toGuestPost = (dto: CommentDto): Post => ({
  title: dto.content,
  date: formatShortDate(dto.createdAt),
  href: '/guest',
});

export async function getProfileData(): Promise<ProfileData> {
  const [experiences, skillGroups, projects, blogs, guestComments] = await Promise.all([
    fetchApiOr<ExperienceDto[]>('/api/experiences', []),
    fetchApiOr<SkillGroupDto[]>('/api/skill-groups', []),
    fetchApiOr<ProjectDto[]>('/api/projects', []),
    fetchApiOr<PageResponse<BlogSummaryDto>>(`/api/blogs?page=0&size=${BOARD_SIZE}`, EMPTY_PAGE),
    fetchApiOr<CommentDto[]>('/api/comments?targetType=GUEST&targetId=1', []),
  ]);

  const pinned = projects.filter((project) => project.pinned);
  const featured = pinned.length > 0 ? pinned : projects.slice(0, 3);
  const latestGuest = guestComments
    .filter((comment) => !comment.deleted)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, BOARD_SIZE);

  return {
    experiences: experiences.map(toExperience),
    skillGroups: skillGroups.map(toSkillGroup),
    projects: featured.map(toProject),
    postBoards: [
      { title: 'Blog', href: '/blog', posts: blogs.content.map(toBlogPost) },
      { title: 'Guest Board', borderVariant: 'border-02', href: '/guest', posts: latestGuest.map(toGuestPost) },
    ],
  };
}
