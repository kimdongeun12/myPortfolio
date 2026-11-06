'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { FiHeart } from 'react-icons/fi';

import { requestApi } from '@/lib/api';
import type { BlogDetailDto } from '@/lib/api-types';

type LikeResponse = { likeCount: number; liked: boolean };

type LikeButtonProps = {
  postId: string;
  initialCount: number;
};

export default function LikeButton({ postId, initialCount }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    requestApi<BlogDetailDto>(`/api/blogs/${postId}`)
      .then((dto) => {
        if (cancelled) return;
        setCount(dto.likeCount);
        setLiked(dto.liked);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleClick = async () => {
    if (liked || pending) return;
    setPending(true);
    try {
      const result = await requestApi<LikeResponse>(`/api/blogs/${postId}/like`, { method: 'POST' });
      setCount(result.likeCount);
      setLiked(true);
    } catch {
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type='button'
      className={clsx('btn-like', liked && 'is-liked')}
      onClick={handleClick}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? `좋아요 완료, ${count}` : `좋아요, ${count}`}
    >
      <FiHeart aria-hidden />
      <span>{count}</span>
    </button>
  );
}
