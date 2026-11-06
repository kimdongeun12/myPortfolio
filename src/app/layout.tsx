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
import { SITE_URL } from '@/lib/site-url';
import { UiStoreProvider } from '@/providers/ui-store-provider';

const SITE_TITLE = '김동은 | 이력서';
const SITE_DESCRIPTION = '프론트엔드 개발자 김동은의 이력서와 포트폴리오';
const OG_IMAGE = { url: '/og_image.jpg', width: 2400, height: 1260, alt: SITE_TITLE };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '김동은 | %s',
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: '김동은 포트폴리오',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
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
