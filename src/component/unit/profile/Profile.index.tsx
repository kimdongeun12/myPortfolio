 "use client"
 import Link from 'next/link';
 import { Swiper, SwiperSlide } from 'swiper/react';
 import { Pagination, Navigation } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';

import 'swiper/css/pagination';
import '/public/styles/profile.scss';

import { AmbientBackground } from '@/component/backgrounds';
import ImgWrap from '@/component/common/box/ImgWrap';
import { BsFillBookFill, BsFillEnvelopeHeartFill, BsGithub } from 'react-icons/bs';


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
      desc : '설명 작성 예정',
      stack : ['Vue','React','Next','Javascript','TypeScript','Scss','Vuetify']
    },
    {
      name : 'Back-end',
      desc : '설명 작성 예정',
      stack : ['Spring','MySQL']
    },
    {
      name : 'Tools',
      desc : '설명 작성 예정',
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
        <div className='flex-con gap-2 pb-15'>
          <div className='desc-box'>
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
              <div className='font-24 pb-1'>
                <p>EXPERIENCE</p>
              </div>
              <hr/>
              <div className='pt-2'>
                <ul>
                  {
                    experienceData.map((el,idx) => (
                      <li 
                        className='flex-con'
                        key={idx}>
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
              <div className='font-24 pb-1'>
                <p>SKILLS</p>
              </div>
              <div>
                <ul className='flex-con gap-1'>
                  {
                    skillsData.map((el, idx) => (
                      <li 
                        className='box has-border col-4'
                        key={idx}>
                        <p className='pb-1 font-18'>{el.name}</p>
                        <p className='pb-2 font-14 color-3'>{el.desc}</p>
                        <div className='skill-box'>
                          {
                            el.stack.map((cur, stackIdx) => <span key={stackIdx}>{cur}</span>)
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
        <div className='project-wrap pb-15'>
          <div className='mb-5'>
            <h3 className='font-28 mb-3'>Project</h3>
            <p className='w-3 color-2'>
              에이전시에서 쌓은 UI/UX 경험과 다양한 서비스 개발 경험을 바탕으로,
              디자인과 기술 사이의 균형을 고민하며 더 나은 서비스를 만들어 가고 있습니다.
            </p>
          </div>
          <div className='swipe-wrap'>
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={80}
              slidesPerView={2}
              centeredSlides={true}
              pagination={{
                el: '.swiper-pagination', 
                type: 'progressbar', 
              }}
              navigation= {{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
            >
              <SwiperSlide>
                    <div className='box gap-3 flex-con has-bg'>
                      <div className='col-5'>
                        <ImgWrap
                          ratioObj={{width : 1, height : 1}}>
                            <span></span>
                          </ImgWrap>
                      </div>
                      <div className='info-wrap col-7'>
                        <div className='info-top'>
                          <span className='num'>01</span>
                          <div className='title-wrap'>
                            <p className='font-32 mb-1'>국민지갑</p>
                            <p>프론트엔드 운영 개발</p>
                          </div>
                        </div>
                        <hr className='mt-3 mb-3'/>
                        <div className='info-bottom mb-3'>
                          <ul>
                            <li className='flex-con'>
                              <p className='col-2'>ROLE</p>
                              <p className='col-10'>프론트엔드 운영 및 개발</p>
                            </li>
                            <li className='flex-con'>
                              <p className='col-2'>ROLE</p>
                              <p className='col-10'>프론트엔드 운영 및 개발</p>
                            </li>
                          </ul>
                        </div>
                        <div className='btn-wrap'>
                          <Link className='btn-link' href={'/'}>
                            <span className="deco top"/>
                            자세히보기
                            <span className="deco bottom"/>
                          </Link>
                        </div>
                      </div>
                    </div>
              </SwiperSlide>
              <SwiperSlide>
                    <div className='box gap-3 flex-con has-bg'>
                      <div className='col-5'>
                        <ImgWrap
                          ratioObj={{width : 1, height : 1}}>
                            <span></span>
                          </ImgWrap>
                      </div>
                      <div className='info-wrap col-7'>
                        <div className='info-top'>
                          <span className='num'>01</span>
                          <div className='title-wrap'>
                            <p className='font-32 mb-1'>국민지갑</p>
                            <p>프론트엔드 운영 개발</p>
                          </div>
                        </div>
                        <hr className='mt-3 mb-3'/>
                        <div className='info-bottom mb-3'>
                          <ul>
                            <li className='flex-con'>
                              <p className='col-2'>ROLE</p>
                              <p className='col-10'>프론트엔드 운영 및 개발</p>
                            </li>
                            <li className='flex-con'>
                              <p className='col-2'>ROLE</p>
                              <p className='col-10'>프론트엔드 운영 및 개발</p>
                            </li>
                          </ul>
                        </div>
                        <div className='btn-wrap'>
                          <Link className='btn-link' href={'/'}>
                            <span className="deco top"/>
                            자세히보기
                            <span className="deco bottom"/>
                          </Link>
                        </div>
                      </div>
                    </div>
              </SwiperSlide>
            </Swiper>
            <div className='paging-wrap pt-2'>
              <button className="swiper-button-prev">aa</button>
              <div className='swiper-pagination'></div>
              <button className="swiper-button-next">bb</button>
            </div>
          </div>
        </div>
        <div className='post-wrap'>
          <div className='mb-5'>
            <h3 className='font-28 mb-3'>기록하고, 나눈 이야기들</h3>
          </div>
          <div className='flex-con gap-2 mb-2'>
            <div className='box col-6 has-border'>
              <div className='font20 pb-1'>Blog</div>
              <ul>
                <li>
                  <Link className='flex-con pt-1 pb-1' href={'/'}>
                    <span className='col-9 text-overflow'>여기에는 명칭</span>
                    <span className='col-3 ta-r'>26.10.13</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className='box col-6 has-border border-02'>
              <div className='font20 pb-1'>Guest Board</div>
              <ul>
                <li>
                  <Link className='flex-con pt-1 pb-1' href={'/'}>
                    <span className='col-9 text-overflow'>여기에는 명칭</span>
                    <span className='col-3 ta-r'>26.10.13</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='box has-bg'>
          <div>프로젝트의 목표를 함께 완성해 나갈 동료가 되겠습니다</div>
          <div className=''>
            <span>010-9208-7621</span>
            <span>kdedong12@gmail.com</span>
          </div>
          <div className="link-wrap mt-2">
            <Link href='https://github.com/kimdongeun12' target='_blank'><BsGithub /></Link>
            <Link href='https://velog.io/@kimdongeun12' target='_blank'><BsFillBookFill /></Link>
            <Link href='mailto:kdedong12@gmail.com'><BsFillEnvelopeHeartFill /></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
