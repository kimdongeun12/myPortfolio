'use client';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Card, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '../../api/client';
import { deleteExperience, fetchExperiences, type Experience } from '../../api/experiences';
import AdminPageHeader from '../AdminPageHeader';

import ExperienceFormModal from './ExperienceFormModal';

const formatPeriod = ({ startDate, endDate }: Experience) =>
  `${startDate.replace(/-/g, '.')} ~ ${endDate ? endDate.replace(/-/g, '.') : ''}`;

export default function ExperienceAdmin() {
  const { message } = App.useApp();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchExperiences());
    } catch (error) {
      message.error(getErrorMessage(error, '경력 목록을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (item: Experience) => {
    try {
      await deleteExperience(item.id);
      message.success('삭제했습니다.');
      load();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const columns: ColumnsType<Experience> = [
    {
      title: '기간',
      key: 'period',
      width: 210,
      render: (_, item) => (
        <Space size={4}>
          <span>{formatPeriod(item)}</span>
          {item.current && <Tag color='blue'>재직중</Tag>}
        </Space>
      ),
    },
    {
      title: '회사',
      key: 'company',
      render: (_, item) => (
        <>
          <Typography.Text strong>{item.companyName}</Typography.Text>
          {item.formerName && <Typography.Text type='secondary'> (구 {item.formerName})</Typography.Text>}
        </>
      ),
    },
    {
      title: '부서 / 직무',
      key: 'job',
      responsive: ['md'],
      render: (_, item) => [item.department, item.jobTitle].filter(Boolean).join(' / ') || '-',
    },
    { title: '직급', dataIndex: 'position', responsive: ['lg'], render: (value: string | null) => value || '-' },
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
            title='경력을 삭제할까요?'
            description='목록에서 숨겨지며, 연결된 프로젝트는 그대로 남습니다.'
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
        title='경력 관리'
        description='최신 입사일 순으로 표시됩니다.'
        extra={
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setEditing(null)}>
            경력 추가
          </Button>
        }
      />

      <Card>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={false}
          expandable={{
            rowExpandable: (item) => Boolean(item.responsibilities || item.achievements || item.role),
            expandedRowRender: (item) => (
              <div className='admin-pre-line'>
                {item.role && <p>역할: {item.role}</p>}
                {item.responsibilities && (
                  <>
                    <p><strong>주요 업무</strong></p>
                    <p>{item.responsibilities}</p>
                  </>
                )}
                {item.achievements && (
                  <>
                    <p><strong>주요 성과</strong></p>
                    <p>{item.achievements}</p>
                  </>
                )}
              </div>
            ),
          }}
        />
      </Card>

      <ExperienceFormModal
        open={editing !== undefined}
        experience={editing ?? null}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined);
          load();
        }}
      />
    </>
  );
}
