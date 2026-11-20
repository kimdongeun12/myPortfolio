'use client';

import { Alert, App, Button, Collapse, Empty, Input, Space, Spin, Switch, Tag, Timeline, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/client';
import { fetchVisitors, updateVisitorLabel } from '../api/common';
import type { Visitor, VisitorTimeline } from '../api/types';

import { formatDuration } from './VisitTrendTable';

type VisitorTimelinePanelProps = {
  from: string;
  to: string;
};

const formatRange = (first: string, last: string) => {
  const start = dayjs(first);
  const end = dayjs(last);
  if (start.isSame(end, 'day')) return `${start.format('MM.DD (dd) HH:mm')} ~ ${end.format('HH:mm')}`;
  return `${start.format('MM.DD HH:mm')} ~ ${end.format('MM.DD HH:mm')}`;
};

function LabelEditor({ visitor, onSaved }: { visitor: Visitor; onSaved: (label: string | null) => void }) {
  const { message } = App.useApp();
  const [value, setValue] = useState(visitor.label ?? '');
  const [saving, setSaving] = useState(false);

  if (!visitor.ipHash) {
    return <Typography.Text type='secondary'>IP 정보가 없는 방문이라 이름을 붙일 수 없습니다.</Typography.Text>;
  }

  const save = async (next: string) => {
    setSaving(true);
    try {
      await updateVisitorLabel(visitor.ipHash as string, next);
      onSaved(next.trim() ? next.trim() : null);
      message.success(next.trim() ? '이름을 저장했습니다.' : '이름을 지웠습니다.');
    } catch (e) {
      message.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space.Compact style={{ maxWidth: 420, width: '100%' }}>
      <Input
        value={value}
        maxLength={40}
        placeholder='예: 나 - 집, 나 - 회사'
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={() => save(value)}
      />
      <Button type='primary' loading={saving} onClick={() => save(value)}>
        저장
      </Button>
      <Button disabled={saving || !visitor.label} onClick={() => { setValue(''); save(''); }}>
        지우기
      </Button>
    </Space.Compact>
  );
}

function VisitorVisits({ visitor }: { visitor: Visitor }) {
  const items = visitor.visits.flatMap((visit, idx) => {
    const prev = visitor.visits[idx - 1];
    const time = dayjs(visit.visitedAt);
    const newDay = !prev || !dayjs(prev.visitedAt).isSame(time, 'day');
    const newSession = !prev || prev.sessionId !== visit.sessionId;
    const marker = newDay || newSession
      ? [{
          key: `${visit.visitedAt}-marker`,
          color: 'gray',
          content: (
            <Typography.Text type='secondary' style={{ fontSize: 12 }}>
              {newDay ? time.format('YYYY.MM.DD (dd)') : '새로 접속'}
              {visit.referrer ? ` · 유입: ${visit.referrer}` : ''}
            </Typography.Text>
          ),
        }]
      : [];
    return [
      ...marker,
      {
        key: `${visit.visitedAt}-${visit.path}-${idx}`,
        content: (
          <div className='visitor-visit'>
            <span className='visitor-visit-time'>{time.format('HH:mm:ss')}</span>
            <span className='visitor-visit-page'>
              {visit.label}
              {visit.label !== visit.path && (
                <Typography.Text type='secondary' style={{ fontSize: 12, marginLeft: 6 }}>
                  {visit.path}
                </Typography.Text>
              )}
            </span>
            <span className='visitor-visit-duration'>{formatDuration(visit.durationMs)}</span>
          </div>
        ),
      },
    ];
  });
  return <Timeline items={items} />;
}

export default function VisitorTimelinePanel({ from, to }: VisitorTimelinePanelProps) {
  const [data, setData] = useState<VisitorTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hideLabeled, setHideLabeled] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetchVisitors({ from, to })
      .then((result) => {
        if (ignore) return;
        setData(result);
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
  }, [from, to]);

  const applyLabel = (ipHash: string, label: string | null) => {
    setData((prev) =>
      prev
        ? { ...prev, visitors: prev.visitors.map((v) => (v.ipHash === ipHash ? { ...v, label } : v)) }
        : prev,
    );
  };

  if (error) return <Alert type='error' title={error} showIcon />;
  if (loading) return <Spin style={{ display: 'block', margin: '32px auto' }} />;

  const visitors = (data?.visitors ?? []).filter((v) => !hideLabeled || !v.label);
  const labeledCount = (data?.visitors ?? []).filter((v) => v.label).length;

  return (
    <>
      <div className='visitor-toolbar'>
        <Typography.Text type='secondary'>
          방문자 {data?.visitors.length ?? 0}명 · 이름 붙인 방문자 {labeledCount}명 · 같은 IP를 한 사람으로 묶었습니다
        </Typography.Text>
        <Space>
          <Typography.Text>이름 붙인 방문자 숨기기</Typography.Text>
          <Switch checked={hideLabeled} onChange={setHideLabeled} />
        </Space>
      </div>
      {data?.truncated && (
        <Alert type='warning' showIcon className='admin-block' title='기록이 많아 최근 3,000건만 표시합니다. 기간을 줄여 보세요.' />
      )}
      {visitors.length === 0 ? (
        <Empty description='이 기간에 방문 기록이 없습니다.' />
      ) : (
        <Collapse
          className='visitor-list'
          items={visitors.map((visitor) => ({
            key: visitor.visitorId,
            label: (
              <div className='visitor-head'>
                <Space size={6} wrap>
                  {visitor.label ? <Tag color='magenta'>{visitor.label}</Tag> : <Tag>방문자 {visitor.visitorId.slice(0, 6)}</Tag>}
                  <Typography.Text>{visitor.device} · {visitor.os} · {visitor.browser}</Typography.Text>
                </Space>
                <Typography.Text type='secondary' className='visitor-head-meta'>
                  {formatRange(visitor.firstVisitedAt, visitor.lastVisitedAt)} · 페이지 {visitor.pageViews} · 접속 {visitor.sessions}회 · 체류 {formatDuration(visitor.totalDurationMs)}
                  {visitor.firstReferrer ? ` · 유입 ${visitor.firstReferrer}` : ''}
                </Typography.Text>
              </div>
            ),
            children: (
              <>
                <div className='admin-block'>
                  <LabelEditor visitor={visitor} onSaved={(label) => visitor.ipHash && applyLabel(visitor.ipHash, label)} />
                </div>
                <VisitorVisits visitor={visitor} />
              </>
            ),
          }))}
        />
      )}
    </>
  );
}
