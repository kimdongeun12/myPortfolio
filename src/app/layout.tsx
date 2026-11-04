import type { ReactNode } from 'react';

import '@/styles/reset.scss';

export const metadata = {
  title: {
    template: '김동은 | %s',
    default: '김동은 | 어드민',
  },
  description: '포트폴리오 어드민',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
