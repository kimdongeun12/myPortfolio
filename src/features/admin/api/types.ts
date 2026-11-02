/** 어드민 API 공통 타입 (백엔드 DTO 와 이름을 맞춤) */

/** 페이징 응답 (PageResponseDto) */
export type PageResponse<T> = {
  content: T[];
  page: number; // 0부터 시작
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type TechStack = {
  id: number;
  name: string;
};

export type ImageTargetType = 'PROJECT' | 'BLOG';

export type UploadedImage = {
  id: number;
  targetType: ImageTargetType;
  targetId: number;
  url: string; // /uploads/2026/11/xxx.png
  originalName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
};

export type VisitStats = {
  from: string;
  to: string;
  totalPageViews: number;
  totalVisitors: number;
  todayPageViews: number;
  todayVisitors: number;
  daily: { date: string; pageViews: number; visitors: number }[];
};
