import Link from 'next/link';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { AmbientCollectionBackground } from '@/components/backgrounds';
import { CommentSection } from '@/components/common/comment';
import TagChip from '@/components/common/TagChip';

import BlogSidebar from '@/features/blog/components/BlogSidebar';
import PostStats from '@/features/blog/components/PostStats';
import TableOfContents from '@/features/blog/components/TableOfContents';
import { countComments } from '@/features/blog/data';
import type { BlogPost } from '@/features/blog/types';

type BlogDetailProps = {
  post: BlogPost;
  prev?: BlogPost;
  next?: BlogPost;
};

export default function BlogDetail({ post, prev, next }: BlogDetailProps) {
  return (
    <div className='contents-wrap blog-page'>
      <AmbientCollectionBackground variant='blog-detail' />
      <div className='content blog-layout'>
        <BlogSidebar>
          <Link href='/blog' className='back-to-list'>
            <FiArrowLeft aria-hidden /> 목록 보기
          </Link>
          <TableOfContents items={post.sections.map((s) => ({ id: s.id, label: s.heading }))} />
        </BlogSidebar>

        <article className='blog-main post-detail'>
          <header className='detail-header'>
            <p className='post-category'>{post.category}</p>
            <h2 className='detail-title'>{post.title}</h2>
            <p className='detail-meta'>
              <span className='post-date'>{post.date}</span>
              <PostStats views={post.views} likes={post.likes} comments={countComments(post.comments)} />
            </p>
          </header>

          <div className='detail-content'>
            {post.sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h3>{section.heading}</h3>
                {section.paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <div className='detail-tags'>
            {post.tags.map((tag) => (
              <TagChip key={tag} label={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>

          <nav className='post-nav' aria-label='이전글, 다음글'>
            {prev ? (
              <Link href={`/blog/${prev.id}`} className='nav-item is-prev'>
                <FiArrowLeft aria-hidden />
                <span>
                  <small>이전글</small>
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/blog/${next.id}`} className='nav-item is-next'>
                <span>
                  <small>다음글</small>
                  {next.title}
                </span>
                <FiArrowRight aria-hidden />
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <CommentSection initialComments={post.comments} />
        </article>
      </div>
    </div>
  );
}
