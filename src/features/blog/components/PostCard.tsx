import Link from 'next/link';

import PostStats from '@/features/blog/components/PostStats';
import type { BlogPost } from '@/features/blog/types';

export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.id}`} className='post-card'>
      <p className='post-category'>{post.category}</p>
      <p className='post-title'>{post.title}</p>
      <p className='post-summary'>{post.summary}</p>
      <div className='post-footer'>
        <span className='post-date'>{post.date}</span>
        <PostStats likes={post.likes} comments={post.comments} />
      </div>
    </Link>
  );
}
