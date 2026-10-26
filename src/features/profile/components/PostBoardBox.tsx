import Link from 'next/link';
import clsx from 'clsx';

import type { PostBoard } from '@/features/profile/data';

/** 글 목록 박스 (Blog, Guest Board) */
export default function PostBoardBox({ board }: { board: PostBoard }) {
  return (
    <div className={clsx('box col-6 has-border', board.borderVariant)}>
      <div className='font20 pb-1'>{board.title}</div>
      <ul>
        {board.posts.map((post, idx) => (
          <li key={idx}>
            <Link className='flex-con pt-1 pb-1' href={post.href}>
              <span className='col-9 text-overflow'>{post.title}</span>
              <span className='col-3 ta-r'>{post.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
