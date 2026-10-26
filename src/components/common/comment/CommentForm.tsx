'use client';

import { useId, useState, type FormEvent } from 'react';
import clsx from 'clsx';

import type { CommentInput } from './types';

type CommentFormProps = {
  onSubmit: (input: CommentInput) => void;
  /** 답글 폼처럼 작은 크기 */
  compact?: boolean;
  placeholder?: string;
  submitLabel?: string;
  onCancel?: () => void;
};

const MIN_LENGTH = 2;

/** 닉네임 · 비밀번호 · 내용 입력 폼 */
export default function CommentForm({
  onSubmit,
  compact,
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
    if (password.length < MIN_LENGTH) return setError(`비밀번호를 ${MIN_LENGTH}자 이상 작성해주세요.`);
    if (!content.trim()) return setError('내용을 작성해주세요.');

    onSubmit({ nickname: nickname.trim(), password, content: content.trim() });
    setContent('');
    setError('');
  };

  return (
    <form className={clsx('comment-form', compact && 'is-compact')} onSubmit={handleSubmit} noValidate>
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
      </div>
      <textarea
        className='form-content'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        aria-label='댓글 내용'
        rows={compact ? 2 : 3}
        maxLength={1000}
      />
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
