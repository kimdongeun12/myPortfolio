import type { ReactNode } from 'react';

import AdminShell from '@/features/admin/components/AdminShell';

/**
 * 로그인이 필요한 어드민 페이지 묶음
 * AdminShell 이 로그인 여부를 확인하고, 안 되어 있으면 /admin/login 으로 보냅니다.
 */
export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
