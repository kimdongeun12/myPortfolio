'use client';

import { useId, useState, type FormEvent } from 'react';
import clsx from 'clsx';

import type { CommentInput } from './types';

/** 페이지마다 다르게 쓸 수 있는 폼 옵션 (CommentSection에서 그대로 전달) */
export type CommentFormOptions = {
  /** 비밀번호 칸 사용 여부 (기본 true, 방명록은 false) */
  requirePassword?: boolean;
  /** 내용 칸 왼쪽 라벨 (예: "메세지"), 없으면 라벨 없이 placeholder만 */
  contentLabel?: string;
  /** 내용 최소 글자 수 (기본 1) */
  contentMinLength?: number;
  placeholder?: string;
};

type CommentFormProps = CommentFormOptions & {
  onSubmit: (input: CommentInput) => void;
  /** 답글 폼처럼 작은 크기 */
  compact?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
};

const MIN_LENGTH = 2;

/** 닉네임 · (비밀번호) · 내용 입력 폼 */
export default function CommentForm({
  onSubmit,
  compact,
  requirePassword = true,
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (nickname.trim().length < MIN_LENGTH) return setError(`닉네임을 ${MIN_LENGTH}자 이상 작성해주세요.`);
    if (requirePassword && password.length < MIN_LENGTH)
      return setError(`비밀번호를 ${MIN_LENGTH}자 이상 작성해주세요.`);
    if (content.trim().length < contentMinLength)
      return setError(contentMinLength > 1 ? `내용을 ${contentMinLength}자 이상 작성해주세요.` : '내용을 작성해주세요.');

    onSubmit({ nickname: nickname.trim(), password, content: content.trim() });
    setContent('');
    setError('');
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
            placeholder={`${MIN_LENGTH}자 이상 작성해주세요`}
            autoComplete='nickname'
            maxLength={20}
          />
        </label>
        {requirePassword && (
          <label className='form-field' htmlFor={`${id}-password`}>
            <span className='field-label'>비밀번호</span>
            <input
              id={`${id}-password`}
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`${MIN_LENGTH}자 이상 작성해주세요`}
              autoComplete='new-password'
              maxLength={20}
            />
          </label>
        )}
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
        <button type='submit' className='btn-submit'>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
