import type { ReactNode } from 'react';

// Import Swiper styles
import 'swiper/css';

import Header from '@/components/layout/Header';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Wrap from '@/components/layout/Wrap';
import { UiStoreProvider } from '@/providers/ui-store-provider';

/**
 * 공개 페이지 레이아웃 (프로필, 포트폴리오, 블로그, 방명록)
 * (site) 는 URL 에 포함되지 않는 라우트 그룹이라 주소는 그대로입니다.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <UiStoreProvider>
        <Wrap>
          <Header />
          {children}
        </Wrap>
      </UiStoreProvider>
    </>
  );
}
