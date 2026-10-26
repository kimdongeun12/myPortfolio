import type { ReactNode } from 'react';

import profile from '@/data/profile';

/** 블로그 왼쪽 사이드바 (목록·상세 공통 틀: 이름 + 직무 + 안쪽 내용) */
export default function BlogSidebar({ children }: { children: ReactNode }) {
  return (
    <aside className='blog-sidebar'>
      <div className='sidebar-profile'>
        <p className='profile-name'>{profile.name}</p>
        <p className='profile-role'>Front-end Developer</p>
      </div>
      {children}
    </aside>
  );
}
