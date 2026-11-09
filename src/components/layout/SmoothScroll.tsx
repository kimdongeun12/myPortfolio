'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis 부드러운 스크롤 + GSAP ScrollTrigger 동기화
 * - 휠 한 번에 페이지가 뚝뚝 이동하지 않고, 매 프레임 조금씩 보간되며 이동
 *   → 에너지 절약 모드(30fps 제한)에서도 계단처럼 끊겨 보이지 않음
 * - Lenis를 GSAP ticker로 구동해서 ScrollTrigger와 같은 프레임에 갱신
 * - 실제 window 스크롤 위치를 쓰기 때문에 position: sticky, 스크롤 이벤트는 그대로 동작
 * - 움직임 줄이기 설정이면 사용하지 않음 (브라우저 기본 스크롤)
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (window.matchMedia('(pointer: coarse)').matches) {
      ScrollTrigger.config({ ignoreMobileResize: true });
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,             // 0~1, 작을수록 더 미끄럽게(천천히) 따라감
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000); // GSAP ticker는 초 단위
    gsap.ticker.add(raf);
    // 프레임이 밀렸을 때 GSAP가 시간을 건너뛰지 않도록 (스크롤 위치와 어긋남 방지)
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // GSAP 기본값으로 복구
      lenis.destroy();
    };
  }, []);

  return null;
}
