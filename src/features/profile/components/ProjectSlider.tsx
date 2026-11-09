'use client';

import { useState, type ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, EffectCards, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';

import 'swiper/css/effect-cards';

import SlideButton from '@/components/common/button/SlideButton';
import { padNumber } from '@/lib/format';

import ProjectCard from '@/features/profile/components/ProjectCard';
import type { Project } from '@/features/profile/data';

type ProjectSliderProps = {
  projects: Project[];
  children?: ReactNode;
};

const syncHiddenSlides = (instance: SwiperInstance) => {
  instance.slides.forEach((slide, idx) => {
    const hidden = idx !== instance.activeIndex;
    slide.inert = hidden;
    slide.setAttribute('aria-hidden', String(hidden));
  });
};

export default function ProjectSlider({ projects, children }: ProjectSliderProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const total = projects.length;
  const canSlide = total > 1;
  const slides = canSlide && total < 6 ? [...projects, ...projects] : projects;

  return (
    <div className='project-deck'>
      <div className='deck-intro'>
        {children}
        {canSlide && (
          <div className='deck-controls'>
            <SlideButton direction='prev' onClick={() => swiper?.slidePrev()} />
            <SlideButton direction='next' className='is-primary' onClick={() => swiper?.slideNext()} />
            <p className='deck-count kodchasan' aria-live='polite'>
              <span className='current'>{padNumber(slideIndex + 1)}</span>
              <span className='divider'>/</span>
              <span className='total'>{padNumber(total)}</span>
            </p>
          </div>
        )}
      </div>
      <div className='deck-stage'>
        <Swiper
          className='deck-swiper'
          modules={[EffectCards, Keyboard, A11y]}
          effect='cards'
          grabCursor={canSlide}
          allowTouchMove={canSlide}
          loop={canSlide}
          cardsEffect={{ rotate: false, perSlideOffset: 10, slideShadows: false }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          a11y={{ prevSlideMessage: '이전 프로젝트', nextSlideMessage: '다음 프로젝트' }}
          onSwiper={(instance) => {
            setSwiper(instance);
            syncHiddenSlides(instance);
          }}
          onProgress={(instance) => {
            instance.slides.forEach((slide) => {
              const progress = (slide as HTMLElement & { progress: number }).progress;
              const opacity = progress > 0 ? 1 - progress : progress < -2 ? 3 + progress : 1;
              slide.style.opacity = String(Math.min(1, Math.max(0, opacity)));
            });
          }}
          onSlideChange={(instance) => {
            setSlideIndex(instance.realIndex % total);
            syncHiddenSlides(instance);
          }}
        >
          {slides.map((project, idx) => (
            <SwiperSlide key={`${project.id}-${idx}`}>
              <ProjectCard project={project} index={idx % total} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
