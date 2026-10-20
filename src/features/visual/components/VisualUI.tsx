 "use client"

import { useEffect, useRef } from 'react';
import { BsGithub, BsFillBookFill, BsFillEnvelopeHeartFill } from "react-icons/bs";
import ParticlesUI from '@/features/visual/components/Particles';
import NameUI from '@/components/common/Name';

import { useBeforeUnload } from '@/hooks/useWindowEvent';
import { useUiStore } from '@/providers/ui-store-provider';
import { useVisualScrollTrigger } from '@/features/visual/hooks/useVisualScrollTrigger';
import Link from 'next/link';


export default function VisualUI() {
  const visualWrap = useRef<HTMLDivElement | null>(null);
  const isWindowOpen = useUiStore((state) => state.isWindowOpen);
  const openWindow = useUiStore((state) => state.openWindow);

  useEffect(() => {
    console.log(isWindowOpen, 'asdada')
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
    return () => dim.removeEventListener('animationstart', openWindow);
  }, [isWindowOpen, openWindow]);

  useBeforeUnload();
  // GSAP ScrollTrigger 스크롤 연출 (인트로 후 스크롤이 풀리면 위치 재계산)
  useVisualScrollTrigger(visualWrap, isWindowOpen);

  return (
    <div className={`visual-wrap ${ !isWindowOpen ? 'loading' : '' }`} ref={visualWrap}>
      {/* 화면에 고정된 채로 스크롤 진행도에 따라 원형으로 닫히는 영역 */}
      <div className="visual-sticky">
      <ParticlesUI/>
      {/* 인트로 dim: 파티클은 덮고, 이름(.visual-middle)은 그 위에 그려지도록 사이에 둠 */}
      <div className='dim'/>
      {/* <div className="visual-top">
        <div><span>조회수 : </span><span>0</span></div>
        <div><span>방명록 : </span><span>0</span></div>
      </div> */}
      <div className="visual-middle">
        {/* <Avatar size={160} /> */}
        {/* <div className="img-wrap"><span className='img-box'>이미지 영역</span></div> */}
        <div className="name-wrap mt-3">
          <div className="name"><NameUI/></div>
          <div className="job kodchasan">{
            'FrontEnd Developer'.split('').map((el,idx) => (
              <span key={`text${idx}`}>{el}</span>
            ))
          }</div>
        </div>
        <div className="link-wrap mt-2">
          <Link href='https://github.com/kimdongeun12' target='_blank'><BsGithub /></Link>
          <Link href='https://velog.io/@kimdongeun12' target='_blank'><BsFillBookFill /></Link>
          <Link href='mailto:kdedong12@gmail.com'><BsFillEnvelopeHeartFill /></Link>
        </div>
      </div>
      </div>
      {/* <div className='copyright'>© 2023. rlo-orn<br/>All rights reserved.</div> */}
    </div>
  )
}
