import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

type PostStatsProps = {
  likes: number;
  comments: number;
  views?: number;
};

export default function PostStats({ likes, comments, views }: PostStatsProps) {
  return (
    <span className='post-stats'>
      {views !== undefined && (
        <span aria-label={`조회수 ${views}`}>
          <FiEye aria-hidden /> {views}
        </span>
      )}
      <span aria-label={`좋아요 ${likes}`}>
        <FiHeart aria-hidden /> {likes}
      </span>
      <span aria-label={`댓글 ${comments}`}>
        <FiMessageCircle aria-hidden /> {comments}
      </span>
    </span>
  );
}
