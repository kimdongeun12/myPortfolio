import { requestApi } from '@/lib/api';
import type { CommentDto, CommentPageResponse } from '@/lib/api-types';
import { toIsoString } from '@/lib/format';

import type { CommentData, CommentInput, CommentTarget } from './types';

const DELETED_NICKNAME = '알 수 없음';

const toComment = (dto: CommentDto): CommentData => ({
  id: String(dto.id),
  nickname: dto.nickname ?? DELETED_NICKNAME,
  content: dto.content,
  createdAt: toIsoString(dto.createdAt),
  admin: dto.admin,
  deleted: dto.deleted,
  edited: dto.edited,
  replies: (dto.replies ?? []).map(toComment),
});

export async function fetchComments(target: CommentTarget): Promise<CommentData[]> {
  const list = await requestApi<CommentDto[]>(`/api/comments?targetType=${target.type}&targetId=${target.id}`);
  return list.map(toComment).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export type CommentPage = {
  items: CommentData[];
  page: number;
  last: boolean;
  totalCount: number;
  todayCount: number;
};

export async function fetchCommentPage(target: CommentTarget, page: number, size: number): Promise<CommentPage> {
  const result = await requestApi<CommentPageResponse>(
    `/api/comments/page?targetType=${target.type}&targetId=${target.id}&page=${page}&size=${size}`,
  );
  return {
    items: result.content.map(toComment),
    page: result.page,
    last: result.last,
    totalCount: result.totalCount,
    todayCount: result.todayCount,
  };
}

export async function createComment(target: CommentTarget, input: CommentInput, parentId?: string): Promise<void> {
  await requestApi<number>('/api/comments', {
    body: {
      targetType: target.type,
      targetId: target.id,
      parentId: parentId ? Number(parentId) : null,
      nickname: input.nickname,
      password: input.password,
      content: input.content,
    },
  });
}

export async function updateComment(id: string, password: string, content: string): Promise<void> {
  await requestApi(`/api/comments/${id}`, { method: 'PUT', body: { password, content } });
}

export async function deleteComment(id: string, password: string): Promise<void> {
  await requestApi(`/api/comments/${id}/delete`, { body: { password } });
}
