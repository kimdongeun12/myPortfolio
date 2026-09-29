 "use client"
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import '/public/styles/profile.scss';

import { AmbientBackground } from '@/component/backgrounds';


export default function Profile() {
  const experienceData = [
    {
      startDate : '20230621',
      endDate : '재직중',
      name : '(주) 클러쉬 | (전) 디씨온',
      job : 'KB개발담당',
      info : '국민지갑 플랫폼의 프론트엔드 업무를 리딩하며 구조 설계, 공통화, 서비스 개발과 운영을 경험했습니다. SSO 인증, GLN 해외결제, 메인 UI 고도화, 기차예매 개선 등 다양한 금융 서비스를 담당했고, 합병 이후에도 플랫폼 개발과 운영, 재사용 구조 개선을 이어가고 있습니다.'
    },
    {
      startDate : '20230621',
      endDate : '재직중',
      name : '(주) 클러쉬 | (전) 디씨온',
      job : 'KB개발담당',
      info : '국민지갑 플랫폼의 프론트엔드 업무를 리딩하며 구조 설계, 공통화, 서비스 개발과 운영을 경험했습니다. SSO 인증, GLN 해외결제, 메인 UI 고도화, 기차예매 개선 등 다양한 금융 서비스를 담당했고, 합병 이후에도 플랫폼 개발과 운영, 재사용 구조 개선을 이어가고 있습니다.'
    },
  ]
  const skillsData = [
    {
      name : 'Front-end',
      desc : '',
      stack : ['Vue','React','Next','Javascript','TypeScript','Scss','Vuetify']
    },
    {
      name : 'Back-end',
      desc : '',
      stack : ['Spring','MySQL']
    },
    {
      name : 'Tools',
      desc : '',
      stack : ['AWS','Jenkins','Vite','Bitbucket','Git','Figma','Webpack']
    },
  ]

  return (
    <div className="contents-wrap">
      <AmbientBackground />
      <div className='content'>
        <div className='mb-5'>
          <h2 className='font-28'>안녕하세요!<br/><span className='color-9'>프론트엔드 개발자</span> 김동은 입니다.</h2>
        </div>
        <div className='flex-con gap-2'>
          <div className='desc'>
            <p>에이전시에서 쌓은 UI/UX 경험과 다양한 서비스 개발 경험을 바탕으로, 디자인과 기술 사이의 균형을 고민하며 더 나은 서비스를 만들어 가고 있습니다.</p>
          </div>
          <div>
            <div className='about-wrap mb-10'>
              <div className='about-box flex-con gap-2'>
                <div className='about-info right col-8'>
                  <ul className='info-box flex-con gap-2'>
                    <li className='col-3'>
                      <div>
                        <p className='mb-1 color-1 font-14'>01</p>
                        <p className='mb-1 color-9'>사용자 경험</p>
                        <p className='color-3 font-14'>사용자가 자연스럽게 서비스를 이용할 수 있는 인터페이스와 흐름을 고민합니다.</p>
                      </div>
                    </li>
                    <li className='col-3'>
                      <div>
                        <p className='mb-1 color-1 font-14'>02</p>
                        <p className='mb-1 color-9'>구조와 재사용</p>
                        <p className='color-3 font-14'>반복되는 UI와 로직을 정리해 유지보수하기 좋은 구조를 만들어 갑니다.</p>
                      </div>
                    </li>
                    <li className='col-3'>
                      <div>
                        <p className='mb-1 color-1 font-14'>03</p>
                        <p className='mb-1 color-9'>안정적인 서비스</p>
                        <p className='color-3 font-14'>개발과 운영 경험을 바탕으로 안정적으로 지속될 수 있는 서비스를 고민합니다.</p>
                      </div>
                    </li>
                    <li className='col-3'>
                      <div>
                        <p className='mb-1 color-1 font-14'>04</p>
                        <p className='mb-1 color-9'>함께 만드는 개발</p>
                        <p className='color-3 font-14'>다양한 직군과 소통하며 더 나은 해결책을 함께 찾아갑니다.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='experience-wrap mb-10'>
              <div className='font-20 pb-1'>
                <p>EXPERIENCE</p>
              </div>
              <hr/>
              <div className='pt-2'>
                <ul>
                  {
                    experienceData.map((el) => (
                      <li className='flex-con'>
                        <span className='deco'/>
                        <div className='col-3'>
                          <p className='pb-1 color-3 font-14'>{el.startDate} - {el.endDate}</p>
                          <p className='pb-1'>{el.name}</p>
                          <p className='font-14'>{el.job}</p>
                        </div>
                        <div  className='col-9'>
                          {el.info}
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
              <hr/>
            </div>
            <div className='skills-wrap'>
              <div className='font-20 pb-1'>
                <p>SKILLS</p>
              </div>
              <div>
                <ul>
                  {
                    skillsData.map((el) => (
                      <li>
                        <p>{el.name}</p>
                        <p>{el.desc}</p>
                        <div>
                          {
                            el.stack.map((cur) => <span>{cur}</span>)
                          }
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            Project
          </div>
        </div>
      </div>
    </div>
  )
}
