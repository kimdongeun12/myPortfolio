'use client';

import { Space, Typography } from 'antd';
import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  /** 오른쪽 버튼 영역 */
  extra?: ReactNode;
};

/** 어드민 페이지 상단 제목 + 버튼 */
export default function AdminPageHeader({ title, description, extra }: AdminPageHeaderProps) {
  return (
    <div className='admin-page-header'>
      <div>
        <Typography.Title level={3} className='admin-page-title'>
          {title}
        </Typography.Title>
        {description && <Typography.Text type='secondary'>{description}</Typography.Text>}
      </div>
      {extra && <Space wrap>{extra}</Space>}
    </div>
  );
}
