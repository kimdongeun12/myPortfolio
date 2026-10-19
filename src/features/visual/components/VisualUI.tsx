 "use client"

import { useEffect, useRef } from 'react';
import { BsGithub, BsFillBookFill, BsFillEnvelopeHeartFill } from "react-icons/bs";
import ParticlesUI from '@/features/visual/components/Particles';
import NameUI from '@/components/common/Name';

import { useBeforeUnload } from '@/hooks/useWindowEvent';
import { useUiStore } from '@/providers/ui-store-provider';
import Link from 'next/link';


export default function VisualUI() {
  const visualWrap = useRef<HTMLDivElement | null>(null);
  const isWindowOpen = useUiStore((state) => state.isWindowOpen);
  const openWindow = useUiStore((state) => state.openWindow);

  useEffect(() => {
    console.log(isWindowOpen, 'asdada')
    if (isWindowOpen) return;
    const dim = document.querySelector('.visual-wrap .dim');
    if (!dim) return;

    dim.addEventListener('animationstart', openWindow, { once: true });
    return () => dim.removeEventListener('animationstart', openWindow);
  }, [isWindowOpen, openWindow]);

  useBeforeUnload();

  return (
    <div className={`visual-wrap ${ !isWindowOpen ? 'loading' : '' }`} ref={visualWrap}>
      <ParticlesUI/>
      {/* <div className="visual-top">
        <div><span>조회수 : </span><span>0</span></div>
        <div><span>방명록 : </span><span>0</span></div>
      </div> */}
      <div className="visual-middle">
        {/* <Avatar size={160} /> */}
        {/* <div className="img-wrap"><span className='img-box'>이미지 영역</span></div> */}
        <div className="name-wrap mt-3">
          {<div className='dim'/>}
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
      {/* <div className='copyright'>© 2023. rlo-orn<br/>All rights reserved.</div> */}
    </div>
  )
}
