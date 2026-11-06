import '@/styles/guest.scss';

import { AmbientCollectionBackground } from '@/components/backgrounds';

import GuestBoard from '@/features/guest/components/GuestBoard';

export default function Guest() {
  return (
    <div className='contents-wrap guest-page'>
      <AmbientCollectionBackground variant='guestbook' />
      <div className='content guest-layout'>
        <div className='guest-intro'>
          <h2 className='guest-title'>잠시 들러 한마디, 남겨주세요.</h2>
          <p className='guest-desc'>
            궁금한 점이나 가벼운 인사도 좋아요.<br />
            남겨주신 이야기는 소중히 읽겠습니다.
          </p>
        </div>

        <GuestBoard />
      </div>
    </div>
  );
}
