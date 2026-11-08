import { ApiError, fetchApi, fetchApiOr, requestApi } from '@/lib/api';
import type { BlogDetailDto, BlogOverviewDto, BlogSummaryDto, PageResponse } from '@/lib/api-types';
import { formatDotDate } from '@/lib/format';
import { SKILL_ICONS } from '@/data/skills';

import type { BlogPage, BlogPost, BlogPostDetail, BlogStats } from './types';

export const ALL_TAG = '전체';

const LIST_SIZE = 200;
const FAILED_PAGE: BlogPage = { items: [], page: -1, last: false, total: 0 };

const EMPTY_PAGE: PageResponse<BlogSummaryDto> = { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0, last: true };
const ICON_ORDER = Object.keys(SKILL_ICONS);

const toBlogPost = (dto: BlogSummaryDto): BlogPost => ({
  id: String(dto.id),
  title: dto.title,
  category: dto.techStacks[0] ?? 'Blog',
  summary: dto.excerpt,
  date: formatDotDate(dto.publishedAt ?? dto.createdAt),
  likes: dto.likeCount,
  comments: dto.commentCount,
  tags: dto.techStacks,
});

export const BLOG_PAGE_SIZE = 10;

const EMPTY_OVERVIEW: BlogOverviewDto = { posts: 0, likes: 0, comments: 0, tags: [] };

const toBlogPage = (page: PageResponse<BlogSummaryDto>): BlogPage => ({
  items: page.content.map(toBlogPost),
  page: page.page,
  last: page.last,
  total: page.totalElements,
});

const blogPagePath = (page: number, tag?: string, query?: string) => {
  const params = new URLSearchParams({ page: String(page), size: String(BLOG_PAGE_SIZE) });
  if (tag && tag !== ALL_TAG) params.set('tech', tag);
  if (query && query.trim()) params.set('q', query.trim());
  return `/api/blogs?${params.toString()}`;
};

export async function getBlogFirstPage(): Promise<BlogPage> {
  try {
    return toBlogPage(await fetchApi<PageResponse<BlogSummaryDto>>(blogPagePath(0)));
  } catch {
    return FAILED_PAGE;
  }
}

export async function fetchBlogPage(page: number, tag?: string, query?: string): Promise<BlogPage> {
  return toBlogPage(await requestApi<PageResponse<BlogSummaryDto>>(blogPagePath(page, tag, query)));
}

const sortTags = (tags: string[]) => {
  const rank = (tag: string) => {
    const index = ICON_ORDER.indexOf(tag);
    return index === -1 ? ICON_ORDER.length : index;
  };
  return [...tags].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
};

export async function getBlogOverview(): Promise<{ stats: BlogStats; tags: string[] }> {
  const overview = await fetchApiOr<BlogOverviewDto>('/api/blogs/overview', EMPTY_OVERVIEW);
  return {
    stats: { posts: overview.posts, likes: overview.likes, comments: overview.comments },
    tags: [ALL_TAG, ...sortTags(overview.tags)],
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const page = await fetchApiOr<PageResponse<BlogSummaryDto>>(`/api/blogs?page=0&size=${LIST_SIZE}`, EMPTY_PAGE);
  return page.content.map(toBlogPost);
}

export async function getBlogPost(id: string, summary?: BlogPost): Promise<BlogPostDetail | null> {
  if (!/^\d+$/.test(id)) return null;
  try {
    const dto = await fetchApi<BlogDetailDto>(`/api/blogs/${id}`);
    return {
      id: String(dto.id),
      title: dto.title,
      category: dto.techStacks[0] ?? 'Blog',
      summary: summary?.summary ?? '',
      date: formatDotDate(dto.publishedAt ?? dto.createdAt),
      likes: dto.likeCount,
      comments: summary?.comments ?? 0,
      tags: dto.techStacks,
      content: dto.content,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export const getAdjacentPosts = (posts: BlogPost[], id: string) => {
  const index = posts.findIndex((post) => post.id === id);
  return {
    prev: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
    next: index > 0 ? posts[index - 1] : undefined,
  };
};
