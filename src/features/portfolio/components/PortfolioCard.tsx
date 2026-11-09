import Link from 'next/link';
import clsx from 'clsx';

import ImgWrap from '@/components/common/box/ImgWrap';
import ProjectCover from '@/components/common/box/ProjectCover';
import SkillTags from '@/components/common/SkillTags';

import type { PortfolioProject } from '@/features/portfolio/data';

type PortfolioCardProps = {
  project: PortfolioProject;
  /** row: 이미지 왼쪽 + 정보 오른쪽 (Pinned), column: 이미지 위 + 정보 아래 (Other) */
  layout?: 'row' | 'column';
};

export default function PortfolioCard({ project, layout = 'column' }: PortfolioCardProps) {
  return (
    <Link href={`/portfolio/${project.id}`} className={clsx('portfolio-card', `is-${layout}`)}>
      <div className='card-thumb'>
        <ImgWrap type='cover' ratioObj={{ width: 3, height: 2 }}>
          <ProjectCover cover={project.cover} size={layout === 'row' ? 'lg' : 'md'} />
        </ImgWrap>
      </div>
      <div className='card-info'>
        <p className='card-title'>{project.title}</p>
        <p className='card-summary'>{project.summary}</p>
        <SkillTags skills={project.stack} size='sm' />
      </div>
    </Link>
  );
}
