 "use client"

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import ParticlesUI from '@/features/visual/components/Particles';
import NameUI from '@/components/common/Name';
import SocialLinks from '@/components/common/SocialLinks';

import { useBeforeUnload } from '@/hooks/useWindowEvent';
import { useUiStore } from '@/providers/ui-store-provider';
import { useVisualScrollTrigger } from '@/features/visual/hooks/useVisualScrollTrigger';


export default function VisualUI() {
  const visualWrap = useRef<HTMLDivElement | null>(null);
  const isWindowOpen = useUiStore((state) => state.isWindowOpen);
  const openWindow = useUiStore((state) => state.openWindow);
  // 처음 화면에 그려질 때 이미 인트로를 본 상태인지 (다른 페이지에 갔다가 돌아온 경우)
  // → 마운트 시점 값으로 고정해서, 첫 방문 중 인트로가 끝나는 순간에는 바뀌지 않게 함
  const [isIntroDone] = useState(isWindowOpen);

  useEffect(() => {
    if (isWindowOpen) return;
    const dim = document.querySelector<HTMLElement>('.visual-wrap .dim');
    if (!dim) return;

    // 하이드레이션이 늦어 리스너를 붙이기 전에 dim 애니메이션이 이미 시작됐다면 바로 처리
    const delayMs = parseFloat(getComputedStyle(dim).animationDelay) * 1000 || 0;
    const alreadyStarted = dim.getAnimations().some(
      (animation) =>
        animation.playState === 'finished' || Number(animation.currentTime ?? 0) >= delayMs,
    );
    if (alreadyStarted) {
      openWindow();
      return;
    }

    dim.addEventListener('animationstart', openWindow, { once: true });
    const fallback = window.setTimeout(openWindow, delayMs + 1000);
    return () => {
      dim.removeEventListener('animationstart', openWindow);
      window.clearTimeout(fallback);
    };
  }, [isWindowOpen, openWindow]);

  useBeforeUnload();
  // GSAP ScrollTrigger 스크롤 연출 (인트로 후 스크롤이 풀리면 위치 재계산)
  useVisualScrollTrigger(visualWrap, isWindowOpen);

  return (
    <div
      className={clsx('visual-wrap', {
        loading: !isWindowOpen,
        'is-intro-done': isIntroDone, // 인트로 애니메이션을 건너뛰고 완료된 모습으로 바로 표시
      })}
      ref={visualWrap}
    >
      {/* 화면에 고정된 채로 스크롤 진행도에 따라 원형으로 닫히는 영역 */}
      <div className="visual-sticky">
      <ParticlesUI/>
      {/* 인트로 dim: 파티클은 덮고, 이름(.visual-middle)은 그 위에 그려지도록 사이에 둠 */}
      <div className='dim'/>
      <div className="visual-middle">
        <div className="name-wrap mt-3">
          <div className="name"><NameUI/></div>
          <div className="job kodchasan">{
            'FrontEnd Developer'.split('').map((el,idx) => (
              <span key={`text${idx}`}>{el}</span>
            ))
          }</div>
        </div>
        <SocialLinks className="link-wrap mt-2" />
      </div>
      </div>
      {/* <div className='copyright'>© 2023. rlo-orn<br/>All rights reserved.</div> */}
    </div>
  )
}
