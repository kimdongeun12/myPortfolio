import ImgWrap from '@/components/common/box/ImgWrap';
import ProjectCover from '@/components/common/box/ProjectCover';
import DecoLink from '@/components/common/button/DecoLink';
import { padNumber } from '@/lib/format';

import type { Project } from '@/features/profile/data';

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <div className='project-card box gap-3 flex-con has-bg'>
      <div className='col-4'>
        <ImgWrap type='cover' ratioObj={{ width: 1, height: 1 }}>
          <ProjectCover cover={project.cover} size='lg' />
        </ImgWrap>
      </div>
      <div className='info-wrap col-8'>
        <div className='info-top'>
          <span className='num'>{padNumber(index + 1)}</span>
          <div className='title-wrap'>
            <p className='font-32 mb-1'>{project.title}</p>
            <p>{project.subtitle}</p>
          </div>
        </div>
        <hr className='mt-3 mb-3' />
        <div className='info-bottom mb-3'>
          <ul>
            {project.roles.map((role) => (
              <li className='flex-con' key={role.label}>
                <p className='col-2'>{role.label}</p>
                <p className='col-10'>{role.value}</p>
              </li>
            ))}
          </ul>
          {project.highlights.length > 0 && (
            <ul className='info-highlights mt-2'>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}
        </div>
        <div className='btn-wrap'>
          <DecoLink href={project.href}>자세히보기</DecoLink>
        </div>
      </div>
    </div>
  );
}
