'use client';

import { Result } from 'antd';

import AdminPageHeader from './AdminPageHeader';

/** 아직 기능 브랜치가 합쳐지지 않은 메뉴의 임시 화면 */
export default function AdminComingSoon({ title }: { title: string }) {
  return (
    <>
      <AdminPageHeader title={title} />
      <Result status='info' title='준비 중인 화면입니다' subTitle='해당 기능 브랜치를 합치면 이 화면이 교체됩니다.' />
    </>
  );
}
