import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@/styles/reset.scss';
import '@/styles/default.scss';
// Import Swiper styles
import 'swiper/css';

import Header from '@/components/layout/Header';
import SmoothScroll from '@/components/layout/SmoothScroll';
import VisitTracker from '@/components/layout/VisitTracker';
import Wrap from '@/components/layout/Wrap';
import { pageMetadata } from '@/lib/page-metadata';
import { SITE_URL } from '@/lib/site-url';
import { UiStoreProvider } from '@/providers/ui-store-provider';

export const metadata: Metadata = {
  ...pageMetadata({ path: '/' }),
  metadataBase: new URL(SITE_URL),
  title: {
    template: '김동은 | %s',
    default: '김동은 | 이력서',
  },
  robots: { index: false, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SmoothScroll />
        <VisitTracker />
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
