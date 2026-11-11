'use client';

import { Alert, Card, Col, DatePicker, Row, Segmented, Space, Statistic, Table, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/client';
import { fetchVisitPageStats, fetchVisitStats, fetchVisitTrend } from '../api/common';
import type { VisitPageStat, VisitPageStats, VisitPeriod, VisitStats, VisitUnit } from '../api/types';

import AdminPageHeader from './AdminPageHeader';
import { PageTrend, VisitTrendTable, formatDuration } from './VisitTrendTable';

const DATE_FORMAT = 'YYYY-MM-DD';
const MAX_MONTHS = 12;

const defaultRange = (unit: VisitUnit): [Dayjs, Dayjs] =>
  unit === 'month'
    ? [dayjs().subtract(MAX_MONTHS - 1, 'month').startOf('month'), dayjs()]
    : [dayjs().subtract(29, 'day'), dayjs()];

const toParams = (unit: VisitUnit, range: [Dayjs, Dayjs]) => {
  if (unit === 'day') return { from: range[0].format(DATE_FORMAT), to: range[1].format(DATE_FORMAT) };
  const end = range[1].endOf('month');
  return {
    from: range[0].startOf('month').format(DATE_FORMAT),
    to: (end.isAfter(dayjs(), 'day') ? dayjs() : end).format(DATE_FORMAT),
  };
};

export default function AdminDashboard() {
  const [unit, setUnit] = useState<VisitUnit>('day');
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => defaultRange('day'));
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [pageStats, setPageStats] = useState<VisitPageStats | null>(null);
  const [periods, setPeriods] = useState<VisitPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const params = toParams(unit, range);

  useEffect(() => {
    const query = toParams(unit, range);
    let ignore = false;
    Promise.all([fetchVisitStats(query), fetchVisitPageStats(query), fetchVisitTrend({ ...query, unit })])
      .then(([visit, pages, trend]) => {
        if (ignore) return;
        setStats(visit);
        setPageStats(pages);
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
  }, [unit, range]);

  const changeUnit = (next: VisitUnit) => {
    setLoading(true);
    setUnit(next);
    setRange(defaultRange(next));
  };

  const changeRange = (values: [Dayjs | null, Dayjs | null] | null) => {
    if (!values || !values[0] || !values[1]) return;
    let start = values[0];
    const end = values[1];
    if (unit === 'month' && end.diff(start, 'month') >= MAX_MONTHS) {
      start = end.subtract(MAX_MONTHS - 1, 'month');
    }
    setLoading(true);
    setRange([start, end]);
  };

  const periodLabel =
    unit === 'month'
      ? `${dayjs(params.from).format('YY.MM')} ~ ${dayjs(params.to).format('YY.MM')}`
      : `${range[0].format('MM.DD')} ~ ${range[1].format('MM.DD')}`;
  const unitLabel = unit === 'month' ? '월별' : '일별';

  return (
    <>
      <AdminPageHeader
        title='대시보드'
        description='방문 통계 (봇·새로고침 중복 제외, 체류 시간은 화면이 보이는 동안만 측정)'
        extra={
          <Space wrap>
            <Segmented<VisitUnit>
              value={unit}
              onChange={changeUnit}
              options={[
                { label: '일별', value: 'day' },
                { label: '월별', value: 'month' },
              ]}
            />
            <DatePicker.RangePicker
              key={unit}
              picker={unit === 'month' ? 'month' : 'date'}
              value={range}
              onChange={changeRange}
              allowClear={false}
              disabledDate={(date) => date.isAfter(dayjs(), unit === 'month' ? 'month' : 'day')}
            />
          </Space>
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

      <Card title={`${unitLabel} 방문`} className='admin-block'>
        <VisitTrendTable periods={periods} unit={unit} loading={loading} pageSize={unit === 'month' ? 12 : 10} />
      </Card>

      <Card title='페이지별 조회수' extra={<Typography.Text type='secondary'>행을 펼치면 {unitLabel} 추이를 볼 수 있습니다</Typography.Text>}>
        <Table<VisitPageStat>
          rowKey='path'
          size='small'
          loading={loading}
          dataSource={pageStats?.pages ?? []}
          pagination={{ pageSize: 15, hideOnSinglePage: true }}
          scroll={{ x: 640 }}
          expandable={{
            expandedRowRender: (row) => (
              <PageTrend key={`${row.path}-${unit}-${params.from}-${params.to}`} path={row.path} unit={unit} from={params.from} to={params.to} />
            ),
          }}
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
    </>
  );
}
