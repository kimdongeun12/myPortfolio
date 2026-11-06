import Profile from '@/features/profile/components/Profile';
import { getProfileData } from '@/features/profile/api';
import Visual from '@/features/visual/components/Visual';

export const revalidate = 60;

export default async function ProfilePage() {
  const data = await getProfileData();
  return (
    <>
      <Visual />
      <Profile {...data} />
    </>
  );
}
