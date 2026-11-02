import type { ReactNode } from 'react';

import '@/styles/reset.scss';
import '@/styles/default.scss';

export const metadata = {
  title: {
    template: '김동은 | %s',
    default: '김동은 | 이력서',
  },
  description: '김동은 이력서',
};

/**
 * 최상위 레이아웃 (html/body + 공통 스타일만)
 * - 공개 페이지 레이아웃: app/(site)/layout.tsx (헤더, 스크롤 효과)
 * - 어드민 레이아웃: app/admin/layout.tsx
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
