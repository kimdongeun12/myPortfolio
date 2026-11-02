import type { ReactNode } from 'react';

import '@/styles/reset.scss';

export const metadata = {
  title: {
    template: '김동은 | %s',
    default: '김동은 | 어드민',
  },
  description: '포트폴리오 어드민',
  // 검색엔진에 노출되지 않게
  robots: { index: false, follow: false },
};

/** 최상위 레이아웃 (어드민 전용 배포) — 화면 구성은 app/admin/layout.tsx */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
