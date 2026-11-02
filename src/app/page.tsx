import { redirect } from 'next/navigation';

/** 어드민 전용 배포라 첫 화면은 /admin 으로 이동 */
export default function RootPage() {
  redirect('/admin');
}
