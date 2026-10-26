'use client';

import { FiCornerDownRight } from 'react-icons/fi';

import { formatRelativeTime } from '@/lib/format';

import CommentForm from './CommentForm';
import type { CommentData, CommentInput } from './types';

type CommentItemProps = {
  comment: CommentData;
  /** 0: 댓글, 1: 답글 (답글은 한 단계까지만 들여쓰기) */
  depth?: number;
  /** 지금 답글 폼이 열려 있는 댓글 id */
  replyingTo: string | null;
  onToggleReply: (id: string | null) => void;
  /** threadId: 답글이 달릴 최상위 댓글 id */
  onReply: (threadId: string, input: CommentInput) => void;
  threadId?: string;
};

export default function CommentItem({
  comment,
  depth = 0,
  replyingTo,
  onToggleReply,
  onReply,
  threadId = comment.id,
}: CommentItemProps) {
  const isReplying = replyingTo === comment.id;

  return (
    <li className={depth === 0 ? 'comment-thread' : 'comment-reply'}>
      <article className='comment-item'>
        <span className='comment-avatar' aria-hidden='true'>
          {comment.nickname.slice(0, 1)}
        </span>
        <div className='comment-body'>
          <p className='comment-meta'>
            <strong className='comment-nickname'>{comment.nickname}</strong>
            <time dateTime={comment.createdAt}>{formatRelativeTime(comment.createdAt)}</time>
          </p>
          <p className='comment-content'>{comment.content}</p>
          <button
            type='button'
            className='btn-reply'
            aria-expanded={isReplying}
            onClick={() => onToggleReply(isReplying ? null : comment.id)}
          >
            <FiCornerDownRight aria-hidden />
            댓글쓰기
          </button>
          {isReplying && (
            <CommentForm
              compact
              placeholder={`${comment.nickname}님에게 답글 남기기`}
              onCancel={() => onToggleReply(null)}
              onSubmit={(input) => {
                // 답글에 답글을 달아도 같은 스레드(최상위 댓글) 아래에 이어서 표시
                onReply(threadId, input);
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
              threadId={threadId}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
