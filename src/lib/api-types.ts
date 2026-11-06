export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ExperienceDto = {
  id: number;
  companyName: string;
  formerName: string | null;
  department: string | null;
  jobTitle: string | null;
  role: string | null;
  position: string | null;
  responsibilities: string | null;
  achievements: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
};

export type SkillGroupDto = {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
  techStacks: string[];
};

export type ProjectDto = {
  id: number;
  experienceId: number | null;
  companyName: string | null;
  formerName: string | null;
  title: string;
  summary: string | null;
  role: string | null;
  responsibilities: string | null;
  content: string | null;
  type: 'COMPANY' | 'PERSONAL' | 'SIDE';
  thumbnailUrl: string | null;
  pinned: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  techStacks: string[];
};

export type BlogSummaryDto = {
  id: number;
  title: string;
  excerpt: string;
  thumbnailUrl: string | null;
  likeCount: number;
  techStacks: string[];
  createdAt: string;
  commentCount: number;
};

export type BlogDetailDto = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string | null;
  likeCount: number;
  techStacks: string[];
  createdAt: string;
  updatedAt: string;
};

export type CommentTargetType = 'BLOG' | 'PROJECT' | 'GUEST';

export type CommentDto = {
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
  replies: CommentDto[];
};
