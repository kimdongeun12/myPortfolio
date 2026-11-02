'use client';

import { DeleteOutlined, EditOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import { App, Button, Input, Popconfirm, Space, Tag, Typography } from 'antd';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';

import { formatRelativeTime } from '@/lib/format';

import { getErrorMessage } from '../../api/client';
import { createAdminComment, deleteCommentByAdmin, updateAdminComment, type AdminComment } from '../../api/comments';

const MAX_LENGTH = 1000;

type AdminCommentItemProps = {
  comment: AdminComment;
  isReply?: boolean;
  /** 등록·수정·숨김 후 목록 다시 불러오기 */
  onChanged: () => void;
};

type Mode = 'view' | 'reply' | 'edit';

/** 댓글 한 개 (답글 작성 / 관리자 댓글 수정 / 숨김) */
export default function AdminCommentItem({ comment, isReply = false, onChanged }: AdminCommentItemProps) {
  const { message } = App.useApp();
  const [mode, setMode] = useState<Mode>('view');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const openMode = (next: Mode) => {
    setMode(next);
    setText(next === 'edit' ? comment.content : '');
  };

  const run = async (action: () => Promise<unknown>, successText: string) => {
    setBusy(true);
    try {
      await action();
      message.success(successText);
      setMode('view');
      onChanged();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = () => {
    const content = text.trim();
    if (!content) return;
    if (mode === 'reply') {
      // 답글의 답글도 백엔드에서 같은 최상위 댓글 아래로 붙여줌
      run(() => createAdminComment({ parentId: comment.id, content }), '답글을 등록했습니다.');
    } else if (mode === 'edit') {
      run(() => updateAdminComment(comment.id, content), '수정했습니다.');
    }
  };

  return (
    <div className={clsx('admin-comment-item', isReply && 'is-reply', comment.deleted && 'is-deleted')}>
      <Space size={8} wrap>
        <Typography.Text strong>{comment.deleted ? '(삭제됨)' : comment.nickname}</Typography.Text>
        {comment.admin && !comment.deleted && <Tag color='blue'>작성자</Tag>}
        <Typography.Text type='secondary' title={dayjs(comment.createdAt).format('YYYY.MM.DD HH:mm')}>
          {formatRelativeTime(comment.createdAt)}
        </Typography.Text>
        {!comment.deleted && comment.likeCount > 0 && (
          <Typography.Text type='secondary'>
            <HeartOutlined /> {comment.likeCount}
          </Typography.Text>
        )}
      </Space>

      {mode === 'edit' ? null : (
        <Typography.Paragraph className='admin-pre-line' style={{ margin: '6px 0' }}>
          {comment.content}
        </Typography.Paragraph>
      )}

      {!comment.deleted && mode === 'view' && (
        <Space size={4}>
          <Button size='small' type='text' icon={<MessageOutlined />} onClick={() => openMode('reply')}>
            답글
          </Button>
          {comment.admin && (
            <Button size='small' type='text' icon={<EditOutlined />} onClick={() => openMode('edit')}>
              수정
            </Button>
          )}
          <Popconfirm
            title='이 댓글을 숨길까요?'
            description={isReply ? '사이트에서 보이지 않게 됩니다.' : '답글이 있으면 "삭제된 댓글입니다."로 표시됩니다.'}
            okText='숨기기'
            cancelText='취소'
            okButtonProps={{ danger: true }}
            onConfirm={() => run(() => deleteCommentByAdmin(comment.id), '숨김 처리했습니다.')}
          >
            <Button size='small' type='text' danger icon={<DeleteOutlined />}>
              숨기기
            </Button>
          </Popconfirm>
        </Space>
      )}

      {mode !== 'view' && (
        <div style={{ marginTop: 8 }}>
          <Input.TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={mode === 'reply' ? `${comment.nickname ?? ''}님에게 관리자 답글` : '댓글 수정'}
            autoSize={{ minRows: 2, maxRows: 6 }}
            maxLength={MAX_LENGTH}
            autoFocus
          />
          <Space style={{ marginTop: 8 }}>
            <Button size='small' onClick={() => setMode('view')} disabled={busy}>
              취소
            </Button>
            <Button size='small' type='primary' onClick={handleSubmit} loading={busy} disabled={!text.trim()}>
              {mode === 'reply' ? '답글 등록' : '수정'}
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
}
