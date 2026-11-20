'use client';

import { Alert, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/client';
import { fetchVisitTrend } from '../api/common';
import type { VisitPeriod, VisitUnit } from '../api/types';

export const formatDuration = (ms: number | null | undefined) => {
  if (ms === null || ms === undefined) return '-';
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
};

const PERIOD_TITLES: Record<VisitUnit, string> = { hour: '시간', day: '날짜', month: '월' };

export const formatPeriod = (period: string, unit: VisitUnit) => {
  if (unit === 'hour') return dayjs(period).format('MM.DD (dd) HH시');
  if (unit === 'day') return dayjs(period).format('YYYY.MM.DD (dd)');
  return dayjs(`${period}-01`).format('YYYY.MM');
};

type VisitTrendTableProps = {
  periods: VisitPeriod[];
  unit: VisitUnit;
  loading?: boolean;
  pageSize?: number;
  hideEmpty?: boolean;
};

export function VisitTrendTable({ periods, unit, loading, pageSize = 10, hideEmpty }: VisitTrendTableProps) {
  const rows = [...periods].reverse().filter((row) => !hideEmpty || row.pageViews > 0);
  const max = Math.max(1, ...rows.map((row) => row.pageViews));

  return (
    <Table<VisitPeriod>
      rowKey='period'
      size='small'
      loading={loading}
      dataSource={rows}
      pagination={{ pageSize, hideOnSinglePage: true, showSizeChanger: false }}
      scroll={{ x: 560 }}
      columns={[
        {
          title: PERIOD_TITLES[unit],
          dataIndex: 'period',
          width: 160,
          render: (value: string) => formatPeriod(value, unit),
        },
        {
          title: '페이지뷰',
          dataIndex: 'pageViews',
          render: (value: number) => (
            <div className='visit-bar'>
              <span className='visit-bar-fill' style={{ width: `${(value / max) * 100}%` }} />
              <span className='visit-bar-value'>{value}</span>
            </div>
          ),
        },
        { title: '방문자', dataIndex: 'visitors', align: 'right', width: 90 },
        {
          title: '평균 체류',
          dataIndex: 'avgDurationMs',
          align: 'right',
          width: 120,
          render: (value: number | null, row) => (
            <span title={`체류 시간 측정 ${row.measured}건`}>{formatDuration(value)}</span>
          ),
        },
      ]}
    />
  );
}

type PageTrendProps = {
  path: string;
  unit: VisitUnit;
  from: string;
  to: string;
};

export function PageTrend({ path, unit, from, to }: PageTrendProps) {
  const [periods, setPeriods] = useState<VisitPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchVisitTrend({ from, to, unit, path })
      .then((trend) => {
        if (ignore) return;
        setPeriods(trend.periods);
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
  }, [path, unit, from, to]);

  if (error) return <Alert type='error' title={error} showIcon />;
  return <VisitTrendTable periods={periods} unit={unit} loading={loading} pageSize={10} hideEmpty />;
}
