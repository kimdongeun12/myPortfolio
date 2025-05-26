 "use client"

import { useEffect, useRef, useState } from 'react';
import { BsGithub, BsFillBookFill, BsFillEnvelopeHeartFill } from "react-icons/bs";
import ParticlesUI from '@/component/unit/visual/Particles';
import NameUI from '@/component/common/Name';

// import Hammer from 'hammerjs';
const Hammer = typeof window !== 'undefined' ? require('hammerjs') : undefined;

import '/public/styles/visual.scss';
import Link from 'next/link';
import { removeCookie, setCookie } from '@/commons/hooks/customs/useCookie';
import {useBeforeUnload, useWindowResize} from '@/commons/hooks/customs/useWindowEvent';
import { MouseInput } from 'hammerjs';
import { Avatar } from 'antd';
import ImgWrap from '@/component/common/box/ImgWrap';

interface IVisualProps {
  visual : boolean
}

export default function VisualUI({visual} : IVisualProps) {
  const visualWrap = useRef<HTMLDivElement | null>(null);
  const [drawer, setDrawer] = useState(visual);
  const [loading] = useState(!visual);
  useWindowResize()

  const visualPcEvent = (visualEl : HTMLDivElement) => {
    let clientWidth = visualEl.clientWidth;
    let move = clientWidth;
    let full = window.innerWidth;
    let minWidth = parseFloat(getComputedStyle(document.documentElement).fontSize) * 25;
    if(typeof window !== 'undefined') {
      const hammer = new Hammer(visualEl);
      hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_HORIZONTAL });
      hammer.on('pan panend', (event : HammerInput) => {
        full = window.innerWidth;
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
            if(move > full || move < minWidth || event.velocityX === 0) {
              return
            };
            console.log(event)
            move = clientWidth + event.deltaX;
        }
        if(move > full) move = full;
        if(move < minWidth) move = minWidth;
        visualEl.style.width = `${move}px`;
      });
    }
  }

  const visualMoEvent = (visualEl : HTMLDivElement) => {
    if(typeof window !== 'undefined') {
      const hammer = new Hammer(visualEl);
      hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_HORIZONTAL });
      hammer.on('pan panend', (event : HammerInput) => {
        switch(event.type) {
          case 'panend' :
            if(Math.abs(event.deltaX) > 100) {
              setDrawer(event.offsetDirection > 3);
              if(event.offsetDirection === 2) {
                visualEl.classList.remove('open');
              } else if(event.offsetDirection === 4) {
                visualEl.classList.add('open');
              };
            } else {
              visualEl.classList.remove('open');
            }
            break;
        }
      });
    }
  }

  useEffect(() => {
    const visualEl = visualWrap.current;
    if(!visualEl) return;
    visualEl.style.removeProperty('width');
    // console.log(useWindowResize());
    if(window.innerWidth >= 768) {
      visualPcEvent(visualEl)
    } else {
      visualMoEvent(visualEl);
    }
    setCookie('visual' , `${drawer}`);
  }, [drawer]);

  useEffect(() => {
    const visualEl = visualWrap.current;
    if(!visualEl) return;
    if(typeof window !== 'undefined') {
      let number = 0;
      visualEl.addEventListener('touchmove' , (ev) => {
        // console.log(ev.deltaY);

        // scale += ev.deltaY * 0.01;
        // Restrict scale
        // scale = Math.min(Math.max(0.0000001, scale), 10);
        
        // number = Math.floor(scale);
        console.log(ev);
      })
    }
  }, )
  
  useBeforeUnload();

  return (
    <div className={`visual-wrap ${drawer ? 'open' : ''} ${loading ? 'loaded' : ''}`} ref={visualWrap}>
      <ParticlesUI/>
      {/* <div className="visual-top">
        <div><span>조회수 : </span><span>0</span></div>
        <div><span>방명록 : </span><span>0</span></div>
      </div> */}
      <div className="visual-middle">
        {/* <Avatar size={160} /> */}
        {/* <div className="img-wrap"><span className='img-box'>이미지 영역</span></div> */}
        <ImgWrap
          type="avatar">
          <span className='img-box'>이미지 영역</span>
        </ImgWrap>
        <div className="name-wrap mt-3">
          {<div className='dim'/>}
          <div className="name"><NameUI/></div>
          <div className="job kodchasan">{
            'FrontEnd Developer'.split('').map((el,idx) => (
              <span key={`text${idx}`}>{el}</span>
            ))
          }</div>
        </div>
        <div className="nav mt-2 kodchasan">
          <Link href="/" onClick={() => setDrawer(false)}>Profile</Link>
          <Link href="/resume" onClick={() => setDrawer(false)}>Resume</Link>
          <Link href="/portfolio" onClick={() => setDrawer(false)}>Portfolio</Link>
        </div>
        <div className="link-wrap mt-2">
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
