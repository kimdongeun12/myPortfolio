import '@/styles/portfolio.scss';

import { AmbientCollectionBackground } from '@/components/backgrounds';
import ImgWrap from '@/components/common/box/ImgWrap';
import BackLink from '@/components/common/button/BackLink';
import SkillTags from '@/components/common/SkillTags';

import type { PortfolioProject } from '@/features/portfolio/data';

export default function PortfolioDetail({ project }: { project: PortfolioProject }) {
  return (
    <div className='contents-wrap portfolio-page'>
      {/* 상세는 글 읽기에 집중하도록 가장자리만 은은하게 변하는 배경 */}
      <AmbientCollectionBackground variant='blog-detail' />
      <div className='content'>
        <div className='detail-head'>
          <BackLink href='/portfolio' label='포트폴리오 목록으로' />
          <h2 className='detail-title'>{project.title}</h2>
        </div>

        <div className='detail-body flex-con gap-2'>
          {/* 왼쪽: 프로젝트 정보 */}
          <dl className='detail-meta col-4'>
            <dt>역할</dt>
            <dd>{project.role}</dd>
            <dt>프로젝트 기간</dt>
            <dd>{project.period}</dd>
            <dt>기술 스택</dt>
            <dd>
              <SkillTags skills={project.stack} size='sm' />
            </dd>
            <dt>프로젝트 설명</dt>
            <dd className='meta-desc'>{project.description}</dd>
          </dl>

          {/* 오른쪽: 이미지 + 본문 */}
          <div className='detail-main col-8'>
            <div className='detail-thumb'>
              <ImgWrap ratioObj={{ width: 864, height: 425 }}>
                {project.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.thumbnail} alt={`${project.title} 대표 이미지`} />
                )}
              </ImgWrap>
            </div>
            {project.sections.map((section, idx) => (
              <section className='detail-section' key={idx}>
                {section.heading && <h3 className='section-heading'>{section.heading}</h3>}
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
