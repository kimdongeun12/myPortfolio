import { adminApi } from './client';
import type { PageResponse } from './types';

export type BlogSummary = {
  id: number;
  title: string;
  excerpt: string;
  thumbnailUrl: string | null;
  likeCount: number;
  published: boolean;
  techStacks: string[];
  publishedAt?: string;
  createdAt: string;
};

export type BlogDetail = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string | null;
  likeCount: number;
  liked: boolean;
  published: boolean;
  techStacks: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogRequest = {
  title: string;
  content: string;
  thumbnailUrl: string | null;
  published: boolean;
  techStacks: string[];
  publishedAt?: string;
};

export const fetchAdminBlogs = async (page: number, size = 20): Promise<PageResponse<BlogSummary>> => {
  const { data } = await adminApi.get<PageResponse<BlogSummary>>('/api/admin/blogs', {
    params: { page, size, sort: 'publishedAt,desc' },
  });
  return data;
};

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

export const deleteBlog = async (id: number): Promise<void> => {
  await adminApi.post(`/api/blogs/${id}/delete`);
};
