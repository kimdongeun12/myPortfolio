'use client';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Card, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '../../api/client';
import { deleteSkillGroup, fetchSkillGroups, type SkillGroup } from '../../api/skillGroups';
import AdminPageHeader from '../AdminPageHeader';

import SkillGroupFormModal from './SkillGroupFormModal';

export default function SkillGroupAdmin() {
  const { message } = App.useApp();
  const [items, setItems] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SkillGroup | null | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchSkillGroups());
    } catch (error) {
      message.error(getErrorMessage(error, '스킬 그룹 목록을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (item: SkillGroup) => {
    try {
      await deleteSkillGroup(item.id);
      message.success('삭제했습니다.');
      load();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const columns: ColumnsType<SkillGroup> = [
    { title: '순서', dataIndex: 'sortOrder', width: 80 },
    {
      title: '그룹',
      key: 'group',
      render: (_, item) => (
        <>
          <Typography.Text strong>{item.name}</Typography.Text>
          {item.description && (
            <Typography.Paragraph type='secondary' style={{ margin: '4px 0 0' }}>
              {item.description}
            </Typography.Paragraph>
          )}
        </>
      ),
    },
    {
      title: '기술 스택',
      key: 'techStacks',
      responsive: ['md'],
      render: (_, item) => (
        <Space size={[4, 4]} wrap>
          {item.techStacks.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '관리',
      key: 'actions',
      width: 150,
      render: (_, item) => (
        <Space>
          <Button size='small' icon={<EditOutlined />} onClick={() => setEditing(item)}>
            수정
          </Button>
          <Popconfirm
            title='스킬 그룹을 삭제할까요?'
            description='공개 사이트 SKILLS에서 숨겨집니다.'
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

  const nextSortOrder = items.reduce((max, item) => Math.max(max, item.sortOrder), 0) + 1;

  return (
    <>
      <AdminPageHeader
        title='스킬 관리'
        description='공개 사이트 SKILLS 영역에 정렬 순서대로 표시됩니다.'
        extra={
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setEditing(null)}>
            그룹 추가
          </Button>
        }
      />

      <Card>
        <Table rowKey='id' columns={columns} dataSource={items} loading={loading} pagination={false} />
      </Card>

      <SkillGroupFormModal
        open={editing !== undefined}
        skillGroup={editing ?? null}
        nextSortOrder={nextSortOrder}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined);
          load();
        }}
      />
    </>
  );
}
