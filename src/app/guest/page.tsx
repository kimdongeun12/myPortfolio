import Guest from '@/features/guest/components/Guest';

export const generateMetadata = () => {
  return {
    title: '방명록',
    customMeta: {
      pageTitle: 'Guest',
    },
  };
};

export default function GuestPage() {
  return <Guest />;
}
