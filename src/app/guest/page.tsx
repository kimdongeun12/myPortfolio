import Guest from '@/features/guest/components/Guest';
import { pageMetadata } from '@/lib/page-metadata';

export const generateMetadata = () => {
  return {
    ...pageMetadata({ title: '방명록', description: '프론트엔드 개발자 김동은의 방명록', path: '/guest' }),
    customMeta: {
      pageTitle: 'Guest',
    },
  };
};

export default function GuestPage() {
  return <Guest />;
}
