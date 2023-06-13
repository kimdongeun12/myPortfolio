 "use client"
import { useEffect, useRef, useState } from 'react';
import { BsGithub, BsFillBookFill, BsFillEnvelopeHeartFill } from "react-icons/bs";
import Hammer from 'hammerjs';
// if (typeof window !== 'undefined') {
//   require('hammerjs');
// }


import ParticlesUI from '@/src/component/Particles';
import NameUI from '@/src/component/Name';


import '/public/styles/visual.scss';
import Link from 'next/link';

interface IVisualProps {
  open : boolean
}

export default function Visual({open} : IVisualProps) {
  const visualWrap = useRef<HTMLDivElement | null>(null);

  const [drawer, setDrawer] = useState(true);

  useEffect(() => {
    setDrawer(open);
  }, [open]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const visualEl = visualWrap.current;

      if(!visualEl) return;
      let clientWidth = visualEl.clientWidth;
      let move = clientWidth;
      let full = window.innerWidth;
      let minWidth = 400;
      const hammer = new Hammer(visualEl);
      hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_HORIZONTAL });
      hammer.on('pan panstart panend', (event) => {
        switch(event.type) {
          case 'panend' :
            if(Math.abs(event.deltaX) > 300) {
              setDrawer(event.offsetDirection > 3);
              clientWidth = event.offsetDirection > 3 ? full : minWidth;
              if(event.offsetDirection > 3) {
                move = full;
              } else {
                move = minWidth;
              }
            } else {
              move = drawer ? full : minWidth;
            }
            break
          default:
            if(move > full || move < 400) {
              return
            };
            move = clientWidth + event.deltaX;
        }
        if(move > full) move = full;
        if(move < minWidth) move = minWidth;
        visualEl.style.width = `${move}px`;
      });
    }
  }, [drawer])

  return (
    <div className={`visual-wrap ${drawer ? 'open' : ''}`} ref={visualWrap}>
      <ParticlesUI/>
      <div className="visual-top">
        <div><span>조회수 : </span><span>0</span></div>
        <div><span>방명록 : </span><span>0</span></div>
      </div>
      <div className="visual-middle">
        <div className="img-wrap"><span className='img-box'>이미지 영역</span></div>
        <div className="name-wrap mt3">
          <div className='dim'/>
          <div className="name"><NameUI/></div>
          <div className="job kodchasan">{
            'FrontEnd Developer'.split('').map((el,idx) => (
              <span key={`text${idx}`}>{el}</span>
            ))
          }</div>
        </div>
        <div className="nav mt2 kodchasan">
          <Link href="/">Profile</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/portfolio">Portfolio</Link>
        </div>
        <div className="link-wrap mt2">
          <a href='https://github.com/kimdongeun12' target='_blank'><BsGithub /></a>
          <a href='https://velog.io/@kimdongeun12' target='_blank'><BsFillBookFill /></a>
          <a href='mailto:kdedong12@gmail.com'><BsFillEnvelopeHeartFill /></a>
        </div>
      </div>
      <div className='copyright'>© 2023. rlo-orn<br/>All rights reserved.</div>
      <div className='dim'/>
    </div>
  )
}
