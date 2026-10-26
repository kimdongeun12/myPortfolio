 "use client"
 import Link from 'next/link';
 import { Swiper, SwiperSlide } from 'swiper/react';
 import { Pagination, Navigation } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';

import 'swiper/css/pagination';
import '@/styles/profile.scss';

import { AmbientBackground } from '@/components/backgrounds';
import ImgWrap from '@/components/common/box/ImgWrap';
import SlideButton from '@/components/common/button/SlideButton';
import { BsFillBookFill, BsFillEnvelopeHeartFill, BsGithub } from 'react-icons/bs';


// 기술 스택 아이콘 (public/images/skills), 여기에 없는 항목은 글자만 표시
const SKILL_ICONS: Record<string, string> = {
  Vue: '/images/skills/vue.svg',
  React: '/images/skills/react.svg',
  Next: '/images/skills/next.svg',
  Javascript: '/images/skills/javascript.svg',
  TypeScript: '/images/skills/typescript.svg',
  Scss: '/images/skills/scss.svg',
  Vuetify: '/images/skills/vuetify.svg',
  Spring: '/images/skills/spring.svg',
  MySQL: '/images/skills/mysql.svg',
  AWS: '/images/skills/aws.svg',
  Jenkins: '/images/skills/jenkins.svg',
  Vite: '/images/skills/vite.svg',
  Bitbucket: '/images/skills/bitbucket.svg',
  Git: '/images/skills/git.svg',
  Figma: '/images/skills/figma.svg',
  Webpack: '/images/skills/webpack.svg',
};

export default function Profile() {
  // 프로젝트 슬라이드 이전/다음 버튼 (클래스 선택자 대신 ref로 연결해 다른 Swiper와 섞이지 않게)
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  // 프로젝트 슬라이드 카운트 (01 / 02)
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideTotal, setSlideTotal] = useState(0);
  const pad2 = (num: number) => String(num).padStart(2, '0');

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
      <div className='content pt-10'>
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
                            el.stack.map((cur, stackIdx) => (
                              <span key={stackIdx}>
                                {SKILL_ICONS[cur] && (
                                  // 장식용 아이콘이라 alt는 비움 (이름은 옆 글자로 읽힘)
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img className='skill-icon' src={SKILL_ICONS[cur]} alt='' width={24} height={24} />
                                )}
                                {cur}
                              </span>
                            ))
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
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              // 첫 렌더 때는 ref가 아직 비어 있으므로 Swiper 초기화 직전에 버튼을 연결
              onBeforeInit={(swiper) => {
                if (typeof swiper.params.navigation === 'object') {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
              }}
              onSwiper={(swiper) => {
                setSlideTotal(swiper.slides.length);
                setSlideIndex(swiper.realIndex);
              }}
              onSlideChange={(swiper) => setSlideIndex(swiper.realIndex)}
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
              <SlideButton ref={prevRef} direction="prev" />
              <div className='paging-progress'>
                <p className='paging-count kodchasan' aria-live='polite'>
                  <span className='current'>{pad2(slideIndex + 1)}</span>
                  <span className='divider'>/</span>
                  <span className='total'>{pad2(slideTotal)}</span>
                </p>
                <div className='swiper-pagination'></div>
              </div>
              <SlideButton ref={nextRef} direction="next" />
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
        <div className='box has-bg contact-wrap'>
          <p className='contact-title'>
            프로젝트의 목표를<br />
            함께 완성해 나갈 동료가 되겠습니다
          </p>
          <div className='contact-info'>
            <a href='tel:01092087621'>010-9208-7621</a>
            <a href='mailto:kdedong12@gmail.com'>kdedong12@gmail.com</a>
          </div>
          <div className='contact-links'>
            <Link href='https://github.com/kimdongeun12' target='_blank' rel='noopener noreferrer' aria-label='GitHub'>
              <BsGithub aria-hidden />
            </Link>
            <Link href='https://velog.io/@kimdongeun12' target='_blank' rel='noopener noreferrer' aria-label='블로그(velog)'>
              <BsFillBookFill aria-hidden />
            </Link>
            <Link href='mailto:kdedong12@gmail.com' aria-label='이메일 보내기'>
              <BsFillEnvelopeHeartFill aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
