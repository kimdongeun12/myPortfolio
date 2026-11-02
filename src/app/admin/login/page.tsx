import { Suspense } from 'react';

import AdminLogin from '@/features/admin/components/AdminLogin';

export const metadata = { title: '어드민 로그인' };

export default function AdminLoginPage() {
  // useSearchParams 를 쓰는 컴포넌트는 Suspense 로 감싸야 빌드됩니다 (Next 14)
  return (
    <Suspense>
      <AdminLogin />
    </Suspense>
  );
}
