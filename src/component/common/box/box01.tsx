 "use client"

import { useEffect, useRef, useState } from 'react';
import '/public/styles/visual.scss';


interface IBox01Props {
    children : React.ReactNode;
}

export default function Box({children} : IBox01Props) {

  return (
    <div className='box-wrap'>
      { children }
    </div>
  )
}
