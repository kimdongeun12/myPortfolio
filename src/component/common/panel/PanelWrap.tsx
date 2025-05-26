 "use client"

import clsx from 'clsx';
import { ReactNode, } from 'react';
import _ from '@/commons/libs/lodash-global';


interface IPanelWrapProps {
  title: string;
  lists : string[];
}

export default function PanelWrap({title,lists} : IPanelWrapProps) {
  
  return (
    <div 
      className='panel-wrap'>
      <button 
        className='pannel-header font-24 bold'>
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