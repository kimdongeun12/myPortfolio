'use client';

import { App, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../../api/client';
import {
  createSkillGroup,
  updateSkillGroup,
  type SkillGroup,
  type SkillGroupRequest,
} from '../../api/skillGroups';
import TechStackSelect from '../TechStackSelect';

type FormValues = {
  name: string;
  description?: string;
  sortOrder: number;
  techStacks: string[];
};

type SkillGroupFormModalProps = {
  open: boolean;
  skillGroup: SkillGroup | null;
  nextSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
};

const toFormValues = (skillGroup: SkillGroup | null, nextSortOrder: number): FormValues =>
  skillGroup
    ? {
        name: skillGroup.name,
        description: skillGroup.description ?? undefined,
        sortOrder: skillGroup.sortOrder,
        techStacks: skillGroup.techStacks,
      }
    : { name: '', sortOrder: nextSortOrder, techStacks: [] };

const toRequest = (values: FormValues): SkillGroupRequest => ({
  name: values.name.trim(),
  description: values.description?.trim() ? values.description.trim() : null,
  sortOrder: values.sortOrder ?? 0,
  techStacks: values.techStacks ?? [],
});

export default function SkillGroupFormModal({
  open,
  skillGroup,
  nextSortOrder,
  onClose,
  onSaved,
}: SkillGroupFormModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(toFormValues(skillGroup, nextSortOrder));
    }
  }, [open, skillGroup, nextSortOrder, form]);

  const handleSubmit = async () => {
    let values: FormValues;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }
    setSaving(true);
    try {
      const body = toRequest(values);
      if (skillGroup) await updateSkillGroup(skillGroup.id, body);
      else await createSkillGroup(body);
      message.success(skillGroup ? '수정했습니다.' : '등록했습니다.');
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
      title={skillGroup ? '스킬 그룹 수정' : '스킬 그룹 추가'}
      okText={skillGroup ? '수정' : '등록'}
      cancelText='취소'
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={saving}
      width={640}
      forceRender
      maskClosable={false}
    >
      <Form<FormValues> form={form} layout='vertical' requiredMark='optional'>
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item
              name='name'
              label='그룹명'
              rules={[
                { required: true, whitespace: true, message: '그룹명을 입력하세요.' },
                { max: 50, message: '50자 이하로 입력하세요.' },
              ]}
            >
              <Input placeholder='Front-end' />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name='sortOrder' label='정렬 순서' tooltip='작은 숫자가 먼저 표시됩니다.'>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='description'
              label='설명'
              extra='공개 사이트에서 3줄 이내로 보이도록 짧게 작성하세요.'
              rules={[{ max: 300, message: '300자 이하로 입력하세요.' }]}
            >
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} showCount maxLength={300} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name='techStacks' label='기술 스택' extra='선택한 순서대로 표시됩니다.'>
              <TechStackSelect />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
