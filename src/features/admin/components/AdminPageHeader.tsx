'use client';

import { Space, Typography } from 'antd';
import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  extra?: ReactNode;
};

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
