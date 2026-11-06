import { ApiError, fetchApi, fetchApiOr } from '@/lib/api';
import type { BlogDetailDto, BlogSummaryDto, PageResponse } from '@/lib/api-types';
import { formatDotDate } from '@/lib/format';
import { SKILL_ICONS } from '@/data/skills';

import type { BlogPost, BlogPostDetail, BlogStats } from './types';

export const ALL_TAG = '전체';

const LIST_SIZE = 200;
const EMPTY_PAGE: PageResponse<BlogSummaryDto> = { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0, last: true };
const ICON_ORDER = Object.keys(SKILL_ICONS);

const toBlogPost = (dto: BlogSummaryDto): BlogPost => ({
  id: String(dto.id),
  title: dto.title,
  category: dto.techStacks[0] ?? 'Blog',
  summary: dto.excerpt,
  date: formatDotDate(dto.createdAt),
  likes: dto.likeCount,
  comments: dto.commentCount,
  tags: dto.techStacks,
});

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
      date: formatDotDate(dto.createdAt),
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

export const getBlogTags = (posts: BlogPost[]) => {
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const rank = (tag: string) => {
    const index = ICON_ORDER.indexOf(tag);
    return index === -1 ? ICON_ORDER.length : index;
  };
  tags.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  return [ALL_TAG, ...tags];
};

export const getBlogStats = (posts: BlogPost[]): BlogStats => ({
  posts: posts.length,
  likes: posts.reduce((sum, post) => sum + post.likes, 0),
  comments: posts.reduce((sum, post) => sum + post.comments, 0),
});

export const getAdjacentPosts = (posts: BlogPost[], id: string) => {
  const index = posts.findIndex((post) => post.id === id);
  return {
    prev: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
    next: index > 0 ? posts[index - 1] : undefined,
  };
};
