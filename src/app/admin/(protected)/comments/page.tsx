import { Suspense } from 'react';

import CommentAdmin from '@/features/admin/components/comment/CommentAdmin';

export const metadata = { title: '댓글 관리' };

export default function AdminCommentsPage() {
  // useSearchParams 를 쓰는 컴포넌트는 Suspense 로 감싸야 빌드됩니다 (Next 14)
  return (
    <Suspense>
      <CommentAdmin />
    </Suspense>
  );
}
