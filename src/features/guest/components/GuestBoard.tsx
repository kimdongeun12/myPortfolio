'use client';

// renderHeader 같은 함수 prop은 서버 컴포넌트에서 클라이언트 컴포넌트로 넘길 수 없어서
// 방명록 설정을 클라이언트 컴포넌트 안에서 조립
import { CommentSection, type CommentData } from '@/components/common/comment';

export default function GuestBoard({ initialMessages }: { initialMessages: CommentData[] }) {
  return (
    <CommentSection
      className='guest-board'
      title='방명록'
      initialComments={initialMessages}
      requirePassword={false}
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
