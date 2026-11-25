'use client';

import { Alert, Card, Col, DatePicker, Row, Segmented, Space, Statistic, Switch, Table, Tabs, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/client';
import { fetchVisitPageStats, fetchVisitStats, fetchVisitTrend } from '../api/common';
import type { VisitPageStat, VisitPageStats, VisitPeriod, VisitStats, VisitUnit } from '../api/types';

import AdminPageHeader from './AdminPageHeader';
import VisitorTimelinePanel from './VisitorTimelinePanel';
import { PageTrend, VisitTrendTable, formatDuration } from './VisitTrendTable';

const DATE_FORMAT = 'YYYY-MM-DD';
const MAX_HOURLY_DAYS = 7;
const MAX_VISITOR_DAYS = 31;

const PRESETS: { label: string; value: [Dayjs, Dayjs] }[] = [
  { label: '오늘', value: [dayjs().startOf('day'), dayjs()] },
  { label: '어제', value: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')] },
  { label: '최근 7일', value: [dayjs().subtract(6, 'day'), dayjs()] },
  { label: '최근 30일', value: [dayjs().subtract(29, 'day'), dayjs()] },
  { label: '최근 12개월', value: [dayjs().subtract(11, 'month').startOf('month'), dayjs()] },
];

const clampDays = (range: [Dayjs, Dayjs], days: number): [Dayjs, Dayjs] =>
  range[1].diff(range[0], 'day') >= days ? [range[1].subtract(days - 1, 'day'), range[1]] : range;

const toQuery = (range: [Dayjs, Dayjs]) => ({ from: range[0].format(DATE_FORMAT), to: range[1].format(DATE_FORMAT) });

const rangeText = (range: [Dayjs, Dayjs]) =>
  range[0].isSame(range[1], 'day')
    ? range[0].format('MM.DD')
    : `${range[0].format('MM.DD')} ~ ${range[1].format('MM.DD')}`;

export default function AdminDashboard() {
  const [range, setRange] = useState<[Dayjs, Dayjs]>(PRESETS[2].value);
  const [unit, setUnit] = useState<VisitUnit>('hour');
  const [hideEmpty, setHideEmpty] = useState(true);
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [pageStats, setPageStats] = useState<VisitPageStats | null>(null);
  const [periods, setPeriods] = useState<VisitPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [error, setError] = useState('');

  const query = toQuery(range);
  const hourRange = clampDays(range, MAX_HOURLY_DAYS);
  const visitorRange = clampDays(range, MAX_VISITOR_DAYS);
  const trendRange = unit === 'hour' ? hourRange : range;
  const trendQuery = toQuery(trendRange);
  const visitorQuery = toQuery(visitorRange);
  const pageUnit: VisitUnit = range[1].diff(range[0], 'day') > 92 ? 'month' : 'day';

  useEffect(() => {
    let ignore = false;
    Promise.all([fetchVisitStats(toQuery(range)), fetchVisitPageStats(toQuery(range))])
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

  useEffect(() => {
    let ignore = false;
    const target = unit === 'hour' ? clampDays(range, MAX_HOURLY_DAYS) : range;
    fetchVisitTrend({ ...toQuery(target), unit })
      .then((trend) => {
        if (!ignore) setPeriods(trend.periods);
      })
      .catch((e) => {
        if (!ignore) setError(getErrorMessage(e));
      })
      .finally(() => {
        if (!ignore) setTrendLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [range, unit]);

  const changeRange = (values: [Dayjs | null, Dayjs | null] | null) => {
    if (!values || !values[0] || !values[1]) return;
    setLoading(true);
    setTrendLoading(true);
    setRange([values[0], values[1]]);
  };

  const changeUnit = (next: VisitUnit) => {
    setTrendLoading(true);
    setUnit(next);
  };

  const label = rangeText(range);

  return (
    <>
      <AdminPageHeader
        title='대시보드'
        description='봇·새로고침 중복은 제외하고, 어드민에 로그인한 상태로 본 공개 사이트 방문은 기록하지 않습니다.'
        extra={
          <DatePicker.RangePicker
            value={range}
            onChange={changeRange}
            allowClear={false}
            presets={PRESETS}
            disabledDate={(date) => date.isAfter(dayjs(), 'day')}
          />
        }
      />

      {error && <Alert type='error' title={error} showIcon className='admin-block' />}

      <Row gutter={[12, 12]} className='admin-block'>
        <Col xs={12} md={6} xl={6}>
          <Card size='small'>
            <Statistic title='누적 방문자' value={stats?.allTimeVisitors ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col xs={12} md={6} xl={6}>
          <Card size='small'>
            <Statistic title='누적 페이지뷰' value={stats?.allTimePageViews ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col xs={12} md={6} xl={6}>
          <Card size='small'>
            <Statistic title='오늘 방문자' value={stats?.todayVisitors ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col xs={12} md={6} xl={6}>
          <Card size='small'>
            <Statistic title='오늘 페이지뷰' value={stats?.todayPageViews ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col xs={12} md={8} xl={8}>
          <Card size='small'>
            <Statistic title={`방문자 · ${label}`} value={stats?.totalVisitors ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col xs={12} md={8} xl={8}>
          <Card size='small'>
            <Statistic title={`페이지뷰 · ${label}`} value={stats?.totalPageViews ?? 0} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} md={8} xl={8}>
          <Card size='small'>
            <Statistic title={`평균 체류 · ${label}`} value={formatDuration(pageStats?.avgDurationMs)} loading={loading} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          defaultActiveKey='visitors'
          destroyOnHidden
          items={[
            {
              key: 'visitors',
              label: '방문자 타임라인',
              children: (
                <>
                  {visitorRange[0] !== range[0] && (
                    <Typography.Paragraph type='secondary'>
                      방문자 타임라인은 최대 31일까지 볼 수 있어 {rangeText(visitorRange)}만 표시합니다.
                    </Typography.Paragraph>
                  )}
                  <VisitorTimelinePanel key={`${visitorQuery.from}-${visitorQuery.to}`} from={visitorQuery.from} to={visitorQuery.to} />
                </>
              ),
            },
            {
              key: 'trend',
              label: '방문 추이',
              children: (
                <>
                  <div className='visitor-toolbar'>
                    <Segmented<VisitUnit>
                      value={unit}
                      onChange={changeUnit}
                      options={[
                        { label: '시간별', value: 'hour' },
                        { label: '일별', value: 'day' },
                        { label: '월별', value: 'month' },
                      ]}
                    />
                    <Space>
                      <Typography.Text>방문 없는 {unit === 'hour' ? '시간' : unit === 'day' ? '날' : '달'} 숨기기</Typography.Text>
                      <Switch checked={hideEmpty} onChange={setHideEmpty} />
                    </Space>
                  </div>
                  {unit === 'hour' && trendRange[0] !== range[0] && (
                    <Typography.Paragraph type='secondary'>
                      시간별은 최대 7일까지 볼 수 있어 {rangeText(trendRange)}만 표시합니다.
                    </Typography.Paragraph>
                  )}
                  <VisitTrendTable
                    periods={periods}
                    unit={unit}
                    loading={trendLoading}
                    pageSize={unit === 'hour' ? 24 : unit === 'month' ? 12 : 15}
                    hideEmpty={hideEmpty}
                  />
                </>
              ),
            },
            {
              key: 'pages',
              label: '페이지별',
              children: (
                <Table<VisitPageStat>
                  rowKey='path'
                  size='small'
                  loading={loading}
                  dataSource={pageStats?.pages ?? []}
                  pagination={{ pageSize: 15, hideOnSinglePage: true }}
                  scroll={{ x: 640 }}
                  expandable={{
                    expandedRowRender: (row) => (
                      <PageTrend
                        key={`${row.path}-${pageUnit}-${query.from}-${query.to}`}
                        path={row.path}
                        unit={pageUnit}
                        from={query.from}
                        to={query.to}
                      />
                    ),
                  }}
                  columns={[
                    {
                      title: '페이지',
                      dataIndex: 'label',
                      render: (text: string, row) => (
                        <>
                          <div>{text}</div>
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
                      width: 90,
                      sorter: (a, b) => a.pageViews - b.pageViews,
                      defaultSortOrder: 'descend',
                    },
                    {
                      title: '방문자',
                      dataIndex: 'visitors',
                      align: 'right',
                      width: 90,
                      sorter: (a, b) => a.visitors - b.visitors,
                    },
                    {
                      title: '평균 체류',
                      dataIndex: 'avgDurationMs',
                      align: 'right',
                      width: 120,
                      sorter: (a, b) => (a.avgDurationMs ?? -1) - (b.avgDurationMs ?? -1),
                      render: (value: number | null, row) => (
                        <span title={`체류 시간 측정 ${row.measured}건`}>{formatDuration(value)}</span>
                      ),
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
