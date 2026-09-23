 "use client"

import { useEffect, useMemo, useRef, useState } from 'react';
import profile from '@/commons/core/data/profile';

import Title from '@/component/common/title/Title';
import ImgWrap from '@/component/common/box/ImgWrap';

import blog from '@/commons/core/data/blog'
import ListWrap from '@/component/common/box/ListWrap';

export default function Blog() {
  const [experienceItems, setExperienceItems] = useState(blog.experience);
  const [projectItems, setProjectItems] = useState(blog.project);

  
  useEffect(() => {
    const updated = { ...experienceItems, items: [...experienceItems.items] };
    console.log(experienceItems)
    Object.entries(projectItems.items).forEach(([category, value]) => {
      const stack = value.stack;
      const idx = updated.items.findIndex((el) => el.category === category);

      if (idx !== -1) {
        // 기존 stack도 복사해서 불변성 유지
        updated.items[idx] = {
          ...updated.items[idx],
          stack: [...updated.items[idx].stack, ...stack],
        };
      }
    });

    setExperienceItems(updated);
  }, [projectItems]);

  return (
    <div>
      <Title title='Blog'/>
      <div className='profile-area mb-10'>
        <div className='profile-wrap'>
          <div className='info-wrap'>
            <div className='name-wrap'>
              <strong className='name font-28'>{profile.name}</strong>
              <span className='birth'>{profile.birth}</span>
            </div>
            <div className='job-wrap'>{profile.job.ko}</div>
            <div className='sns-wrap'>
              <span className='email'>{profile.email}</span>
            </div>
          </div>
          <div className='greeting-wrap'>
            <p className='greeting white-pre-line font-18'>{profile.greetings}</p>
            <p className='white-pre-line'>{profile.desc}</p>
          </div>
        </div>
        <ImgWrap
          ratioObj={{width : 1, height : 1}}>
        </ImgWrap>
      </div>

      <div className='project-area'>
        <div className='title-wrap'>
          <h2 className='title font32'>{experienceItems.title}</h2>
          <span></span>
        </div>
        { 
          experienceItems.items.map((el,idx) => (
            <div 
              className='box-wrap'
              key={idx}>
              <div className='contents-desc'>
                <div>{ `${el?.startDate} ~ ${el?.endDate}` }</div>
              </div>
              <div className='contents'>
                <div>
                  <div>{el.name}</div>
                  <div>{`${el.team} / ${el.level} / ${el.job}`}</div>
                  <div>{`${el.stack}`}</div>
                  <div>{`${el.desc}`}</div>
                </div>
              </div>
            </div>
          ))
        }
        {/* <ListWrap 
          items={blogItems.experience}>
            <div>asdasd</div>
        </ListWrap> */}
      </div>
      {/* <div className='project-area'>
        <ListWrap 
          items={blogItems.stack}>
        </ListWrap>
      </div>
      <div className='project-area'>
        <ListWrap 
          items={blogItems.education}>
        </ListWrap>
      </div>
      <div className='project-area'>
        <ListWrap 
          items={blogItems.activity}>
        </ListWrap>
      </div> */}

      {/* <div className='project-area'>
        <div className='title'>
          <div>경력 :</div>
          <div>총 </div>
        </div>
        <div>
          <div></div>
        </div>
      </div>

      <div className='project-area'>
        <div className='title'>
          <div>경력 :</div>
          <div>총 </div>
        </div>
        <div>
          <div></div>
        </div>
      </div>

      <div className='project-area'>
        <div className='title'>
          <div>경력 :</div>
          <div>총 </div>
        </div>
        <div>
          <div></div>
        </div>
      </div> */}
    </div>
  )
}
