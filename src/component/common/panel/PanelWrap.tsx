 "use client"

import clsx from 'clsx';
import { ReactNode, useState, } from 'react';
import _ from '@/commons/libs/lodash-global';


interface IPanelWrapProps {
  title: string;
  lists : string[];
}

export default function PanelWrap({title,lists} : IPanelWrapProps) {
  const [ isActive, setIsActive ] = useState(true);
  return (
    <div 
    
      className={clsx(
        `pannel-wrap`,
        isActive && 'active')}>
      <button 
        className='pannel-header font-24 bold'
        onClick={() => setIsActive(!isActive)}>
          <span className='arrow'/>
          {title}
        </button>
      <ul className='list-wrap pl-3'>
        {lists.map((list, listIdx) => (
          <li key={listIdx}>{list}</li>
        ))}
      </ul>
    </div>
  )
}