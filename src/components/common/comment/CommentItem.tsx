'use client';

import { FiCornerDownRight } from 'react-icons/fi';
import clsx from 'clsx';

import { formatRelativeTime } from '@/lib/format';

import CommentForm, { type CommentFormOptions } from './CommentForm';
import type { CommentData, CommentInput } from './types';

type CommentItemProps = {
  comment: CommentData;
  depth?: number;
  replyingTo: string | null;
  onToggleReply: (id: string | null) => void;
  onReply: (parentId: string, input: CommentInput) => Promise<void>;
  formOptions?: CommentFormOptions;
};

export default function CommentItem({
  comment,
  depth = 0,
  replyingTo,
  onToggleReply,
  onReply,
  formOptions,
}: CommentItemProps) {
  const isReplying = replyingTo === comment.id;

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
            <button
              type='button'
              className='btn-reply'
              aria-expanded={isReplying}
              onClick={() => onToggleReply(isReplying ? null : comment.id)}
            >
              <FiCornerDownRight aria-hidden />
              댓글쓰기
            </button>
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
            />
          ))}
        </ul>
      )}
    </li>
  );
}
