// ------------------------------------------------------------
// 블로그 데이터 (목록 /blog, 상세 /blog/[id]) - 시안용 임시 데이터
// ------------------------------------------------------------
import type { CommentData } from '@/components/common/comment';
import { SKILL_ICONS } from '@/data/skills';

import type { BlogPost, BlogSection } from './types';

const SUMMARY =
  '각 프로젝트 설명은 3줄정도를 기입하려고 노력 합시다.각 프로젝트 설명은 3줄정도를 기입하려고 노력 합시다.각 프로젝각 프로젝트 설명은 3줄정도를 기입하려고 노력 합시다.각 프로젝트 설명은 3줄정도를 기입하려고 노력 합시다.각 프로젝각 프로젝트 설명은 3줄정도를 기입하려고 노력 합시다.';

const sections: BlogSection[] = Array.from({ length: 7 }, (_, i) => ({
  id: `section-${i + 1}`,
  heading: `${String(i + 1).padStart(2, '0')}. 이번 목차 입니다.`,
  paragraphs: [SUMMARY, SUMMARY],
}));

const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

const comments: CommentData[] = [
  {
    id: 'c1',
    nickname: '닉네임',
    content: '저에게는 큰 응원이 됩니다.\n언제든 편하게 남겨주세요 :)',
    createdAt: daysAgo(70),
    replies: [
      { id: 'c1-1', nickname: '닉네임', content: '저에게는 큰 응원이 됩니다.\n언제든 편하게 남겨주세요 :)', createdAt: daysAgo(65) },
      { id: 'c1-2', nickname: '닉네임', content: '저에게는 큰 응원이 됩니다.\n언제든 편하게 남겨주세요 :)', createdAt: daysAgo(64) },
    ],
  },
  { id: 'c2', nickname: '닉네임', content: '저에게는 큰 응원이 됩니다.\n언제든 편하게 남겨주세요 :)', createdAt: daysAgo(62) },
];

const TAG_SETS = [
  ['Vue', 'Javascript', 'TypeScript', 'Scss', 'Vuetify', 'Vite', 'Bitbucket', 'Git', 'Figma', 'Webpack'],
  ['React', 'Next', 'TypeScript', 'Scss'],
  ['Vue', 'Vuetify', 'Vite'],
];

export const BLOG_POSTS: BlogPost[] = Array.from({ length: 12 }, (_, i) => ({
  id: `post-${i + 1}`,
  title: i === 1 ? 'vue2 + vite + vuetify2 노트' : '프로젝트명',
  category: 'Vue',
  summary: SUMMARY,
  date: '2026.09.17',
  views: 3,
  likes: 0,
  tags: TAG_SETS[i % TAG_SETS.length],
  sections,
  comments,
}));

/** 필터 태그 목록: 전체 + 기술 스택 (아이콘 목록과 같은 순서) */
export const ALL_TAG = '전체';
export const BLOG_TAGS = [ALL_TAG, ...Object.keys(SKILL_ICONS)];

export const countComments = (list: CommentData[]): number =>
  list.reduce((sum, c) => sum + 1 + countComments(c.replies ?? []), 0);

export const BLOG_STATS = {
  posts: BLOG_POSTS.length,
  views: BLOG_POSTS.reduce((sum, p) => sum + p.views, 0),
  likes: BLOG_POSTS.reduce((sum, p) => sum + p.likes, 0),
};

export const getBlogPost = (id: string) => BLOG_POSTS.find((post) => post.id === id);

/** 이전글 / 다음글 (목록 순서 기준) */
export const getAdjacentPosts = (id: string) => {
  const index = BLOG_POSTS.findIndex((post) => post.id === id);
  return {
    prev: index > 0 ? BLOG_POSTS[index - 1] : undefined,
    next: index >= 0 && index < BLOG_POSTS.length - 1 ? BLOG_POSTS[index + 1] : undefined,
  };
};
