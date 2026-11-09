import clsx from 'clsx';

import type { ProjectCover as ProjectCoverData } from '@/lib/project-cover';

type ProjectCoverProps = {
  cover: ProjectCoverData;
  size?: 'sm' | 'md' | 'lg';
};

export default function ProjectCover({ cover, size = 'md' }: ProjectCoverProps) {
  return (
    <div className={clsx('project-cover', `size-${size}`)} aria-hidden='true'>
      <div className='cover-top'>
        {cover.label && <span className='cover-label'>{cover.label}</span>}
        {cover.year && <span className='cover-year'>{cover.year}</span>}
      </div>
      <div className='cover-body'>
        <p className='cover-title'>{cover.title}</p>
        {cover.sub && <p className='cover-sub'>{cover.sub}</p>}
      </div>
    </div>
  );
}
