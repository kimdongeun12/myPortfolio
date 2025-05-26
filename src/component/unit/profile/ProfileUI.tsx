 "use client"

import { useEffect, useRef, useState } from 'react';
import Title from '@/component/common/title/Title';
import '/public/styles/visual.scss';
import profile from '@/commons/core/profile';
import Link from 'next/link';
import ImgWrap from '@/component/common/box/ImgWrap';


export default function ProfileUI() {
  const linkArr = [
    {
      link : '/resume',
      desc : '이력서는 프론트엔드 개발과 관련하여 핵심적인 내용만 간결하게 작성했습니다.'
    },
    {
      link : '/portfolio',
      desc : '포트폴리오는 활동과 프로젝트들을 시작적으로 깊게 작성했습니다.'
    }
  ];
  const introduceArr = [
    {
      title : '저는 ____ 엔지니어 입니다.',
      lists : [
        '고객의 시선에서 편리함을 고민 하는',
        '조직에 관심이 많은',
        '성장을 위한 개발 문화를 고민 하는',
        '하고있는 업무에 자존감이 강한',
      ]
    },
    {
      title : '저는 ____ 조직을 선호합니다.',
      lists : [
        '프로젝트의 의사결정이 투명하게 이뤄지는',
        '프로젝트 기술에 자부심을 갖고있는',
        '더욱 더 편리한 서비스를 제공하기 위해 끊임없는 도전 하는',
      ]
    }
  ];
  

  return (
    <div>
      <Title title='Profile'/>
      <div className='d-flex row-2 gap-5 pb-9'>
        <div>
          <div>
            <div className='font-32 bold'>{profile.name}</div>
            <div className='kodchasan font-20 bold mb-3'>{profile.job.en}</div>
            <div className='font-24 white-pre bold mb-2'>{profile.greetings}</div>
          </div>
          <ul className='list-wrap'>
            <li>“끊임없이 배우고 성장하는 개발자입니다.”</li>
            <li>“사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.”</li>
            <li>“도전을 즐기며 문제 해결에 집중하는 엔지니어입니다.”</li>
          </ul>
        </div>
        <ImgWrap 
          ratioObj={{width : 16, height : 9}}>
            
          </ImgWrap>
      </div>
      <div className='d-flex row-2 gap-5 pb-9'>
        {introduceArr.map((cur, idx) => (
          <div key={idx}>
            <div className='font-24 bold'>{cur.title}</div>
            <ul>
              {cur.lists.map((list, listIdx) => (
                <li key={listIdx}>{list}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className='d-flex row-2 gap-5'>
        {
          linkArr.map((cur, idx) => (
            <Link
              href={cur.link}
              key={idx}>
              <ImgWrap
                ratioObj={{width : 16, height : 9}}>이미지 영역</ImgWrap>
              <div className='box mt-3'>{cur.desc}</div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}
