'use client';

import { Alert, Table } from 'antd';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/client';
import { fetchVisitTrend } from '../api/common';
import type { VisitPeriod, VisitUnit } from '../api/types';

export const formatDuration = (ms: number | null | undefined) => {
  if (ms === null || ms === undefined) return '-';
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
};

type VisitTrendTableProps = {
  periods: VisitPeriod[];
  unit: VisitUnit;
  loading?: boolean;
  pageSize?: number;
};

export function VisitTrendTable({ periods, unit, loading, pageSize = 10 }: VisitTrendTableProps) {
  return (
    <Table<VisitPeriod>
      rowKey='period'
      size='small'
      loading={loading}
      dataSource={[...periods].reverse()}
      pagination={{ pageSize, hideOnSinglePage: true, showSizeChanger: false }}
      columns={[
        { title: unit === 'month' ? '월' : '날짜', dataIndex: 'period' },
        { title: '페이지뷰', dataIndex: 'pageViews', align: 'right', width: 100 },
        { title: '방문자', dataIndex: 'visitors', align: 'right', width: 100 },
        {
          title: '평균 체류 시간',
          dataIndex: 'avgDurationMs',
          align: 'right',
          width: 140,
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
  return <VisitTrendTable periods={periods} unit={unit} loading={loading} pageSize={unit === 'month' ? 12 : 7} />;
}
