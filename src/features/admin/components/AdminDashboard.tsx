'use client';

import { Alert, Card, Col, DatePicker, Row, Statistic, Table, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/client';
import { fetchVisitPageStats, fetchVisitStats } from '../api/common';
import type { VisitPageStat, VisitPageStats, VisitStats } from '../api/types';

import AdminPageHeader from './AdminPageHeader';

const DATE_FORMAT = 'YYYY-MM-DD';

const formatDuration = (ms: number | null | undefined) => {
  if (ms === null || ms === undefined) return '-';
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
};

export default function AdminDashboard() {
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => [dayjs().subtract(29, 'day'), dayjs()]);
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [pageStats, setPageStats] = useState<VisitPageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = { from: range[0].format(DATE_FORMAT), to: range[1].format(DATE_FORMAT) };
    let ignore = false;
    Promise.all([fetchVisitStats(params), fetchVisitPageStats(params)])
      .then(([visit, pages]) => {
        if (ignore) return;
        setStats(visit);
        setPageStats(pages);
        setError('');
      })
      .catch((e) => {
        if (!ignore) setError(getErrorMessage(e));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [range]);

  const changeRange = (values: [Dayjs | null, Dayjs | null] | null) => {
    if (!values || !values[0] || !values[1]) return;
    setLoading(true);
    setRange([values[0], values[1]]);
  };

  const daily = stats ? [...stats.daily].reverse() : [];
  const periodLabel = `${range[0].format('MM.DD')} ~ ${range[1].format('MM.DD')}`;

  return (
    <>
      <AdminPageHeader
        title='대시보드'
        description='방문 통계 (봇·새로고침 중복 제외, 체류 시간은 화면이 보이는 동안만 측정)'
        extra={
          <DatePicker.RangePicker
            value={range}
            onChange={changeRange}
            allowClear={false}
            disabledDate={(date) => date.isAfter(dayjs(), 'day')}
          />
        }
      />

      {error && <Alert type='error' title={error} showIcon className='admin-block' />}

      <Row gutter={[16, 16]} className='admin-block'>
        <Col flex='1 1 180px'>
          <Card>
            <Statistic title='오늘 페이지뷰' value={stats?.todayPageViews ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col flex='1 1 180px'>
          <Card>
            <Statistic title='오늘 방문자' value={stats?.todayVisitors ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col flex='1 1 180px'>
          <Card>
            <Statistic title={`페이지뷰 (${periodLabel})`} value={stats?.totalPageViews ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col flex='1 1 180px'>
          <Card>
            <Statistic title={`방문자 (${periodLabel})`} value={stats?.totalVisitors ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col flex='1 1 180px'>
          <Card>
            <Statistic
              title={`평균 체류 시간 (${periodLabel})`}
              value={formatDuration(pageStats?.avgDurationMs)}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card title='페이지별 조회수' className='admin-block'>
        <Table<VisitPageStat>
          rowKey='path'
          size='small'
          loading={loading}
          dataSource={pageStats?.pages ?? []}
          pagination={{ pageSize: 15, hideOnSinglePage: true }}
          scroll={{ x: 640 }}
          columns={[
            {
              title: '페이지',
              dataIndex: 'label',
              render: (label: string, row) => (
                <>
                  <div>{label}</div>
                  <Typography.Text type='secondary' style={{ fontSize: 12 }}>
                    {row.path}
                  </Typography.Text>
                </>
              ),
            },
            {
              title: '조회수',
              dataIndex: 'pageViews',
              align: 'right',
              width: 100,
              sorter: (a, b) => a.pageViews - b.pageViews,
              defaultSortOrder: 'descend',
            },
            {
              title: '방문자',
              dataIndex: 'visitors',
              align: 'right',
              width: 100,
              sorter: (a, b) => a.visitors - b.visitors,
            },
            {
              title: '평균 체류 시간',
              dataIndex: 'avgDurationMs',
              align: 'right',
              width: 140,
              sorter: (a, b) => (a.avgDurationMs ?? -1) - (b.avgDurationMs ?? -1),
              render: (value: number | null, row) => (
                <span title={`체류 시간 측정 ${row.measured}건`}>{formatDuration(value)}</span>
              ),
            },
          ]}
        />
      </Card>

      <Card title='일별 방문'>
        <Table
          rowKey='date'
          size='small'
          loading={loading}
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
