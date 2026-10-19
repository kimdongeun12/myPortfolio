 "use client"

import clsx from 'clsx';
import { ReactNode, } from 'react';
import _ from '@/lib/lodash';


interface IImgWrapProps {
    children : ReactNode;
    type ?: string
    ratioObj ?: {
      width : number
      height : number
    }
}

export default function ImgWrap({children, type, ratioObj} : IImgWrapProps) {
  const isPadding = (ratioObj?.height && ratioObj?.width);
  const ratio = isPadding && `${(ratioObj?.height / ratioObj?.width) * 100}%`;
  
  return (
    <div 
      className={clsx(
      `img-wrap`,
      type && `type-${type}`
      )}>
      <div 
        className='img-box'
        style={{paddingTop : ratio}}>
        { children }
      </div>
    </div>
  )
}