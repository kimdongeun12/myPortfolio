import type { ReactNode } from 'react';

import '@/styles/reset.scss';
import '@/styles/default.scss';
// Import Swiper styles
import 'swiper/css';

import Header from '@/components/layout/Header';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Wrap from '@/components/layout/Wrap';
import { UiStoreProvider } from '@/providers/ui-store-provider';

export const metadata = {
  title: {
    template: '김동은 | %s',
    default: '김동은 | 이력서',
  },
  description: '김동은 이력서',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SmoothScroll />
        <UiStoreProvider>
          <Wrap>
            <Header />
            {children}
          </Wrap>
        </UiStoreProvider>
      </body>
    </html>
  );
}
