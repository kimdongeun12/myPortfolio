// 방명록 시안용 임시 데이터 (나중에 서버에서 불러오도록 교체)
import type { CommentData } from '@/components/common/comment';

const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
const MESSAGE = '저에게는 큰 응원이 됩니다.\n언제든 편하게 남겨주세요 :)';

export const GUEST_MESSAGES: CommentData[] = [
  { id: 'g-today-1', nickname: '닉네임', content: MESSAGE, createdAt: daysAgo(0.05) },
  { id: 'g-today-2', nickname: '닉네임', content: MESSAGE, createdAt: daysAgo(0.2) },
  {
    id: 'g1',
    nickname: '닉네임',
    content: MESSAGE,
    createdAt: daysAgo(70),
    replies: [
      { id: 'g1-1', nickname: '닉네임', content: MESSAGE, createdAt: daysAgo(66) },
      { id: 'g1-2', nickname: '닉네임', content: MESSAGE, createdAt: daysAgo(65) },
    ],
  },
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `g${i + 2}`,
    nickname: '닉네임',
    content: MESSAGE,
    createdAt: daysAgo(60 + i * 3),
  })),
];
