export type PageResponse<T> = {
  content: T[];
  page: number;
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
  url: string;
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
