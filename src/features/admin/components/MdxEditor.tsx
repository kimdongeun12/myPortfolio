'use client';

import { PictureOutlined } from '@ant-design/icons';
import { App, Button, Segmented, Space, Spin, Tooltip, Upload } from 'antd';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { getErrorMessage } from '../api/client';
import { uploadImage } from '../api/common';
import type { ImageTargetType } from '../api/types';

/**
 * MDX 컴파일러(@mdx-js/mdx)는 용량이 커서 따로 불러옵니다.
 * → 작성 화면(폼)이 먼저 뜨고, 미리보기는 준비되는 대로 표시
 */
const MdxContent = dynamic(() => import('@/components/mdx/MdxContent'), {
  ssr: false,
  loading: () => <Spin size='small' tip='미리보기 준비 중'><div style={{ height: 80 }} /></Spin>,
});

type ViewMode = 'split' | 'edit' | 'preview';

type MdxEditorProps = {
  /** Form.Item 이 자동으로 넣어주는 값 */
  value?: string;
  onChange?: (value: string) => void;
  /** 이미지 업로드 대상 (id 가 없으면 = 아직 저장 전이면 업로드 불가) */
  uploadTarget?: { type: ImageTargetType; id?: number };
  minHeight?: number;
};

/** 툴바에서 넣을 수 있는 문법 조각 */
const SNIPPETS: { label: string; text: string; tooltip: string }[] = [
  { label: 'H2', text: '\n## 제목\n', tooltip: '큰 제목 (목차에 표시)' },
  { label: 'H3', text: '\n### 소제목\n', tooltip: '작은 제목' },
  { label: 'B', text: '**굵게**', tooltip: '굵은 글씨' },
  { label: '링크', text: '[링크 텍스트](https://)', tooltip: '링크' },
  { label: '코드', text: '\n```ts\nconst hello = "world";\n```\n', tooltip: '코드 블록' },
  { label: '표', text: '\n| 항목 | 내용 |\n| --- | --- |\n| A | B |\n', tooltip: '표' },
  { label: 'Callout', text: '\n<Callout type="tip" title="참고">\n  강조할 내용\n</Callout>\n', tooltip: '강조 박스 (info / tip / warn)' },
];

const PREVIEW_DELAY = 300;

/**
 * MDX 에디터 (작성 + 실시간 미리보기)
 * antd Form.Item 안에 넣으면 value/onChange 가 자동 연결됩니다.
 */
export default function MdxEditor({ value = '', onChange, uploadTarget, minHeight = 480 }: MdxEditorProps) {
  const { message } = App.useApp();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<ViewMode>('split');
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);

  // 입력할 때마다 렌더링하면 무거우므로 잠깐 멈췄을 때 미리보기 갱신
  useEffect(() => {
    const timer = setTimeout(() => setPreview(value), PREVIEW_DELAY);
    return () => clearTimeout(timer);
  }, [value]);

  /** 커서 위치(선택 영역)에 텍스트 넣기 */
  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange?.(value + text);
      return;
    }
    const { selectionStart, selectionEnd } = textarea;
    const next = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
    onChange?.(next);
    // 값이 반영된 뒤 커서를 넣은 텍스트 뒤로 이동
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selectionStart + text.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleUpload = async (file: File) => {
    if (!uploadTarget?.id) return;
    setUploading(true);
    try {
      const image = await uploadImage(file, uploadTarget.type, uploadTarget.id);
      const alt = (image.originalName ?? '이미지').replace(/\.[^.]+$/, '');
      insertText(`\n![${alt}](${image.url})\n`);
      message.success('이미지를 넣었습니다.');
    } catch (error) {
      message.error(getErrorMessage(error, '이미지 업로드에 실패했습니다.'));
    } finally {
      setUploading(false);
    }
  };

  const canUpload = Boolean(uploadTarget?.id);

  return (
    <div className='mdx-editor'>
      <div className='mdx-editor-toolbar'>
        <Space wrap size={4}>
          {SNIPPETS.map((snippet) => (
            <Tooltip key={snippet.label} title={snippet.tooltip}>
              <Button size='small' onClick={() => insertText(snippet.text)} disabled={mode === 'preview'}>
                {snippet.label}
              </Button>
            </Tooltip>
          ))}
          {uploadTarget && (
            <Tooltip title={canUpload ? 'png, jpg, gif, webp (최대 10MB)' : '먼저 저장(임시저장)해야 이미지를 올릴 수 있습니다.'}>
              <Upload
                accept='image/png,image/jpeg,image/gif,image/webp'
                showUploadList={false}
                disabled={!canUpload || mode === 'preview'}
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false; // antd 기본 업로드 대신 직접 처리
                }}
              >
                <Button size='small' icon={<PictureOutlined />} loading={uploading} disabled={!canUpload || mode === 'preview'}>
                  이미지
                </Button>
              </Upload>
            </Tooltip>
          )}
        </Space>
        <Segmented<ViewMode>
          size='small'
          value={mode}
          onChange={setMode}
          options={[
            { label: '나란히', value: 'split' },
            { label: '작성', value: 'edit' },
            { label: '미리보기', value: 'preview' },
          ]}
        />
      </div>

      <div className={clsx('mdx-editor-body', `is-${mode}`)} style={{ minHeight }}>
        {mode !== 'preview' && (
          <textarea
            ref={textareaRef}
            className='mdx-editor-input'
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={'## 제목\n\n본문을 MDX 로 작성하세요.\n<Callout type="tip">강조 박스</Callout>'}
            spellCheck={false}
          />
        )}
        {mode !== 'edit' && (
          <div className='mdx-editor-preview'>
            {preview.trim() ? (
              <MdxContent source={preview} showError />
            ) : (
              <p className='mdx-editor-empty'>미리보기가 여기에 표시됩니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
