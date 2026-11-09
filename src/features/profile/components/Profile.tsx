"use client"

import '@/styles/profile.scss';

import { AmbientBackground } from '@/components/backgrounds';
import SkillTags from '@/components/common/SkillTags';
import SocialLinks from '@/components/common/SocialLinks';
import profile from '@/data/profile';
import { padNumber } from '@/lib/format';

import PostBoardBox from '@/features/profile/components/PostBoardBox';
import ProjectSlider from '@/features/profile/components/ProjectSlider';
import { ABOUT_ITEMS, type ProfileData } from '@/features/profile/data';

export default function Profile({ experiences, skillGroups, projects, postBoards }: ProfileData) {
  return (
    <div className="contents-wrap">
      <AmbientBackground />
      <div className='content pt-10'>
        <div className='mb-5'>
          <h2 className='font-28'>안녕하세요!<br/><span className='color-9'>프론트엔드 개발자</span> 김동은 입니다.</h2>
        </div>
        <div className='profile-intro flex-con gap-2 pb-15'>
          <div className='desc-box'>
            <p>사용자는 화면으로 서비스를 만납니다. 금융 플랫폼에서 5년간 그 화면을 만들며, 쓰기 쉬운 흐름과 고치기 쉬운 코드를 함께 챙겨 왔습니다.</p>
          </div>
          <div className='profile-main'>
            <div className='about-wrap mb-10'>
              <div className='about-box flex-con gap-2'>
                <div className='about-info right col-8'>
                  <ul className='info-box flex-con gap-2'>
                    {ABOUT_ITEMS.map((item, idx) => (
                      <li className='col-3' key={item.title}>
                        <div>
                          <p className='mb-1 color-1 font-14'>{padNumber(idx + 1)}</p>
                          <p className='mb-1 color-9'>{item.title}</p>
                          <p className='color-3 font-14'>{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='experience-wrap mb-10'>
              <div className='font-24 pb-1'>
                <p>EXPERIENCE</p>
              </div>
              <hr/>
              <div className='pt-2'>
                <ul>
                  {experiences.map((el) => (
                    <li className='experience-item flex-con' key={el.id}>
                      <span className='deco'/>
                      <div className='col-3'>
                        <p className='pb-1 color-3 font-14'>{el.startDate} - {el.endDate}</p>
                        <p className='pb-1'>{el.name}</p>
                        <p className='font-14'>{el.job}</p>
                      </div>
                      <div className='col-9'>
                        <p>{el.info}</p>
                        {el.tasks.length > 0 && (
                          <div className='experience-detail pt-2'>
                            <p className='pb-1 color-9 font-14'>주요 업무</p>
                            <ul className='color-3 font-14'>
                              {el.tasks.map((task) => (
                                <li key={task}>{task}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {el.achievements.length > 0 && (
                          <div className='experience-detail pt-2'>
                            <p className='pb-1 color-9 font-14'>주요 성과</p>
                            <ul className='color-2 font-14'>
                              {el.achievements.map((achievement) => (
                                <li key={achievement}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <hr/>
            </div>
            <div className='skills-wrap'>
              <div className='font-24 pb-1'>
                <p>SKILLS</p>
              </div>
              <div>
                <ul className='skill-groups flex-con gap-1'>
                  {skillGroups.map((group) => (
                    <li className='box has-border col-4' key={group.id}>
                      <p className='pb-1 font-18'>{group.name}</p>
                      <p className='pb-2 font-14 color-3'>{group.desc}</p>
                      <SkillTags skills={group.stack} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='project-wrap pb-15'>
          <ProjectSlider projects={projects}>
            <h3 className='font-28 mb-3'>Project</h3>
            <p className='keep-all color-2'>
              에이전시에서 쌓은 UI/UX 경험과 다양한 서비스 개발 경험을 바탕으로,
              디자인과 기술 사이의 균형을 고민하며 더 나은 서비스를 만들어 가고 있습니다.
            </p>
          </ProjectSlider>
        </div>
        <div className='post-wrap'>
          <div className='mb-5'>
            <h3 className='font-28 mb-3'>기록하고, 나눈 이야기들</h3>
          </div>
          <div className='post-boards flex-con gap-2 mb-2'>
            {postBoards.map((board) => (
              <PostBoardBox board={board} key={board.title} />
            ))}
          </div>
        </div>
        <div className='box has-bg contact-wrap'>
          <p className='contact-title'>
            프로젝트의 목표를<br />
            함께 완성해 나갈 동료가 되겠습니다
          </p>
          <div className='contact-info'>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <SocialLinks className='contact-links' />
        </div>
      </div>
    </div>
  )
}
