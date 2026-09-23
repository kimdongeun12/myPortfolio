 "use client"
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import profile from '@/commons/core/data/profile';

import Title from '@/component/common/title/Title';
import ImgWrap from '@/component/common/box/ImgWrap';
import PanelWrap from '@/component/common/panel/PanelWrap';


export default function Profile() {
  return (
    <div className="contents-wrap">
      {/* <Title title='Profile'/> */}
      <div>
        <div>
          <h3>안녕하세요!프론트엔드 개발자 김동은 입니다.</h3>
        </div>
        <div>
          <div>
            <p>에이전시에서 쌓은 UI/UX 경험과 다양한 서비스 개발 경험을 바탕으로, 디자인과 기술 사이의 균형을 고민하며 더 나은 서비스를 만들어 가고 있습니다.</p>
          </div>
          <div>
            <ul>
              <li>
                <div>
                  <p>01</p>
                  <p>사용자 경험</p>
                  <p>사용자가 자연스럽게 서비스를 이용할 수 있는 인터페이스와 흐름을 고민합니다.</p>
                </div>
              </li>
              <li>
                <div>
                  <p>02</p>
                  <p>구조와 재사용</p>
                  <p>반복되는 UI와 로직을 정리해 유지보수하기 좋은 구조를 만들어 갑니다.</p>
                </div>
              </li>
              <li>
                <div>
                  <p>03</p>
                  <p>안정적인 서비스</p>
                  <p>개발과 운영 경험을 바탕으로 안정적으로 지속될 수 있는 서비스를 고민합니다.</p>
                </div>
              </li>
              <li>
                <div>
                  <p>04</p>
                  <p>함께 만드는 개발</p>
                  <p>다양한 직군과 소통하며 더 나은 해결책을 함께 찾아갑니다.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <div>
          EXPERIENCE
        </div>
        <div>
          <ul>
            <li>
              <div>
                <p>날짜</p>
                <p>회사</p>
                <p>직무</p>
              </div>
              <div>
                한 일
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div>
          SKILLS
        </div>

      </div>
    </div>
  )
}
