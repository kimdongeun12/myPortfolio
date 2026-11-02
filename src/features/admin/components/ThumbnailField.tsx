'use client';

import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { App, Button, Input, Space, Tooltip, Upload } from 'antd';
import { useState } from 'react';

import { toAssetUrl } from '@/lib/api-url';

import { getErrorMessage } from '../api/client';
import { uploadImage } from '../api/common';
import type { ImageTargetType } from '../api/types';

type ThumbnailFieldProps = {
  /** Form.Item 이 자동으로 넣어주는 값 */
  value?: string | null;
  onChange?: (value: string | null) => void;
  /** 업로드 대상 (id 가 없으면 = 아직 저장 전이면 업로드 불가, URL 직접 입력만 가능) */
  target: { type: ImageTargetType; id?: number };
};

/** 썸네일 입력 (업로드 또는 URL 직접 입력 + 미리보기) */
export default function ThumbnailField({ value, onChange, target }: ThumbnailFieldProps) {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const canUpload = Boolean(target.id);

  const handleUpload = async (file: File) => {
    if (!target.id) return;
    setUploading(true);
    try {
      const image = await uploadImage(file, target.type, target.id);
      onChange?.(image.url);
      message.success('썸네일을 올렸습니다. 저장해야 반영됩니다.');
    } catch (error) {
      message.error(getErrorMessage(error, '이미지 업로드에 실패했습니다.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='admin-thumbnail-field'>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className='admin-thumbnail-preview' src={toAssetUrl(value)} alt='썸네일 미리보기' />
      )}
      <Space.Compact className='admin-full-width'>
        <Input
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value || null)}
          placeholder='/uploads/... 또는 https://...'
          maxLength={500}
        />
        <Tooltip title={canUpload ? 'png, jpg, gif, webp (최대 10MB)' : '먼저 저장해야 업로드할 수 있습니다.'}>
          <Upload
            accept='image/png,image/jpeg,image/gif,image/webp'
            showUploadList={false}
            disabled={!canUpload}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} loading={uploading} disabled={!canUpload}>
              업로드
            </Button>
          </Upload>
        </Tooltip>
        {value && <Button icon={<DeleteOutlined />} onClick={() => onChange?.(null)} aria-label='썸네일 지우기' />}
      </Space.Compact>
    </div>
  );
}
