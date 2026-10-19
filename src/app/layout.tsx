import React from 'react';


import '/public/styles/reset.scss';
import '/public/styles/default.scss';
// Import Swiper styles
import 'swiper/css';

import Link from 'next/link';
import { UiStoreProvider, useUiStoreApi } from '@/providers/ui-store-provider';

export const metadata = {
  title: {
    template: '김동은 | %s',
    default: '김동은 | 이력서',
  },
  description: '김동은 이력서',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const uiStore = useUiStoreApi();
  console.log(uiStore.getState().isWindowOpen)
  return (
    <html lang="en">
      <body>
            <div id="wrap">
              <div className="header-wrap kodchasan">
                <div className='header-inner'>
                  <Link href="/">Profile</Link>
                  <Link href="/blog">Blog</Link>
                  <Link href="/portfolio">Portfolio</Link>
                </div>
              </div>
              <UiStoreProvider>
               {children}
              </UiStoreProvider>
            </div>
      </body>
    </html>
  );
}