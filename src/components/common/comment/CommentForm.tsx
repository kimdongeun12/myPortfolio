'use client';

import { useId, useState, type FormEvent } from 'react';

import { getErrorMessage } from '@/lib/api';
import clsx from 'clsx';

import type { CommentInput } from './types';

export type CommentFormOptions = {
  contentLabel?: string;
  contentMinLength?: number;
  placeholder?: string;
};

type CommentFormProps = CommentFormOptions & {
  onSubmit: (input: CommentInput) => Promise<void>;
  compact?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
};

const NICKNAME_MIN = 2;
const PASSWORD_MIN = 4;

export default function CommentForm({
  onSubmit,
  compact,
  contentLabel,
  contentMinLength = 1,
  placeholder = '댓글을 남겨주세요',
  submitLabel = '등록하기',
  onCancel,
}: CommentFormProps) {
  const id = useId();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (nickname.trim().length < NICKNAME_MIN) return setError(`닉네임을 ${NICKNAME_MIN}자 이상 작성해주세요.`);
    if (password.length < PASSWORD_MIN) return setError(`비밀번호를 ${PASSWORD_MIN}자 이상 작성해주세요.`);
    if (content.trim().length < contentMinLength)
      return setError(contentMinLength > 1 ? `내용을 ${contentMinLength}자 이상 작성해주세요.` : '내용을 작성해주세요.');

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ nickname: nickname.trim(), password, content: content.trim() });
      setContent('');
    } catch (err) {
      setError(getErrorMessage(err, '등록하지 못했습니다. 잠시 후 다시 시도해주세요.'));
    } finally {
      setSubmitting(false);
    }
  };

  const textarea = (
    <textarea
      id={`${id}-content`}
      className='form-content'
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder={placeholder}
      aria-label={contentLabel ? undefined : '내용'}
      rows={compact ? 2 : 3}
      maxLength={1000}
    />
  );

  return (
    <form
      className={clsx('comment-form', compact && 'is-compact', contentLabel && 'has-labels')}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className='form-row'>
        <label className='form-field' htmlFor={`${id}-nickname`}>
          <span className='field-label'>닉네임</span>
          <input
            id={`${id}-nickname`}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={`${NICKNAME_MIN}자 이상 작성해주세요`}
            autoComplete='nickname'
            maxLength={20}
          />
        </label>
        <label className='form-field' htmlFor={`${id}-password`}>
          <span className='field-label'>비밀번호</span>
          <input
            id={`${id}-password`}
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={`${PASSWORD_MIN}자 이상 작성해주세요`}
            autoComplete='new-password'
            maxLength={30}
          />
        </label>
      </div>

      {contentLabel ? (
        <label className='form-field is-content' htmlFor={`${id}-content`}>
          <span className='field-label'>{contentLabel}</span>
          {textarea}
        </label>
      ) : (
        textarea
      )}

      <div className='form-actions'>
        {error && (
          <p className='form-error' role='alert'>
            {error}
          </p>
        )}
        {onCancel && (
          <button type='button' className='btn-cancel' onClick={onCancel}>
            취소
          </button>
        )}
        <button type='submit' className='btn-submit' disabled={submitting}>
          {submitting ? '등록 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
