import { adminApi } from './client';
import type { PageResponse } from './types';

export type CommentTargetType = 'BLOG' | 'PROJECT';

/** 댓글 (CommentResponseDto) — 최상위 댓글 안에 답글 목록 포함 */
export type AdminComment = {
  id: number;
  parentId: number | null;
  nickname: string | null; // 삭제된 댓글은 null
  content: string;
  likeCount: number;
  admin: boolean; // 관리자(작성자) 댓글
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies: AdminComment[];
};

/** 댓글 대상 선택 목록 */
export type CommentTarget = { id: number; title: string };

export const fetchComments = async (targetType: CommentTargetType, targetId: number): Promise<AdminComment[]> => {
  const { data } = await adminApi.get<AdminComment[]>('/api/comments', { params: { targetType, targetId } });
  return data;
};

/** 관리자 댓글 작성 — parentId 가 있으면 답글 */
export const createAdminComment = async (body: {
  targetType?: CommentTargetType;
  targetId?: number;
  parentId?: number;
  content: string;
}): Promise<number> => {
  const { data } = await adminApi.post<number>('/api/admin/comments', body);
  return data;
};

/** 관리자 댓글 수정 (관리자가 쓴 댓글만) */
export const updateAdminComment = async (id: number, content: string): Promise<AdminComment> => {
  const { data } = await adminApi.put<AdminComment>(`/api/admin/comments/${id}`, { content });
  return data;
};

/** 아무 댓글이나 숨김 처리 */
export const deleteCommentByAdmin = async (id: number): Promise<void> => {
  await adminApi.post(`/api/admin/comments/${id}/delete`);
};

/**
 * 댓글을 달 수 있는 대상 목록
 * - 블로그: 공개 글만 (임시저장 글에는 댓글 불가)
 * - 프로젝트: 전체
 */
export const fetchCommentTargets = async (targetType: CommentTargetType): Promise<CommentTarget[]> => {
  if (targetType === 'BLOG') {
    const { data } = await adminApi.get<PageResponse<{ id: number; title: string; published: boolean }>>('/api/admin/blogs', {
      params: { page: 0, size: 100, sort: 'createdAt,desc' },
    });
    return data.content.filter((blog) => blog.published).map(({ id, title }) => ({ id, title }));
  }
  const { data } = await adminApi.get<{ id: number; title: string }[]>('/api/projects');
  return data.map(({ id, title }) => ({ id, title }));
};
