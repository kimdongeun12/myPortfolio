import { adminApi } from './client';
import type { PageResponse } from './types';

/** 목록용 (BlogSummaryDto) */
export type BlogSummary = {
  id: number;
  title: string;
  excerpt: string;
  thumbnailUrl: string | null;
  likeCount: number;
  published: boolean;
  techStacks: string[];
  createdAt: string;
};

/** 상세 (BlogResponseDto) */
export type BlogDetail = {
  id: number;
  title: string;
  content: string; // MDX
  thumbnailUrl: string | null;
  likeCount: number;
  liked: boolean;
  published: boolean;
  techStacks: string[];
  createdAt: string;
  updatedAt: string;
};

/** 등록·수정 요청 (BlogRequestDto) */
export type BlogRequest = {
  title: string;
  content: string;
  thumbnailUrl: string | null;
  published: boolean;
  techStacks: string[];
};

/** 관리자 목록 (임시저장 포함, 최신순) — page 는 0부터 */
export const fetchAdminBlogs = async (page: number, size = 20): Promise<PageResponse<BlogSummary>> => {
  const { data } = await adminApi.get<PageResponse<BlogSummary>>('/api/admin/blogs', {
    params: { page, size, sort: 'createdAt,desc' },
  });
  return data;
};

/** 관리자 상세 (임시저장 포함) */
export const fetchAdminBlog = async (id: number): Promise<BlogDetail> => {
  const { data } = await adminApi.get<BlogDetail>(`/api/admin/blogs/${id}`);
  return data;
};

export const createBlog = async (body: BlogRequest): Promise<number> => {
  const { data } = await adminApi.post<number>('/api/blogs', body);
  return data;
};

export const updateBlog = async (id: number, body: BlogRequest): Promise<BlogDetail> => {
  const { data } = await adminApi.put<BlogDetail>(`/api/blogs/${id}`, body);
  return data;
};

/** 삭제 (숨김 처리) */
export const deleteBlog = async (id: number): Promise<void> => {
  await adminApi.post(`/api/blogs/${id}/delete`);
};
