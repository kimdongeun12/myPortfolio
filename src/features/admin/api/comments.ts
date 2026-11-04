import { adminApi } from './client';
import type { PageResponse } from './types';

export type CommentTargetType = 'BLOG' | 'PROJECT' | 'GUEST';

export const GUEST_TARGET_ID = 1;

export type AdminComment = {
  id: number;
  parentId: number | null;
  nickname: string | null;
  content: string;
  likeCount: number;
  admin: boolean;
  deleted: boolean;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
  replies: AdminComment[];
};

export type CommentTarget = { id: number; title: string };

export const fetchComments = async (targetType: CommentTargetType, targetId: number): Promise<AdminComment[]> => {
  const { data } = await adminApi.get<AdminComment[]>('/api/comments', { params: { targetType, targetId } });
  return data;
};

export const createAdminComment = async (body: {
  targetType?: CommentTargetType;
  targetId?: number;
  parentId?: number;
  content: string;
}): Promise<number> => {
  const { data } = await adminApi.post<number>('/api/admin/comments', body);
  return data;
};

export const updateAdminComment = async (id: number, content: string): Promise<AdminComment> => {
  const { data } = await adminApi.put<AdminComment>(`/api/admin/comments/${id}`, { content });
  return data;
};

export const deleteCommentByAdmin = async (id: number): Promise<void> => {
  await adminApi.post(`/api/admin/comments/${id}/delete`);
};

export const fetchCommentTargets = async (targetType: CommentTargetType): Promise<CommentTarget[]> => {
  if (targetType === 'GUEST') {
    return [{ id: GUEST_TARGET_ID, title: '방명록' }];
  }
  if (targetType === 'BLOG') {
    const { data } = await adminApi.get<PageResponse<{ id: number; title: string; published: boolean }>>('/api/admin/blogs', {
      params: { page: 0, size: 100, sort: 'createdAt,desc' },
    });
    return data.content.filter((blog) => blog.published).map(({ id, title }) => ({ id, title }));
  }
  const { data } = await adminApi.get<{ id: number; title: string }[]>('/api/projects');
  return data.map(({ id, title }) => ({ id, title }));
};
