'use client';

import { DeleteOutlined, EditOutlined, HeartOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Card, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { deleteBlog, fetchAdminBlogs, type BlogSummary } from '../../api/blogs';
import { getErrorMessage } from '../../api/client';
import AdminPageHeader from '../AdminPageHeader';

const PAGE_SIZE = 20;

export default function BlogAdmin() {
  const { message } = App.useApp();
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<BlogSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBlogs(page, PAGE_SIZE);
      setItems(data.content);
      setTotal(data.totalElements);
    } catch (error) {
      message.error(getErrorMessage(error, '블로그 목록을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [page, message]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (item: BlogSummary) => {
    try {
      await deleteBlog(item.id);
      message.success('삭제했습니다.');
      if (items.length === 1 && page > 0) setPage(page - 1);
      else load();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const columns: ColumnsType<BlogSummary> = [
    {
      title: '상태',
      dataIndex: 'published',
      width: 90,
      render: (published: boolean) => (published ? <Tag color='green'>공개</Tag> : <Tag>임시저장</Tag>),
    },
    {
      title: '제목',
      key: 'title',
      render: (_, item) => (
        <Space direction='vertical' size={2}>
          <Link href={`/admin/blogs/${item.id}`}>
            <Typography.Text strong>{item.title}</Typography.Text>
          </Link>
          {item.excerpt && (
            <Typography.Text type='secondary' ellipsis style={{ maxWidth: 520 }}>
              {item.excerpt}
            </Typography.Text>
          )}
        </Space>
      ),
    },
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
      title: <HeartOutlined aria-label='좋아요' />,
      dataIndex: 'likeCount',
      width: 70,
      align: 'center',
      responsive: ['md'],
    },
    {
      title: '작성일',
      dataIndex: 'createdAt',
      width: 120,
      responsive: ['md'],
      render: (value: string) => dayjs(value).format('YYYY.MM.DD'),
    },
    {
      title: '관리',
      key: 'actions',
      width: 130,
      render: (_, item) => (
        <Space>
          <Link href={`/admin/blogs/${item.id}`}>
            <Button size='small' icon={<EditOutlined />}>
              수정
            </Button>
          </Link>
          <Popconfirm
            title='글을 삭제할까요?'
            description='사이트에서 숨겨지며, 댓글·좋아요도 함께 노출되지 않습니다.'
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
        title='블로그 관리'
        description='임시저장 글은 사이트에 노출되지 않습니다.'
        extra={
          <Link href='/admin/blogs/new'>
            <Button type='primary' icon={<PlusOutlined />}>
              새 글 쓰기
            </Button>
          </Link>
        }
      />

      <Card>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{
            current: page + 1,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
            hideOnSinglePage: true,
            onChange: (next) => setPage(next - 1),
          }}
        />
      </Card>
    </>
  );
}
