'use client';

import { useState, type FormEvent } from 'react';
import { FiCornerDownRight } from 'react-icons/fi';
import clsx from 'clsx';

import { getErrorMessage } from '@/lib/api';
import { formatRelativeTime } from '@/lib/format';

import CommentForm, { type CommentFormOptions } from './CommentForm';
import type { CommentData, CommentInput } from './types';

export type CommentActions = {
  onEdit: (id: string, password: string, content: string) => Promise<void>;
  onDelete: (id: string, password: string) => Promise<void>;
};

type ManageMode = 'edit' | 'delete';

type ManageFormProps = {
  mode: ManageMode;
  initialContent: string;
  onSubmit: (password: string, content: string) => Promise<void>;
  onCancel: () => void;
};

function ManageForm({ mode, initialContent, onSubmit, onCancel }: ManageFormProps) {
  const [password, setPassword] = useState('');
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!password) return setError('비밀번호를 입력해주세요.');
    if (mode === 'edit' && !content.trim()) return setError('내용을 작성해주세요.');
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(password, content.trim());
    } catch (err) {
      setError(getErrorMessage(err, '처리하지 못했습니다. 잠시 후 다시 시도해주세요.'));
      setSubmitting(false);
    }
  };

  return (
    <form className='comment-form is-compact comment-manage' onSubmit={handleSubmit} noValidate>
      <div className='form-row'>
        <label className='form-field'>
          <span className='field-label'>비밀번호</span>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='작성할 때 입력한 비밀번호'
            autoComplete='current-password'
            maxLength={30}
          />
        </label>
      </div>
      {mode === 'edit' && (
        <textarea
          className='form-content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label='수정할 내용'
          rows={2}
          maxLength={1000}
        />
      )}
      <div className='form-actions'>
        {error && (
          <p className='form-error' role='alert'>
            {error}
          </p>
        )}
        <button type='button' className='btn-cancel' onClick={onCancel}>
          취소
        </button>
        <button type='submit' className='btn-submit' disabled={submitting}>
          {mode === 'edit' ? '수정하기' : '삭제하기'}
        </button>
      </div>
    </form>
  );
}

type CommentItemProps = {
  comment: CommentData;
  depth?: number;
  replyingTo: string | null;
  onToggleReply: (id: string | null) => void;
  onReply: (parentId: string, input: CommentInput) => Promise<void>;
  formOptions?: CommentFormOptions;
  actions?: CommentActions;
};

export default function CommentItem({
  comment,
  depth = 0,
  replyingTo,
  onToggleReply,
  onReply,
  formOptions,
  actions,
}: CommentItemProps) {
  const [mode, setMode] = useState<ManageMode | null>(null);
  const isReplying = replyingTo === comment.id;
  const canManage = !!actions && !comment.deleted && !comment.admin;

  return (
    <li className={depth === 0 ? 'comment-thread' : 'comment-reply'}>
      <article className={clsx('comment-item', comment.deleted && 'is-deleted', comment.admin && 'is-admin')}>
        <span className='comment-avatar' aria-hidden='true'>
          {comment.nickname.slice(0, 1)}
        </span>
        <div className='comment-body'>
          <p className='comment-meta'>
            <strong className='comment-nickname'>{comment.nickname}</strong>
            {comment.admin && !comment.deleted && <span className='comment-badge'>작성자</span>}
            <time dateTime={comment.createdAt}>{formatRelativeTime(comment.createdAt)}</time>
            {comment.edited && <span className='comment-edited'>수정됨</span>}
          </p>
          <p className='comment-content'>{comment.content}</p>
          {!comment.deleted && (
            <div className='comment-actions'>
              <button
                type='button'
                className='btn-reply'
                aria-expanded={isReplying}
                onClick={() => onToggleReply(isReplying ? null : comment.id)}
              >
                <FiCornerDownRight aria-hidden />
                댓글쓰기
              </button>
              {canManage && (
                <>
                  <button
                    type='button'
                    className='btn-reply'
                    aria-expanded={mode === 'edit'}
                    onClick={() => setMode(mode === 'edit' ? null : 'edit')}
                  >
                    수정
                  </button>
                  <button
                    type='button'
                    className='btn-reply'
                    aria-expanded={mode === 'delete'}
                    onClick={() => setMode(mode === 'delete' ? null : 'delete')}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          )}
          {mode && actions && (
            <ManageForm
              key={mode}
              mode={mode}
              initialContent={comment.content}
              onCancel={() => setMode(null)}
              onSubmit={async (password, content) => {
                if (mode === 'edit') await actions.onEdit(comment.id, password, content);
                else await actions.onDelete(comment.id, password);
                setMode(null);
              }}
            />
          )}
          {isReplying && (
            <CommentForm
              {...formOptions}
              compact
              placeholder={`${comment.nickname}님에게 답글 남기기`}
              onCancel={() => onToggleReply(null)}
              onSubmit={async (input) => {
                await onReply(comment.id, input);
                onToggleReply(null);
              }}
            />
          )}
        </div>
      </article>

      {comment.replies && comment.replies.length > 0 && (
        <ul className='comment-replies'>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={1}
              replyingTo={replyingTo}
              onToggleReply={onToggleReply}
              onReply={onReply}
              formOptions={formOptions}
              actions={actions}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
