import { Suspense } from 'react';

import AdminLogin from '@/features/admin/components/AdminLogin';

export const metadata = { title: '어드민 로그인' };

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLogin />
    </Suspense>
  );
}
