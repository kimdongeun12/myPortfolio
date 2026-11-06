'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';

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
  const swiperRef = useRef<SwiperInstance | null>(null);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;
    if (typeof swiper.params.navigation === 'object') {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
    }
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  return (
    <div className='swipe-wrap'>
      <Swiper
        modules={[Pagination, Navigation]}
        // 모바일 기준값 + 화면이 넓어질수록 (Swiper breakpoints는 min-width 기준)
        spaceBetween={16}
        slidesPerView={1.1}
        centeredSlides={true}
        breakpoints={{
          769: { slidesPerView: 1.4, spaceBetween: 40 },  // 768px 초과
          1025: { slidesPerView: 2, spaceBetween: 80 },   // 1024px 초과 (기존 데스크톱)
        }}
        pagination={{
          el: '.swiper-pagination',
          type: 'progressbar',
        }}
        navigation={{
          prevEl: null,
          nextEl: null,
        }}
        onSwiper={(instance) => {
          swiperRef.current = instance;
          setSlideTotal(instance.slides.length);
          setSlideIndex(instance.realIndex);
        }}
        onSlideChange={(instance) => setSlideIndex(instance.realIndex)}
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
