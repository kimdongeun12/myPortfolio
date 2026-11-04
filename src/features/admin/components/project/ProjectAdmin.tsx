'use client';

import { DeleteOutlined, EditOutlined, PlusOutlined, PushpinFilled } from '@ant-design/icons';
import { App, Button, Card, Popconfirm, Segmented, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '../../api/client';
import { deleteProject, fetchProjects, PROJECT_TYPE_LABEL, type Project, type ProjectType } from '../../api/projects';
import AdminPageHeader from '../AdminPageHeader';

type TypeFilter = ProjectType | 'ALL';

const TYPE_COLOR: Record<ProjectType, string> = { COMPANY: 'blue', PERSONAL: 'green', SIDE: 'purple' };

const formatPeriod = ({ startDate, endDate }: Project) => {
  if (!startDate) return '-';
  const toMonth = (date: string) => date.slice(0, 7).replace('-', '.');
  return `${toMonth(startDate)} ~ ${endDate ? toMonth(endDate) : '진행중'}`;
};

export default function ProjectAdmin() {
  const { message } = App.useApp();
  const [filter, setFilter] = useState<TypeFilter>('ALL');
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchProjects(filter === 'ALL' ? undefined : filter));
    } catch (error) {
      message.error(getErrorMessage(error, '프로젝트 목록을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [filter, message]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (item: Project) => {
    try {
      await deleteProject(item.id);
      message.success('삭제했습니다.');
      load();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const columns: ColumnsType<Project> = [
    {
      title: '프로젝트',
      key: 'title',
      render: (_, item) => (
        <Space direction='vertical' size={2}>
          <Space size={6}>
            {item.pinned && (
              <Tooltip title='상단 고정'>
                <PushpinFilled style={{ color: '#4356FF' }} />
              </Tooltip>
            )}
            <Link href={`/admin/projects/${item.id}`}>
              <Typography.Text strong>{item.title}</Typography.Text>
            </Link>
          </Space>
          {item.summary && (
            <Typography.Text type='secondary' ellipsis style={{ maxWidth: 420 }}>
              {item.summary}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: '종류',
      dataIndex: 'type',
      width: 90,
      render: (type: ProjectType) => <Tag color={TYPE_COLOR[type]}>{PROJECT_TYPE_LABEL[type]}</Tag>,
    },
    { title: '회사', dataIndex: 'companyName', width: 120, responsive: ['md'], render: (value: string | null) => value || '-' },
    { title: '기간', key: 'period', width: 170, responsive: ['lg'], render: (_, item) => formatPeriod(item) },
    {
      title: '기술 스택',
      dataIndex: 'techStacks',
      responsive: ['xl'],
      render: (stacks: string[]) => (
        <Space size={[0, 4]} wrap>
          {stacks.map((name) => (
            <Tag key={name}>{name}</Tag>
          ))}
        </Space>
      ),
    },
    { title: '순서', dataIndex: 'sortOrder', width: 70, align: 'center', responsive: ['md'] },
    {
      title: '관리',
      key: 'actions',
      width: 130,
      render: (_, item) => (
        <Space>
          <Link href={`/admin/projects/${item.id}`}>
            <Button size='small' icon={<EditOutlined />}>
              수정
            </Button>
          </Link>
          <Popconfirm
            title='프로젝트를 삭제할까요?'
            description='사이트에서 숨겨지며, 댓글·이미지도 함께 노출되지 않습니다.'
            okText='삭제'
            cancelText='취소'
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(item)}
          >
            <Button size='small' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title='프로젝트 관리'
        description='상단 고정 → 정렬 순서(작은 숫자 먼저) → 최신 시작일 순으로 사이트에 표시됩니다.'
        extra={
          <Link href='/admin/projects/new'>
            <Button type='primary' icon={<PlusOutlined />}>
              프로젝트 추가
            </Button>
          </Link>
        }
      />

      <Card>
        <Segmented<TypeFilter>
          className='admin-block'
          value={filter}
          onChange={setFilter}
          options={[
            { label: '전체', value: 'ALL' },
            { label: '회사', value: 'COMPANY' },
            { label: '개인', value: 'PERSONAL' },
            { label: '사이드', value: 'SIDE' },
          ]}
        />
        <Table rowKey='id' columns={columns} dataSource={items} loading={loading} pagination={{ pageSize: 20, hideOnSinglePage: true }} />
      </Card>
    </>
  );
}
