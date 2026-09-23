 "use client"

import { useEffect, useRef, useState } from 'react';
import { BsGithub, BsFillBookFill, BsFillEnvelopeHeartFill } from "react-icons/bs";
import ParticlesUI from '@/component/unit/visual/Particles';
import NameUI from '@/component/common/Name';

import { useBeforeUnload } from '@/commons/hooks/customs/useWindowEvent';

interface IVisualProps {
  visual : boolean
}

export default function VisualUI({visual} : IVisualProps) {
  const visualWrap = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(!visual);
  
  useEffect(() => {
    const dim = document.querySelector('.visual-wrap .dim');
    if(loading) return;
    dim?.addEventListener('animationstart', (e) => {
      setLoading(true)
    })
  }, [visual]);

  useBeforeUnload();

  return (
    <div className={`visual-wrap ${ !loading ? 'loading' : '' }`} ref={visualWrap}>
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
          <a href='https://github.com/kimdongeun12' target='_blank'><BsGithub /></a>
          <a href='https://velog.io/@kimdongeun12' target='_blank'><BsFillBookFill /></a>
          <a href='mailto:kdedong12@gmail.com'><BsFillEnvelopeHeartFill /></a>
        </div>
      </div>
      {/* <div className='copyright'>© 2023. rlo-orn<br/>All rights reserved.</div> */}
    </div>
  )
}
