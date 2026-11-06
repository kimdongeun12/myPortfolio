'use client';

import { CommentSection } from '@/components/common/comment';

const GUEST_TARGET = { type: 'GUEST', id: 1 } as const;

export default function GuestBoard() {
  return (
    <CommentSection
      className='guest-board'
      title='방명록'
      target={GUEST_TARGET}
      contentLabel='메세지'
      contentMinLength={2}
      placeholder='2자 이상 작성해주세요'
      headerPosition='below-form'
      renderHeader={({ today, total }) => (
        <>
          오늘 작성된 한마디 <em>{today}</em>
          <span className='divider' aria-hidden='true'>|</span>
          전체 <em>{total}</em>
        </>
      )}
    />
  );
}
