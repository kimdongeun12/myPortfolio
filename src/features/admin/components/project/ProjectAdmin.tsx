'use client';

import { DeleteOutlined, EditOutlined, PlusOutlined, PushpinFilled } from '@ant-design/icons';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { App, Button, Card, Popconfirm, Segmented, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '../../api/client';
import {
  deleteProject,
  fetchProjects,
  PROJECT_TYPE_LABEL,
  reorderProjects,
  type Project,
  type ProjectType,
} from '../../api/projects';
import AdminPageHeader from '../AdminPageHeader';
import SortableRow, { DragHandle, ReorderEnabledContext } from '../SortableRow';

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
  const [saving, setSaving] = useState(false);

  const canReorder = filter === 'ALL' && !saving;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    if (items[oldIndex].pinned !== items[newIndex].pinned) {
      message.warning('상단 고정 프로젝트끼리, 일반 프로젝트끼리만 순서를 바꿀 수 있습니다.');
      return;
    }

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    setSaving(true);
    try {
      await reorderProjects(next.map((item) => item.id));
      message.success('순서를 저장했습니다.');
      load();
    } catch (error) {
      message.error(getErrorMessage(error, '순서를 저장하지 못했습니다.'));
      load();
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnsType<Project> = [
    {
      key: 'drag',
      width: 48,
      align: 'center',
      render: () => <DragHandle />,
    },
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
        description='목록 순서대로 사이트에 표시됩니다. 전체 보기에서 행을 끌어 놓으면 순서가 바뀌고, 상단 고정 프로젝트는 항상 위에 옵니다.'
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
        {filter !== 'ALL' && (
          <Typography.Paragraph type='secondary' className='admin-block'>
            순서 변경은 전체 보기에서만 할 수 있습니다.
          </Typography.Paragraph>
        )}
        <ReorderEnabledContext.Provider value={canReorder}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            accessibility={{
              screenReaderInstructions: {
                draggable: '스페이스바로 들어 올리고 위아래 방향키로 옮긴 뒤 스페이스바로 내려놓습니다. 취소는 Esc입니다.',
              },
            }}
          >
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy} disabled={!canReorder}>
              <Table
                rowKey='id'
                columns={columns}
                dataSource={items}
                loading={loading || saving}
                pagination={false}
                components={{ body: { row: SortableRow } }}
              />
            </SortableContext>
          </DndContext>
        </ReorderEnabledContext.Provider>
      </Card>
    </>
  );
}
