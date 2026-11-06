import { FiHeart, FiMessageCircle } from 'react-icons/fi';

type PostStatsProps = {
  likes: number;
  comments: number;
};

export default function PostStats({ likes, comments }: PostStatsProps) {
  return (
    <span className='post-stats'>
      <span aria-label={`좋아요 ${likes}`}>
        <FiHeart aria-hidden /> {likes}
      </span>
      <span aria-label={`댓글 ${comments}`}>
        <FiMessageCircle aria-hidden /> {comments}
      </span>
    </span>
  );
}
