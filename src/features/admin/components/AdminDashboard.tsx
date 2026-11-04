'use client';

import { Alert, Card, Col, Row, Statistic, Table } from 'antd';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/client';
import { fetchVisitStats } from '../api/common';
import type { VisitStats } from '../api/types';

import AdminPageHeader from './AdminPageHeader';

export default function AdminDashboard() {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVisitStats()
      .then(setStats)
      .catch((e) => setError(getErrorMessage(e)));
  }, []);

  const daily = stats ? [...stats.daily].reverse() : [];

  return (
    <>
      <AdminPageHeader title='대시보드' description='최근 30일 방문 통계 (봇·새로고침 중복 제외)' />

      {error && <Alert type='error' message={error} showIcon className='admin-block' />}

      <Row gutter={[16, 16]} className='admin-block'>
        <Col xs={12} lg={6}>
          <Card>
            <Statistic title='오늘 페이지뷰' value={stats?.todayPageViews ?? 0} loading={!stats && !error} />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card>
            <Statistic title='오늘 방문자' value={stats?.todayVisitors ?? 0} loading={!stats && !error} />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card>
            <Statistic title='30일 페이지뷰' value={stats?.totalPageViews ?? 0} loading={!stats && !error} />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card>
            <Statistic title='30일 방문자' value={stats?.totalVisitors ?? 0} loading={!stats && !error} />
          </Card>
        </Col>
      </Row>

      <Card title='일별 방문'>
        <Table
          rowKey='date'
          size='small'
          loading={!stats && !error}
          dataSource={daily}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          columns={[
            { title: '날짜', dataIndex: 'date' },
            { title: '페이지뷰', dataIndex: 'pageViews', align: 'right' },
            { title: '방문자', dataIndex: 'visitors', align: 'right' },
          ]}
        />
      </Card>
    </>
  );
}
