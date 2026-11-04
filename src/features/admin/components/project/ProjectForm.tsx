'use client';

import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { App, Button, Card, Checkbox, Col, DatePicker, Form, Input, InputNumber, Result, Row, Select, Spin, Switch } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../../api/client';
import {
  createProject,
  fetchExperienceOptions,
  fetchProject,
  PROJECT_TYPE_LABEL,
  updateProject,
  type ExperienceOption,
  type Project,
  type ProjectRequest,
  type ProjectType,
} from '../../api/projects';
import AdminPageHeader from '../AdminPageHeader';
import MdxEditor from '../MdxEditor';
import TechStackSelect from '../TechStackSelect';
import ThumbnailField from '../ThumbnailField';

type FormValues = {
  experienceId?: number | null;
  type: ProjectType;
  title: string;
  summary?: string;
  role?: string;
  responsibilities?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  ongoing: boolean;
  thumbnailUrl?: string | null;
  pinned: boolean;
  sortOrder: number;
  techStacks: string[];
  content?: string;
};

const DATE_FORMAT = 'YYYY-MM-DD';
const emptyToNull = (value?: string | null) => (value && value.trim() ? value.trim() : null);

const DEFAULT_VALUES: Partial<FormValues> = {
  type: 'COMPANY',
  ongoing: false,
  pinned: false,
  sortOrder: 0,
  techStacks: [],
  content: '',
};

const toFormValues = (project: Project): FormValues => ({
  experienceId: project.experienceId,
  type: project.type,
  title: project.title,
  summary: project.summary ?? undefined,
  role: project.role ?? undefined,
  responsibilities: project.responsibilities ?? undefined,
  startDate: project.startDate ? dayjs(project.startDate) : null,
  endDate: project.endDate ? dayjs(project.endDate) : null,
  ongoing: Boolean(project.startDate) && !project.endDate,
  thumbnailUrl: project.thumbnailUrl,
  pinned: project.pinned,
  sortOrder: project.sortOrder,
  techStacks: project.techStacks,
  content: project.content ?? '',
});

const toRequest = (values: FormValues): ProjectRequest => ({
  experienceId: values.type === 'COMPANY' ? values.experienceId ?? null : null,
  type: values.type,
  title: values.title.trim(),
  summary: emptyToNull(values.summary),
  role: emptyToNull(values.role),
  responsibilities: emptyToNull(values.responsibilities),
  content: emptyToNull(values.content),
  startDate: values.startDate ? values.startDate.format(DATE_FORMAT) : null,
  endDate: values.ongoing || !values.endDate ? null : values.endDate.format(DATE_FORMAT),
  thumbnailUrl: emptyToNull(values.thumbnailUrl),
  pinned: values.pinned,
  sortOrder: values.sortOrder ?? 0,
  techStacks: values.techStacks ?? [],
});

