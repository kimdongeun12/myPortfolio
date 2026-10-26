import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

type PostStatsProps = {
  views: number;
  likes: number;
  comments: number;
};

/** 조회수 · 좋아요 · 댓글 수 */
export default function PostStats({ views, likes, comments }: PostStatsProps) {
  return (
    <span className='post-stats'>
      <span aria-label={`조회수 ${views}`}>
        <FiEye aria-hidden /> {views}
      </span>
      <span aria-label={`좋아요 ${likes}`}>
        <FiHeart aria-hidden /> {likes}
      </span>
      <span aria-label={`댓글 ${comments}`}>
        <FiMessageCircle aria-hidden /> {comments}
      </span>
    </span>
  );
}
