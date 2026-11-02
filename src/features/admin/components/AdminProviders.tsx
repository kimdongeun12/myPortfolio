'use client';

import { App, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { ReactNode } from 'react';

dayjs.locale('ko');

/**
 * 어드민 공통 Provider
 * - ConfigProvider: antd 한국어·테마
 * - App: message / modal 을 App.useApp() 으로 쓰기 위함
 */
export default function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        token: {
          colorPrimary: '#4356FF',
          fontFamily: '"NotoSansKR", sans-serif',
          borderRadius: 8,
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
