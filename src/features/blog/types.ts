import type { CommentData } from '@/components/common/comment';

export type BlogSection = {
  id: string;        // 목차 이동용 앵커 id
  heading: string;   // 목차·본문 제목
  paragraphs: string[];
};

export type BlogPost = {
  id: string;        // URL에 쓰이는 값 (/blog/[id])
  title: string;
  category: string;
  summary: string;
  date: string;      // 표시용 (2026.09.17)
  views: number;
  likes: number;
  tags: string[];
  sections: BlogSection[];
  comments: CommentData[];
};
