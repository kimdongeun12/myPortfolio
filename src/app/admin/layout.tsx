import type { ReactNode } from 'react';

import '@/styles/admin.scss';

import AdminProviders from '@/features/admin/components/AdminProviders';

export const metadata = {
  title: '어드민',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