type ProjectFormProps = {
  projectId?: number;
};

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [experiences, setExperiences] = useState<ExperienceOption[]>([]);
  const [loading, setLoading] = useState(Boolean(projectId));
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEdit = projectId !== undefined;
  const type = Form.useWatch('type', form);
  const ongoing = Form.useWatch('ongoing', form);

  useEffect(() => {
    fetchExperienceOptions()
      .then(setExperiences)
      .catch(() => setExperiences([]));
  }, []);

  useEffect(() => {
    if (!projectId) return;
    fetchProject(projectId)
      .then((project) => form.setFieldsValue(toFormValues(project)))
      .catch((error) => setLoadError(getErrorMessage(error, '프로젝트를 불러오지 못했습니다.')))
      .finally(() => setLoading(false));
  }, [projectId, form]);

  const handleFinish = async (values: FormValues) => {
    setSaving(true);
    try {
      const body = toRequest(values);
      if (projectId !== undefined) {
        await updateProject(projectId, body);
        message.success('저장했습니다.');
      } else {
        const id = await createProject(body);
        message.success('등록했습니다. 이제 이미지를 올릴 수 있습니다.');
        router.replace(`/admin/projects/${id}`);
      }
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <Result
        status='warning'
        title={loadError}
        extra={
          <Link href='/admin/projects'>
            <Button>목록으로</Button>
          </Link>
        }
      />
    );
  }

  const uploadTarget = { type: 'PROJECT' as const, id: projectId };

  return (
    <>
      <AdminPageHeader
        title={isEdit ? '프로젝트 수정' : '프로젝트 추가'}
        extra={
          <Link href='/admin/projects'>
            <Button icon={<ArrowLeftOutlined />}>목록</Button>
          </Link>
        }
      />

      <Spin spinning={loading} tip='불러오는 중'>
        <Form<FormValues>
          form={form}
          layout='vertical'
          requiredMark='optional'
          initialValues={DEFAULT_VALUES}
          onFinish={handleFinish}
          scrollToFirstError
        >
          <Card title='기본 정보' className='admin-block'>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name='type' label='종류' rules={[{ required: true }]}>
                  <Select
                    options={(Object.keys(PROJECT_TYPE_LABEL) as ProjectType[]).map((value) => ({
                      value,
                      label: PROJECT_TYPE_LABEL[value],
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={16}>
                <Form.Item
                  name='experienceId'
                  label='소속 경력'
                  tooltip='회사 프로젝트만 연결됩니다.'
                  rules={[{ required: type === 'COMPANY', message: '회사 프로젝트는 소속 경력을 선택하세요.' }]}
                >
                  <Select
                    allowClear
                    disabled={type !== 'COMPANY'}
                    placeholder={type === 'COMPANY' ? '경력 선택' : '개인·사이드 프로젝트는 선택하지 않습니다'}
                    options={experiences.map((exp) => ({
                      value: exp.id,
                      label: `${exp.companyName} (${exp.startDate.slice(0, 7)} ~ ${exp.endDate ? exp.endDate.slice(0, 7) : '재직중'})`,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name='title'
                  label='프로젝트명'
                  rules={[
                    { required: true, whitespace: true, message: '프로젝트명을 입력하세요.' },
                    { max: 200, message: '200자 이하로 입력하세요.' },
                  ]}
                >
                  <Input placeholder='스타뱅킹 국민지갑 서비스 개발' />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name='summary' label='한 줄 소개' rules={[{ max: 300, message: '300자 이하로 입력하세요.' }]}>
                  <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} showCount maxLength={300} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='role' label='담당 역할' rules={[{ max: 200, message: '200자 이하로 입력하세요.' }]}>
                  <Input placeholder='프론트엔드 공통 회원 서비스 개발' />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='techStacks' label='기술 스택'>
                  <TechStackSelect />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name='responsibilities' label='담당 업무' extra='한 줄에 하나씩 작성하면 프로필 프로젝트 카드에 목록으로 표시됩니다.'>
                  <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} placeholder='줄바꿈으로 구분해서 작성하세요.' />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='startDate' label='시작일'>
                  <DatePicker className='admin-full-width' />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name='endDate'
                  label='종료일'
                  dependencies={['startDate', 'ongoing']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator: (_, value?: Dayjs | null) => {
                        const start: Dayjs | null | undefined = getFieldValue('startDate');
                        if (getFieldValue('ongoing') || !value || !start || !value.isBefore(start, 'day')) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('종료일은 시작일 이후여야 합니다.'));
                      },
                    }),
                  ]}
                >
                  <DatePicker className='admin-full-width' disabled={ongoing} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='ongoing' label=' ' valuePropName='checked'>
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) form.setFieldValue('endDate', null);
                    }}
                  >
                    진행중
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title='노출 설정' className='admin-block'>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name='thumbnailUrl' label='썸네일'>
                  <ThumbnailField target={uploadTarget} />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item name='pinned' label='상단 고정' valuePropName='checked'>
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item name='sortOrder' label='정렬 순서' tooltip='작은 숫자가 먼저 표시됩니다.'>
                  <InputNumber className='admin-full-width' min={0} max={9999} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title='상세 내용 (MDX)'>
            <Form.Item name='content' noStyle>
              <MdxEditor uploadTarget={uploadTarget} />
            </Form.Item>
          </Card>

          <div className='admin-form-actions'>
            <Link href='/admin/projects'>
              <Button>취소</Button>
            </Link>
            <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={saving}>
              {isEdit ? '저장' : '등록'}
            </Button>
          </div>
        </Form>
      </Spin>
    </>
  );
}
