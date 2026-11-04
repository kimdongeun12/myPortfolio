import type { ReactNode } from 'react';

import AdminShell from '@/features/admin/components/AdminShell';

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
