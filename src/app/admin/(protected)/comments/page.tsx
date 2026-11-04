import { Suspense } from 'react';

import CommentAdmin from '@/features/admin/components/comment/CommentAdmin';

export const metadata = { title: '댓글 관리' };

export default function AdminCommentsPage() {
  return (
    <Suspense>
      <CommentAdmin />
    </Suspense>
  );
}
