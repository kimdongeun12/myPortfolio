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

export type VisitUnit = 'day' | 'month';

export type VisitPeriod = {
  period: string;
  pageViews: number;
  visitors: number;
  avgDurationMs: number | null;
  measured: number;
};

export type VisitTrend = {
  from: string;
  to: string;
  unit: VisitUnit;
  path: string | null;
  periods: VisitPeriod[];
};

export type VisitPageStat = {
  path: string;
  label: string;
  pageViews: number;
  visitors: number;
  avgDurationMs: number | null;
  measured: number;
};

export type VisitPageStats = {
  from: string;
  to: string;
  avgDurationMs: number | null;
  pages: VisitPageStat[];
};
