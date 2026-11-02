'use client';

import { App, Checkbox, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../../api/client';
import {
  createExperience,
  updateExperience,
  type Experience,
  type ExperienceRequest,
} from '../../api/experiences';

type FormValues = {
  companyName: string;
  formerName?: string;
  department?: string;
  jobTitle?: string;
  role?: string;
  position?: string;
  responsibilities?: string;
  startDate: Dayjs;
  endDate?: Dayjs | null;
  current: boolean;
};

type ExperienceFormModalProps = {
  open: boolean;
  /** null 이면 새로 등록 */
  experience: Experience | null;
  onClose: () => void;
  onSaved: () => void;
};

const DATE_FORMAT = 'YYYY-MM-DD';

/** 빈 문자열은 null 로 보내서 DB 에 빈 값이 남지 않게 */
const emptyToNull = (value?: string) => (value && value.trim() ? value.trim() : null);

const toFormValues = (experience: Experience | null): Partial<FormValues> =>
  experience
    ? {
        companyName: experience.companyName,
        formerName: experience.formerName ?? undefined,
        department: experience.department ?? undefined,
        jobTitle: experience.jobTitle ?? undefined,
        role: experience.role ?? undefined,
        position: experience.position ?? undefined,
        responsibilities: experience.responsibilities ?? undefined,
        startDate: dayjs(experience.startDate),
        endDate: experience.endDate ? dayjs(experience.endDate) : null,
        current: experience.current,
      }
    : { current: false };

const toRequest = (values: FormValues): ExperienceRequest => ({
  companyName: values.companyName.trim(),
  formerName: emptyToNull(values.formerName),
  department: emptyToNull(values.department),
  jobTitle: emptyToNull(values.jobTitle),
  role: emptyToNull(values.role),
  position: emptyToNull(values.position),
  responsibilities: emptyToNull(values.responsibilities),
  startDate: values.startDate.format(DATE_FORMAT),
  endDate: values.current || !values.endDate ? null : values.endDate.format(DATE_FORMAT),
});

/** 경력 등록·수정 모달 */
export default function ExperienceFormModal({ open, experience, onClose, onSaved }: ExperienceFormModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);
  const current = Form.useWatch('current', form);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(toFormValues(experience));
    }
  }, [open, experience, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const body = toRequest(values);
      if (experience) await updateExperience(experience.id, body);
      else await createExperience(body);
      message.success(experience ? '수정했습니다.' : '등록했습니다.');
      onSaved();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={experience ? '경력 수정' : '경력 추가'}
      okText={experience ? '수정' : '등록'}
      cancelText='취소'
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={saving}
      width={720}
      // 닫혀 있어도 Form 을 유지해야 useForm/useWatch 경고가 나지 않음 (열 때마다 초기화)
      forceRender
      maskClosable={false}
    >
      <Form<FormValues> form={form} layout='vertical' requiredMark='optional'>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name='companyName'
              label='회사명'
              rules={[
                { required: true, whitespace: true, message: '회사명을 입력하세요.' },
                { max: 100, message: '100자 이하로 입력하세요.' },
              ]}
            >
              <Input placeholder='클러쉬' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name='formerName' label='이전 사명' rules={[{ max: 100, message: '100자 이하로 입력하세요.' }]}>
              <Input placeholder='디씨온' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name='department' label='부서' rules={[{ max: 100, message: '100자 이하로 입력하세요.' }]}>
              <Input placeholder='KB개발담당' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name='jobTitle' label='담당 직무' rules={[{ max: 100, message: '100자 이하로 입력하세요.' }]}>
              <Input placeholder='프론트엔드 개발자' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name='position' label='직급/직책' rules={[{ max: 50, message: '50자 이하로 입력하세요.' }]}>
              <Input placeholder='선임연구원(대리)' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name='role' label='역할' rules={[{ max: 200, message: '200자 이하로 입력하세요.' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name='startDate' label='입사일' rules={[{ required: true, message: '입사일을 선택하세요.' }]}>
              <DatePicker className='admin-full-width' />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name='endDate'
              label='퇴사일'
              dependencies={['startDate', 'current']}
              rules={[
                ({ getFieldValue }) => ({
                  validator: (_, value?: Dayjs | null) => {
                    if (getFieldValue('current')) return Promise.resolve();
                    if (!value) return Promise.reject(new Error('퇴사일을 선택하거나 재직중을 체크하세요.'));
                    const start: Dayjs | undefined = getFieldValue('startDate');
                    if (start && value.isBefore(start, 'day')) {
                      return Promise.reject(new Error('퇴사일은 입사일 이후여야 합니다.'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker className='admin-full-width' disabled={current} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name='current' label=' ' valuePropName='checked'>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) form.setFieldValue('endDate', null);
                }}
              >
                재직중
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name='responsibilities' label='담당 업무'>
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 12 }} placeholder='줄바꿈으로 구분해서 작성하세요.' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
