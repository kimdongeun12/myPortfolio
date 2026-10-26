'use client';

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css/pagination';

import SlideButton from '@/components/common/button/SlideButton';
import { padNumber } from '@/lib/format';

import ProjectCard from '@/features/profile/components/ProjectCard';
import type { Project } from '@/features/profile/data';

/**
 * 프로젝트 슬라이드 + 이전/다음 버튼 + 진행바 위 카운트(01 / 02)
 */
export default function ProjectSlider({ projects }: { projects: Project[] }) {
  // 클래스 선택자 대신 ref로 연결해 다른 Swiper와 섞이지 않게
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideTotal, setSlideTotal] = useState(projects.length);

  return (
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
        {projects.map((project, idx) => (
          <SwiperSlide key={idx}>
            <ProjectCard project={project} index={idx} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='paging-wrap pt-2'>
        <SlideButton ref={prevRef} direction="prev" />
        <div className='paging-progress'>
          <p className='paging-count kodchasan' aria-live='polite'>
            <span className='current'>{padNumber(slideIndex + 1)}</span>
            <span className='divider'>/</span>
            <span className='total'>{padNumber(slideTotal)}</span>
          </p>
          <div className='swiper-pagination'></div>
        </div>
        <SlideButton ref={nextRef} direction="next" />
      </div>
    </div>
  );
}
