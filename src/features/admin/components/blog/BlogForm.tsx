'use client';

import { ArrowLeftOutlined, CloudUploadOutlined, SaveOutlined } from '@ant-design/icons';
import { App, Button, Card, Col, DatePicker, Form, Input, Result, Row, Spin, Tag } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { createBlog, fetchAdminBlog, updateBlog, type BlogRequest } from '../../api/blogs';
import { getErrorMessage } from '../../api/client';
import AdminPageHeader from '../AdminPageHeader';
import MdxEditor from '../MdxEditor';
import TechStackSelect from '../TechStackSelect';
import ThumbnailField from '../ThumbnailField';

type FormValues = {
  title: string;
  techStacks: string[];
  thumbnailUrl?: string | null;
  publishedAt?: Dayjs | null;
  content: string;
};

const DEFAULT_VALUES: FormValues = { title: '', techStacks: [], thumbnailUrl: null, content: '' };

type BlogFormProps = {
  blogId?: number;
};

export default function BlogForm({ blogId }: BlogFormProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(Boolean(blogId));
  const [loadError, setLoadError] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null);
  const isEdit = blogId !== undefined;

  useEffect(() => {
    if (!blogId) return;
    fetchAdminBlog(blogId)
      .then((blog) => {
        form.setFieldsValue({
          title: blog.title,
          techStacks: blog.techStacks,
          thumbnailUrl: blog.thumbnailUrl,
          publishedAt: dayjs(blog.publishedAt ?? blog.createdAt),
          content: blog.content,
        });
        setPublished(blog.published);
      })
      .catch((error) => setLoadError(getErrorMessage(error, '글을 불러오지 못했습니다.')))
      .finally(() => setLoading(false));
  }, [blogId, form]);

  const save = async (publish: boolean) => {
    let values: FormValues;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }
    const body: BlogRequest = {
      title: values.title.trim(),
      content: values.content,
      thumbnailUrl: values.thumbnailUrl?.trim() || null,
      published: publish,
      techStacks: values.techStacks ?? [],
      publishedAt: values.publishedAt ? values.publishedAt.format('YYYY-MM-DDTHH:mm:ss') : undefined,
    };

    setSaving(publish ? 'publish' : 'draft');
    try {
      if (blogId !== undefined) {
        await updateBlog(blogId, body);
        setPublished(publish);
        message.success(publish ? '공개로 저장했습니다.' : '임시저장했습니다.');
      } else {
        const id = await createBlog(body);
        message.success(publish ? '글을 공개했습니다.' : '임시저장했습니다. 이제 이미지를 올릴 수 있습니다.');
        router.replace(`/admin/blogs/${id}`);
      }
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSaving(null);
    }
  };

  if (loadError) {
    return (
      <Result
        status='warning'
        title={loadError}
        extra={
          <Link href='/admin/blogs'>
            <Button>목록으로</Button>
          </Link>
        }
      />
    );
  }

  const uploadTarget = { type: 'BLOG' as const, id: blogId };

  return (
    <>
      <AdminPageHeader
        title={isEdit ? '글 수정' : '새 글 쓰기'}
        description={isEdit ? undefined : '처음 저장하기 전에는 이미지를 올릴 수 없습니다. 먼저 임시저장하세요.'}
        extra={
          <>
            {isEdit && (published ? <Tag color='green'>공개 중</Tag> : <Tag>임시저장 상태</Tag>)}
            <Link href='/admin/blogs'>
              <Button icon={<ArrowLeftOutlined />}>목록</Button>
            </Link>
          </>
        }
      />

      <Spin spinning={loading} description='불러오는 중'>
        <Form<FormValues> form={form} layout='vertical' requiredMark='optional' initialValues={DEFAULT_VALUES}>
          <Card className='admin-block'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name='title'
                  label='제목'
                  rules={[
                    { required: true, whitespace: true, message: '제목을 입력하세요.' },
                    { max: 200, message: '200자 이하로 입력하세요.' },
                  ]}
                >
                  <Input size='large' placeholder='vue2 + vite + vuetify2 노트' />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='techStacks' label='기술 스택 (태그)'>
                  <TechStackSelect />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='publishedAt' label='게시일' extra='비워 두면 저장하는 시각으로 기록됩니다.'>
                  <DatePicker showTime format='YYYY.MM.DD HH:mm' style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='thumbnailUrl' label='썸네일'>
                  <ThumbnailField target={uploadTarget} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title='본문 (MDX)'>
            <Form.Item
              name='content'
              rules={[{ required: true, whitespace: true, message: '본문을 입력하세요.' }]}
            >
              <MdxEditor uploadTarget={uploadTarget} minHeight={560} />
            </Form.Item>
          </Card>

          <div className='admin-form-actions'>
            <Button icon={<SaveOutlined />} loading={saving === 'draft'} disabled={saving !== null} onClick={() => save(false)}>
              {isEdit && published ? '비공개로 전환 (임시저장)' : '임시저장'}
            </Button>
            <Button
              type='primary'
              icon={<CloudUploadOutlined />}
              loading={saving === 'publish'}
              disabled={saving !== null}
              onClick={() => save(true)}
            >
              {isEdit && published ? '저장' : '공개하기'}
            </Button>
          </div>
        </Form>
      </Spin>
    </>
  );
}
