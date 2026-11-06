import type { CommentTargetType } from '@/lib/api-types';

export type CommentData = {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
  admin?: boolean;
  deleted?: boolean;
  edited?: boolean;
  replies?: CommentData[];
};

export type CommentInput = {
  nickname: string;
  password: string;
  content: string;
};

export type CommentTarget = {
  type: CommentTargetType;
  id: number;
};
